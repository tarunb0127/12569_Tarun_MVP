import math
from app.core.logging_config import get_logger

logger = get_logger("alignment_service")


def detect_alignment(facial_area: dict) -> dict:

    logger.info("Starting alignment detection")

    left_eye = facial_area.get("left_eye")
    right_eye = facial_area.get("right_eye")

    if not left_eye or not right_eye:
        logger.warning("Eye landmarks missing")
        return {
            "alignment_angle": None,
            "alignment_category": "landmarks_missing",
            "alignment_quality_score": 0.0
        }

    if left_eye[0] > right_eye[0]:
        left_eye, right_eye = right_eye, left_eye

    x1, y1 = left_eye
    x2, y2 = right_eye

    angle = math.degrees(math.atan2((y2 - y1), (x2 - x1)))
    abs_angle = abs(angle)

    if abs_angle > 90:
        abs_angle = 180 - abs_angle

    if abs_angle <= 5:
        category = "perfect"
        score = 1.0
    elif abs_angle <= 10:
        category = "slightly_tilted"
        score = 0.7
    else:
        category = "tilted"
        score = 0.3

    logger.info(f"Alignment category: {category} | Angle: {round(abs_angle,2)}")

    return {
        "alignment_angle": round(float(abs_angle), 2),
        "alignment_category": category,
        "alignment_quality_score": float(score)
    }