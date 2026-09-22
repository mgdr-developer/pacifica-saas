import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si hay un token en la billetera, adelante
  if (authService.getToken()) {
    return true;
  }

  // Si no hay token, lo mandamos al login y bloqueamos la pantalla
  router.navigate(['/login']);
  return false;
};