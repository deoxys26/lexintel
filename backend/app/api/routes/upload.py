from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.document_service import DocumentService

router = APIRouter()

@router.post("/upload")
async def upload_contract(file: UploadFile = File(...)):
    try:
        document_service = DocumentService()
        return document_service.upload_contract(file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))