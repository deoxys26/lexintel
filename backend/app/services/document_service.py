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
        # 1. Save uploaded PDF locally
        file_path = self.file_repository.save_file(file)

        # 2. Extract PDF text page-by-page
        # Expected output:
        # [
        #   {"text": "...", "filename": "contract.pdf", "page": 1},
        #   {"text": "...", "filename": "contract.pdf", "page": 2}
        # ]
        pages = self.pdf_service.extract_pages(
            file_path=file_path,
            filename=file.filename
        )

        # 3. Create chunks while keeping filename, page number, and chunk index
        # Expected output:
        # [
        #   {
        #     "text": "...",
        #     "filename": "contract.pdf",
        #     "page": 1,
        #     "chunk_index": 0
        #   }
        # ]
        chunks = self.pdf_service.create_chunks_from_pages(pages)

        # 4. Create embeddings only from chunk text
        embeddings = [
            self.embedding_service.embed_text(chunk["text"])
            for chunk in chunks
        ]

        # 5. Store chunk text + metadata + embedding in Qdrant
        self.qdrant_repository.insert_chunks(
            chunks=chunks,
            embeddings=embeddings
        )

        return {
            "filename": file.filename,
            "file_path": file_path,
            "pages_extracted": len(pages),
            "chunks_created": len(chunks),
            "message": "Contract uploaded and indexed successfully"
        }