from pydantic import BaseModel
from typing import List, Optional


class Transaction(BaseModel):
    date: Optional[str] = ""
    description: Optional[str] = ""
    category: str
    amount: float
    type: Optional[str] = ""
    risk_flag: Optional[str] = ""
    reason: Optional[str] = ""


class CustomerInput(BaseModel):
    customer_name: Optional[str] = ""
    month: Optional[str] = ""
    monthly_income: Optional[float] = 0
    monthly_expenses: Optional[float] = 0
    savings_balance: Optional[float] = 0
    credit_utilization_percent: Optional[float] = 0
    monthly_debt_payments: Optional[float] = 0
    spending_spike_percent: Optional[float] = 0
    transactions: Optional[List[Transaction]] = []
