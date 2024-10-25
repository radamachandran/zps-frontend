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

@Component({
  selector: 'app-leave-dialog',
  templateUrl: './leave-dialog.component.html',
  styleUrls: ['./leave-dialog.component.css']
})

// While Adding new leave, if the record exist then that row has to high light with yellow in colour, but this functionality is not working.
export class LeaveDialogComponent implements OnInit {
   highlightRow = new EventEmitter<{ employeeId: number, leaveForTheMonth: string }>();

  leaveForTheMonthControl = new FormControl('');
  isEditMode: boolean = false;
  months: string[] = [];
  leaveForm: FormGroup;
  employees:any;



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
      leaveId: [this.data?.leave?.leaveId || ''],
      employeeId: [{ value: this.data?.leave?.employeeId || '', disabled: false },''],
      //employeeId: [this.data?.leave?.employeeId || ''],
      leaveForTheMonth: [this.data?.leave?.leaveForTheMonth || ''],
      noOfDays: [this.data?.leave?.noOfDays || '']
    });
  }

  ngOnInit(): void {
    const currentMonth = moment().format('MM-YYYY');
    const previousMonth = moment().subtract(1, 'months').format('MM-YYYY');
    this.months = [currentMonth, previousMonth];

    this.loademployees();
  }

  onSubmit() {
    if (this.leaveForm.valid) {
      
      const employeeId = this.leaveForm.value.employeeId;
      const leaveForTheMonth = this.leaveForm.value.leaveForTheMonth;

      // Check if leave record already exists for this employee and month in frontend
      const existingLeave = this.data.leaves.find(
        (leave: any) => leave.employeeId === employeeId && leave.leaveForTheMonth === leaveForTheMonth
      );

      if (existingLeave) {
        // If record exists, prompt the user to edit the existing record
        this.snackBar.open('A leave record for this employee and month already exists. Please edit the existing record.', 'Close', {
          duration: 5000
        });
        this.dialogRef.close(true);
      } else {
        // No record exists, proceed with creation or update
        if (this.data?.leave?.leaveId) {
          // Update
          this.leaveService.updateLeave(this.leaveForm.value).subscribe(() => {
            this.dialogRef.close(true);
          });
        } else {
          // Create
          this.leaveService.addLeave(this.leaveForm.value).subscribe(() => {
            this.dialogRef.close(true);
          });
        }
      }
    }
  }

  loademployees(): void {
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data;
    });
  }
}
