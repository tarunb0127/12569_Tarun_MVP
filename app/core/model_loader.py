from deepface import DeepFace
import numpy as np


def load_models():
    """
    Warm up RetinaFace detector at startup.
    This prevents first-request delay.
    """

    # Create dummy image (black image)
    dummy = np.zeros((224, 224, 3), dtype="uint8")

    # Trigger model loading
    DeepFace.extract_faces(
        img_path=dummy,
        detector_backend="retinaface",
        enforce_detection=False,
        align=False
    )