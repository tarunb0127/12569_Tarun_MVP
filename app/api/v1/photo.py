from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.response_schema import ProfessionalResponse
from app.services.validation_service import validate_photo
from app.core.logging_config import get_logger
import shutil
import os
import uuid
import cv2

router = APIRouter()
logger = get_logger("photo_router")

UPLOAD_DIR = "app/temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}


@router.post("/validate", response_model=ProfessionalResponse)
async def validate(file: UploadFile = File(...)):

    request_id = str(uuid.uuid4())
    logger.info(f"[{request_id}] Received file: {file.filename}")

    # Validate MIME type
    if file.content_type not in ALLOWED_MIME_TYPES:
        logger.warning(f"[{request_id}] Invalid MIME type: {file.content_type}")
        raise HTTPException(
            status_code=400,
            detail="Only image files (JPG, PNG, WEBP) are allowed."
        )

    # Validate file extension
    _, ext = os.path.splitext(file.filename.lower())
    if ext not in ALLOWED_EXTENSIONS:
        logger.warning(f"[{request_id}] Invalid file extension: {ext}")
        raise HTTPException(
            status_code=400,
            detail="Invalid file extension. Allowed: JPG, PNG, WEBP."
        )

    unique_filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        # Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        logger.info(f"[{request_id}] File saved: {file_path}")

        # Verify that the file is a valid image
        image = cv2.imread(file_path)
        if image is None:
            logger.warning(f"[{request_id}] File is not a valid image")
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is not a valid image."
            )

        # Run validation pipeline
        result = await validate_photo(file_path)

        logger.info(f"[{request_id}] Validation completed successfully")

        return result

    except HTTPException:
        raise

    except Exception:
        logger.exception(f"[{request_id}] Validation failed unexpectedly")
        raise HTTPException(status_code=500, detail="Validation failed")

    finally:
        # Ensure temporary file is removed
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"[{request_id}] Temporary file removed")