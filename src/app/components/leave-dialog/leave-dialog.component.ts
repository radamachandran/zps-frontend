  import { EventEmitter } from '@angular/core';
  import { Component, Inject, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup } from '@angular/forms';
  import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
  import { LeaveService } from 'src/app/services/leave.service';
  import { EmployeeService } from 'src/app/services/employee.service';
  import { MatDatepicker } from '@angular/material/datepicker';
  import { FormControl } from '@angular/forms';
  import * as moment from 'moment';
  import { MatSnackBar } from '@angular/material/snack-bar';
  import { catchError } from 'rxjs/operators';
  import { throwError } from 'rxjs';
  import { Observable } from 'rxjs';
  import { map, startWith } from 'rxjs/operators';


  @Component({
    selector: 'app-leave-dialog',
    templateUrl: './leave-dialog.component.html',
    styleUrls: ['./leave-dialog.component.css']
  })

  // While Adding new leave, if the record exist then that row has to high light with yellow in colour, but this functionality is not working.
  export class LeaveDialogComponent implements OnInit {

  // Filter Control
  employeeFilterCtrl = new FormControl('');

  // Filtered Employees List
  filteredEmployees: Observable<any[]>;


    highlightRow = new EventEmitter<{ employeeId: number, leaveForTheMonth: string }>();

    leaveForTheMonthControl = new FormControl('');
    isEditMode: boolean = false;
    months: string[] = [];
    leaveForm: FormGroup;
    employees:any[]=[];
    lfm : string =''
    previousMonth='';
    // leaveForm: FormGroup;
    // employees: any;
    // months: string[] = [];

    constructor(
      private fb: FormBuilder,
      private leaveService: LeaveService,
      private employeeService: EmployeeService,
      public dialogRef: MatDialogRef<LeaveDialogComponent>,
      private snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data: any  // Inject data containing leaves
    ) {
      this.leaveForm = this.fb.group({
        leaveId: [{value: this.data?.leave?.leaveId || ''}],
        employeeId: [{ value: this.data?.leave?.employeeId || ''},''],
        leaveForTheMonth: [this.data?.leave?.leaveForTheMonth || ''],
        noOfDays: [this.data?.leave?.noOfDays || '']
      });
      // console.log("Data from parent : "+this.leaveForm.value.employeeId);
    }

    ngOnInit(): void {
      const currentMonth = moment().format('MM-YYYY');
      this.previousMonth = moment().subtract(1, 'months').format('MM-YYYY');
      this.months = [currentMonth, this.previousMonth];
      this.leaveForm.controls['leaveForTheMonth'].setValue(this.months[1]);
      this.leaveForm.controls['leaveForTheMonth'].setValue(this.months[1]);
      this.leaveForm.controls['leaveForTheMonth'].disable();
      this.loademployees();
      
      // Filter employees based on search input
      this.filteredEmployees = this.employeeFilterCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this.filterEmployees(value || ''))
      );
      // console.log(this.filterEmployees);
    }

    // Filter function
    private filterEmployees(value: string): any[] {
      const filterValue = value.toLowerCase();
      
      return this.employees.filter(emp => 
        // emp.empNo.includes(filterValue) ||
        emp.firstName.toLowerCase().includes(filterValue) ||
        emp.lastName.toLowerCase().includes(filterValue)
      );
    }

    onSubmit() {
      if (this.leaveForm.valid) {
        const employeeId = this.leaveForm.value.employeeId;
        this.leaveForm.value.leaveForTheMonth = this.previousMonth;
    
        const existingLeave = this.data.leaves.find(
          (leave: any) => leave.employeeId === employeeId && leave.leaveForTheMonth === this.previousMonth
        );
    
        if (existingLeave) {
          this.snackBar.open('A leave record for this employee and month already exists. Please edit the existing record.', 'Close', {
            duration: 5000
          });
          this.dialogRef.close(true);
        } else {

          if (this.data?.leave?.leaveId) {
            // Update Leave
            this.leaveForm.value.leaveId=this.data?.leave?.leaveId;
            this.leaveForm.value.leaveForTheMonth = this.previousMonth;
            this.leaveForm.value.employeeId =this.leaveForm.value.employeeId;
            this.leaveForm.value.noOfDays=this.leaveForm.value.noOfDays;


            this.leaveService.updateLeave(this.leaveForm.value).pipe(
              catchError(error => {
                console.error('Error updating leave:', error);
                this.snackBar.open('Failed to update leave. Try again.', 'Close',  { duration: 5000 });
                return throwError(error);
              })
            ).subscribe(() => {
              this.dialogRef.close(true);
            });
          } else {
            // Create Leave
            this.leaveService.addLeave(this.leaveForm.value).pipe(
              catchError(error => {
                console.error('Error adding leave:', error);
                this.snackBar.open('Failed to add leave. Try again.', 'Close', { duration: 5000 });
                return throwError(error);
              })
            ).subscribe(() => {
              this.dialogRef.close(true);
            });
          }
        }
      }
    }

    loademployees(): void {
      this.employeeService.getEmployees().pipe(
        catchError(error => {
          console.error('Error loading employees:', error);
          this.snackBar.open('Error fetching employee list. Please try again.', 'Close', { duration: 5000 });
          return throwError(error);
        })
      ).subscribe(data => {
        this.employees = data;
      });
    
      this.filteredEmployees = this.employeeFilterCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this.filterEmployees(value || ''))
      );
    }

    // Select Employee and Set Form Value
    selectEmployee(event: any) {
      const selectedEmployee = this.employees.find(emp => emp.employeeId === event.option.value);
      // console.log("selected empl : " + this.selectEmployee);
      if (selectedEmployee) {
        this.leaveForm.controls['employeeId'].setValue(selectedEmployee.employeeId);
      }
    }

  }
