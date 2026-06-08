from sentence_transformers import CrossEncoder


class RerankerService:
    def __init__(self):
        """
        Cross-encoder reranker for LexIntel 3.0.

        This model reads the query and each retrieved chunk together,
        then assigns a relevance score.

        We use a lightweight model so it is practical for local systems.
        """
        self.model = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

    def rerank(
        self,
        query: str,
        sources: list[dict],
        top_k: int = 5
    ) -> list[dict]:
        """
        Rerank retrieved sources using a cross-encoder model.

        Input:
        - query: user's question
        - sources: chunks returned from Qdrant

        Output:
        - top_k most relevant chunks, sorted by reranker score
        """

        if not sources:
            return []

        pairs = []

        for source in sources:
            child_text = source.get("child_text", source.get("text", ""))
            parent_text = source.get("parent_text", "")

            # Use child_text for reranking because it is smaller and more focused.
            # If child_text is missing, use parent_text.
            text_for_reranking = child_text if child_text else parent_text

            pairs.append([query, text_for_reranking])

        scores = self.model.predict(pairs)

        reranked_sources = []

        for source, score in zip(sources, scores):
            updated_source = source.copy()
            updated_source["reranker_score"] = round(float(score), 4)
            reranked_sources.append(updated_source)

        reranked_sources.sort(
            key=lambda item: item.get("reranker_score", 0),
            reverse=True
        )

        return reranked_sources[:top_k]