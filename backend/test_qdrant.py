from dotenv import load_dotenv
import os
from qdrant_client import QdrantClient

load_dotenv()

url = os.getenv("QDRANT_URL")
key = os.getenv("QDRANT_API_KEY")

print("URL:", url)
print("KEY START:", key[:12] if key else None)
print("KEY LENGTH:", len(key) if key else None)

client = QdrantClient(
    url=url,
    api_key=key
)

print(client.get_collections())