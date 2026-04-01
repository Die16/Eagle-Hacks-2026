import { Component, OnInit }        from '@angular/core';
import { Router }                   from '@angular/router';
import { FinancialIntakeService }   from '../../services/financial-intake';
import testData from "../../assets/test-data.json";

@Component({
  selector:    'app-client-intake-form',
  standalone: false,
  templateUrl: './client-intake-form.html',
  styleUrls:   ['./client-intake-form.css']
})

export class ClientIntakeForm implements OnInit {

  uploadedFile: File | null = null;
  parsedData:   any         = null;
  isDragging    = false;
  isLoading     = false;
  errorMsg      = '';

  sampleData = testData;
  firstName = "";

  constructor(
    private service: FinancialIntakeService,
    private router:  Router
  ) {}

  ngOnInit(): void {
    console.log("Sample data--->", this.sampleData);
    this.firstName = this.sampleData.customer_name.split(" ")[0];
    console.log("username-->", this.firstName);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.loadFile(file);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    if (file) this.loadFile(file);
  }

  loadFile(file: File): void {
    this.errorMsg = '';
    if (!file.name.endsWith('.json')) {
      this.errorMsg = 'Please upload a valid JSON file.';
      return;
    }

    const reader  = new FileReader();
    reader.onload = (e) => {
      try {
        this.parsedData   = JSON.parse(e.target?.result as string);
        this.uploadedFile = file;
      } catch {
        this.errorMsg = 'Could not parse JSON file. Please check the format.';
      }
    };
    reader.readAsText(file);
  }

  removeFile(): void {
    this.uploadedFile = null;
    this.parsedData   = null;
    this.errorMsg     = '';
  }

  getFileSizeKb(): string {
    return this.uploadedFile
      ? (this.uploadedFile.size / 1024).toFixed(1)
      : '0';
  }

  onSubmit(): void {
    if (!this.parsedData) return;

    this.isLoading = true;
    this.errorMsg  = '';

    this.service.submitIntakeForm(this.parsedData).subscribe({
      next: (result: any) => {
        this.isLoading = false;
        sessionStorage.setItem('analysisResult',   JSON.stringify(result));
        sessionStorage.setItem('transactionData',  JSON.stringify(this.parsedData));
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMsg  = 'Analysis failed. Please try again.';
        console.error(err);
      }
    });
  }

}