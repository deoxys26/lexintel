from fastapi import UploadFile
from pathlib import Path
import shutil


class FileRepository:
    def __init__(self, upload_dir: str = "uploads"):
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(exist_ok=True)

    def save_file(self, file: UploadFile) -> str:
        file_path = self.upload_dir / file.filename

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return str(file_path)