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

    def insert_chunks(self, chunks: list[str], embeddings: list[list[float]], filename: str):
        points = []

        for index, chunk in enumerate(chunks):
            points.append(
                PointStruct(
                    id=str(uuid.uuid4()),
                    vector=embeddings[index],
                    payload={
                        "text": chunk,
                        "filename": filename,
                        "chunk_index": index
                    }
                )
            )

        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )

    def search_similar_chunks(self, query_embedding: list[float], limit: int = 5):
        results = self.client.query_points(
        collection_name=self.collection_name,
        query=query_embedding,
        limit=limit
    ).points

        return [
        {
            "text": result.payload.get("text", ""),
            "filename": result.payload.get("filename", ""),
            "score": result.score
        }
        for result in results
    ]