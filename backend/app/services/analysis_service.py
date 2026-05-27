from app.services.embedding_service import EmbeddingService
from app.repositories.qdrant_repository import QdrantRepository
from app.services.gemini_service import GeminiService


class AnalysisService:
    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.qdrant_repository = QdrantRepository()
        self.gemini_service = GeminiService()

    def analyze_contract(self, query: str):
        print("1. Creating query embedding...")
        query_embedding = self.embedding_service.embed_text(query)

        print("2. Searching Qdrant...")
        relevant_chunks = self.qdrant_repository.search_similar_chunks(
            query_embedding=query_embedding,
            limit=2
        )

        print("3. Building compact context...")
        context = "\n\n".join(
            [
                f"Source: {chunk['filename']}\n"
                f"Content: {chunk['text'][:600]}"
                for chunk in relevant_chunks
            ]
        )

        print("4. Calling Gemini for grounded answer...")

        prompt = f"""
You are LexIntel, an AI contract/document analysis assistant.

Answer the user's question using ONLY the retrieved context below.

Retrieved Context:
{context}

User Question:
{query}

Give the answer in this format:
1. Short Summary
2. Important Points Found
3. Risks or Concerns
4. Recommendations
5. Sources Used

Keep the answer concise.
"""

        try:
            answer = self.gemini_service.generate_response(prompt)
        except Exception as e:
            print("GEMINI FINAL ANSWER ERROR:")
            print(type(e))
            print(str(e))
            raise e

        print("5. Done.")

        return {
            "analysis": answer,
            "sources": relevant_chunks
        }