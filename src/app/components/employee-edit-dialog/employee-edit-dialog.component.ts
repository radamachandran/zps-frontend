import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
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
      employeeId: [this.data?.employeeId],
      empNo: [{ value: this.data?.empNo || '', disabled: this.data?.empNo }, Validators.required],
      firstName: [this.data?.firstName || '', Validators.required],
      lastName: [this.data?.lastName || ''],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      phoneNumber: [this.data?.phoneNumber || '', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]], 
      dateOfBirth: [this.data?.dateOfBirth || '', Validators.required],
      address: [this.data?.address || '', Validators.required],
      designation: [this.data?.designation || '', Validators.required],
      department: [this.data?.department?.departmentId || null, Validators.required],
      panCard: [this.data?.panCard || '', [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      aadharCard: [this.data?.aadharCard || '', [Validators.required]], // Fixed here
      bankAcNo: [this.data?.bankAcNo || '', [Validators.required, Validators.pattern(/^\d{9,18}$/)]], // Fixed here
      bankName: [this.data?.bankName || '', Validators.required],
      ifsc: [this.data?.ifsc || '', [Validators.required]], // Fixed here
      active: [this.data?.active || true],
      dateOfJoining: [this.data?.dateOfJoining || '', Validators.required],
      dateOfLeaving: [{ value: this.data?.dateOfLeaving || '', disabled: !this.data.dateOfJoining }],
      uan: [this.data?.uan || '', Validators.pattern(/^\d{12}$/)],
      createdOn: [this.dataUp || '']
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
      console.log("Department id : "+selectedDepartmentId);
      console.log("empl id : "+this.data?.employeeId);
      if (!this.data?.employeeId)
        this.sel =this.departments.find(dept => dept.departmentName === selectedDepartmentId);
      else
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
    else{
//      alert("Please check the form, there is some discrepency!!!");
        this.showValidationErrors(); // Call the method to highlight errors
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  showValidationErrors(): void {
    const invalidFields: string[] = [];
  
    // Loop through form controls to find invalid fields
    Object.keys(this.employeeForm.controls).forEach((field) => {
      const control = this.employeeForm.get(field);
      if (control?.invalid) {
        invalidFields.push(field); // Store the invalid field name
      }
    });
  
    if (invalidFields.length > 0) {
      // Show alert with invalid fields
      alert(`Please correct the following fields:\n${invalidFields.join(', ')}`);
  
      // Scroll to the first invalid field (if in a dialog, ensure the form is scrollable)
      const firstInvalidControl = document.querySelector(`[formcontrolname="${invalidFields[0]}"]`);
      if (firstInvalidControl) {
        firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (firstInvalidControl as HTMLElement).focus();
      }
    }
  }
  
}
