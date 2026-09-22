import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Inyectamos nuestro servicio de autenticación
  const authService = inject(AuthService);

  // 2. Revisamos si hay un token en la billetera
  const token = authService.getToken();

  // 3. Si hay token, clonamos el sobre original pegándole la estampilla
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Dejamos salir al cartero con el sobre modificado
    return next(clonedRequest);
  }

  // 4. Si no hay token (ej. al hacer Login), dejamos salir el sobre original
  return next(req);
};