import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Institute } from '../models/institute.model';

@Injectable({
  providedIn: 'root'
})
export class InstituteService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/institutes';

  getInstitutes(): Observable<Institute[]> {
    return this.http.get<Institute[]>(this.apiUrl);
  }

  createInstitute(data: Partial<Institute>): Observable<Institute> {
    return this.http.post<Institute>(this.apiUrl, data);
  }

  updateInstitute(id: string, data: Partial<Institute>): Observable<Institute> {
    return this.http.put<Institute>(`${this.apiUrl}/${id}`, data);
  }

  deleteInstitute(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
