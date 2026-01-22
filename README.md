# 🧠 IntelliInsight - AI Research Paper Analysis Platform

<div align="center">
  <img src="https://images.pexels.com/photos/5324865/pexels-photo-5324865.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1" alt="IntelliInsight Logo" width="120" height="120" style="border-radius: 20px;" />
  
  <h3>Turning Research Papers into Smart Insights</h3>
  <p><em>AI-powered research paper classification and analysis platform</em></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](#)
  [![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](#)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](#)
  [![Python](https://img.shields.io/badge/Python-14354C?logo=python&logoColor=white)](#)
  [![FastAPI](https://img.shields.io/badge/FastAPI-005571?logo=fastapi)](#)
</div>

---

## 🌟 Overview

IntelliInsight is a comprehensive, production-ready web application that leverages artificial intelligence to automatically analyze research papers. Upload any PDF research paper and get instant, intelligent insights including publication type classification, research nature analysis, and key evidence extraction.

### ✨ Key Features

🎯 **AI-Powered Classification**
- Automatic detection of Conference vs Journal papers
- Implementation vs Theoretical research nature classification
- Confidence scores for all classifications

🔍 **Evidence Extraction**
- Intelligent extraction of key experimental evidence
- Highlight sentences containing results, datasets, and methodologies
- Keyword identification and categorization

📊 **Professional Dashboard**
- Modern SaaS-style interface with smooth animations
- Dark/light mode with system preference detection
- Real-time analysis progress tracking

📱 **Responsive Design**
- Mobile-first responsive design
- Optimized for all device sizes
- Touch-friendly interactions

📈 **Analysis History**
- Complete history of all analyzed papers
- Advanced search and filtering capabilities
- Batch operations and bulk actions

📄 **Report Generation**
- Professional PDF reports with branding
- Downloadable analysis summaries
- Shareable insights and results

---

## 🏗️ Architecture

### Frontend Stack
- **React 18** + **TypeScript** for type-safe development
- **Tailwind CSS** for modern, responsive styling
- **Framer Motion** for smooth animations and micro-interactions
- **Radix UI** for accessible, unstyled components
- **Lucide React** for consistent iconography

### Backend Stack
- **Node.js** + **Express** for robust API development
- **MongoDB** with Mongoose for data persistence
- **Multer** for secure file upload handling
- **Express Rate Limit** for API protection

### AI/ML Stack
- **Python** + **FastAPI** for high-performance AI service
- **scikit-learn** for machine learning classification
- **NLTK** + **spaCy** for natural language processing
- **pdfminer.six** for PDF text extraction

### DevOps & Deployment
- **Docker** containerization for consistent environments
- **Vercel** for frontend hosting
- **Railway/Render** for backend and AI service hosting
- **MongoDB Atlas** for cloud database

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- MongoDB (local or Atlas)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/intelliinsight.git
cd intelliinsight
```

### 2. Frontend Setup
```bash
npm install
cp .env.example .env
npm run dev
```

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure MongoDB URI in .env
npm run dev
```

### 4. AI Service Setup
```bash
cd ai-service
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **AI Service**: http://localhost:8000

---

## 🎨 UI/UX Design

### Design Philosophy
IntelliInsight follows modern SaaS design principles with a focus on:

- **Clean Minimalism**: Uncluttered interface focusing on essential features
- **Professional Aesthetics**: Apple-level design attention to detail
- **Intuitive Navigation**: Self-explanatory user flows and interactions
- **Consistent Branding**: Cohesive visual identity throughout the platform

### Color System
```css
/* Primary Gradient */
background: linear-gradient(to right, #6366F1, #A855F7);

/* Semantic Colors */
Success: #10B981    Error: #EF4444
Warning: #F59E0B    Info: #3B82F6
```

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Line Height**: 150% (body), 120% (headings)

### Components
- **Cards**: Rounded (2xl), soft shadows, backdrop blur effects
- **Buttons**: Gradient backgrounds, hover state animations
- **Forms**: Floating labels, validation states, smooth transitions

---

## 🔧 API Documentation

### Upload & Analysis
```http
POST /api/upload
Content-Type: multipart/form-data

Body: PDF file (max 10MB)

Response: {
  "success": true,
  "data": {
    "id": "analysis_id",
    "title": "Paper Title",
    "type": "Conference",
    "typeConfidence": 0.89,
    "nature": "Implementation", 
    "natureConfidence": 0.94,
    "evidence": ["Key evidence sentences..."],
    "uploadDate": "2024-01-15T10:30:00Z"
  }
}
```

### Get Analysis History
```http
GET /api/analysis?page=1&limit=10&search=query&type=Conference

Response: {
  "success": true,
  "data": [...analyses],
  "pagination": {
    "page": 1,
    "total": 25,
    "pages": 3
  },
  "statistics": {
    "totalAnalyses": 25,
    "conferenceCount": 15,
    "journalCount": 10
  }
}
```

### Delete Analysis
```http
DELETE /api/analysis/:id

Response: {
  "success": true,
  "message": "Analysis deleted successfully"
}
```

---

## 🧪 AI/ML Implementation

### Classification Models

The AI service uses TF-IDF vectorization with Logistic Regression for classification:

```python
# Publication Type Classification
type_features = ['conference', 'workshop', 'proceedings', 'journal', 'volume']
type_model = LogisticRegression()

# Research Nature Classification  
nature_features = ['implementation', 'experiment', 'theoretical', 'mathematical']
nature_model = LogisticRegression()
```

### Evidence Extraction Algorithm

```python
def extract_evidence(text, paper_nature):
    sentences = nltk.sent_tokenize(text)
    keywords = get_keywords_for_nature(paper_nature)
    
    scored_sentences = []
    for sentence in sentences:
        score = sum(1 for kw in keywords if kw in sentence.lower())
        if score > 0:
            scored_sentences.append((sentence, score))
    
    return sorted(scored_sentences, key=lambda x: x[1], reverse=True)[:5]
```

### Model Training Pipeline

For production use, train models on labeled dataset:

```python
# Data preparation
papers_df = pd.read_csv('labeled_papers.csv')
X = papers_df['text']  
y_type = papers_df['type']
y_nature = papers_df['nature']

# Feature extraction
vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1,2))
X_features = vectorizer.fit_transform(X)

# Model training
type_model = LogisticRegression()
type_model.fit(X_features, y_type)

nature_model = LogisticRegression()  
nature_model.fit(X_features, y_nature)
```

---

## 📊 Database Schema

### Analysis Collection (MongoDB)
```javascript
{
  _id: ObjectId,
  paperTitle: String,
  originalFileName: String,
  uploadDate: Date,
  type: String, // 'Conference' | 'Journal'
  typeConfidence: Number, // 0-1
  nature: String, // 'Implementation' | 'Theoretical'  
  natureConfidence: Number, // 0-1
  evidence: [String], // Key sentences
  keywords: [String], // Extracted keywords
  fileSize: Number,
  processingTime: Number, // milliseconds
  status: String, // 'processing' | 'completed' | 'error'
  userId: String // For future authentication
}
```

---

## 🚀 Deployment Guide

### Production Deployment (Free Tier)

1. **Frontend** → Vercel
2. **Backend** → Railway/Render  
3. **AI Service** → Railway/Render
4. **Database** → MongoDB Atlas

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

### Docker Deployment
```bash
# Start all services
docker-compose up -d

# Services will be available at:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000  
# AI Service: http://localhost:8000
# MongoDB: localhost:27017
```

---

## 🔒 Security Features

- **File Validation**: Strict PDF type and size checking
- **Rate Limiting**: API endpoint protection
- **CORS Configuration**: Secure cross-origin policies  
- **Input Sanitization**: SQL injection and XSS prevention
- **Error Handling**: Secure error messages without data exposure

---

## 📈 Performance Optimizations

### Frontend
- **Code Splitting**: Dynamic imports for components
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Tree-shaking and dead code elimination
- **Caching**: Service worker implementation

### Backend  
- **Database Indexing**: Optimized queries with compound indexes
- **Response Compression**: Gzip compression for APIs
- **Connection Pooling**: Efficient database connections
- **Caching**: Redis integration for frequently accessed data

### AI Service
- **Model Caching**: Pre-loaded models in memory
- **Batch Processing**: Multiple file analysis
- **Async Processing**: Non-blocking PDF extraction
- **GPU Acceleration**: CUDA support for large models

---

## 🧪 Testing Strategy

### Frontend Testing
```bash
# Unit tests
npm run test

# E2E tests  
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Backend Testing
```bash
cd backend
npm run test
```

### AI Service Testing
```bash
cd ai-service  
python -m pytest tests/
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

### Development Workflow
1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and add tests
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`  
6. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenAI GPT** for natural language processing insights
- **Hugging Face** for transformer model implementations  
- **Papers With Code** for research paper datasets
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for utility-first styling approach

---

## 📞 Support & Contact

- **Documentation**: [docs.intelliinsight.com](https://docs.intelliinsight.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/intelliinsight/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/intelliinsight/discussions)
- **Email**: support@intelliinsight.com

---

<div align="center">
  <p><strong>Made with ❤️ by the IntelliInsight Team</strong></p>
  <p><em>Turning Research Papers into Smart Insights</em></p>
</div>