from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.document_service import DocumentService
import traceback

router = APIRouter()


@router.post("/upload")
async def upload_contract(file: UploadFile = File(...)):
    print("UPLOAD ROUTE HIT")

    try:
        # Basic file validation
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")

        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        document_service = DocumentService()
        return document_service.upload_contract(file)

    except HTTPException:
        raise

    except Exception as e:
        print("UPLOAD ERROR:")
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {str(e)}"
        )