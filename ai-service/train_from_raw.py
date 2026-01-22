# train_from_raw.py
"""
Improved IntelliInsight Training Script (Version 5.2)
- Proper class-weighted loss
- More epochs
- Larger max_length (384)
- Gradient accumulation
- Warmup learning rate
- Strong regularization
- Improved dataset cleaning
- Correct seeding for reproducibility
"""

import os
import glob
import numpy as np
import pandas as pd

from pdfminer.high_level import extract_text
from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight

import torch
from torch.utils.data import Dataset
from torch import nn

from transformers import (
    BertTokenizer,
    BertForSequenceClassification,
    Trainer,
    TrainingArguments,
    DataCollatorWithPadding,
    set_seed,   # important for reproducibility
)

# ==============================
# CONFIG
# ==============================
RAW_DIR = "raw"

MAP = {
    "Conference": "Conference",
    "Journal": "Journal",
    "implementation": "Implementation",
    "theory": "Theory",
    "NotResearchPaper": "NotResearch",
}

LABEL_MAP = {
    "Conference": 0,
    "Journal": 1,
    "Implementation": 2,
    "Theory": 3,
    "NotResearch": 4,
}

TMP_CSV = "dataset_from_raw.csv"


# ==============================
# Extract Text
# ==============================
def extract_text_from_file(path: str) -> str:
    try:
        if path.lower().endswith(".pdf"):
            return extract_text(path)
        else:
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
    except Exception as e:
        print(f"[WARN] Failed to read {path}: {e}")
        return ""


# ==============================
# Build Dataset
# ==============================
def build_dataset() -> pd.DataFrame:
    rows = []

    for folder, label in MAP.items():
        folder_path = os.path.join(RAW_DIR, folder)
        if not os.path.isdir(folder_path):
            print(f"[INFO] Skipping missing folder: {folder_path}")
            continue

        for ext in ("*.pdf", "*.txt", "*.md"):
            for path in glob.glob(os.path.join(folder_path, ext)):
                text = extract_text_from_file(path)

                if not text:
                    continue

                text = text.strip()
                if len(text) < 80:  # avoid tiny junk docs
                    continue

                # collapse multiple spaces/newlines
                cleaned = " ".join(text.split())

                rows.append(
                    {
                        "text": cleaned,
                        "label": label,
                        "source_file": path,
                    }
                )

    df = pd.DataFrame(rows)
    df.to_csv(TMP_CSV, index=False)
    print(f"✅ Saved {len(df)} samples → {TMP_CSV}")
    return df


# ==============================
# Dataset Class
# ==============================
class PaperDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len: int = 384):
        self.texts = list(texts)
        self.labels = list(labels)
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx: int):
        enc = self.tokenizer(
            str(self.texts[idx]),
            truncation=True,
            padding=False,   # dynamic padding via DataCollator
            max_length=self.max_len,
            return_tensors="pt",
        )

        item = {k: v.squeeze(0) for k, v in enc.items()}
        item["labels"] = torch.tensor(int(self.labels[idx]), dtype=torch.long)
        return item


# ==============================
# Custom Trainer with class weights
# ==============================
class WeightedTrainer(Trainer):
    def __init__(self, class_weights: torch.Tensor = None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.class_weights = class_weights

    def compute_loss(self, model, inputs, return_outputs=False):
        labels = inputs.pop("labels")
        outputs = model(**inputs)
        logits = outputs.logits

        if self.class_weights is not None:
            weight = self.class_weights.to(logits.device)
            loss_fct = nn.CrossEntropyLoss(weight=weight)
        else:
            loss_fct = nn.CrossEntropyLoss()

        loss = loss_fct(logits, labels)
        return (loss, outputs) if return_outputs else loss


# ==============================
# Train Function
# ==============================
def train():
    # ✅ Proper seeding for reproducibility
    set_seed(42)
    torch.manual_seed(42)
    np.random.seed(42)

    df = build_dataset()
    if df.empty:
        raise SystemExit("No data found in raw/ folders.")

    # Map labels to IDs
    df["label_id"] = df["label"].map(LABEL_MAP)

    # Train/Val split (stratified if possible)
    try:
        train_texts, val_texts, train_labels, val_labels = train_test_split(
            df["text"],
            df["label_id"],
            test_size=0.15,
            random_state=42,
            stratify=df["label_id"],
        )
    except Exception as e:
        print(f"[WARN] Stratified split failed: {e}")
        train_texts, val_texts, train_labels, val_labels = train_test_split(
            df["text"], df["label_id"], test_size=0.15, random_state=42
        )

    # ===== Class balancing =====
    classes = np.unique(df["label_id"])
    class_weights_np = compute_class_weight(
        class_weight="balanced",
        classes=classes,
        y=df["label_id"].values,
    )
    class_weights = torch.tensor(class_weights_np, dtype=torch.float32)
    print(f"📊 Class weights: {class_weights_np}")

    # Tokenizer
    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

    train_ds = PaperDataset(train_texts, train_labels, tokenizer)
    val_ds = PaperDataset(val_texts, val_labels, tokenizer)

    # Model
    model = BertForSequenceClassification.from_pretrained(
        "bert-base-uncased", num_labels=len(LABEL_MAP)
    )

    # Dynamic padding
    data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

    # ========== Training Settings ==========
    training_args = TrainingArguments(
        output_dir="./bert_results",
        evaluation_strategy="epoch",
        save_strategy="epoch",
        per_device_train_batch_size=4,
        per_device_eval_batch_size=4,

        gradient_accumulation_steps=4,   # effective batch ≈ 16
        num_train_epochs=6,
        learning_rate=2e-5,
        warmup_ratio=0.1,
        weight_decay=0.01,

        load_best_model_at_end=True,
        logging_steps=20,
        report_to="none",   # no wandb/tensorboard
    )

    def compute_metrics(eval_pred):
        logits, labels = eval_pred
        preds = np.argmax(logits, axis=1)
        acc = (preds == labels).mean()
        return {"accuracy": float(acc)}

    # Use WeightedTrainer instead of Trainer
    trainer = WeightedTrainer(
        model=model,
        args=training_args,
        train_dataset=train_ds,
        eval_dataset=val_ds,
        data_collator=data_collator,
        compute_metrics=compute_metrics,
        class_weights=class_weights,
    )

    trainer.train()

    # Save final model
    model.save_pretrained("./saved_bert")
    tokenizer.save_pretrained("./saved_bert")

    print("\n🎉 Training Complete! Model saved in saved_bert/\n")


# ==============================
# MAIN
# ==============================
if __name__ == "__main__":
    train()
