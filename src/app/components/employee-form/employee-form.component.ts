import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/app/models/employee';
import { EmployeeEditDialogComponent } from '../employee-edit-dialog/employee-edit-dialog.component';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent  implements OnInit{
  ELEMENT_DATA:Employee[]|any;
  displayedColumns: string[] = ['empno', 'firstName', 'lastName', 'designation', 'department', 'actions'];
  dataSource = new MatTableDataSource<Employee>();

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe((employees: Employee[]) => {
      this.dataSource.data = employees;
    });
  }

  addEmployee(): void {
    const dialogRef = this.dialog.open(EmployeeEditDialogComponent, {
      width: '600px',
      data: {} as Employee
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Add employee  : " + result);
        
         this.loadEmployees();
      }
    });
  }

  editEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(EmployeeEditDialogComponent, {
      width: '600px',
      data: employee
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Before Update employee  : "+ employee + " - " + result);
        this.loadEmployees();      
//        this.employeeService.updateEmployee(employee.employeeId, employee).subscribe(() => this.loadEmployees());
      }
    });
  }

  deleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe(() => this.loadEmployees());
  }

}
