import { Leave } from 'src/app/models/employee';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LeaveService } from 'src/app/services/leave.service';
import { LeaveDialogComponent } from '../leave-dialog/leave-dialog.component';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css']
})

export class LeaveComponent implements OnInit {
  months: string[] = [];
  leaveForTheMonthControl = new FormControl('');
  displayedColumns: string[] = ['leaveId', 'employeeId','employeeName', 'leaveForTheMonth', 'noOfDays', 'actions'];
  leaves:Leave[] = [];
  flag = true;
  highlightedRow: Leave|null=null;
  employees:any[]=[];


  constructor(private leaveService: LeaveService,private employeeService: EmployeeService, public dialog: MatDialog) {}

  ngOnInit(): void {
    const currentMonth = moment().format('MM-YYYY');
    const previousMonth = moment().subtract(1, 'months').format('MM-YYYY');
    
    this.months = [currentMonth, previousMonth];
    this.loadLeaves();
    this.loademployees();
  }

  loadLeaves() {
    this.leaveService.getLeaves().subscribe({
      next: (data: any) => {
        this.leaves = data.map(leave => {
          const employee = this.employees.find(emp => emp.employeeId === leave.employeeId);
          return {
            ...leave,
            employeeName: employee ? employee.firstName + ' ' + employee.lastName : 'Unknown'
          };
        });
      },
      error: (err) => {
        console.error('Error fetching leaves:', err);
        alert('Failed to load leaves. Please try again later.');
      }
    });
  }
  
  loademployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.loadLeaves();  // Ensure leaves load after employees
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
        alert('Failed to load employee data.');
      }
    });
  }
  
  deleteLeave(id: number) {
    const confirmation = confirm('Are you sure you want to delete this record?');
    if (!confirmation) {
      return; // Do nothing if the user cancels
    }
  
    this.leaveService.deleteLeave(id).subscribe({
      next: () => {
        this.loadLeaves();
        alert('Leave record deleted successfully.');
      },
      error: (err) => {
        console.error('Error deleting leave:', err);
        alert('Failed to delete leave. Please try again.');
      }
    });
  }
  

  // deleteLeave(id: number) {

  //   // this.leaveService.deleteLeave(id).subscribe({
  //   //   next: () => {
  //   //     this.loadLeaves();
  //   //   },
  //   //   error: (err) => {
  //   //     console.error('Error deleting leave:', err);
  //   //     alert('Failed to delete leave. Please try again.');
  //   //   }
  //   // });
  // }
  // leave.component.ts
openLeaveForm() {
  const dialogRef = this.dialog.open(LeaveDialogComponent, {
    width: '400px',
    data: {
      leaves: this.leaves  // Pass existing leaves to the dialog
    }
  });
  
  dialogRef.componentInstance.highlightRow.subscribe((row: { employeeId: number, leaveForTheMonth: string }) => {
    this.highlightRow(row);
  });
  
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loadLeaves();
    }
  });
}

editLeave(leave: any) {
  const dialogRef = this.dialog.open(LeaveDialogComponent, {
    width: '400px',
    data: {
      leave,
      leaves: this.leaves  // Pass existing leaves to the dialog
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loadLeaves();
    }
  });
}

highlightRow(row: { employeeId: number, leaveForTheMonth: string }) {
  
  this.highlightedRow = this.leaves.find(leave => 
    leave.employeeId === row.employeeId && leave.leaveForTheMonth === row.leaveForTheMonth
  ) || null;
}

// Update this method to add a class to the highlighted row
getRowClass(row: Leave): string {
  return this.highlightedRow && this.highlightedRow.employeeId === row.employeeId && this.highlightedRow.leaveForTheMonth === row.leaveForTheMonth 
    ? 'highlighted' 
    : '';
}

}
