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
You are a professional profile photo consultant.

Analyze the following image quality metrics and provide improvement feedback.

Metrics:
{metric_summary}

Instructions:
- Only focus on the metrics provided.
- Do not mention scores or numbers.
- Do not repeat metric names directly.
- Do not add introductions or conclusions.
- Do not mention LinkedIn or any platform.
- Provide exactly 4 to 5 clear, constructive sentences.
- Each sentence must describe one improvement suggestion.

Now provide the feedback:
"""


    return await generate_llm_feedback(prompt)