from pypdf import PdfReader
import re
import uuid


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
                    "text": self.clean_text(page_text),
                    "filename": filename,
                    "page": page_index + 1
                })

        return pages

    def clean_text(self, text: str) -> str:
        """
        Clean PDF-extracted text.

        PDF extraction often creates unnecessary new lines,
        extra spaces, and broken formatting.
        """

        text = text.replace("\n", " ")
        text = re.sub(r"\s+", " ", text)
        return text.strip()

    def chunk_text(
        self,
        text: str,
        chunk_size: int,
        overlap: int
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

    def create_parent_chunks_from_pages(
        self,
        pages: list[dict],
        parent_chunk_size: int = 1800,
        parent_overlap: int = 250
    ) -> list[dict]:
        """
        Create larger parent chunks from each page.

        Parent chunks preserve bigger legal context.

        Returns:
        [
            {
                "parent_id": "unique-parent-id",
                "parent_text": "large context...",
                "filename": "contract.pdf",
                "page": 1,
                "parent_index": 0
            }
        ]
        """

        parent_chunks = []

        for page in pages:
            chunks = self.chunk_text(
                text=page["text"],
                chunk_size=parent_chunk_size,
                overlap=parent_overlap
            )

            for parent_index, parent_text in enumerate(chunks):
                parent_chunks.append({
                    "parent_id": str(uuid.uuid4()),
                    "parent_text": parent_text,
                    "filename": page["filename"],
                    "page": page["page"],
                    "parent_index": parent_index
                })

        return parent_chunks

    def create_child_chunks_from_parent(
        self,
        parent_chunk: dict,
        child_chunk_size: int = 500,
        child_overlap: int = 100
    ) -> list[dict]:
        """
        Create smaller child chunks from one parent chunk.

        Child chunks are used for precise vector search.
        Parent text is stored with every child chunk so that
        the LLM can receive fuller legal context later.
        """

        child_texts = self.chunk_text(
            text=parent_chunk["parent_text"],
            chunk_size=child_chunk_size,
            overlap=child_overlap
        )

        child_chunks = []

        for child_index, child_text in enumerate(child_texts):
            child_chunks.append({
                # This "text" field is kept because your old pipeline
                # probably expects chunk["text"] for embedding.
                "text": child_text,

                # New LexIntel 3.0 fields
                "child_text": child_text,
                "parent_text": parent_chunk["parent_text"],
                "parent_id": parent_chunk["parent_id"],
                "child_id": str(uuid.uuid4()),
                "chunk_type": "child",

                # Metadata for source tracking
                "filename": parent_chunk["filename"],
                "page": parent_chunk["page"],
                "parent_index": parent_chunk["parent_index"],
                "child_index": child_index
            })

        return child_chunks

    def create_chunks_from_pages(
        self,
        pages: list[dict],
        parent_chunk_size: int = 1800,
        parent_overlap: int = 250,
        child_chunk_size: int = 500,
        child_overlap: int = 100
    ) -> list[dict]:
        """
        Main chunking function for LexIntel 3.0.

        Creates parent-child sliding window chunks.

        Final output:
        [
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
        ]

        We embed child chunks for accurate search,
        but keep parent_text for stronger answer generation.
        """

        all_child_chunks = []

        parent_chunks = self.create_parent_chunks_from_pages(
            pages=pages,
            parent_chunk_size=parent_chunk_size,
            parent_overlap=parent_overlap
        )

        for parent_chunk in parent_chunks:
            child_chunks = self.create_child_chunks_from_parent(
                parent_chunk=parent_chunk,
                child_chunk_size=child_chunk_size,
                child_overlap=child_overlap
            )

            all_child_chunks.extend(child_chunks)

        return all_child_chunks