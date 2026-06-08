# LexIntel - Legal Document Intelligence Platform

LexIntel is a full-stack AI-powered legal document analysis platform that allows users to upload PDF contracts or documents, ask questions, and receive source-grounded answers using Retrieval-Augmented Generation (RAG).

The project was built using FastAPI, React, Gemini, Qdrant, and document embeddings. It started as a basic PDF chatbot and was improved into a more trustworthy RAG system with page-level citations, source text, filename tracking, and similarity scores.

---

## Project Overview

Basic PDF chatbots often generate answers without showing where the information came from. This creates a trust issue, especially for legal or contract-related documents.

LexIntel solves this by retrieving relevant document chunks from Qdrant and returning:

* AI-generated answer
* Source filename
* Page number
* Retrieved source text
* Similarity score
* Chunk index

This makes every answer more transparent and easier to verify.

---

## Key Features

* PDF contract/document upload
* Text extraction from uploaded PDFs
* Page-wise document processing
* Chunk creation for retrieval
* Embedding generation for each chunk
* Vector storage using Qdrant
* RAG-based question answering
* Gemini-powered legal document explanation
* Source-grounded answers
* Page number citations
* Similarity scores for retrieved chunks
* React-based dashboard UI
* Upload status and document statistics
* Source preview display in frontend

---

## Phase 1 Improvement: Source-Grounded RAG

The initial version of LexIntel only uploaded documents and returned AI answers. The improved Phase 1 version adds source grounding.

### Before

The basic version worked like this:

```text
PDF Upload
↓
Extract Text
↓
Create Chunks
↓
Store Embeddings
↓
Ask Question
↓
Get AI Answer
```

The issue was that the answer did not clearly show which page or document section supported it.

### After Phase 1

The improved version works like this:

```text
PDF Upload
↓
Extract Text Page-by-Page
↓
Create Chunks with Metadata
↓
Store Text + Filename + Page Number + Chunk Index in Qdrant
↓
Ask Question
↓
Retrieve Relevant Chunks
↓
Generate Grounded Answer with Sources
↓
Display Page Numbers and Similarity Scores in UI
```

Now every answer includes supporting evidence from the uploaded document.

---

## Tech Stack

### Frontend

* React
* Vite
* Axios
* CSS

### Backend

* FastAPI
* Python
* Pydantic
* Uvicorn

### AI and RAG

* Google Gemini
* Qdrant Vector Database
* Embeddings
* Retrieval-Augmented Generation

### PDF Processing

* pypdf

---

## Folder Structure

```text
lexintel/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── upload.py
│   │   │       ├── analysis.py
│   │   │       └── health.py
│   │   │
│   │   ├── core/
│   │   │   └── config.py
│   │   │
│   │   ├── repositories/
│   │   │   ├── file_repository.py
│   │   │   └── qdrant_repository.py
│   │   │
│   │   ├── schemas/
│   │   │   └── analysis_schema.py
│   │   │
│   │   ├── services/
│   │   │   ├── analysis_service.py
│   │   │   ├── document_service.py
│   │   │   ├── embedding_service.py
│   │   │   ├── gemini_service.py
│   │   │   └── pdf_service.py
│   │   │
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── contractApi.js
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   ├── dashboard/
│   │   │   └── upload/
│   │   └── pages/
│   │       └── Dashboard.jsx
│   │
│   └── package.json
│
├── docs/
│   └── LexIntel_Phase1_Issues_and_Improvements.docx
│
└── README.md
```

---

## Backend Setup

Go to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the backend folder.

Example:

```env
GOOGLE_API_KEY=your_google_api_key
QDRANT_URL=your_qdrant_cluster_url
QDRANT_API_KEY=your_qdrant_api_key
QDRANT_COLLECTION=legal_documents_v2
```

Run the backend:

```bash
uvicorn app.main:app --reload
```

If port 8000 is already occupied, run:

```bash
uvicorn app.main:app --reload --port 8001
```

Open Swagger docs:

```text
http://127.0.0.1:8000/docs
```

or:

```text
http://127.0.0.1:8001/docs
```

---

## Frontend Setup

Go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Open the frontend URL shown in the terminal, usually:

```text
http://localhost:5173
```

---

## API Endpoints

### Upload Contract

```http
POST /api/contracts/upload
```

Uploads a PDF, extracts text, chunks it, creates embeddings, and stores the chunks in Qdrant.

Example response:

