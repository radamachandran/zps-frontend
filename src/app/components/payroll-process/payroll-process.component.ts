import { Component } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AuthserviceService } from 'src/app/auth/services/authservice.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// Removed the commented-out Moment imports
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as moment from 'moment'; // You can remove this import if you no longer use moment elsewhere
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import   
 { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',   

  },
};

@Component({
  selector: 'app-payroll-process',   

  templateUrl: './payroll-process.component.html',
  styleUrls: ['./payroll-process.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    // Remove any Moment.js related providers
  ],
})
export class PayrollProcessComponent {
// date = new FormControl(moment()); // You can remove moment() if using default date
date = new FormControl<Date | null>(new Date());
 // date:Date=new Date();
  payrollResults: any[] = [];
  displayedColumns: string[] = ['employee_id', 'employee_name', 'originalBasic', 'adjustedBasic','monthlyBasic' ,'house_rent_allowance', 'special_allowance', 'other_allowance', 'pf','pfEmployerContribution367','pfEmployerContribution833' ,'esiEmployeeContribution75','esiEmployeeContribution325', 'net_salary', 'Leave', 'Sal_Adv'];
  selectedDate: Date=new Date();

  constructor(private http: HttpClient, private authService: AuthserviceService, private datePipe: DatePipe) {}

  // Remove setMonthAndYear function as it was specific to Moment.js

  setMonthAndYear(normalizedMonthAndYear: Date, datepicker: MatDatepicker<Date>) {
    const ctrlValue = this.date.value ? new Date(this.date.value) : new Date();
    ctrlValue.setMonth(normalizedMonthAndYear.getMonth());
    ctrlValue.setFullYear(normalizedMonthAndYear.getFullYear());   
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  processPayroll() {

    if (this.date.value) {
      const formattedDate = this.formatDate(this.date.value);
      console.log("Month to be processed: " + formattedDate);
  
      this.http.post<any[]>('http://localhost:8080/api/processPayroll', { monthYear: formattedDate }).subscribe(
        (response) => {
          this.payrollResults = response;
          console.log(this.payrollResults);
          this.downloadPayrollData();
        },
        (error) => {
          console.error('Error processing payroll:', error);
          alert("Error processing payroll: " + error);
        }
      );
    } else {
      console.error('No month selected');
    }

    
  }
  
  private formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${year}`;
  }

   downloadPayrollData() {
    if (this.date.value) {
      const formattedDate = this.formatDate(this.date.value);
      
      this.http.get('http://localhost:8080/api/downloadPayroll', {
        params: { monthYear: formattedDate },
        responseType: 'blob',
        observe: 'response'
      }).pipe(
        tap((response: HttpResponse<Blob>) => {
          const blob = new Blob([response.body!], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const filename = `payroll_${formattedDate}.xlsx`;
          saveAs(blob, filename);
        }),
        catchError(error => {
          console.error('Error downloading payroll data:', error);
          return throwError(() => new Error('Failed to download payroll data'));
        })
      ).subscribe();
    } else {
      console.error('No month selected');
    }
  }
}