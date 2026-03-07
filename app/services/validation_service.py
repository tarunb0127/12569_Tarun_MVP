import time
from app.core.logging_config import get_logger
from app.services.face_service import detect_face
from app.services.alignment_service import detect_alignment
from app.services.background_service import detect_background
from app.services.quality_service import detect_blur, detect_brightness
from app.services.composition_service import analyze_composition
from app.services.suggestion_service import generate_suggestions
from app.schemas.response_schema import ProfessionalResponse, MetricResult, FaceBox

logger = get_logger("validation_service")


def severity_from_score(score: int) -> str:
    if score >= 85:
        return "None"
    elif score >= 70:
        return "Low"
    elif score >= 50:
        return "Medium"
    else:
        return "High"


def generate_rating(score: int) -> str:
    if score >= 85:
        return "Excellent"
    elif score >= 70:
        return "Good"
    elif score >= 50:
        return "Needs Improvement"
    else:
        return "Poor"



async def validate_photo(image_path: str) -> ProfessionalResponse:

    start_time = time.time()
    logger.info("Starting professional validation engine")

    face_result = detect_face(image_path)

    if not face_result.get("valid"):
        logger.warning("Validation rejected: invalid face detection")

        return ProfessionalResponse(
            overallScore=0,
            rating="Rejected",
            confidenceLevel="Low",
            analysisSummary="No valid single face detected.",
            metrics=[],
            improvementPriority=["Ensure exactly one clear face is visible."],
            faceBox=FaceBox(x=0, y=0, width=0, height=0),
            suggestions="Please upload an image with exactly one clearly visible face."
        )

    image = face_result["image"]
    facial_area = face_result["facial_area"]

    alignment = detect_alignment(facial_area)
    background = detect_background(image, facial_area)
    blur = detect_blur(image)
    brightness = detect_brightness(image)
    composition = analyze_composition(image, facial_area)

    brightness_score = int(brightness["brightness_quality_score"] * 100)
    clarity_score = min(int(blur["blur_score"] / 2), 100)
    orientation_score = (
        max(0, 100 - int(alignment["alignment_angle"] * 6))
        if alignment["alignment_angle"] is not None else 0
    )
    face_score = int(min(face_result["confidence"], 1.0) * 100)

    centering_score = composition["centering_score"]
    coverage_score = composition["coverage_score"]
    yaw_score = composition["yaw_score"]
    uniformity_score = composition["uniformity_score"]

    weights = {
        "brightness": 0.15,
        "clarity": 0.15,
        "face": 0.10,
        "centering": 0.15,
        "coverage": 0.15,
        "yaw": 0.10,
        "background": 0.20,
    }

    overall_score = int(
        brightness_score * weights["brightness"] +
        clarity_score * weights["clarity"] +
        face_score * weights["face"] +
        centering_score * weights["centering"] +
        coverage_score * weights["coverage"] +
        yaw_score * weights["yaw"] +
        uniformity_score * weights["background"]
    )

    rating = generate_rating(overall_score)
    confidence_level = "High" if face_score > 80 else "Moderate"

    metrics = [

    MetricResult(
        name="Brightness",
        score=brightness_score,
        severity=severity_from_score(brightness_score),
        impactWeight=weights["brightness"],
        details=f"Brightness category: {brightness['brightness_category']}"
    ),

    MetricResult(
        name="Clarity",
        score=clarity_score,
        severity=severity_from_score(clarity_score),
        impactWeight=weights["clarity"],
        details=f"Blur score: {blur['blur_score']}"
    ),

    MetricResult(
        name="Face Centering",
        score=centering_score,
        severity=severity_from_score(centering_score),
        impactWeight=weights["centering"],
        details="Measures horizontal alignment."
    ),

    MetricResult(
        name="Framing Coverage",
        score=coverage_score,
        severity=severity_from_score(coverage_score),
        impactWeight=weights["coverage"],
        details="Evaluates face-to-frame ratio."
    ),

    MetricResult(
        name="Pose Alignment",
        score=yaw_score,
        severity=severity_from_score(yaw_score),
        impactWeight=weights["yaw"],
        details="Approximates frontal vs side pose."
    ),

    MetricResult(
        name="Background Uniformity",
        score=uniformity_score,
        severity=severity_from_score(uniformity_score),
        impactWeight=weights["background"],
        details="Measures background consistency."
    ),

    MetricResult(
        name="Face Detection",
        score=face_score,
        severity=severity_from_score(face_score),
        impactWeight=weights["face"],
        details="Single face detected."
    ),
]

    sorted_metrics = sorted(metrics, key=lambda x: x.score)
    improvement_priority = [m.name for m in sorted_metrics if m.score < 85]

    if improvement_priority:
        summary = (
            f"The image scored {overall_score}/100. "
            f"Primary improvement area: {improvement_priority[0]}."
        )
    else:
        summary = "The image meets professional profile standards."

    face_box = FaceBox(
        x=int(facial_area["x"]),
        y=int(facial_area["y"]),
        width=int(facial_area["w"]),
        height=int(facial_area["h"])
    )

    response = ProfessionalResponse(
        overallScore=overall_score,
        rating=rating,
        confidenceLevel=confidence_level,
        analysisSummary=summary,
        metrics=metrics,
        improvementPriority=improvement_priority,
        faceBox=face_box
    )

    response_dict = response.model_dump()

    
    response.suggestions = await generate_suggestions(response_dict)

    duration = round((time.time() - start_time) * 1000, 2)
    logger.info(f"Validation completed in {duration} ms | Score: {overall_score}")

    return response