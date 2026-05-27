from pypdf import PdfReader


class PDFService:
    def extract_text(self, file_path: str) -> str:
        reader = PdfReader(file_path)
        text = ""

        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

        return text

    def chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 150):
        chunks = []
        start = 0

        while start < len(text):
            end = start + chunk_size
            chunks.append(text[start:end])
            start = end - overlap

        return chunks