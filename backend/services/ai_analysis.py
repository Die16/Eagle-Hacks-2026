import os
import json
import requests
from pathlib import Path
from dotenv import load_dotenv

ROOT_ENV = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=ROOT_ENV)

WXO_URL = os.getenv("WXO_URL")
WXO_API_KEY = os.getenv("WXO_API_KEY")
WXO_AGENT_ID = os.getenv("WXO_AGENT_ID")


def get_iam_token() -> str:
    if not WXO_API_KEY:
        raise ValueError("Missing WXO_API_KEY in .env")

    response = requests.post(
        "https://iam.cloud.ibm.com/identity/token",
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        },
        data={
            "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
            "apikey": WXO_API_KEY,
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["access_token"]


def analyze_with_ai(data: dict) -> dict:
    if not WXO_URL or not WXO_AGENT_ID:
        raise ValueError("Missing WXO_URL or WXO_AGENT_ID in .env")

    token = get_iam_token()

    prompt = "Say hello".strip()

    url = f"{WXO_URL}/api/v1/orchestrate/{WXO_AGENT_ID}/chat/completions"

    payload = {
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "stream": False
    }

    response = requests.post(
        url,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        json=payload,
        timeout=60,
    )

    # Helpful debug info if it fails
    if not response.ok:
        print("STATUS:", response.status_code)
        print("BODY:", response.text)

    response.raise_for_status()
    raw = response.json()

    text = None
    try:
        text = raw["choices"][0]["message"]["content"]
    except Exception:
        return {
            "ai_summary": "Connected to AI, but could not parse the response format yet.",
            "ai_recommendations": [],
            "raw_ai_response": raw
        }

    try:
        parsed = json.loads(text)
        return {
            "ai_summary": parsed.get("ai_summary", ""),
            "ai_recommendations": parsed.get("ai_recommendations", [])
        }
    except Exception:
        return {
            "ai_summary": text,
            "ai_recommendations": [],
            "raw_ai_response": raw
        }
