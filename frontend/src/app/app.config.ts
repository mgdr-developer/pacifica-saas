import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/services/auth.interceptor'; // Importa tu interceptor
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Agregamos el asistente a la cadena de proveedores HTTP
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};