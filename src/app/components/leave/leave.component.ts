import { Leave } from 'src/app/models/employee';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LeaveService } from 'src/app/services/leave.service';
import { LeaveDialogComponent } from '../leave-dialog/leave-dialog.component';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css']
})
export class LeaveComponent implements OnInit {
  months: string[] = [];
  leaveForTheMonthControl = new FormControl('');
  displayedColumns: string[] = ['leaveId', 'employeeId', 'leaveForTheMonth', 'noOfDays', 'actions'];
  leaves:Leave[] = [];
  flag = true;
  highlightedRow: Leave|null=null;



  constructor(private leaveService: LeaveService, public dialog: MatDialog) {}

  ngOnInit(): void {
    const currentMonth = moment().format('MM-YYYY');
    const previousMonth = moment().subtract(1, 'months').format('MM-YYYY');
    
    this.months = [currentMonth, previousMonth];
    this.loadLeaves();
  }

  loadLeaves() {
    this.leaveService.getLeaves().subscribe((data: any) => {
      this.leaves = data;
    });
  }

  
  deleteLeave(id: number) {
    this.leaveService.deleteLeave(id).subscribe(() => {
      this.loadLeaves();
    });
  }

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
  console.log("High1 : " ,row.employeeId);
  console.log("High2 : " ,row.leaveForTheMonth);
  
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
