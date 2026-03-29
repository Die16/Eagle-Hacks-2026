import os
import json
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
You are a financial risk analysis assistant for a banking dashboard.

Analyze the customer's transactions and provide a clear, evidence-based explanation of their financial behavior.

IMPORTANT:
- You MUST reference specific merchants, dates, and transaction patterns when relevant
- Mention suspicious merchants, duplicate charges, repeated transfers, unusual withdrawals, and recurring behavior
- Distinguish between normal recurring activity and suspicious activity
- Do NOT give vague generic advice
- Do NOT mention missing data
- Return only valid JSON

Focus on:
- suspicious transactions such as unknown vendors, transfers, or withdrawals
- repeated suspicious merchants
- duplicate charges
- unusual transaction timing or clustering
- recurring spending patterns like coffee, groceries, gas, and dining
- recurring income patterns like salary or freelance payments
- overall financial stability including income vs expenses vs savings
- the biggest reasons this customer looks risky or stable

Good examples of reasoning:
- "Unknown Vendor appears multiple times (March 6, 21, 30), suggesting repeated suspicious activity"
- "Two ATM withdrawals occurred within minutes on March 8, which is unusual behavior"
- "Chipotle transactions on March 11 appear duplicated"
- "Recurring Starbucks and grocery purchases appear normal and consistent"

Return ONLY valid JSON in this exact format:
{{
  "ai_summary": "2-4 sentence explanation using specific examples from the transactions",
  "ai_recommendations": [
    "specific action tied to observed behavior",
    "specific action tied to observed behavior",
    "specific action tied to observed behavior"
  ]
}}

Customer data:
{json.dumps(data, indent=2)}
""".strip()

    payload = {
        "agent_id": AGENT_ID,
        "message": message,
        "thread_id": "test-thread-1"
    }

    response = requests.post(url, headers=headers, json=payload, timeout=60)

    print("STATUS:", response.status_code)
    print("BODY:", response.text)

    response.raise_for_status()

    raw = response.json()
    response_text = raw.get("response", "")

    try:
        parsed = json.loads(response_text)
        return {
            "ai_summary": parsed.get("ai_summary", ""),
            "ai_recommendations": parsed.get("ai_recommendations", []),
            "raw_ai_response": raw
        }
    except json.JSONDecodeError:
        return {
            "ai_summary": response_text,
            "ai_recommendations": [],
            "raw_ai_response": raw
        }