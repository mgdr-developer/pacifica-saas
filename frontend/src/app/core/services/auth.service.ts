import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inyección de dependencias moderna de Angular 17+
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/v1/auth';
  private tokenKey = 'pacifica_jwt_token'; // El nombre del bolsillo de la billetera

  // Va a la ventanilla y guarda el gafete si la respuesta es exitosa
  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/authenticate`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
        })
      );
  }

  // Método auxiliar para que el Interceptor lea el gafete
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Tira el gafete a la basura
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}