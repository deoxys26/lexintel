from fastapi import APIRouter, HTTPException
from app.schemas.analysis_schema import AnalysisRequest, AnalysisResponse
from app.services.analysis_service import AnalysisService
import traceback

router = APIRouter()


@router.post("/analyze", response_model=AnalysisResponse)
def analyze_contract(request: AnalysisRequest):
    try:
        print("\n========== ANALYSIS REQUEST START ==========")
        print(f"User query: {request.query}")

        analysis_service = AnalysisService()

        print("Running AnalysisService.analyze_contract()...")
        result = analysis_service.analyze_contract(request.query)

        print("Analysis completed successfully.")
        print("Result:", result)
        print("========== ANALYSIS REQUEST END ==========\n")

        return result

    except Exception as e:
        print("\n========== ANALYSIS ERROR ==========")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        traceback.print_exc()
        print("====================================\n")

        raise HTTPException(
            status_code=500,
            detail=f"{type(e).__name__}: {str(e)}"
        )