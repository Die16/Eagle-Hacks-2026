def process_transactions(transactions):
    income = 0
    expenses = 0
    flagged_transactions = []
    high_flag_count = 0
    medium_flag_count = 0

    for transaction in transactions:
        amount = transaction.get("amount", 0)
        risk_flag = transaction.get("risk_flag", "").lower()

        if amount > 0:
            income += amount
        elif amount < 0:
            expenses += abs(amount)

        if risk_flag in ["medium", "high"]:
            flagged_transactions.append(transaction)

        if risk_flag == "high":
            high_flag_count += 1
        elif risk_flag == "medium":
            medium_flag_count += 1

    return {
        "monthly_income": income,
        "monthly_expenses": expenses,
        "flagged_transactions": flagged_transactions,
        "high_flag_count": high_flag_count,
        "medium_flag_count": medium_flag_count
    }
