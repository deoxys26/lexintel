from google import genai
from app.core.config import settings


class EmbeddingService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GOOGLE_API_KEY)

    def embed_text(self, text: str) -> list[float]:
        response = self.client.models.embed_content(
            model="gemini-embedding-001",
            contents=text
        )

        return response.embeddings[0].values