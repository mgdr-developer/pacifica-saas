import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * ============================================================================
 * GUARDIA DE PERMISOS FUNCIONAL (El Guardia de la Oficina Privada)
 * ============================================================================
 * Fábrica de guardias que valida si el usuario cuenta con una llave específica.
 * Si no la tiene, bloquea el paso y lo redirige automáticamente al Dashboard.
 */
export const permissionGuard = (requiredPermission: string): CanActivateFn => {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);

        // 1. ¿El gafete tiene la llave requerida o la llave maestra universal?
        if (authService.can(requiredPermission)) {
            return true; // Adelante, pase usted
        }

        // 2. Si no tiene permiso, lo acompañamos amablemente de regreso al Dashboard
        console.warn(`Acceso denegado a la ruta: Se requiere la llave [${requiredPermission}]`);
        router.navigate(['/dashboard']);
        return false;
    };
};
