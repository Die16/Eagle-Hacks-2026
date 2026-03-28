import os
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / ".env")

API_KEY = os.getenv("CONTENTIQ_API_KEY")
AGENT_ID = os.getenv("CONTENTIQ_AGENT_ID")
BASE_URL = os.getenv("CONTENTIQ_BASE_URL")


def analyze_with_ai(data):
    url = f"{BASE_URL}/api/headless/chat"

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    message = f"""
You are a financial risk analysis assistant.

Use these rules:
- High risk if 3 or more warning signs exist
- Medium risk if 1 or 2 warning signs exist
- Low risk if no warning signs exist
- Warning signs include:
  1. Expenses exceed income
  2. Credit utilization is above 30%
  3. Spending spike is above 20%
  4. Savings are lower than one month of expenses

Return a concise JSON response with this exact shape:
{{
  "ai_summary": "short explanation",
  "ai_recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}}

Customer data:
{data}
""".strip()

    payload = {
        "agent_id": AGENT_ID,
        "message": message,
        "thread_id": "test-thread-1"
    }

    response = requests.post(url, headers=headers, json=payload)

    print("STATUS:", response.status_code)
    print("BODY:", response.text)

    response.raise_for_status()

    raw = response.json()

    return {
        "ai_summary": raw.get("response", ""),
        "ai_recommendations": [],
        "raw_ai_response": raw
    }
