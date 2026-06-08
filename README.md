## LexIntel Phase 2: Advanced RAG Upgrade

LexIntel Phase 2 improves the document retrieval pipeline by moving from basic chunk-based RAG to a more advanced parent-child retrieval system with cross-encoder re-ranking.

### What Changed in Phase 2

* Added parent-child sliding window chunking
* Used child chunks for precise vector search
* Stored parent chunks for larger legal context
* Added richer Qdrant metadata including page number, parent ID, child ID, and chunk indexes
* Increased retrieval candidates from top 5 to top 20
* Removed duplicate parent chunks before answer generation
* Added cross-encoder re-ranking using `cross-encoder/ms-marco-MiniLM-L-6-v2`
* Improved source-grounded answers with filename and page number references
* Added Phase 2 documentation and challenges faced report

### Phase 2 Retrieval Flow

```text
PDF Upload
↓
Extract text page-wise
↓
Clean extracted text
↓
Create parent chunks
↓
Create child chunks with sliding window overlap
↓
Generate embeddings for child chunks
↓
Store child chunks + parent metadata in Qdrant
↓
User asks a question
↓
Qdrant retrieves top 20 child chunks
↓
Remove duplicate parent chunks
↓
Cross-encoder re-ranks the retrieved chunks
↓
Top 5 parent contexts are sent to Gemini
↓
Gemini generates a source-grounded answer
```

### Why This Upgrade Matters

The previous version used simpler chunking and directly sent retrieved chunks to the LLM. This worked for basic document analysis, but legal documents often contain long clauses, conditions, exceptions, and references across multiple paragraphs.

The Phase 2 upgrade improves retrieval quality by using smaller child chunks for accurate search and larger parent chunks for preserving legal meaning. Cross-encoder re-ranking further improves the final context selection before the answer is generated.

### Phase 2 Documentation

* [Phase 2 RAG Upgrade](./Phase_2_Changes/PHASE_2_RAG_UPGRADE.md)
* [Challenges Faced in Phase 2](./Phase_2_Changes/CHALLENGES_FACED_PHASE_2.md)
