
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {
  private baseUrl = 'http://localhost:8080/api/salary';

  constructor(private http: HttpClient) { }

  getSalaries(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl+"/getAll");
  }

  getSalaryById(salaryId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${salaryId}`);
  }

  createSalary(salary: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, salary);
  }

  updateSalary(salaryId: number, salary: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${salaryId}`, salary);
  }

  deleteSalary(salaryId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${salaryId}`);
  }
 }
