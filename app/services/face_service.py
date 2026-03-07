from deepface import DeepFace
import cv2
from app.core.logging_config import get_logger

logger = get_logger("face_service")


def detect_face(image_path: str) -> dict:

    logger.info("Starting face detection")

    image = cv2.imread(image_path)

    if image is None:
        logger.error("Image could not be read")
        return {"valid": False, "error": "Image not readable"}

    try:
        detections = DeepFace.extract_faces(
            img_path=image_path,
            detector_backend="retinaface",
            enforce_detection=False,
            align=False
        )

        if len(detections) != 1:
            logger.warning(f"Invalid face count: {len(detections)}")
            return {"valid": False, "faces_detected": int(len(detections))}

        face = detections[0]
        confidence = float(face.get("confidence", 0.0))

        logger.info(f"Face detected successfully | Confidence: {confidence}")

        return {
            "valid": True,
            "faces_detected": 1,
            "facial_area": face["facial_area"],
            "confidence": confidence,
            "image": image
        }

    except Exception:
        logger.exception("Face detection failed")
        return {"valid": False, "error": "Face detection error"}