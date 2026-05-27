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
        file_path = self.file_repository.save_file(file)

        text = self.pdf_service.extract_text(file_path)
        chunks = self.pdf_service.chunk_text(text)

        embeddings = [
            self.embedding_service.embed_text(chunk)
            for chunk in chunks
        ]

        self.qdrant_repository.insert_chunks(
            chunks=chunks,
            embeddings=embeddings,
            filename=file.filename
        )

        return {
            "filename": file.filename,
            "file_path": file_path,
            "chunks_created": len(chunks),
            "message": "Contract uploaded and indexed successfully"
        }