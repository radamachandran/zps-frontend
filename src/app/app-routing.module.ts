import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { DepartmentComponent } from './components/department/department.component';
import { SalarydeductionsComponent } from './components/salarydeductions/salarydeductions.component';
import { SalaryadvmsService } from './services/salaryadvms.service';
import { SalaryadvmstComponent } from './components/salaryadvmst/salaryadvmst.component';
import { LeaveComponent } from './components/leave/leave.component';
import { MonthlySalaryAdvdetComponent } from './components/monthly-salary-advdet/monthly-salary-advdet.component';
import { PayrollProcessComponent } from './components/payroll-process/payroll-process.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/services/AuthGuard';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { OfferComponent } from './components/offer/offer.component';

// const routes: Routes = [
//   { path: 'login', component: LoginComponent },
//   { path: '', redirectTo: '/login', pathMatch: 'full' },
//  // { path: '**', redirectTo: '/login' },
//   { path: 'employees', component: EmployeeFormComponent,   canActivate: [AuthGuard]},
//   { path: 'department', component: DepartmentComponent, canActivate: [AuthGuard]},
//   { path: 'salary', component: SalarydeductionsComponent, canActivate: [AuthGuard] },
//   { path: 'salaryadv', component: SalaryadvmstComponent, canActivate: [AuthGuard] },
//   { path: 'monthly_salary_det', component: MonthlySalaryAdvdetComponent, canActivate: [AuthGuard]},
//   { path: 'leave', component: LeaveComponent, canActivate: [AuthGuard]},
//   { path: 'Process_payroll', component: PayrollProcessComponent, canActivate: [AuthGuard]},
// ];

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  
  { 
    path: '', 
    component: AdminLayoutComponent, 
    canActivate: [AuthGuard], // Protect this route with AuthGuard
    children: [
      { path: 'employees', component: EmployeeFormComponent },
      { path: 'department', component: DepartmentComponent },
      { path: 'salary', component: SalarydeductionsComponent },
      { path: 'salaryadv', component: SalaryadvmstComponent },
      { path: 'monthly_salary_det', component: MonthlySalaryAdvdetComponent },
      { path: 'leave', component: LeaveComponent },
      { path: 'Process_payroll', component: PayrollProcessComponent },
      { path: 'offer_letter', component: OfferComponent },
      { path: '**', redirectTo: '/login' } // Default route
    ]
  },
  { path: '**', redirectTo: '/login' } // Redirect unknown routes to login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
