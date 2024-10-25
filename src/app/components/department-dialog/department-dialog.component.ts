import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-department-dialog',
  templateUrl: './department-dialog.component.html',
  styleUrls: ['./department-dialog.component.css']
})
export class DepartmentDialogComponent {
department: any = {};

  constructor(
    public dialogRef: MatDialogRef<DepartmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.department) {
      this.department = { ...data.department };
    }
  }

  onSave(): void {
    this.dialogRef.close(this.department);
  }

  onCancel(): void {
    this.dialogRef.close();
  }


  

}
interface department{
  id:number;
  name:String;
}