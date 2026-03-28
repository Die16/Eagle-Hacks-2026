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

    if input.transactions:
        processed = process_transactions([t.model_dump() for t in input.transactions])
        data.update(processed)

    rule_result = analyze_customer(data)
    ai_result = analyze_with_ai(data)

    rule_result["ai_summary"] = ai_result["ai_summary"]
    rule_result["ai_recommendations"] = ai_result["ai_recommendations"]

    return rule_result
