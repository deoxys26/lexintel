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
        Store LexIntel 3.0 parent-child chunks and their embeddings in Qdrant.

        Important:
        - We embed child chunks.
        - We store parent_text in payload.
        - During search, child_text helps retrieval.
        - During answer generation, parent_text gives full legal context.

        Each chunk should contain:
        {
            "text": "small searchable child chunk",
            "child_text": "small searchable child chunk",
            "parent_text": "larger legal context",
            "parent_id": "...",
            "child_id": "...",
            "chunk_type": "child",
            "filename": "contract.pdf",
            "page": 1,
            "parent_index": 0,
            "child_index": 0
        }
        """

        if len(chunks) != len(embeddings):
            raise ValueError("Number of chunks and embeddings must be equal")

        points = []

        for index, chunk in enumerate(chunks):
            point_id = chunk.get("child_id") or str(uuid.uuid4())

            payload = {
                # Searchable text
                "text": chunk.get("text", ""),
                "child_text": chunk.get("child_text", chunk.get("text", "")),

                # Parent-child retrieval metadata
                "parent_text": chunk.get("parent_text", ""),
                "parent_id": chunk.get("parent_id", ""),
                "child_id": point_id,
                "chunk_type": chunk.get("chunk_type", "child"),

                # Source metadata
                "filename": chunk.get("filename", "Unknown file"),
                "page": chunk.get("page", "Unknown page"),
                "parent_index": chunk.get("parent_index", 0),
                "child_index": chunk.get("child_index", index),

                # Backward compatibility with old UI/backend
                "chunk_index": chunk.get("chunk_index", chunk.get("child_index", index))
            }

            points.append(
                PointStruct(
                    id=point_id,
                    vector=embeddings[index],
                    payload=payload
                )
            )

        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )

    def search_similar_chunks(
        self,
        query_embedding: list[float],
        limit: int = 20
    ) -> list[dict]:
        """
        Search Qdrant using query embedding.

        LexIntel 3.0:
        - Qdrant retrieves child chunks.
        - Each result also returns parent_text.
        - Later, reranker can score the query against child_text/parent_text.
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

            child_text = payload.get("child_text", payload.get("text", ""))
            parent_text = payload.get("parent_text", "")

            sources.append({
                # Main fields
                "text": child_text,
                "child_text": child_text,
                "parent_text": parent_text,

                # Parent-child IDs
                "parent_id": payload.get("parent_id", ""),
                "child_id": payload.get("child_id", ""),
                "chunk_type": payload.get("chunk_type", "child"),

                # Source metadata
                "filename": payload.get("filename", "Unknown file"),
                "page": payload.get("page", "Unknown page"),
                "parent_index": payload.get("parent_index", 0),
                "child_index": payload.get("child_index", 0),

                # Backward compatibility
                "chunk_index": payload.get("chunk_index", payload.get("child_index", 0)),

                # Vector search score
                "score": round(result.score, 4)
            })

        return sources