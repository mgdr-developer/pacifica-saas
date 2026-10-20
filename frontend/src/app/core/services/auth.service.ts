import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, of, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Perfil público del usuario en sesión.
 * NOTA DE SEGURIDAD: Solo guarda datos de visualización (nombre, correo, rol).
 * El Token JWT criptográfico NUNCA se almacena en JavaScript ni en LocalStorage;
 * reside exclusivamente protegido dentro de la Cookie HttpOnly del navegador.
 */
export interface CurrentUser {
  email: string;
  firstName: string;
  role: string;
}

/**
 * Respuesta enviada por la ventanilla de autenticación del Backend.
 */
export interface AuthResponse {
  token?: string;
  email: string;
  firstName: string;
  role: string;
}

/**
 * ============================================================================
 * CATÁLOGO OFICIAL DE LLAVES POR PUESTO (Matriz Híbrida de Permisos)
 * ============================================================================
 * Cada Rol del club tiene asignado un juego específico de llaves digitales.
 * Las vistas y botones de Angular no evalúan roles, sino permisos individuales.
 */
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: ['*'], // Llave maestra universal: acceso total a todo el club
  ADMIN: [
    'institutes:read',
    'institutes:write',
    'services:read',
    'services:write',
    'users:manage'
  ],
  COACH: [
    'institutes:read',
    'services:read'
    // Modo solo lectura: sin llaves de modificación ni acceso a personal
  ],
  ALUMNO: [
    'services:read'
  ]
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = `${environment.apiUrl}/v1/auth`;
  private userKey = 'pacifica_user_profile';

  // ==========================================================================
  // SIGNALS REACTIVOS DE ESTADO (Angular 19)
  // ==========================================================================

  /**
   * Bandeja del usuario actual.
   * Se inicializa inmediatamente con el perfil guardado en LocalStorage
   * para evitar parpadeos visuales en pantalla durante la recarga (F5).
   */
  currentUser = signal<CurrentUser | null>(this.getStoredUser());

  /**
   * Pantalla reactiva que muestra el Puesto/Rol actual del usuario.
   * Se recalcula automáticamente cuando cambia 'currentUser'.
   */
  currentRole = computed(() => this.currentUser()?.role || null);

  /**
   * Llavero digital reactivo con las llaves autorizadas para el rol actual.
   * Se recalcula automáticamente cuando cambia 'currentRole'.
   */
  permissions = computed<string[]>(() => {
    const role = this.currentRole();
    if (!role) return [];
    return ROLE_PERMISSIONS[role] || [];
  });

  constructor() {
    // Cada vez que la aplicación arranca en el navegador, valida la sesión con el backend
    this.verifySessionWithBackend();
  }

  // ==========================================================================
  // OPERACIONES DE AUTENTICACIÓN
  // ==========================================================================

  /**
   * Inicia sesión con credenciales.
   * La Cookie HttpOnly es emitida por el Backend y almacenada automáticamente
   * por el navegador gracias a 'withCredentials: true'.
   */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/authenticate`,
      { email, password },
      { withCredentials: true }
    ).pipe(
      tap(response => {
        const userProfile: CurrentUser = {
          email: response.email,
          firstName: response.firstName,
          role: response.role
        };

        // Guardamos únicamente la tarjeta de presentación pública (Anti-XSS puro)
        localStorage.setItem(this.userKey, JSON.stringify(userProfile));
        this.currentUser.set(userProfile);
      })
    );
  }

  /**
   * Cierra la sesión activa.
   * Notifica a Spring Boot para que destruya la Cookie HttpOnly (MaxAge = 0)
   * y limpia el estado local antes de redirigir al login.
   */
  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => this.cleanLocalSession(),
      error: () => this.cleanLocalSession()
    });
  }

  /**
   * Limpia el estado local y expulsa al usuario al login.
   */
  private cleanLocalSession(): void {
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  // ==========================================================================
  // VERIFICACIÓN DE LLAVES Y ROLES (Para uso en plantillas y componentes)
  // ==========================================================================

  /**
   * Verifica si el usuario actual cuenta con una llave de permiso específica.
   * Ejemplo: authService.can('services:write')
   */
  can(permission: string): boolean {
    const perms = this.permissions();
    return perms.includes('*') || perms.includes(permission);
  }

  /**
   * Verifica si el usuario cuenta con alguno de los roles indicados.
   * Ejemplo: authService.hasRole(['ADMIN', 'SUPER_ADMIN'])
   */
  hasRole(roles: string[]): boolean {
    const role = this.currentRole();
    return role ? roles.includes(role) : false;
  }

  /**
   * Indica si hay una sesión activa de usuario.
   */
  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  // ==========================================================================
  // MÉTODOS DE SOPORTE Y SINCRONIZACIÓN
  // ==========================================================================

  /**
   * Lee la tarjeta de presentación almacenada en LocalStorage para arranque veloz.
   */
  private getStoredUser(): CurrentUser | null {
    const stored = localStorage.getItem(this.userKey);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as CurrentUser;
    } catch {
      return null;
    }
  }

  /**
   * Consulta silenciosa al endpoint '/me' para verificar si la Cookie HttpOnly
   * sigue siendo válida en el servidor. Si expiró, purga la sesión local.
   */
  private verifySessionWithBackend(): void {
    if (!this.currentUser()) return;

    this.http.get<AuthResponse>(`${this.apiUrl}/me`, { withCredentials: true })
      .pipe(
        catchError(() => {
          // Si el servidor indica que la cookie caducó o es inválida, cerramos sesión
          this.cleanLocalSession();
          return of(null);
        })
      )
      .subscribe(user => {
        if (user) {
          const updatedProfile: CurrentUser = {
            email: user.email,
            firstName: user.firstName,
            role: user.role
          };
          this.currentUser.set(updatedProfile);
          localStorage.setItem(this.userKey, JSON.stringify(updatedProfile));
        }
      });
  }
}
