import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/services/auth.interceptor';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco'; // Importa tu interceptor
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Agregamos el asistente a la cadena de proveedores HTTP
    provideHttpClient(withInterceptors([authInterceptor])), provideHttpClient(), provideTransloco({
        config: { 
          availableLangs: ['en', 'es'],
          defaultLang: 'en',
          // Remove this option if your application doesn't support changing language in runtime.
          reRenderOnLangChange: true,
          prodMode: !isDevMode(),
        },
        loader: TranslocoHttpLoader
      })
  ]
};