
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalaryadvmsService {
  private apiUrl = "http://localhost:8080/api/salaryadv";

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAll`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(salaryAdvance: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, salaryAdvance);
  }

  update(id: number, salaryAdvance: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, salaryAdvance);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }}
