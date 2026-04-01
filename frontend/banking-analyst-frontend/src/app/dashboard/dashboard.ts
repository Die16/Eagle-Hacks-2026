import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

@Component({
  selector:    'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrls:   ['./dashboard.css']
})
export class Dashboard implements OnInit {

  analysisResult:  any = null;
  transactionData: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const result      = sessionStorage.getItem('analysisResult');
    const transaction = sessionStorage.getItem('transactionData');

    if (result)      this.analysisResult  = JSON.parse(result);
    if (transaction) this.transactionData = JSON.parse(transaction);

    // Fallback if navigated directly without data
    if (!this.analysisResult || !this.transactionData) {
      this.router.navigate(['/']);
    }
  }

  formatCurrency(value: number | undefined): string {
    if (value === undefined || value === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style:    'currency',
      currency: 'USD'
    }).format(Math.abs(value));
  }

  formatCreditLabel(value: string | undefined): string {
    if (!value) return 'N/A';
    return value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  getNetCashFlowClass(): string {
    const val = this.analysisResult?.financial_summary?.net_cash_flow;
    if (val === undefined || val === null) return '';
    if (val > 500)  return 'positive';
    if (val > 0)    return 'warning';
    return 'negative';
  }

  getSavingsClass(): string {
    const val = this.analysisResult?.financial_health?.savings_balance_estimate;
    if (!val) return '';
    if (val === 'low')    return 'low';
    if (val === 'medium') return 'moderate';
    return 'good';
  }

  getCreditClass(): string {
    const val = this.analysisResult?.financial_health?.credit_utilization_estimate;
    if (!val) return '';
    if (val.includes('high'))   return 'low';
    if (val.includes('moderate')) return 'moderate';
    return 'good';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

}