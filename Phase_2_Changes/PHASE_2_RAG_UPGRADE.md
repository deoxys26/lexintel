# LexIntel Phase 2: Advanced RAG Retrieval Upgrade

## Overview

In Phase 2, LexIntel was upgraded from a basic RAG-based legal document assistant into a more advanced retrieval system using parent-child sliding window chunking, Qdrant metadata enrichment, and cross-encoder re-ranking.

The main goal of this phase was to improve the quality of document retrieval before sending context to the LLM. In legal document analysis, simple chunking can break clauses, miss surrounding conditions, and provide incomplete context. This upgrade focuses on retrieving more accurate chunks while still preserving the larger legal context needed for grounded answers.

---

## Previous System

In the earlier version, LexIntel followed a basic RAG flow:

```text
PDF Upload
↓
Extract text
↓
Create simple chunks
↓
Generate embeddings
↓
Store chunks in Qdrant
↓
Retrieve top chunks
↓
Send context to Gemini
↓
Generate answer
```

This worked for basic document question answering, but it had some limitations.

### Problems in the Previous Version

1. Chunks could miss important surrounding context.
2. Legal clauses were sometimes split across multiple chunks.
3. Retrieved chunks were sent directly to Gemini without deeper relevance checking.
4. The system depended mainly on vector similarity.
5. Source metadata was basic and did not support parent-child retrieval.

---

## Phase 2 Improvements

### 1. Parent-Child Sliding Window Chunking

The old chunking system was improved into a parent-child chunking strategy.

In this method, each PDF page is first divided into larger parent chunks. Then each parent chunk is divided into smaller child chunks using sliding window overlap.

```text
PDF Page
↓
Parent Chunk
↓
Child Chunk 1
Child Chunk 2
Child Chunk 3
```

### Why This Helps

Child chunks are smaller and better for vector search, while parent chunks preserve the full legal context. This gives LexIntel both precise retrieval and better answer generation.

```text
Child chunk = used for search
Parent chunk = used for final LLM context
```

---

## 2. Improved PDF Text Cleaning

A text cleaning step was added before chunking.

PDF extraction often creates unnecessary line breaks and extra spaces. These were cleaned using regular expressions so that the final chunks are more readable and useful for embeddings.

Example:

```text
Before:
The tenant shall
pay rent every
month.

After:
The tenant shall pay rent every month.
```

This improves the quality of chunking and retrieval.

---

## 3. Richer Qdrant Metadata

The Qdrant payload was upgraded to store more metadata.

Earlier, each chunk stored only basic fields like:

```text
text
filename
page
chunk_index
```

In Phase 2, each child chunk now stores:

```text
text
child_text
parent_text
parent_id
child_id
chunk_type
filename
page
parent_index
child_index
score
```

This allows LexIntel to retrieve a small child chunk but still access the larger parent context during answer generation.

---

## 4. Retrieval Limit Increased

Earlier, Qdrant retrieved only the top 5 chunks.

In Phase 2, the retrieval limit was increased to top 20 chunks.

```text
Qdrant top 20 candidates
↓
Remove duplicate parent chunks
↓
Re-rank with cross-encoder
↓
Final top 5 chunks
```

This gives the re-ranker more candidates to evaluate and improves final source selection.

---

## 5. Duplicate Parent Chunk Removal

Since multiple child chunks can come from the same parent chunk, duplicate parent chunks were removed before sending context to Gemini.

This avoids repeated content and keeps the final prompt cleaner.

---

## 6. Cross-Encoder Re-Ranking

A new reranking service was added using a cross-encoder model.

The model used:

```text
cross-encoder/ms-marco-MiniLM-L-6-v2
```

Unlike normal vector search, a cross-encoder reads the user query and chunk together, then gives a relevance score.

```text
Query + Chunk → Relevance Score
```

This improves accuracy because the model checks whether the retrieved chunk actually answers the user’s question.

---

## Final Phase 2 RAG Flow

The upgraded LexIntel Phase 2 pipeline is:

```text
User uploads PDF
↓
PDF is saved locally
↓
Text is extracted page-wise
↓
Text is cleaned
↓
Parent chunks are created
↓
Child chunks are created using sliding window overlap
↓
Child chunks are embedded
↓
Child chunks and parent metadata are stored in Qdrant
↓
User asks a question
↓
Query embedding is created
↓
Qdrant retrieves top 20 child chunks
↓
Duplicate parent chunks are removed
↓
Cross-encoder re-ranks the chunks
↓
Top 5 chunks are sent to Gemini with parent context
↓
Gemini generates a grounded answer with sources
```

---

## Files Modified

### `pdf_service.py`

Added:

* Text cleaning
* Parent chunk creation
* Child chunk creation
* Parent-child sliding window chunking

### `document_service.py`

Updated:

* Upload pipeline
* Parent-child chunking settings
* Embedding generation for child chunks
* Better response statistics

### `qdrant_repository.py`

Updated:

* Qdrant payload structure
* Parent-child metadata storage
* Search response fields
* Retrieval limit support

### `analysis_service.py`

Updated:

* Top 20 retrieval
* Duplicate parent removal
* Parent context building
* Re-ranking integration

### `reranker_service.py`

Added:

* Cross-encoder model loading
* Query-chunk pair scoring
* Final top-k reranked source selection

### `requirements.txt`

Added:

* sentence-transformers
* torch

---

## Technical Impact

This phase made LexIntel more advanced because it moved beyond simple RAG. The system now uses a more production-like retrieval pipeline with parent-child retrieval and re-ranking.

The main improvements are:

1. Better legal context preservation
2. More accurate search results
3. Reduced irrelevant chunks
4. Stronger source-grounded answers
5. Better explainability using page numbers, vector scores, and reranker scores

---

## Portfolio Summary

In Phase 2, I upgraded LexIntel’s RAG pipeline by replacing basic chunking with parent-child sliding window chunking and adding cross-encoder re-ranking. Child chunks are used for precise vector search, while parent chunks preserve larger legal context for answer generation. I also improved Qdrant metadata storage to track filename, page number, parent ID, child ID, vector score, and reranker score. This made the system more accurate, explainable, and suitable for legal document analysis.
