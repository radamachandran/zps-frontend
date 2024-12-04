import { Component } from '@angular/core';
import { AuthserviceService } from '../services/authservice.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  logoutReason: string | null = null;

  constructor(private authService: AuthserviceService, private router: Router) {}

  ngOnInit() {
    this.logoutReason = sessionStorage.getItem('logoutReason');
    if (this.logoutReason) {
      sessionStorage.removeItem('logoutReason');
    }
  }

  login() {
    this.authService.login(this.username, this.password).subscribe(
      (response: any) => {
        localStorage.setItem('token', response.jwt); // Store the JWT token
        this.router.navigate(['employees']); // Navigate to the dashboard or other secure page
        console.log("Successfully logged in ");
        
      },
      (error) => {
        this.errorMessage = 'Invalid username or password';
        alert(this.errorMessage);
      }
    );
  }
}
