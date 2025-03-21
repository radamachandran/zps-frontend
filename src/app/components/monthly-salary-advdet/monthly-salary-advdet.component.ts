import { MatTableModule } from '@angular/material/table';
import { getLocaleMonthNames } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-monthly-salary-advdet',
  templateUrl: './monthly-salary-advdet.component.html',
  styleUrls: ['./monthly-salary-advdet.component.css']
})
export class MonthlySalaryAdvdetComponent {

  editForm: FormGroup|any;
  salaryDeductions: any[] = [];
  selectedLoanId: string="";
  isEditing = false;
  mon_year="";
  displayedColumns: string[] = ['loan_id', 'amount_ded','mon_year','actions'];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    // Initialize the form
    this.editForm = this.fb.group({
      transId:['this.salaryDeductions?.trans_id'],
      loan_id: [{ value: 'this.salaryDeductions?.loan_id', disabled: true }, Validators.required],
      amountDed: ['this.salaryDeductions?.amount_ded', [Validators.required, Validators.min(0)]],
      monthYear: ['this.salaryDeductions?.month_year', Validators.required]
    });

     this.mon_year=this.getCurrentMonthYear();
    
    // Load initial data
    //this.processSalaryDeductions();
  }
  

  getCurrentMonthYear(): string {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear().toString();
    const lastDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const month1 = (lastDayOfPreviousMonth.getMonth() + 1).toString().padStart(2, '0');
    const year1 = lastDayOfPreviousMonth.getFullYear().toString();
    return `${month1}-${year1}`;
  }


  processSalaryDeductions() {
    this.http.post<any[]>('http://localhost:8080/api/monthly/monsalaryAdvded', { mon_year: this.mon_year }).subscribe((data: any[]) => {
      this.salaryDeductions = data;
      console.log("Base data  ",this.salaryDeductions);
    });
    
    
  }
  editRecord(record: any): void {
    console.log("TransId : ",record.transId);
    console.log("Amount ded : ",record.amountDed);
    
    // Populate the form with the selected record data
    this.editForm.patchValue({
      transId: record.transId,
      loan_id: record.loan_id,
      amountDed: record.amountDed,
      monthYear: record.monthYear
    });
    this.selectedLoanId = record.transId;
    this.isEditing = true; // Show the form
  }

  saveEdits(editForm:any): void {
    const updatedData = this.editForm.getRawValue();
    
    this.http.put(`http://localhost:8080/api/monthly/update/${this.selectedLoanId}`, updatedData).subscribe(response => {
      // Update the record in the table or refresh the data source
      const index = this.salaryDeductions.findIndex(e => e.loan_id === this.selectedLoanId);
      if (index !== -1) {
        this.salaryDeductions[index] = updatedData;
      }
      this.isEditing = false; // Hide the form
    });

    this.processSalaryDeductions();
  }

  cancelEdit():void{
  }
}
