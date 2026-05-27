# LexIntel ⚖️

AI-powered legal document intelligence platform built with React, FastAPI, Gemini, and Qdrant.

## Overview

LexIntel is an enterprise-style Retrieval-Augmented Generation (RAG) application for analyzing contracts and legal documents.

Users can upload PDF documents, index them into a vector database, and ask natural language questions grounded in the uploaded content.

The system uses semantic retrieval + LLM reasoning for contextual analysis.

---

## Features

- PDF contract/document upload
- Automatic document chunking
- Gemini embedding generation
- Qdrant vector database storage
- Semantic similarity search
- Grounded RAG-based AI assistant
- React enterprise dashboard UI
- Source citation retrieval
- KPI dashboard cards
- FastAPI layered backend architecture

---

## Architecture

```text
React Frontend
    ↓
FastAPI API Layer
    ↓
Service Layer
    ↓
Repository Layer
    ↓
Gemini Embeddings
    ↓
Qdrant Vector DB
    ↓
RAG Retrieval + LLM Response
```

---

## Tech Stack

### Frontend
- React
- Vite
- Axios
- React Dropzone
- CSS

### Backend
- FastAPI
- Uvicorn
- Python

### AI / Vector Stack
- Google Gemini API
- Qdrant Cloud
- Retrieval-Augmented Generation (RAG)

---

## Project Structure

```text
lexintel/
│
├── backend/
│   └── app/
│       ├── api/
│       ├── core/
│       ├── repositories/
│       ├── schemas/
│       └── services/
│
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── pages/
│       └── App.jsx
```

---

## Setup

### Clone

```bash
git clone https://github.com/YOUR_USERNAME/lexintel.git
cd lexintel
```

---

### Backend setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env`

```env
GOOGLE_API_KEY=your_key
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_key
QDRANT_COLLECTION=legal_documents
```

Run backend:

```bash
uvicorn app.main:app --reload
```

---

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

---

## API Endpoints

### Upload document

```http
POST /api/contracts/upload
```

### Analyze document

```http
POST /api/analysis/analyze
```

---

## Future Improvements

- Risk scoring engine
- Clause extraction
- Multi-document comparison
- User authentication
- Persistent document history
- Deployment
- Role-based access

---

## Resume Highlights

Enterprise-style full-stack AI application featuring:

- Layered backend architecture
- Vector search
- Semantic retrieval
- LLM integration
- React dashboard
- RAG pipeline engineering

---

## License

MIT
