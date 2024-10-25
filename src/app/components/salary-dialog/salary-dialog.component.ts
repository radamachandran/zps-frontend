import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SalaryService } from 'src/app/services/salary.service';

@Component({
  selector: 'app-salary-dialog',
  templateUrl: './salary-dialog.component.html',
  styleUrls: ['./salary-dialog.component.css']
})
export class SalaryDialogComponent {
  salaryId:number;
  employeeId: string;
  basic: number;
  grossSalary:number;
 // houseRentAllowance: number;
  otherAllowance: number;
  medicalAllowance: number;
  specialAllowance: number;
  professionalTax: number;
  incomeTax: number;
  otherDeductions: number;
  conveyance:number=0;
  pfFlag:boolean=true;

  constructor(
    private salaryService: SalaryService,
    private dialogRef: MatDialogRef<SalaryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.salaryId=data.salary.SalaryId;
    this.employeeId = data.salary.employeeId;
    this.basic = data.salary.basic;
    this.grossSalary = data.salary.grossSalary;
//    this.houseRentAllowance = data.salary.houseRentAllowance;
    this.otherAllowance = data.salary.otherAllowance;
    this.medicalAllowance = data.salary.medicalAllowance;
    this.specialAllowance = data.salary.specialAllowance;
    this.professionalTax = data.salary.professionalTax;
    this.incomeTax = data.salary.incomeTax;
    this.otherDeductions = data.salary.otherDeductions;
    this.conveyance=data.salary.conveyance;
    this.pfFlag=data.salary.pfFlag;
  //  console.log("Input Data ", this.gross_salary);
    
  }

  onSave(): void {
      const salaryData = {
      salaryId:this.data.salary.salaryId,  
      employeeId: this.data.salary.employeeId,
      basic: this.basic,
      grossSalary:this.grossSalary,
//      houseRentAllowance: this.houseRentAllowance,
      otherAllowance: this.otherAllowance,
      medicalAllowance: this.medicalAllowance,
      specialAllowance: this.specialAllowance,
      professionalTax: this.professionalTax,
      incomeTax: this.incomeTax,
      otherDeductions: this.otherDeductions,
      conveyance:this.conveyance,
      pfFlag:this.pfFlag
    };
    if (this.data?.salary.salaryId) {
      // Update existing salary
      console.log("Salary Id : ",this.data.salary.salaryId);
      
      this.salaryService.updateSalary(this.data.salary.salaryId, salaryData).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
    // else {
    //   // Add new salary
    //   this.salaryService.addSalary(salaryData).subscribe(() => {
    //     this.dialogRef.close(true);
    //   });
    // }
  }

  onCancel(): void {
        this.dialogRef.close(false);
  }
}
