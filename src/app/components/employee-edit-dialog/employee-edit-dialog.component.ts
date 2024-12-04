import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee,Department } from '../../models/employee';
import { DeparmentService } from 'src/app/services/deparment.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-employee-edit-dialog',
  templateUrl: './employee-edit-dialog.component.html',
  styleUrls: ['./employee-edit-dialog.component.css']
})
export class EmployeeEditDialogComponent {
  employeeForm: FormGroup|any;
  departments: Department[]=[]; // Assume this is fetched from a service
  sel:Department|any;
  flag:boolean=false;
  dataUp=new Date();
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmployeeEditDialogComponent>,
    private departmentService:DeparmentService,
    private employeeService:EmployeeService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: Employee
  ) {
  }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      employeeId:[ this.data?.employeeId],
      //empNo: [{ value: this.data?.empNo || '',disabled:true } ],
      empNo: [{ value: this.data?.empNo || '', disabled: this.data?.empNo }],
      firstName: [this.data?.firstName || ''],
      lastName: [this.data?.lastName || ''],
      email: [this.data?.email || ''],
      dateOfBirth: [this.data?.dateOfBirth || ''],
      phoneNumber: [this.data?.phoneNumber || ''],
      address: [this.data?.address || ''],
      designation: [this.data?.designation || ''],
      department: [this.data?.department?.departmentId || null],
      panCard: [this.data?.panCard || ''],
      aadharCard: [this.data?.aadharCard || ''],
      bankAcNo: [this.data?.bankAcNo || ''],
      bankName: [this.data?.bankName || ''],
      ifsc: [this.data?.ifsc || ''],
      active: [this.data?.active || true],
      dateOfJoining:[this.data?.dateOfJoining || ''],
      dateOfLeaving:[{ value: this.data?.dateOfLeaving || '', disabled: !this.data.dateOfJoining }],
      uan:[this.data?.uan || ''],
      createdOn:[this.dataUp || '' ]
      // Additional fields as necessary
    });
  
    this.loadDepartments();
    if(!this.data)
      this.employeeForm.empNo.disabled=false;
       
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe(data => {
      this.departments = data;
         });
  }
  onSave(): void {
    if (this.employeeForm.valid){
      const formValues = this.employeeForm.getRawValue();
      const selectedDepartmentId = this.employeeForm.get('department').value;
      this.sel =this.departments.find(dept => dept.departmentId === selectedDepartmentId);
      const payload = {
          ...formValues,
          department: {departmentId: this.sel.departmentId},  // Wrap the departmentId in an object
          dateOfJoining: this.datePipe.transform(formValues.dateOfJoining, 'yyyy-MM-dd'),  
          updatedOn: this.datePipe.transform(formValues.updatedOn, 'yyyy-MM-dd'),
          createdOn: this.datePipe.transform(formValues.updatedOn, 'yyyy-MM-dd')
          
      };
      console.log(JSON.stringify(payload));
       
      // Determine whether to create or update
      const operation = this.data?.employeeId
      ? this.employeeService.updateEmployee(this.data.employeeId, payload)
      : this.employeeService.createEmployee(payload);

      // Execute operation with success and error handling
      operation.subscribe({
      next: () => {
        // Close dialog and indicate success
        this.dialogRef.close(true);
      },
      error: (err) => {
        // Log the error and provide user feedback
        console.error('Error saving employee data:', err);
        this.dialogRef.close(false); // Optionally close the dialog
        // You can also use MatSnackBar or another method to display an error message
        alert('An error occurred while saving employee data. Please try again later. Error details : '+ err);
      }
    });


      /* old code without handling the error */
        // if(this.data?.employeeId)
        // {
          
        //   this.employeeService.updateEmployee(this.data.employeeId,payload).subscribe(() => {
        //     this.dialogRef.close(true);
        //   });
        // }
        // else
        // {
        //   this.employeeService.createEmployee(payload).subscribe(() => {
        //     this.dialogRef.close(true);
        //   });
        // }

    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
