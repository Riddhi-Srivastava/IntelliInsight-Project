# IntelliInsight – AI Research Paper Analysis Platform

### **Turning Research Papers into Smart Insights**

*AI-powered platform to classify and analyze research papers automatically*

![Tech](https://skillicons.dev/icons?i=react,ts,nodejs,python,fastapi,mongodb,docker)

</div>

---

##  About the Project

**IntelliInsight** is a full-stack AI-based web application that helps students and researchers **quickly understand research papers** without manually reading the entire document.

Users can upload a **PDF research paper**, and the system automatically:

* Classifies the paper type (Conference / Journal)
* Determines research nature (Implementation / Theoretical)
* Extracts key evidence and important sentences
* Stores analysis history for future reference

This project is designed as a modular, real-world inspired system, suitable for placements, internships, and final-year evaluation.

---

## Key Features

### AI-Based Paper Classification

* Conference vs Journal detection
* Implementation vs Theoretical research classification
* Confidence score for predictions

### Evidence Extraction

* Extracts important result-oriented sentences
* Identifies experiment-related, dataset-related, and methodology-related keywords

### Modern Dashboard

* Clean SaaS-style UI
* Upload progress & status tracking
* Analysis history with filters

### Theme Support

* Light / Dark mode
* System preference detection

### Report Ready

* Structured output for further report generation
* Easy to extend for PDF summary export

---

## Tech Stack

### Frontend

* **React 18 + TypeScript**
* **Tailwind CSS**
* **Framer Motion**
* **Radix UI**
* **Vite**

### Backend

* **Node.js + Express**
* **MongoDB + Mongoose**
* **Multer** (PDF upload handling)

### AI / ML Service

* **Python + FastAPI**
* **scikit-learn**
* **NLTK / spaCy**
* **pdfminer.six**

### DevOps

* **Docker & Docker Compose**
* Environment-based configuration

---

## System Architecture

```
Frontend (React)
   |
Backend API (Node + Express)
   |
AI Service (FastAPI)
   |
MongoDB
```

---

## Installation & Setup

### Prerequisites

* Node.js (16+)
* Python (3.8+)
* MongoDB (local or Atlas)

---

### 1. Clone Repository

```bash
git clone https://github.com/Riddhi-Srivastava/IntelliInsight-Project.git
cd IntelliInsight-Project
```

---

### 2. Frontend Setup

```bash
npm install
cp .env.example .env
npm run dev
```

---

### 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

---

### 4. AI Service Setup

```bash
cd ai-service
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload
```

---

### Local URLs

| Service     | URL                                            |
| ----------- | ---------------------------------------------- |
| Frontend    | [http://localhost:3000](http://localhost:3000) |
| Backend API | [http://localhost:5000](http://localhost:5000) |
| AI Service  | [http://localhost:8000](http://localhost:8000) |

---

## AI Logic (High-Level)

### Classification Approach

* TF-IDF Vectorization
* Logistic Regression models

### Evidence Extraction

* Sentence tokenization
* Keyword-based scoring
* Top-ranked sentences selected

---

## Database Schema (MongoDB)

```js
{
  paperTitle: String,
  uploadDate: Date,
  type: "Conference" | "Journal",
  nature: "Implementation" | "Theoretical",
  confidenceScores: Number,
  evidence: [String],
  status: String
}
```

---

## Docker Support

```bash
docker-compose up -d
```

Runs:

* Frontend
* Backend
* AI Service
* MongoDB

---

## Security Measures

* PDF type & size validation
* Rate limiting
* CORS protection
* Secure error handling

---

## This Project  

✔ Full-stack architecture
✔ AI/ML integration
✔ Clean codebase & modular design
✔ Real-world problem solving
✔ Production-style structure

---

## Author

**Riddhi Srivastava**
Final Year B.Tech (IT) Student
Aspiring Software Engineer

GitHub: [https://github.com/Riddhi-Srivastava](https://github.com/Riddhi-Srivastava)

---

## License

MIT License

---



