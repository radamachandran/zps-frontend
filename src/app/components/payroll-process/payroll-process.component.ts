import { Component } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AuthserviceService } from 'src/app/auth/services/authservice.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// Removed the commented-out Moment imports
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as moment from 'moment'; // You can remove this import if you no longer use moment elsewhere
import { FormControl, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import   
 { catchError, tap } from 'rxjs/operators';
import { throwError,of } from 'rxjs';

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
  isLoading = false; // State for the spinner
  dateFlag=true;
// date = new FormControl(moment()); // You can remove moment() if using default date
date = new FormControl<Date | null>(new Date());
 // date:Date=new Date();
  payrollResults: any[] = [];
  displayedColumns: string[] = ['employee_id', 'employee_name', 'originalBasic', 'adjustedBasic','monthlyBasic' ,'house_rent_allowance', 'special_allowance', 'other_allowance', 'pf','pfEmployerContribution367','pfEmployerContribution833' ,'esiEmployeeContribution75','esiEmployeeContribution325', 'net_salary', 'Leave', 'Sal_Adv'];
  selectedDate: Date=new Date();

  constructor(private http: HttpClient, 
    private authService: AuthserviceService, private datePipe: DatePipe) {
      this.date.disable();
    }

  // Remove setMonthAndYear function as it was specific to Moment.js

  setMonthAndYear(normalizedMonthAndYear: Date, datepicker: MatDatepicker<Date>) {
    const ctrlValue = this.date.value ? new Date(this.date.value) : new Date();
    ctrlValue.setMonth(normalizedMonthAndYear.getMonth());
    ctrlValue.setFullYear(normalizedMonthAndYear.getFullYear());   
    this.date.setValue(ctrlValue);
    datepicker.close();
  }


  ngOnInit() {
    this.setLastDayOfPreviousMonth();
  }

  // Method to set the last day of the previous month
  private setLastDayOfPreviousMonth() {
    const today = new Date();
    const lastDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Get last day of the previous month
    this.date.setValue(lastDayOfPreviousMonth); // Set the value to the FormControl
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
          alert("Error processing payroll: " + error.error.message);
        }
      );
    } else {
      console.error('No month selected');
    }

    
  }

  // Format date to MM-YYYY or other format
  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
   // return `${day}-${month}-${year}`;
    return `${month}-${year}`;
  }
   downloadPayrollData() {
    if (this.date.value) {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = now.toLocaleString('default', { month: 'short' }).toUpperCase();
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
    
      // Construct the filename
      const filename1 = `${day}${month}${year}_${hours}${minutes}${seconds}`;



      const formattedDate = this.formatDate(this.date.value);
      
      this.http.get('http://localhost:8080/api/downloadPayroll', {
        params: { monthYear: formattedDate },
        responseType: 'blob',
        observe: 'response'
      }).pipe(
        tap((response: HttpResponse<Blob>) => {
          const blob = new Blob([response.body!], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const filename = `payroll_${filename1}.xlsx`;
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
  download() {
    if (this.date.value) {
      const formattedDate = this.formatDate(this.date.value);
    this.isLoading = true; // Show spinner
    this.http.get('http://localhost:8080/payslip/download/'+ formattedDate)
      .pipe(
        catchError((error) => {
          this.isLoading = false; // Hide spinner on error
          alert('An error occurred while downloading the payroll: ' + error.message);
          return of(null); // Return a safe fallback
        })
      )
      .subscribe(data => {
        this.isLoading = false; // Hide spinner after completion
        if (data) {
          alert('Download successful: ' + data);
        }
      });
  }


  // download(){
  //   //alert("Clicked download link");
  //   this.http.get('http://localhost:8080/api/downloadPayroll/')
  //   .pipe(
  //     catchError((error) => {
  //       alert('An error occurred while downloading the payroll: ' + error.message);
  //       return of(null); // Return a safe fallback
  //     })
  //   )
  //   .subscribe(data => {
  //     if (data) {
  //       alert('Download successful: ' + data);
  //     }
  //     });


  //   }
}
}