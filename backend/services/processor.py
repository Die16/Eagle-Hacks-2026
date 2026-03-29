def process_transactions(transactions):
    income = 0
    expenses = 0
    flagged_transactions = []
    high_flag_count = 0
    medium_flag_count = 0

    category_totals = {}
    merchant_counts = {}
    suspicious_merchants = set()
    duplicate_candidates = {}

    largest_expense = None

    for transaction in transactions:
        amount = transaction.get("amount", 0)
        category = transaction.get("category", "unknown")
        description = transaction.get("description", "unknown")
        risk_flag = transaction.get("risk_flag", "").lower()

        merchant_counts[description] = merchant_counts.get(description, 0) + 1

        if amount > 0:
            income += amount
        elif amount < 0:
            expense_value = abs(amount)
            expenses += expense_value

            category_totals[category] = category_totals.get(category, 0) + expense_value

            if largest_expense is None or expense_value > largest_expense["amount"]:
                largest_expense = {
                    "description": description,
                    "category": category,
                    "amount": expense_value,
                    "reason": transaction.get("reason", "")
                }

        if risk_flag in ["medium", "high"]:
            flagged_transactions.append(transaction)

        if risk_flag == "high":
            high_flag_count += 1
            suspicious_merchants.add(description)

        elif risk_flag == "medium":
            medium_flag_count += 1

        # basic duplicate detection
        key = (description, amount)
        duplicate_candidates[key] = duplicate_candidates.get(key, 0) + 1

    duplicate_transactions = [
        {"description": k[0], "amount": k[1], "count": v}
        for k, v in duplicate_candidates.items()
        if v > 1
    ]

    sorted_categories = sorted(
        category_totals.items(),
        key=lambda x: x[1],
        reverse=True
    )

    top_categories = [
        {"category": cat, "total": total}
        for cat, total in sorted_categories[:5]
    ]

    repeated_suspicious_merchants = [
        merchant for merchant in suspicious_merchants
        if merchant_counts.get(merchant, 0) > 1
    ]

    return {
        "monthly_income": income,
        "monthly_expenses": expenses,
        "flagged_transactions": flagged_transactions,
        "high_flag_count": high_flag_count,
        "medium_flag_count": medium_flag_count,
        "largest_expense": largest_expense,
        "top_categories": top_categories,
        "repeated_suspicious_merchants": repeated_suspicious_merchants,
        "duplicate_transactions": duplicate_transactions
    }
