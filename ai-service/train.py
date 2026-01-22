"""
Improved IntelliInsight Training Using dataset.csv (Version 5.2)
- Proper class-weighted loss
- Better PDF text generalization
- Longer max_length (384 tokens)
- Gradient accumulation (effective batch = 16)
- Warmup learning rate for stability
- Stratified split
"""

import pandas as pd
import numpy as np
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
    set_seed
)

label_map = {
    "Conference": 0,
    "Journal": 1,
    "Implementation": 2,
    "Theory": 3,
    "NotResearch": 4
}


# ========================
# Dataset Class
# ========================
class PaperDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len=384):
        self.texts = list(texts)
        self.labels = list(labels)
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):

        enc = self.tokenizer(
            str(self.texts[idx]),
            truncation=True,
            padding=False,     # dynamic by DataCollator
            max_length=self.max_len,
            return_tensors="pt"
        )

        item = {k: v.squeeze(0) for k, v in enc.items()}
        item["labels"] = torch.tensor(int(self.labels[idx]), dtype=torch.long)

        return item


# ========================
# Custom Trainer (Weighted Loss)
# ========================
class WeightedTrainer(Trainer):
    def __init__(self, class_weights=None, *args, **kwargs):
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


# ========================
# Main Training Pipeline
# ========================
def main():
    # Reproducibility
    set_seed(42)

    # Load CSV
    df = pd.read_csv("dataset.csv").dropna()
    df["label_id"] = df["label"].map(label_map)

    # Split
    train_texts, val_texts, train_labels, val_labels = train_test_split(
        df["text"],
        df["label_id"],
        test_size=0.15,
        random_state=42,
        stratify=df["label_id"]
    )

    # Compute class weights
    class_weights_np = compute_class_weight(
        class_weight="balanced",
        classes=np.unique(df["label_id"]),
        y=df["label_id"]
    )
    class_weights = torch.tensor(class_weights_np, dtype=torch.float32)
    print("📊 Class Weights:", class_weights_np)

    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

    train_ds = PaperDataset(train_texts, train_labels, tokenizer)
    val_ds = PaperDataset(val_texts, val_labels, tokenizer)

    # Model
    model = BertForSequenceClassification.from_pretrained(
        "bert-base-uncased",
        num_labels=5
    )

    data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

    # TrainingConfig
    training_args = TrainingArguments(
        output_dir="./bert_results",
        evaluation_strategy="epoch",
        save_strategy="epoch",

        per_device_train_batch_size=4,
        per_device_eval_batch_size=4,

        gradient_accumulation_steps=4,  # effective batch size = 16
        num_train_epochs=6,
        learning_rate=2e-5,
        warmup_ratio=0.1,
        weight_decay=0.01,

        load_best_model_at_end=True,
        logging_steps=20,
        report_to="none",
        seed=42,
    )

    # Accuracy metric
    def compute_metrics(eval_pred):
        logits, labels = eval_pred
        preds = np.argmax(logits, axis=1)
        acc = (preds == labels).mean()
        return {"accuracy": float(acc)}

    # Trainer
    trainer = WeightedTrainer(
        class_weights=class_weights,
        model=model,
        args=training_args,
        train_dataset=train_ds,
        eval_dataset=val_ds,
        compute_metrics=compute_metrics,
        data_collator=data_collator
    )

    trainer.train()

    # Save
    model.save_pretrained("./saved_bert")
    tokenizer.save_pretrained("./saved_bert")

    print("\n🔥 Training Complete — saved in saved_bert/\n")


if __name__ == "__main__":
    main()
