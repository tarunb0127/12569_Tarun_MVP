import cv2
import numpy as np
from app.core.logging_config import get_logger

logger = get_logger("quality_service")


def detect_blur(image, threshold: float = 30.0) -> dict:

    logger.info("Starting blur detection")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blur_score = float(cv2.Laplacian(gray, cv2.CV_64F).var())

    is_blurry = bool(blur_score < threshold)

    logger.info(f"Blur score: {round(blur_score,2)} | Blurry: {is_blurry}")

    return {
        "blur_score": round(blur_score, 2),
        "is_blurry": is_blurry
    }


def detect_brightness(image) -> dict:

    logger.info("Starting brightness analysis")

    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    brightness_score = float(np.mean(hsv[:, :, 2]))

    if brightness_score < 40:
        category = "very_dark"
        score = 0.2
    elif brightness_score < 70:
        category = "dark"
        score = 0.5
    elif brightness_score <= 180:
        category = "good"
        score = 1.0
    elif brightness_score <= 220:
        category = "slightly_bright"
        score = 0.7
    else:
        category = "overexposed"
        score = 0.3

    logger.info(f"Brightness category: {category}")

    return {
        "brightness_score": round(brightness_score, 2),
        "brightness_category": category,
        "brightness_quality_score": float(score)
    }