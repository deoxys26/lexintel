from fastapi import APIRouter, HTTPException
from app.schemas.analysis_schema import AnalysisRequest, AnalysisResponse
from app.services.analysis_service import AnalysisService

router = APIRouter()


@router.post("/analyze", response_model=AnalysisResponse)
def analyze_contract(request: AnalysisRequest):
    try:
        analysis_service = AnalysisService()
        return analysis_service.analyze_contract(request.query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))