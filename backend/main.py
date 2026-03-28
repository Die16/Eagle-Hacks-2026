from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # okay for hackathon development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend running"}

@app.post("/analyze-customer")
def analyze_customer(customer: dict):
    signals = []
    recommendations = []
    risk_level = "Low"

    income = customer.get("monthly_income", 0)
    expenses = customer.get("monthly_expenses", 0)
    utilization = customer.get("credit_utilization_percent", 0)
    savings = customer.get("savings_balance", 0)
    spike = customer.get("spending_spike_percent", 0)

    if expenses > income:
        signals.append("Expenses exceed income")
        recommendations.append("Reduce discretionary spending")

    if utilization > 50:
        signals.append("Credit utilization is above 50%")
        recommendations.append("Pay down revolving credit balances")

    if savings < max(expenses, 1):
        signals.append("Savings are below one month of expenses")
        recommendations.append("Build emergency savings")

    if spike > 20:
        signals.append("Spending spiked this month")
        recommendations.append("Review recent unusual transactions")

    if len(signals) >= 3:
        risk_level = "High"
    elif len(signals) >= 1:
        risk_level = "Medium"

    return {
        "riskLevel": risk_level,
        "signals": signals[:3],
        "recommendations": recommendations[:3],
        "summary": "Customer analysis generated successfully."
    }
