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
  dataSource_active = new MatTableDataSource<Employee>();
  dataSource_inactive = new MatTableDataSource<Employee>();

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    
    
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe((employees: Employee[]) => {
      // this.dataSource.data = employees.filter(employee => employee.active === true);
      this.dataSource_active.data=employees.filter(x=>x.active===true);
      this.dataSource_inactive.data=employees.filter(x=>x.active===false);
      this.dataSource.data = this.dataSource_active.data;
    });
  }

  displayActive(){
    this.dataSource.data = this.dataSource_active.data;
  }

  displayinActive(){
    this.dataSource.data = this.dataSource_inactive.data;
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
    alert("Removing employee from DB is not advisable so make it in-active using edit icon")
    // this.employeeService.deleteEmployee(employeeId).subscribe(() => this.loadEmployees());
  }

}
