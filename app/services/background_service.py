import cv2
import numpy as np
from app.core.logging_config import get_logger

logger = get_logger("background_service")


def detect_background(image, facial_area: dict) -> dict:

    logger.info("Starting background analysis")

    x, y, w, h = (
        int(facial_area["x"]),
        int(facial_area["y"]),
        int(facial_area["w"]),
        int(facial_area["h"])
    )

    img_h, img_w = image.shape[:2]

    face_area = w * h
    total_area = img_h * img_w
    face_ratio = float(face_area / total_area)

    if face_ratio < 0.15:
        logger.warning("Face too small in frame")
        return {
            "face_ratio": round(face_ratio, 3),
            "edge_density": 0.0,
            "background_category": "face_too_small",
            "hard_reject": True
        }

    mask = np.ones((img_h, img_w), dtype="uint8") * 255
    mask[y:y+h, x:x+w] = 0

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 100, 200)

    background_edges = cv2.bitwise_and(edges, edges, mask=mask)

    total_bg = int(np.sum(mask > 0))
    edge_pixels = int(np.sum(background_edges > 0))

    edge_density = float(edge_pixels / total_bg) if total_bg else 0.0

    if edge_density < 0.06:
        category = "plain"
        hard_reject = False
    else:
        category = "non_plain_background"
        hard_reject = True

    logger.info(f"Background category: {category}")

    return {
        "face_ratio": round(face_ratio, 3),
        "edge_density": round(edge_density, 4),
        "background_category": category,
        "hard_reject": bool(hard_reject)
    }