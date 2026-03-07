import numpy as np
from app.core.logging_config import get_logger

logger = get_logger("composition_service")


def analyze_composition(image, facial_area: dict):

    img_h, img_w = image.shape[:2]
    x = int(facial_area["x"])
    y = int(facial_area["y"])
    w = int(facial_area["w"])
    h = int(facial_area["h"])

    # -----------------------------
    # 1️⃣ Face Centering Score
    # -----------------------------
    face_center_x = x + w / 2
    image_center_x = img_w / 2
    center_offset_ratio = abs(face_center_x - image_center_x) / image_center_x

    centering_score = max(0, 100 - int(center_offset_ratio * 200))

    # -----------------------------
    # 2️⃣ Edge Cutoff Detection
    # -----------------------------
    margin = 0.05 * img_w
    cutoff_penalty = 0

    if x < margin or (x + w) > (img_w - margin):
        cutoff_penalty = 40

    edge_score = max(0, 100 - cutoff_penalty)

    # -----------------------------
    # 3️⃣ Face Coverage Ratio
    # -----------------------------
    face_ratio = (w * h) / (img_w * img_h)

    if 0.25 <= face_ratio <= 0.60:
        coverage_score = 100
    else:
        coverage_score = max(0, 100 - int(abs(face_ratio - 0.4) * 400))

    # -----------------------------
    # 4️⃣ Yaw Approximation
    # -----------------------------
    left_eye = facial_area.get("left_eye")
    right_eye = facial_area.get("right_eye")

    yaw_score = 100

    if left_eye and right_eye:
        eye_distance = abs(left_eye[0] - right_eye[0])
        face_width_ratio = eye_distance / w

        if face_width_ratio < 0.3:
            yaw_score = 50  # side profile
        elif face_width_ratio < 0.4:
            yaw_score = 70

    # -----------------------------
    # 5️⃣ Background Uniformity
    # -----------------------------
    mask = np.ones((img_h, img_w), dtype="uint8") * 255
    mask[y:y+h, x:x+w] = 0

    background_pixels = image[mask == 255]

    color_std = float(np.std(background_pixels))

    uniformity_score = max(0, 100 - int(color_std))

    logger.info(
        f"Composition Scores | Centering:{centering_score}, "
        f"Edge:{edge_score}, Coverage:{coverage_score}, "
        f"Yaw:{yaw_score}, Uniformity:{uniformity_score}"
    )

    return {
        "centering_score": centering_score,
        "edge_score": edge_score,
        "coverage_score": coverage_score,
        "yaw_score": yaw_score,
        "uniformity_score": uniformity_score
    }