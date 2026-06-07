from pydantic import BaseModel
from typing import List, Union


class AnalysisRequest(BaseModel):
    query: str


class SourceResponse(BaseModel):
    text: str
    filename: str
    page: Union[int, str]
    chunk_index: int
    score: float


class AnalysisResponse(BaseModel):
    analysis: str
    sources: List[SourceResponse]