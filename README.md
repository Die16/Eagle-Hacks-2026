# Eagle-Hacks-2026 - SmartBalance

**SmartBalance** is an AI-powered financial intelligence dashboard that turns monthly transaction data into clear, actionable risk insights.

Users can upload a JSON file containing a customer's monthly transactions, and the system will:

- calculate income and expenses
- classify overall financial risk
- highlight flagged transactions
- generate AI-powered explanations and recommendations
- display everything in a polished dashboard UI

---

## Features

### Frontend
- Drag-and-drop JSON upload
- Clean fintech-style dashboard
- Summary cards for:
  - customer
  - month
  - income
  - expenses
  - risk level
- AI insight panel
- Flagged transactions section
- Full transaction history table
- Color-coded transaction risk highlighting

### Backend
- FastAPI REST API
- Transaction processing
- Rule-based risk scoring
- AI-generated financial insight using ContentIQ
- JSON-based data pipeline from upload to dashboard

---

## Tech Stack

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- Axios
- React Dropzone

### Backend
- Python
- FastAPI
- Uvicorn
- Pydantic
- Requests
- python-dotenv

### AI
- ContentIQ Headless Chat API

---

## How It Works

1. The user uploads a monthly transaction JSON file in the frontend.
2. The frontend sends the JSON to the FastAPI backend.
3. The backend:
   - parses the transaction data
   - calculates financial totals
   - extracts flagged transactions
   - computes overall risk level
   - sends the processed data to the AI service
4. The AI returns:
   - a tailored financial summary
   - recommended actions
5. The frontend renders:
   - summary metrics
   - AI insights
   - flagged transactions
   - full transaction history

---

## Project Structure

```text
Eagle-Hacks-2026/
├── backend/
│   ├── main.py
│   ├── models/
│   │   └── schemas.py
│   ├── services/
│   │   ├── ai_analysis.py
│   │   ├── analysis.py
│   │   └── processor.py
│   └── ...
├── frontend/
│   └── banking-dashboard/
│       ├── src/
│       │   ├── App.tsx
│       │   ├── index.css
│       │   └── ...
│       └── ...
└── README.md
