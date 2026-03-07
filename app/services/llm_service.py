import os
import httpx

OLLAMA_URL = os.getenv(
    "OLLAMA_URL",
    "http://ollama:11434/api/generate"
)

MODEL_NAME = "mistral"


async def generate_llm_feedback(prompt: str) -> str:
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.3,
            "top_p": 0.8,
            "repeat_penalty": 1.1
        }
    }

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(OLLAMA_URL, json=payload)
            response.raise_for_status()
            data = response.json()
            return data.get("response", "").strip()

    except Exception as e:
        print("[OLLAMA ERROR]", repr(e))
        return "AI suggestion service is currently unavailable."