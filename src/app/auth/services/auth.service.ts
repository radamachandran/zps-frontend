import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  logout(expirationMessage: string) {
    // Clear user data from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Store the expiration message for display on the login page
    sessionStorage.setItem('logoutReason', expirationMessage);
    
    // Navigate to login page
    this.router.navigate(['/login']);
  }
}