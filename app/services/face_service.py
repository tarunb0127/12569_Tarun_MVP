import cv2
import mediapipe as mp
from app.core.logging_config import get_logger

logger = get_logger("face_service")

mp_face = mp.solutions.face_detection
face_detector = mp_face.FaceDetection(model_selection=1, min_detection_confidence=0.5)


def detect_face(image_path: str) -> dict:

    logger.info("Starting face detection")

    image = cv2.imread(image_path)

    if image is None:
        logger.error("Image could not be read")
        return {"valid": False, "error": "Image not readable"}

    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    results = face_detector.process(rgb)

    if not results.detections:
        logger.warning("No face detected")
        return {"valid": False, "faces_detected": 0}

    if len(results.detections) != 1:
        logger.warning(f"Invalid face count: {len(results.detections)}")
        return {"valid": False, "faces_detected": len(results.detections)}

    detection = results.detections[0]
    bbox = detection.location_data.relative_bounding_box

    h, w, _ = image.shape

    facial_area = {
        "x": int(bbox.xmin * w),
        "y": int(bbox.ymin * h),
        "w": int(bbox.width * w),
        "h": int(bbox.height * h),
    }

    confidence = detection.score[0]

    logger.info(f"Face detected | Confidence: {confidence}")

    return {
        "valid": True,
        "faces_detected": 1,
        "facial_area": facial_area,
        "confidence": confidence,
        "image": image
    }