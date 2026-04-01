import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IntakeFormData {
  monthly_income:          number;
  monthly_expenses:        number;
  savings_balance:         number;
  monthly_debt_payments:   number;
}

export interface AnalysisResult {
  insights:         string[];
  risk_signals:     string[];
  recommendations:  string[];
}

@Injectable({
  providedIn: 'root',
})
export class FinancialIntakeService {

  private apiUrl = 'http://localhost:5173';  //FastAPI base URL

  constructor(private http: HttpClient) {}

  submitIntakeForm(formData: IntakeFormData): Observable<AnalysisResult> {
    return this.http.post<AnalysisResult>(`${this.apiUrl}/analyze`, formData);
  }

}

