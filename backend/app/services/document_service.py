from fastapi import UploadFile
from app.repositories.file_repository import FileRepository
from app.services.pdf_service import PDFService
from app.services.embedding_service import EmbeddingService
from app.repositories.qdrant_repository import QdrantRepository


class DocumentService:
    def __init__(self):
        self.file_repository = FileRepository()
        self.pdf_service = PDFService()
        self.embedding_service = EmbeddingService()
        self.qdrant_repository = QdrantRepository()

    def upload_contract(self, file: UploadFile):
        """
        Upload a legal PDF, extract text, create parent-child chunks,
        generate embeddings for child chunks, and store them in Qdrant.

        LexIntel 3.0 flow:

        PDF
        ↓
        Extract page-wise text
        ↓
        Create parent chunks for full legal context
        ↓
        Create child chunks for precise vector search
        ↓
        Embed only child chunks
        ↓
        Store child chunks + parent context metadata in Qdrant
        """

        # 1. Save uploaded PDF locally
        file_path = self.file_repository.save_file(file)

        # 2. Extract PDF text page-by-page
        pages = self.pdf_service.extract_pages(
            file_path=file_path,
            filename=file.filename
        )

        if not pages:
            return {
                "filename": file.filename,
                "file_path": file_path,
                "pages_extracted": 0,
                "chunks_created": 0,
                "message": "No readable text found in the uploaded PDF"
            }

        # 3. Create parent-child sliding window chunks
        chunks = self.pdf_service.create_chunks_from_pages(
            pages=pages,
            parent_chunk_size=1800,
            parent_overlap=250,
            child_chunk_size=500,
            child_overlap=100
        )

        if not chunks:
            return {
                "filename": file.filename,
                "file_path": file_path,
                "pages_extracted": len(pages),
                "chunks_created": 0,
                "message": "Text was extracted, but no chunks were created"
            }

        # 4. Create embeddings only from child chunk text
        embeddings = [
            self.embedding_service.embed_text(chunk["text"])
            for chunk in chunks
        ]

        # 5. Store child chunks + parent metadata + embeddings in Qdrant
        self.qdrant_repository.insert_chunks(
            chunks=chunks,
            embeddings=embeddings
        )

        unique_parent_ids = {
            chunk["parent_id"]
            for chunk in chunks
            if "parent_id" in chunk
        }

        return {
            "filename": file.filename,
            "file_path": file_path,
            "pages_extracted": len(pages),
            "parent_chunks_created": len(unique_parent_ids),
            "child_chunks_created": len(chunks),
            "chunking_strategy": "parent-child sliding window chunking",
            "embedding_target": "child chunks",
            "message": "Contract uploaded and indexed successfully with LexIntel 3.0 chunking"
        }