import { Component, OnInit } from '@angular/core';
import { DeparmentService } from 'src/app/services/deparment.service';
import { MatDialog } from '@angular/material/dialog';
import { DepartmentDialogComponent } from '../department-dialog/department-dialog.component';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  departments:any = [];
  displayedColumns: string[] = ['departmentId', 'departmentName', 'actions'];

  constructor(private departmentService: DeparmentService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe(data => {
      this.departments = data;
      console.log(this.departments);
    });
  }

  openAddDialog():void {
    const dialogRef = this.dialog.open(DepartmentDialogComponent, {
      width: '400px',
      data: { department: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.departmentService.addDepartment(result).subscribe(() => {
          this.loadDepartments(); // Refresh the department list
        });
      }
    });
  }

  editDepartment(department: any): void {
    const dialogRef = this.dialog.open(DepartmentDialogComponent, {
      width: '400px',
      data: { department: department }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.departmentService.updateDepartment(result).subscribe(() => {
          this.loadDepartments(); // Refresh the department list
        });
      }
    });
  }
  

  deleteDepartment(id: number): void {
    if (confirm('Are you sure you want to delete this department?')) {
      console.log(id);
      
      this.departmentService.deleteDepartment(id).subscribe(() => {
        this.loadDepartments(); // Refresh the department list
      });
    }
  }
  



}
