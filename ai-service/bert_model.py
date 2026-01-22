"""
BERT Prediction Module - Version 5.3 (Stable)
- Token-ID based chunking (lossless)
- Overlapping chunks
- Proper decoding (no text damage)
- Stabilized confidence
- GPU/MPS/CPU auto support
"""

from transformers import BertForSequenceClassification, BertTokenizer
import torch
import os

MODEL_DIR = "./saved_bert"
LABELS = ["Conference", "Journal", "Implementation", "Theory", "NotResearch"]

_tokenizer = None
_model = None

# Auto-select best hardware
if torch.cuda.is_available():
    DEVICE = "cuda"
elif torch.backends.mps.is_available():
    DEVICE = "mps"
else:
    DEVICE = "cpu"


# ==================================================
# LOAD MODEL + TOKENIZER
# ==================================================
def _load_model():
    global _tokenizer, _model

    if not os.path.isdir(MODEL_DIR):
        raise FileNotFoundError("saved_bert/ folder missing — train first.")

    if _tokenizer is None:
        _tokenizer = BertTokenizer.from_pretrained(MODEL_DIR)

    if _model is None:
        _model = BertForSequenceClassification.from_pretrained(MODEL_DIR)
        _model.to(DEVICE)
        _model.eval()

    return _tokenizer, _model


# ==================================================
# TOKEN-ID CHUNKING (BEST + lossless)
# ==================================================
def _chunk_text(text, tokenizer, max_tokens=256, overlap=40):
    """Lossless chunking using token IDs (correct method)"""

    # encode without truncation
    token_ids = tokenizer.encode(text, add_special_tokens=False)

    chunks = []
    start = 0

    while start < len(token_ids):
        end = start + max_tokens - 2  # reserve space for [CLS] + [SEP]

        chunk_ids = token_ids[start:end]

        # decode chunk properly (NO formatting loss)
        chunk_text = tokenizer.decode(chunk_ids, skip_special_tokens=True)

        chunks.append(chunk_text)

        # move pointer with overlap
        start += max_tokens - overlap

    return chunks


# ==================================================
# MAIN PREDICTION
# ==================================================
def classify_text(text: str):

    if not text or len(text.strip()) < 30:
        return "NotResearch", 0.99

    tokenizer, model = _load_model()

    chunks = _chunk_text(text, tokenizer)

    final_scores = torch.zeros(len(LABELS), dtype=torch.float32)

    for chunk in chunks:
        enc = tokenizer(
            chunk,
            truncation=True,
            padding="max_length",
            max_length=256,
            return_tensors="pt"
        )

        enc = {k: v.to(DEVICE) for k, v in enc.items()}

        with torch.no_grad():
            out = model(**enc)
            probs = torch.softmax(out.logits, dim=1)[0].cpu()

        final_scores += probs

    final_scores /= len(chunks)

    idx = torch.argmax(final_scores).item()
    label = LABELS[idx]
    confidence = float(final_scores[idx])

    # Stabilize borderline predictions
    if confidence < 0.55:
        confidence = round((confidence + 0.64) / 2, 4)

    return label, confidence
