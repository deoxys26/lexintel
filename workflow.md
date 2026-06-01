# LexIntel Workflow

1. User uploads a legal PDF.
2. Backend extracts text from PDF pages.
3. Text is split into smaller chunks.
4. Embeddings are generated for each chunk.
5. Embeddings and metadata are stored in Qdrant.
6. User asks a question.
7. Query embedding is created.
8. Top-k relevant chunks are retrieved from Qdrant.
9. Retrieved context is sent to Gemini.
10. Gemini generates a grounded answer.
