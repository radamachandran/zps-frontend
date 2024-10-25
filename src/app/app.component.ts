import { Component } from '@angular/core';
import { AuthserviceService } from './auth/services/authservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Zubaid Payroll System';
  constructor(private authService: AuthserviceService) { }
  
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

 logout():void{
     this.authService.logout();  // Call the logout function
  }
}
