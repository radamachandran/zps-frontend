import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatPaginatorModule } from '@angular/material/paginator'; // Add this

import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DepartmentComponent } from './components/department/department.component';
import { DepartmentDialogComponent } from './components/department-dialog/department-dialog.component';
import { FormsModule } from '@angular/forms';
import { SalarydeductionsComponent } from './components/salarydeductions/salarydeductions.component';
import { SalaryDialogComponent } from './components/salary-dialog/salary-dialog.component';
import { DeductionDialogComponent } from './components/deduction-dialog/deduction-dialog.component';
import { SalaryadvmstComponent } from './components/salaryadvmst/salaryadvmst.component';
import { LeaveComponent } from './components/leave/leave.component';
import { LeaveDialogComponent } from './components/leave-dialog/leave-dialog.component';
import { MonthlySalaryAdvdetComponent } from './components/monthly-salary-advdet/monthly-salary-advdet.component';
import { PayrollProcessComponent } from './components/payroll-process/payroll-process.component';
import { EmployeeEditDialogComponent } from './components/employee-edit-dialog/employee-edit-dialog.component';
import { DatePipe,CurrencyPipe } from '@angular/common';
import { LoginComponent } from './auth/login/login.component';
import { TokenInterceptor } from './auth/interceptors/token.interceptor';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { OfferComponent } from './components/offer/offer.component'; // Import the MatExpansionModule



@NgModule({
  declarations: [
    AppComponent,
    EmployeeListComponent,
    EmployeeDetailComponent,
    EmployeeFormComponent,
    DepartmentComponent,
    DepartmentDialogComponent,
    SalarydeductionsComponent,
    SalaryDialogComponent,
    DeductionDialogComponent,
    SalaryadvmstComponent,
    LeaveComponent,
    LeaveDialogComponent,
    MonthlySalaryAdvdetComponent,
    PayrollProcessComponent,
    EmployeeEditDialogComponent,
    LoginComponent,
    AdminLayoutComponent,
    OfferComponent,
    
  ],
  imports: [
    MatPaginatorModule,
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,  // Import MatToolbarModule
    MatSidenavModule,  // Import MatSidenavModule
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,    
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatExpansionModule, // Include MatExpansionModule
  ],
  providers: [DatePipe, CurrencyPipe,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