```json
{
  "filename": "contract.pdf",
  "file_path": "uploads/contract.pdf",
  "pages_extracted": 5,
  "chunks_created": 12,
  "message": "Contract uploaded and indexed successfully"
}
```

---

### Analyze Contract

```http
POST /api/analysis/analyze
```

Accepts a user query and returns a grounded AI response with sources.

Example request:

```json
{
  "query": "What are the important clauses in this document?"
}
```

Example response:

```json
{
  "analysis": "The document contains important clauses related to termination, payment, and responsibilities.",
  "sources": [
    {
      "text": "Either party may terminate this agreement...",
      "filename": "contract.pdf",
      "page": 2,
      "chunk_index": 0,
      "score": 0.8123
    }
  ]
}
```

---

## Issues Faced and Fixes

### 1. Upload Failed with Internal Server Error

The upload endpoint was failing with a 500 error. The issue was not the file upload itself, but the indexing step after upload.

The upload pipeline was dependent on Qdrant because the backend was doing:

```text
Upload PDF
↓
Extract text
↓
Create embeddings
↓
Store in Qdrant
```

When Qdrant failed, the full upload failed.

Fix:

* Debugged the upload route
* Added clearer error handling
* Understood that upload and indexing were connected
* Fixed Qdrant configuration

---

### 2. Qdrant 404 Error

Qdrant returned:

```text
Unexpected Response: 404 Not Found
```

Reason:

The Qdrant URL was incorrect. The backend was not pointing to the proper Qdrant cluster API endpoint.

Fix:

* Updated `QDRANT_URL` in `.env`
* Used correct Qdrant Cloud cluster URL
* Restarted backend
* Re-tested upload successfully

---

### 3. Page Numbers Were Missing

The earlier PDF extraction logic combined the whole document into one large text string. Because of that, the backend could not identify which page a retrieved answer came from.

Fix:

* Changed PDF extraction to work page-by-page
* Stored page number with each chunk
* Added page metadata into Qdrant payload

---

### 4. Qdrant Payload Was Too Basic

Earlier, Qdrant stored only:

```json
{
  "text": "chunk text",
  "filename": "contract.pdf",
  "chunk_index": 0
}
```

Improved payload:

```json
{
  "text": "chunk text",
  "filename": "contract.pdf",
  "page": 2,
  "chunk_index": 0
}
```

This allowed the frontend to show page-level citations.

---

### 5. Frontend Was Calling Wrong Backend Port

During development, port 8000 was stuck with an older process, so backend testing was moved to port 8001.

Fix:

* Updated frontend API base URL from port 8000 to 8001 during testing
* Increased frontend timeout for longer RAG responses

---

### 6. Frontend Did Not Display Sources

The backend was returning sources, but the chat message component only displayed the answer text.

Fix:

* Updated message state to store `sources`
* Passed sources into `MessageBubble`
* Added source cards below AI responses
* Displayed filename, page number, similarity score, and preview text

---

## What I Improved

The project was improved from a basic RAG chatbot into a more reliable document intelligence system.

### Basic LexIntel

* Uploaded PDFs
* Extracted text
* Stored embeddings
* Returned AI-generated answers

### Improved LexIntel Phase 1

* Extracts PDF text page-by-page
* Stores metadata with each chunk
* Retrieves relevant chunks from Qdrant
* Returns filename, page number, chunk index, and similarity score
* Displays sources in the frontend
* Improves trust and reduces hallucination risk

---



## Future Improvements

Planned improvements for the next phases:

* Risk detection for legal clauses
* Clause extraction
* Contract summary report
* Missing clause detection
* Contract comparison
* Chat history per document
* RAG evaluation dashboard
* Better reranking of retrieved chunks
* Authentication and user-specific documents

---

## Resume Highlight

This project can be described on a resume as:

> Built LexIntel, a full-stack legal document intelligence platform using FastAPI, React, Gemini, and Qdrant. Improved the RAG pipeline by adding source-grounded answers with filename, page number, retrieved text, chunk index, and similarity scores for better trust and reduced hallucination.

---
## Advanced Version

The advanced Phase 2 RAG upgrade is available in a separate branch:

`lexintel-3-rag-upgrade`

This branch includes parent-child chunking, Qdrant metadata improvements, and cross-encoder re-ranking.

## Author

**Phani M**
BTech Electronics and Communication Engineering
Interested in AI/ML, GenAI, FastAPI, React, and full-stack AI applications.

---

## Disclaimer

LexIntel is an educational AI project. It explains document content based on uploaded sources, but it does not provide legal advice.
