def analyze_customer(data):
    signals = []
    recommendations = []
    risk_level = "Low"

    income = data.get("monthly_income", 0)
    expenses = data.get("monthly_expenses", 0)
    utilization = data.get("credit_utilization_percent", 0)
    savings = data.get("savings_balance", 0)
    spike = data.get("spending_spike_percent", 0)
    high_flag_count = data.get("high_flag_count", 0)
    medium_flag_count = data.get("medium_flag_count", 0)

    if income < expenses:
        signals.append("Expenses exceed income")
        recommendations.append("Reduce spending")

    if utilization > 30:
        signals.append("Credit utilization is high")
        recommendations.append("Pay down debt")

    if savings < max(expenses, 1):
        signals.append("Low savings buffer")
        recommendations.append("Build emergency savings")

    if spike > 20:
        signals.append("Recent spending spike")
        recommendations.append("Review unusual transactions")

    if high_flag_count >= 3:
        signals.append("Multiple high-risk transactions detected")
        recommendations.append("Investigate suspicious transactions immediately")

    elif medium_flag_count >= 3:
        signals.append("Several medium-risk transactions detected")
        recommendations.append("Review flagged spending patterns")

    if len(signals) >= 3:
        risk_level = "High"
    elif len(signals) >= 1:
        risk_level = "Medium"

    return {
        "riskLevel": risk_level,
        "signals": signals,
        "recommendations": recommendations,
        "summary": f"Customer classified as {risk_level} risk."
    }
