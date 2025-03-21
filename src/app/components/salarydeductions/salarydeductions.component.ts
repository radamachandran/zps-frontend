import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SalaryService } from 'src/app/services/salary.service';
import { SalaryDialogComponent } from '../salary-dialog/salary-dialog.component';

@Component({
  selector: 'app-salarydeductions',
  templateUrl: './salarydeductions.component.html',
  styleUrls: ['./salarydeductions.component.css']
})
export class SalarydeductionsComponent implements OnInit {
  displayedColumns: string[] = [
    'employeeId',
    'firstName',
    'basic',
    'houseRentAllowance',
    'specialAllowance',
    'otherAllowance',
    'grossSalary',
    'pf',
    'esi',
    'pfFlag',
    'netSalary',
    'actions'
  ];

  salaryForm!: FormGroup;
  isEditMode = false;
  selectedSalary: any;
  dataSource = new MatTableDataSource<any>();

 
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private salaryService: SalaryService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadSalaries();
    
  }

  // Initialize the salary form
  private initializeForm(): void {
    this.salaryForm = this.fb.group({
      employeeId: ['', Validators.required],
      basic: ['', Validators.required],
      houseRentAllowance: ['', Validators.required],
      otherAllowance: ['', Validators.required],
      medicalAllowance: [''],
      specialAllowance: ['', Validators.required],
      professionalTax: ['', Validators.required],
      incomeTax: ['', Validators.required],
      otherDeductions: ['', Validators.required],
      conveyence: ['', Validators.required],
      pfFlag: ['', Validators.required]
    });
  }

  // Load salary data and assign paginator after data is loaded
  private loadSalaries(): void {
    this.salaryService.getSalaries().subscribe(data => {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  

  // Open dialog to add a new salary entry
  openAddSalaryDialog(): void {
    const dialogRef = this.dialog.open(SalaryDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Result from Db after update:  ",result);
      if (result) {
        this.salaryService.createSalary(result).subscribe(() => {
          this.loadSalaries();
         });
      }
    });
  }

  // Open dialog to edit a salary entry
  openEditSalaryDialog(salary: any): void {
    this.isEditMode = true;
    this.selectedSalary = salary;

    // Reset form and patch selected salary data
    this.salaryForm.reset();
    this.salaryForm.patchValue(salary);

    const dialogRef = this.dialog.open(SalaryDialogComponent, {
      width: '400px',
      data: { salary }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadSalaries();
      // if (result) {
      //   this.salaryService.updateSalary(salary.salaryId, result).subscribe(() => {
      //     this.loadSalaries();
      //   });
      // }
    });
  }

  // Save or update salary based on mode
  saveSalary(): void {
    if (this.salaryForm.invalid) {
      return;
    }

    if (this.isEditMode) {
      this.salaryService.updateSalary(this.selectedSalary.salaryId, this.salaryForm.value).subscribe(() => {
        this.loadSalaries();
        this.isEditMode = false; // Reset mode
      });
    } else {
      this.salaryService.createSalary(this.salaryForm.value).subscribe(() => {
        this.loadSalaries();
      });
    }
  }

  // Delete salary entry
  deleteSalary(id: number): void {
    this.salaryService.deleteSalary(id).subscribe(() => {
      this.loadSalaries();
    });
  }
 


}
