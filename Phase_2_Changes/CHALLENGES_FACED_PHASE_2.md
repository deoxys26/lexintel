# LexIntel Phase 2: Challenges Faced and Improvements Made

## Overview

During Phase 2 of LexIntel, the main focus was upgrading the retrieval system from basic RAG to a more advanced parent-child RAG pipeline with cross-encoder re-ranking. While implementing this, several technical challenges were faced related to chunking, metadata storage, dependencies, backend environment setup, API quota limits, and frontend/backend testing.

---

## Challenge 1: Basic Chunking Was Not Enough

### Problem

The earlier version of LexIntel used simple chunking. This worked for basic testing, but it was not ideal for legal documents.

Legal documents often contain:

* Long clauses
* Sub-clauses
* Conditions
* Exceptions
* Penalty details
* References to other sections

When the text was split into simple chunks, some important context could be lost.

### Improvement Made

Parent-child sliding window chunking was added.

The system now creates:

```text
Large parent chunks for context
Small child chunks for search
```

### Why This Improved the Project

This helped LexIntel retrieve focused child chunks while still using the larger parent text for answer generation. This makes the final answer more accurate and context-aware.

---

## Challenge 2: PDF Text Had Formatting Issues

### Problem

PDF text extraction often produced messy text with line breaks, extra spaces, and broken formatting.

Example:

```text
The tenant shall
pay the rent
on or before the 5th day.
```

This kind of formatting affects chunk quality and embedding quality.

### Improvement Made

A text cleaning function was added in `pdf_service.py`.

It removes unnecessary new lines and extra spaces before chunking.

### Why This Improved the Project

Cleaner text leads to better chunks, better embeddings, and better retrieval results.

---

## Challenge 3: Old Qdrant Metadata Was Too Limited

### Problem

The old Qdrant payload stored only basic metadata:

```text
text
filename
page
chunk_index
```

This was not enough for parent-child retrieval.

The system needed to store both child text and parent text.

### Improvement Made

The Qdrant payload was upgraded to include:

```text
child_text
parent_text
parent_id
child_id
chunk_type
filename
page
parent_index
child_index
```

### Why This Improved the Project

Now Qdrant can search small child chunks while still returning the larger parent context for the LLM.

---

## Challenge 4: Multiple Child Chunks Came From the Same Parent

### Problem

When Qdrant retrieved top results, sometimes multiple child chunks came from the same parent chunk.

This created repeated context in the prompt.

### Improvement Made

A duplicate parent removal function was added in `analysis_service.py`.

It keeps only one best child chunk for each parent chunk.

### Why This Improved the Project

This reduced repeated context and made the prompt cleaner before sending it to Gemini.

---

## Challenge 5: Vector Search Alone Was Not Accurate Enough

### Problem

Qdrant vector search is fast, but it may retrieve chunks that are similar in meaning but not always the best answer to the user’s question.

Example:

A question about early termination may retrieve chunks about contract renewal, general termination, or payment terms.

### Improvement Made

A cross-encoder re-ranking service was added.

The model used was:

```text
cross-encoder/ms-marco-MiniLM-L-6-v2
```

### Why This Improved the Project

The cross-encoder reads the query and chunk together and gives a relevance score. This helps select the most useful chunks before passing them to Gemini.

---

## Challenge 6: Dependency Issues With `sentence-transformers`

### Problem

After adding the re-ranker, the backend gave this error:

```text
ModuleNotFoundError: No module named 'sentence_transformers'
```

This happened because the new dependency was added to `requirements.txt`, but it was not installed in the virtual environment.

### Improvement Made

The missing packages were added:

```text
sentence-transformers
torch
```

The backend environment was fixed using:

```powershell
python -m pip install -r requirements.txt
```

### Why This Improved the Project

This allowed the backend to load the cross-encoder model successfully.

---

## Challenge 7: Virtual Environment Had Pip Issues

### Problem

While installing dependencies, the environment showed:

```text
ModuleNotFoundError: No module named 'pip'
```

This meant the virtual environment was not properly configured.

### Improvement Made

The environment was repaired using:

```powershell
python -m ensurepip --upgrade
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

### Why This Improved the Project

This fixed package installation and made the backend environment stable.

---

## Challenge 8: Google API Quota Error

### Problem

During PDF upload, the backend returned:

```text
429 RESOURCE_EXHAUSTED
```

This happened because the system created embeddings for many child chunks quickly, causing Google API quota exhaustion.

### Improvement Made

The chunking configuration was adjusted to create fewer child chunks:

```text
parent_chunk_size = 2500
parent_overlap = 300
child_chunk_size = 900
child_overlap = 150
```

A delay was also suggested between embedding requests.

### Why This Improved the Project

This reduced the number of embedding calls and made the system more practical for free-tier API limits.

---

## Challenge 9: File Picker Freezing During Upload

### Problem

The Windows file picker got stuck while opening the Downloads folder.

This was not a backend issue. It was caused by Windows Explorer loading a heavy folder.

### Improvement Made

The PDF was moved to a smaller test folder before upload.

Example:

```text
C:\Users\Admin\Desktop\test-pdfs
```

### Why This Improved the Project

Using a smaller folder made testing easier and avoided upload interruptions.

---

## Challenge 10: Need to Avoid Mixing Old and New Qdrant Data

### Problem

The old Qdrant collection had chunks from the previous version of LexIntel. These old chunks did not contain the new parent-child metadata.

### Improvement Made

A new Qdrant collection was recommended:

```env
QDRANT_COLLECTION=legal_documents_v3
```

### Why This Improved the Project

This keeps Phase 2 data separate from older data and avoids mixed retrieval results.

---

## Final Improvements Made

By the end of Phase 2, the following improvements were completed:

1. Added parent-child sliding window chunking
2. Added PDF text cleaning
3. Stored richer metadata in Qdrant
4. Increased retrieval limit for better candidate selection
5. Removed duplicate parent chunks
6. Added cross-encoder re-ranking
7. Updated requirements
8. Improved backend debugging and environment setup
9. Reduced API quota pressure
10. Prepared the system for better source-grounded legal document analysis

---

## Final Result

LexIntel Phase 2 became a stronger and more advanced RAG project. Instead of directly sending basic vector search results to Gemini, the system now uses a more reliable retrieval pipeline.

```text
Vector search retrieves candidates
↓
Parent-child metadata preserves context
↓
Cross-encoder re-ranking improves relevance
↓
Gemini receives cleaner, grounded context
```

This makes LexIntel more suitable for portfolio presentation, resume discussion, and technical interviews.
