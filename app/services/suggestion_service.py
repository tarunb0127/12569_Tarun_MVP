from app.services.llm_service import generate_llm_feedback


async def generate_suggestions(validation_response: dict) -> str:

    # Short-circuit if already excellent
    if validation_response["overallScore"] >= 85:
        return (
            "This is already a strong professional profile photo. "
            "Only minor refinements may be needed to further enhance presentation."
        )

    problematic = [
        m for m in validation_response["metrics"]
        if m["severity"] in ["High", "Medium"]
    ]

    metric_summary = "\n".join([
        f"{m['name']} requires improvement."
        for m in problematic
    ])

    prompt = f"""
Analyze the following profile photo evaluation metrics:

{metric_summary}

Provide exactly 5 improvement suggestions.

Requirements:
- Focus only on the issues reflected in the metrics.
- Do not mention scores, numbers, or metric names.
- Do not add any introduction or conclusion.
- Do not reference any platform.
- Each suggestion must be a single clear sentence.
- Return the suggestions as separate bullet points.
- Start each line with "- ".

Output only the bullet points.
"""

    return await generate_llm_feedback(prompt)