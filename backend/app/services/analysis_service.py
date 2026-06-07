from app.services.embedding_service import EmbeddingService
from app.repositories.qdrant_repository import QdrantRepository
from app.services.gemini_service import GeminiService


class AnalysisService:
    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.qdrant_repository = QdrantRepository()
        self.gemini_service = GeminiService()

    def build_context_from_sources(self, sources: list[dict]) -> str:
        """
        Builds a clean context for Gemini using retrieved chunks.

        Each source contains:
        - filename
        - page
        - score
        - text
        """

        context_parts = []

        for index, source in enumerate(sources, start=1):
            context_parts.append(
                f"""
Source {index}
File: {source.get("filename", "Unknown file")}
Page: {source.get("page", "Unknown page")}
Similarity Score: {source.get("score", 0)}

Content:
{source.get("text", "")[:1200]}
"""
            )

        return "\n\n".join(context_parts)

    def analyze_contract(self, query: str):
        print("1. Creating query embedding...")
        query_embedding = self.embedding_service.embed_text(query)

        print("2. Searching Qdrant...")
        relevant_chunks = self.qdrant_repository.search_similar_chunks(
            query_embedding=query_embedding,
            limit=5
        )

        if not relevant_chunks:
            return {
                "analysis": "I could not find relevant information in the uploaded document.",
                "sources": []
            }

        print("3. Building source-grounded context...")
        context = self.build_context_from_sources(relevant_chunks)

        print("4. Calling Gemini for grounded answer...")

        prompt = f"""
You are LexIntel, an AI contract/document analysis assistant.

Answer the user's question using ONLY the retrieved document sources below.

Important rules:
1. Do not make up information.
2. If the answer is not present in the retrieved sources, say:
   "I could not find this information in the uploaded document."
3. Mention page numbers when useful.
4. Do not provide legal advice. Only explain what the document says.
5. Keep the answer clear, practical, and concise.

Retrieved Document Sources:
{context}

User Question:
{query}

Give the answer in this format:

1. Short Summary
2. Important Points Found
3. Risks or Concerns
4. Recommendations
5. Sources Used

In "Sources Used", mention the filename and page number.
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