from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health, upload, analysis

app = FastAPI(
    title="LexIntel API",
    description="Multi-Agent Legal Contract Intelligence Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(upload.router, prefix="/api/contracts", tags=["Contracts"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis"])