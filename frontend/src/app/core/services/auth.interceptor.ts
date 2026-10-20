import { HttpInterceptorFn } from '@angular/common/http';

/**
 * ============================================================================
 * INTERCEPTOR DE AUTENTICACIÓN (El Cartero Oficial del Club)
 * ============================================================================
 * Su única y crucial responsabilidad es garantizar que toda petición enviada
 * desde Angular al Backend lleve consigo la orden 'withCredentials: true'.
 * 
 * Esto le indica al navegador que transporte de forma automática y transparente
 * la Cookie 'HttpOnly' que resguarda el Token JWT en la caja fuerte del navegador,
 * eliminando cualquier riesgo de robo por ataques XSS en JavaScript.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Clonamos la carta agregándole el sello para transportar la caja fuerte (Cookies)
  const clonedRequest = req.clone({
    withCredentials: true
  });

  // El cartero entrega la carta sellada a la siguiente etapa de red
  return next(clonedRequest);
};
