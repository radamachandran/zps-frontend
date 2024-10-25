import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeparmentService {
  private baseUrl = 'http://localhost:8080/api/departments'; // Adjust the base URL as necessary

  constructor(private http: HttpClient) { }

  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`+"/getAll");
  }

  
  addDepartment(department: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`+"/add" , department);
  }

  updateDepartment(department: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${department.departmentId}`, department);
  }

  deleteDepartment(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }  
  
  
  
  // Other CRUD operations
}
