"""
IntelliInsight AI Service - BERT-Driven Version (v5.0)
Improved PDF extraction + Non-research detection + stable BERT flow
"""

import os
import logging
from datetime import datetime
from typing import Tuple

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

import nltk
import spacy
from io import BytesIO
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage


# -----------------------------------
# TRY LOADING BERT CLASSIFIER
# -----------------------------------
try:
    from bert_model import classify_text as bert_classify_text
    BERT_AVAILABLE = True
except:
    BERT_AVAILABLE = False


# -----------------------------------
# spaCy load (optional)
# -----------------------------------
try:
    nlp = spacy.load("en_core_web_sm")
except:
    nlp = None


# -----------------------------------
# NLTK Downloads
# -----------------------------------
try:
    nltk.data.find("tokenizers/punkt")
except LookupError:
    nltk.download("punkt")


# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ======================================================
# SMART PDF EXTRACTOR (High Accuracy)
# ======================================================
def extract_text_from_pdf(content: bytes) -> str:
    """Extract readable text from PDF bytes using pdfminer for accuracy."""
    try:
        resource_manager = PDFResourceManager()
        retstr = BytesIO()
        laparams = LAParams()
        device = TextConverter(resource_manager, retstr, laparams=laparams)
        interpreter = PDFPageInterpreter(resource_manager, device)

        for page in PDFPage.get_pages(BytesIO(content)):
            interpreter.process_page(page)

        text = retstr.getvalue().decode("utf-8", errors="ignore")
        device.close()
        retstr.close()

        if len(text.strip()) < 20:
            raise ValueError("PDF text too small")

        return text.strip()

    except Exception as e:
        raise ValueError(f"Unable to extract text: {e}")


# ======================================================
# NON-RESEARCH / CERTIFICATE DETECTOR
# ======================================================
CERT_KEYWORDS = [
    "certificate", "certify", "completion", "course", "student",
    "awarded", "grade", "marks", "principal", "training", "instructor",
    "admit", "hall ticket", "receipt", "payment", "application"
]

def looks_like_non_research(text: str) -> bool:
    """Detect certificates, receipts, resumes or non-research files."""
    low = text.lower()
    return any(k in low for k in CERT_KEYWORDS)


# ======================================================
# BERT CLASSIFICATION
# ======================================================
def classify_with_bert(text: str) -> Tuple[str, float]:
    """Returns (label, confidence)."""
    if not BERT_AVAILABLE:
        raise HTTPException(500, "BERT model not available — train first.")
    return bert_classify_text(text)


# ======================================================
# KEYWORD EXTRACTION
# ======================================================
def extract_keywords(text: str):
    tokens = nltk.word_tokenize(text)
    tokens = [t.lower() for t in tokens if t.isalpha()]
    freq = {}
    for t in tokens:
        freq[t] = freq.get(t, 0) + 1
    sorted_kw = sorted(freq.items(), key=lambda x: x[1], reverse=True)
    return [w for w, _ in sorted_kw[:10]]


# ======================================================
# EVIDENCE EXTRACTION
# ======================================================
def extract_evidence(text: str, nature: str):
    sentences = nltk.sent_tokenize(text)
    good = []

    for s in sentences:
        sl = s.lower()

        if nature == "Implementation":
            if any(k in sl for k in ["experiment", "dataset", "accuracy", "results"]):
                good.append(s)

        elif nature == "Theory":
            if any(k in sl for k in ["theorem", "proof", "analysis", "mathematical"]):
                good.append(s)

    return good[:5] if good else sentences[:3]


# ======================================================
# FASTAPI APP
# ======================================================
app = FastAPI(
    title="IntelliInsight AI (BERT v5)",
    version="5.0.0",
    description="Improved BERT model classification + smart PDF reader."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ======================================================
# HOME API
# ======================================================
@app.get("/")
def home():
    return {
        "service": "IntelliInsight AI v5",
        "bert_enabled": BERT_AVAILABLE,
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }


# ======================================================
# MAIN ANALYZE API
# ======================================================
@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith(".pdf"):
            raise HTTPException(400, "Only PDF files allowed")

        content = await file.read()
        text = extract_text_from_pdf(content)

        # 1️⃣ HARD FILTER — detect non-research documents BEFORE BERT
        if looks_like_non_research(text):
            return {
                "success": False,
                "type": "Not Research Paper",
                "confidence": 0.98,
                "message": "Document looks like a certificate, receipt, or non-research file."
            }

        # 2️⃣ BERT PREDICT
        label, conf = classify_with_bert(text)

        if label == "NotResearch":
            return {
                "success": False,
                "type": "Not Research Paper",
                "confidence": conf,
                "message": "This is not a research paper."
            }

        # 3️⃣ Map paper type
        if label in ("Conference", "Journal"):
            paper_type = label
            paper_nature = "Research"
        else:
            paper_type = "Research Paper"
            paper_nature = label

        keywords = extract_keywords(text)
        evidence = extract_evidence(text, paper_nature)

        return {
            "success": True,
            "filename": file.filename,
            "bert_label": label,
            "type": paper_type,
            "nature": paper_nature,
            "confidence": round(conf, 3),
            "keywords": keywords,
            "evidence": evidence,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"ERROR: {e}")
        raise HTTPException(500, f"Processing failed: {e}")


# ======================================================
# RUN SERVER
# ======================================================
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
