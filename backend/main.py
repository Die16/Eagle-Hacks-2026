from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models.schemas import CustomerInput
from services.analysis import analyze_customer
from services.processor import process_transactions
from services.ai_analysis import analyze_with_ai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend running"}

@app.post("/analyze-customer")
def analyze(input: CustomerInput):
    data = input.model_dump()

    flagged_transactions = []

    if input.transactions:
        processed = process_transactions([t.model_dump() for t in input.transactions])
        data["monthly_income"] = processed["monthly_income"]
        data["monthly_expenses"] = processed["monthly_expenses"]
        data["high_flag_count"] = processed["high_flag_count"]
        data["medium_flag_count"] = processed["medium_flag_count"]
        flagged_transactions = processed["flagged_transactions"]

    rule_result = analyze_customer(data)
    ai_result = analyze_with_ai(data)

    return {
        "customer_name": data.get("customer_name", ""),
        "month": data.get("month", ""),
        "monthly_income": data.get("monthly_income", 0),
        "monthly_expenses": data.get("monthly_expenses", 0),
        "transactions": data.get("transactions", []),
        "flagged_transactions": flagged_transactions,
        "riskLevel": rule_result.get("riskLevel", ""),
        "signals": rule_result.get("signals", []),
        "recommendations": rule_result.get("recommendations", []),
        "summary": rule_result.get("summary", ""),
        "ai_summary": ai_result.get("ai_summary", ""),
        "ai_recommendations": ai_result.get("ai_recommendations", [])
    }
