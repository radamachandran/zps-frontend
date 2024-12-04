import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient,private router: Router) {}
  getToken(): string | null {
    return localStorage.getItem('token');  // Retrieve token from storage
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.roles ? decodedToken.roles[0] : null;  // Assuming roles are in an array
    }
    return null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ROLE_ADMIN';
  }

  isUser(): boolean {
    return this.getUserRole() === 'ROLE_USER';
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { username, password });
  }
 
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');  // Returns true if token exists 
  }
 
  logout() {
    const token = localStorage.getItem('token');  // Get the token from localStorage
     
    // Call the backend to invalidate the token
    this.http.post(`${this.baseUrl}/api/logout`, { token }).subscribe({
      next: () => {
        localStorage.removeItem('token');  // Remove the token from localStorage
        this.router.navigate(['login']);  // Redirect to the login page
      },
      error: (err) => {
        localStorage.removeItem('token');  // Remove the token from localStorage
        this.router.navigate(['login']);  // Redirect to the login page
        console.error('Logout failed:', err);

      }
    });
  }
}
