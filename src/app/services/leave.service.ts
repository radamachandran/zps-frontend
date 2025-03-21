import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  private apiUrl = 'http://localhost:8080/api/leaves';  // Update with your actual backend URL

  constructor(private http: HttpClient) {}

  getLeaves(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addLeave(leave: any): Observable<any> {
    console.log("In service",leave);
    return this.http.post<any>(this.apiUrl+ "/add", leave);
  }

  updateLeave(leave: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${leave.leaveId}`, leave);
  }

  deleteLeave(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
