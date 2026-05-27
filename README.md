# LexIntel ⚖️

Enterprise-style AI-powered legal document intelligence platform built with **React, FastAPI, Google Gemini, and Qdrant Vector Database**.

LexIntel enables users to upload PDF contracts/documents, semantically index them, and interact with them using a grounded Retrieval-Augmented Generation (RAG) AI assistant.

---

## Product Preview

### Dashboard

![Dashboard](screenshots/dashboard.png)

---

### AI Analysis Chat

![Chat Analysis](screenshots/chat-analysis.png)

---

### Document Upload & Source Retrieval

![Upload Panel](screenshots/upload-panel.png)

---

## Features

✅ PDF document upload and indexing  
✅ Semantic chunking and vector storage  
✅ Gemini embeddings for retrieval  
✅ Qdrant vector database integration  
✅ Retrieval-Augmented Generation (RAG) pipeline  
✅ AI-powered document Q&A assistant  
✅ Enterprise React dashboard UI  
✅ Source citation retrieval  
✅ Layered FastAPI backend architecture  
✅ KPI monitoring dashboard  

---

## Architecture

```text
                ┌───────────────────────────────┐
                │        React Frontend         │
                │   Dashboard + AI Chat UI      │
                └──────────────┬────────────────┘
                               │
                               ▼
                ┌───────────────────────────────┐
                │         FastAPI Backend       │
                │ API Routes + Business Logic   │
                └──────────────┬────────────────┘
                               │
                               ▼
                ┌───────────────────────────────┐
                │        Service Layer          │
                │ Document / Analysis Services  │
                └──────────────┬────────────────┘
                               │
                               ▼
                ┌───────────────────────────────┐
                │       Repository Layer        │
                │ Qdrant + File Persistence     │
                └──────────────┬────────────────┘
                               │
          ┌────────────────────┴────────────────────┐
          ▼                                         ▼
 ┌────────────────────┐                  ┌────────────────────┐
 │ Google Gemini API  │                  │   Qdrant Vector DB │
 │ Embeddings + LLM   │                  │ Semantic Retrieval │
 └────────────────────┘                  └────────────────────┘
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

### AI / Data Layer
- Google Gemini API
- Qdrant Cloud
- Retrieval-Augmented Generation (RAG)
- Vector Search
- PDF Parsing

---

## Backend Architecture

```text
backend/
│
├── app/
│   ├── api/
│   │   └── routes/
│   │       ├── upload.py
│   │       └── analysis.py
│   │
│   ├── core/
│   │   └── config.py
│   │
│   ├── repositories/
│   │   ├── file_repository.py
│   │   └── qdrant_repository.py
│   │
│   ├── schemas/
│   │   └── analysis_schema.py
│   │
│   └── services/
│       ├── analysis_service.py
│       ├── embedding_service.py
│       ├── gemini_service.py
│       └── pdf_service.py
```

---

## Frontend Architecture

```text
frontend/
│
├── src/
│   ├── api/
│   │   └── contractApi.js
│   │
│   ├── components/
│   │   ├── chat/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   └── upload/
│   │
│   ├── pages/
│   │   └── Dashboard.jsx
│   │
│   ├── App.jsx
│   └── App.css
```

---

## Setup Instructions

### Clone repository

```bash
git clone https://github.com/deoxys26/lexintel.git
cd lexintel
```

---

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env`

```env
GOOGLE_API_KEY=your_google_api_key
QDRANT_URL=your_qdrant_cluster_url
QDRANT_API_KEY=your_qdrant_api_key
QDRANT_COLLECTION=legal_documents
```

Run backend:

```bash
uvicorn app.main:app --reload
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## API Endpoints

### Upload Document

```http
POST /api/contracts/upload
```

Uploads and indexes PDF into vector DB.

---

### Analyze Document

```http
POST /api/analysis/analyze
```

Performs semantic retrieval + Gemini grounded response generation.

---

## Example Workflow

1. Upload a PDF contract/document
2. Backend extracts text
3. Document is chunked
4. Gemini generates embeddings
5. Qdrant stores vectors
6. User asks a question
7. Query is embedded
8. Relevant chunks retrieved
9. Gemini generates grounded answer

---

## Future Enhancements

- Risk scoring engine
- Clause extraction
- Multi-document comparison
- User authentication
- Persistent document history
- Legal clause classification
- Document version diff analysis

---

## Resume Highlights

Enterprise full-stack AI application demonstrating:

- Production-style backend architecture
- Retrieval-Augmented Generation
- Vector database integration
- LLM orchestration
- Semantic search
- React dashboard engineering
- API design
- Cloud AI integration

---

## License

MIT
