import { Component } from '@angular/core';
import { AuthserviceService } from 'src/app/auth/services/authservice.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  title = 'Zubaid Payroll System';
  constructor(private authService: AuthserviceService) { }
  
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

 logout():void{
     this.authService.logout();  // Call the logout function
  }
  
  isAdmin(): boolean {
        return this.authService.isAdmin();
  }
}


