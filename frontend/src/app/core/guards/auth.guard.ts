import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si hay una sesión activa de usuario, adelante
  if (authService.isAuthenticated()) {
    return true;
  }

  // Si no hay sesión, lo mandamos al login y bloqueamos la pantalla
  router.navigate(['/login']);
  return false;
};