import { Component,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeductionService } from 'src/app/services/deduction.service';

@Component({
  selector: 'app-deduction-dialog',
  templateUrl: './deduction-dialog.component.html',
  styleUrls: ['./deduction-dialog.component.css']
})
export class DeductionDialogComponent {
  deductionsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private deductionsService: DeductionService,
    private dialogRef: MatDialogRef<DeductionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.deductionsForm = this.fb.group({
      employeeId: [{ value: data.employeeId, disabled: true }, Validators.required],
      amount: [data.amount || '', [Validators.required, Validators.min(0)]]
    });
  }

  onSave(): void {
    if (this.deductionsForm.valid) {
      const deductionData = this.deductionsForm.value;
      if (this.data.id) {
        // Update existing deduction
        deductionData.id = this.data.id;
        this.deductionsService.updateDeduction(deductionData).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        // Add new deduction
        this.deductionsService.addDeduction(deductionData).subscribe(() => {
          this.dialogRef.close(true);
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
