import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Role, UserCreateRequest, UserUpdateRequest } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/v1/users`;

    // 1. Obtener la lista de usuarios
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    // 2. Obtener los roles para el selector del formulario
    getRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(`${this.apiUrl}/roles`);
    }

    // 3. Crear un nuevo usuario
    createUser(data: UserCreateRequest): Observable<User> {
        return this.http.post<User>(this.apiUrl, data);
    }

    // 4. Editar un usuario existente
    updateUser(id: string, data: UserUpdateRequest): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${id}`, data);
    }

    // 5. Eliminar un usuario
    deleteUser(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // 6. Subir avatar independiente (Para el formulario antes de guardar)
    uploadAvatar(file: File): Observable<{ avatarUrl: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ avatarUrl: string }>(`${this.apiUrl}/upload-avatar`, formData);
    }

    // 7. Subir avatar para un usuario específico (Para el menú de 3 puntos)
    updateUserAvatar(id: string, file: File): Observable<User> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<User>(`${this.apiUrl}/${id}/avatar`, formData);
    }

    // 8. Utilidad para armar la URL completa de la foto o dar un avatar por defecto
    getAvatarUrl(user: User): string {
        if (!user.avatarUrl) {
            // Si no tiene foto, generamos un avatar estético con sus iniciales
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.paternalLastName)}&background=0284c7&color=ffffff&bold=true`;
        }
        if (user.avatarUrl.startsWith('http')) {
            return user.avatarUrl;
        }
        // Concatena el dominio del backend con la ruta relativa (/uploads/avatars/...)
        const baseUrl = environment.apiUrl.replace(/\/api\/?$/, '');
        return `${baseUrl}${user.avatarUrl}`;
    }

    // 9. Diccionario para traducir roles técnicos a etiquetas comerciales
    getRoleLabel(roleName?: string): string {
        const labels: Record<string, string> = {
            'SUPER_ADMIN': 'CEO',
            'ADMIN': 'Administrador',
            'COACH': 'Entrenador',
            'ALUMNO': 'Alumno'
        };
        return roleName ? (labels[roleName] || roleName) : 'Sin Rol';
    }

}
