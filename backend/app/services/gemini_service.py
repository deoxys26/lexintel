from google import genai
from app.core.config import settings


class GeminiService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GOOGLE_API_KEY)
        self.model_name = "gemini-2.5-flash"

    def generate_response(self, prompt: str) -> str:
        """
        Sends the final grounded prompt to Gemini and returns the text response.
        """

        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )

            if not response or not response.text:
                return "I could not generate a response from the model."

            return response.text

        except Exception as e:
            print("Gemini API Error:")
            print(type(e))
            print(str(e))
            raise e