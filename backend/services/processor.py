def process_transactions(transactions):
    income = 0
    expenses = 0
    flagged_transactions = []

    for transaction in transactions:
        amount = transaction.get("amount", 0)
        risk_flag = transaction.get("risk_flag", "").lower()

        # Calculate totals
        if amount > 0:
            income += amount
        elif amount < 0:
            expenses += abs(amount)

        # Preserve FULL transaction object
        if risk_flag in ["medium", "high"]:
            flagged_transactions.append(transaction)

    return {
        "monthly_income": income,
        "monthly_expenses": expenses,
        "flagged_transactions": flagged_transactions
    }
