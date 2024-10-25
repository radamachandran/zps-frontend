import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeductionService {
  private baseUrl = 'http://localhost:8080/api/salary';

  constructor(private http: HttpClient) { }

  getDeductions(employeeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?employeeId=${employeeId}`);
  }

  addDeduction(deduction: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, deduction);
  }

  updateDeduction(deduction: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${deduction.id}`, deduction);
  }

  deleteDeduction(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
  getDeductionsByEmployeeId(employeeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/deduction/${employeeId}`);
  }
}
