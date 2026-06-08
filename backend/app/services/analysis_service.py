from app.services.embedding_service import EmbeddingService
from app.repositories.qdrant_repository import QdrantRepository
from app.services.gemini_service import GeminiService
from app.services.reranker_service import RerankerService

class AnalysisService:
    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.qdrant_repository = QdrantRepository()
        self.gemini_service = GeminiService()
        self.reranker_service = RerankerService()

    def remove_duplicate_parent_chunks(self, sources: list[dict]) -> list[dict]:
        """
        Remove duplicate parent chunks.

        In parent-child retrieval, multiple child chunks from the same parent
        may match the query. If we send all of them to Gemini, the context
        becomes repetitive.

        This keeps only the best matching child chunk for each parent_id.
        """

        unique_sources = {}
        fallback_sources = []

        for source in sources:
            parent_id = source.get("parent_id")

            if parent_id:
                if parent_id not in unique_sources:
                    unique_sources[parent_id] = source
            else:
                fallback_sources.append(source)

        return list(unique_sources.values()) + fallback_sources

    def build_context_from_sources(self, sources: list[dict]) -> str:
        """
        Build source-grounded context for Gemini.

        LexIntel 3.0:
        - child_text is the precise retrieved match
        - parent_text is the larger legal context
        - Gemini receives parent_text so it can answer with fuller meaning
        """

        context_parts = []

        for index, source in enumerate(sources, start=1):
            child_text = source.get("child_text", source.get("text", ""))
            parent_text = source.get("parent_text", "")

            # Prefer parent_text for final answer context.
            # If parent_text is missing, fall back to child_text.
            final_context = parent_text if parent_text else child_text

            context_parts.append(
                f"""
Source {index}
File: {source.get("filename", "Unknown file")}
Page: {source.get("page", "Unknown page")}
Vector Similarity Score: {source.get("score", 0)}
Parent Index: {source.get("parent_index", 0)}
Child Index: {source.get("child_index", source.get("chunk_index", 0))}
Reranker Score: {source.get("reranker_score", "Not available")}

Matched Child Text:
{child_text[:700]}

Parent Context Used:
{final_context[:1800]}
"""
            )

        return "\n\n".join(context_parts)

    def analyze_contract(self, query: str):
        print("1. Creating query embedding...")
        query_embedding = self.embedding_service.embed_text(query)

        print("2. Searching Qdrant for top child chunks...")
        retrieved_chunks = self.qdrant_repository.search_similar_chunks(
            query_embedding=query_embedding,
            limit=20
        )

        if not retrieved_chunks:
            return {
                "analysis": "I could not find relevant information in the uploaded document.",
                "sources": []
            }

            print("3. Removing duplicate parent chunks...")
        unique_chunks = self.remove_duplicate_parent_chunks(retrieved_chunks)

        print("4. Reranking chunks with cross-encoder...")
        final_chunks = self.reranker_service.rerank(
            query=query,
            sources=unique_chunks,
            top_k=5
        )

        print("5. Building parent-child source-grounded context...")
        context = self.build_context_from_sources(final_chunks)

        print("6. Calling Gemini for grounded answer...")

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
6. Use the Parent Context Used section for understanding the full clause/context.
7. Use the Matched Child Text section to understand why the source was retrieved.

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

        print("7. Done.")

        return {
            "analysis": answer,
            "sources": final_chunks
        }