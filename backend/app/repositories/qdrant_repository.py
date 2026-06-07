from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct
)
from app.core.config import settings
import uuid


class QdrantRepository:
    def __init__(self):
        self.client = QdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY
        )

        self.collection_name = settings.QDRANT_COLLECTION
        self.vector_size = 3072

        self._create_collection_if_not_exists()

    def _create_collection_if_not_exists(self):
        collections = self.client.get_collections().collections
        existing_names = [collection.name for collection in collections]

        if self.collection_name not in existing_names:
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=self.vector_size,
                    distance=Distance.COSINE
                )
            )

    def insert_chunks(
        self,
        chunks: list[dict],
        embeddings: list[list[float]]
    ):
        """
        Store document chunks and their embeddings in Qdrant.

        Each chunk should contain:
        {
            "text": "...",
            "filename": "contract.pdf",
            "page": 1,
            "chunk_index": 0
        }
        """

        points = []

        for index, chunk in enumerate(chunks):
            points.append(
                PointStruct(
                    id=str(uuid.uuid4()),
                    vector=embeddings[index],
                    payload={
                        "text": chunk.get("text", ""),
                        "filename": chunk.get("filename", "Unknown file"),
                        "page": chunk.get("page", "Unknown page"),
                        "chunk_index": chunk.get("chunk_index", index)
                    }
                )
            )

        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )

    def search_similar_chunks(
        self,
        query_embedding: list[float],
        limit: int = 5
    ) -> list[dict]:
        """
        Search Qdrant using query embedding.

        Returns source chunks with filename, page number, score, and text.
        """

        results = self.client.query_points(
            collection_name=self.collection_name,
            query=query_embedding,
            limit=limit,
            with_payload=True
        ).points

        sources = []

        for result in results:
            payload = result.payload or {}

            sources.append({
                "text": payload.get("text", ""),
                "filename": payload.get("filename", "Unknown file"),
                "page": payload.get("page", "Unknown page"),
                "chunk_index": payload.get("chunk_index", 0),
                "score": round(result.score, 4)
            })

        return sources