from pypdf import PdfReader


class PDFService:
    def extract_pages(self, file_path: str, filename: str) -> list[dict]:
        """
        Extract text from PDF page-by-page.

        Returns:
        [
            {
                "text": "page text...",
                "filename": "contract.pdf",
                "page": 1
            }
        ]
        """

        reader = PdfReader(file_path)
        pages = []

        for page_index, page in enumerate(reader.pages):
            page_text = page.extract_text()

            if page_text and page_text.strip():
                pages.append({
                    "text": page_text.strip(),
                    "filename": filename,
                    "page": page_index + 1
                })

        return pages

    def chunk_text(
        self,
        text: str,
        chunk_size: int = 1000,
        overlap: int = 150
    ) -> list[str]:
        """
        Split text into overlapping character-based chunks.

        Example:
        chunk_size = 1000
        overlap = 150

        Chunk 1: characters 0 to 1000
        Chunk 2: characters 850 to 1850
        """

        if chunk_size <= overlap:
            raise ValueError("chunk_size must be greater than overlap")

        chunks = []
        start = 0

        while start < len(text):
            end = start + chunk_size
            chunk = text[start:end].strip()

            if chunk:
                chunks.append(chunk)

            start = end - overlap

        return chunks

    def create_chunks_from_pages(
        self,
        pages: list[dict],
        chunk_size: int = 1000,
        overlap: int = 150
    ) -> list[dict]:
        """
        Create chunks from each page while preserving metadata.

        Returns:
        [
            {
                "text": "chunk text...",
                "filename": "contract.pdf",
                "page": 1,
                "chunk_index": 0
            }
        ]
        """

        all_chunks = []

        for page in pages:
            page_chunks = self.chunk_text(
                text=page["text"],
                chunk_size=chunk_size,
                overlap=overlap
            )

            for chunk_index, chunk in enumerate(page_chunks):
                all_chunks.append({
                    "text": chunk,
                    "filename": page["filename"],
                    "page": page["page"],
                    "chunk_index": chunk_index
                })

        return all_chunks