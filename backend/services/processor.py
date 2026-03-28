def process_transactions(transactions):
    income = 0
    expenses = 0

    for transaction in transactions:
        amount = transaction.get("amount", 0)

        if amount < 0:
            expenses += abs(amount)
        elif amount > 0:
            income += amount

    return{
            "monthly_income" : income,
            "monthly_expenses" :expenses
    }
