import { Component, OnInit } from '@angular/core';
import { SalaryadvmsService } from 'src/app/services/salaryadvms.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-salaryadvmst',
  templateUrl: './salaryadvmst.component.html',
  styleUrls: ['./salaryadvmst.component.css']
})
export class SalaryadvmstComponent {
  employeesIds:any[]=[];
  employees:any[]=[];
  
  salaryAdvances: any[] = [];
  salaryAdvances_active: any[] = [];
  salaryAdvances_inactive: any[] = [];
  salaryAdvanceForm: FormGroup;
  isEdit: boolean = false;
  currentId: number | null = null;
  flag:boolean =false;

  constructor(
    private salaryAdvanceService: SalaryadvmsService,
    private employeeService: EmployeeService,
    private fb: FormBuilder
  ) {
    this.salaryAdvanceForm = this.fb.group({
      loan_id: [''],
      employee_id: [''],
      loan_amt: [''],
      date_of_issue: [''],
      paid_amt: [''],
      purpose: [''],
      monthly_deduction_amt: [''],
      remarks: ['']
    });
  }

  ngOnInit(): void {
    this.loademployees();
    this.loadSalaryAdvances();
    
  }

  loadSalaryAdvances(): void {
    this.salaryAdvanceService.getAll().subscribe(data => {
      this.salaryAdvances_active=data.filter(x=>x.pending_amt>0);
      this.salaryAdvances_inactive=data.filter(x=>x.pending_amt<=0);
      this.salaryAdvances = this.salaryAdvances_active;      
    });
  }
  
  loademployees(): void {
    this.employeeService.getEmployees().subscribe(data => {

      this.employees = data.filter(x=>x.active===true);
    });
  }

  saveSalaryAdvance(): void {
  
    if (this.isEdit && this.currentId) {
      this.salaryAdvanceService.update(this.currentId, this.salaryAdvanceForm.value).subscribe(() => {
        this.resetForm();
        this.loadSalaryAdvances();
      });
    } else {
      this.salaryAdvanceService.create(this.salaryAdvanceForm.value).subscribe(() => {
        this.resetForm();
        this.loadSalaryAdvances();
      });
    }

   this.flag=false;    
  }

  editSalaryAdvance(salaryAdvance: any): void {
    this.flag=true;
    this.salaryAdvanceForm.patchValue(salaryAdvance);
    this.isEdit = true;
    this.currentId = salaryAdvance.loan_id;
  }

  deleteSalaryAdvance(id: number): void {
    this.salaryAdvanceService.delete(id).subscribe(() => {
      this.loadSalaryAdvances();
    });
  }

  resetForm(): void {
    this.salaryAdvanceForm.reset();
    this.isEdit = false;
    this.currentId = null;
    this.flag=false;
  }
  displayForm(){
    if(this.flag)
      this.flag=false;
    else
      this.flag=true;
  }

  displayActive(){
    
    this.salaryAdvances = this.salaryAdvances_active;

  }

  displayinActive(){
    this.salaryAdvances = this.salaryAdvances_inactive;
  }
}
