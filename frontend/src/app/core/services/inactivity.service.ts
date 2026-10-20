import { Injectable, inject, NgZone, effect } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * ============================================================================
 * SENSOR DE INACTIVIDAD (El Sensor de Presencia del Club)
 * ============================================================================
 * Monitorea la actividad del usuario (mouse, teclado, clicks, scroll, touch).
 * Si transcurren 15 minutos de inactividad mientras el usuario está autenticado,
 * cierra la sesión automáticamente para evitar accesos desatendidos.
 */
@Injectable({
    providedIn: 'root'
})
export class InactivityService {
    private authService = inject(AuthService);
    private ngZone = inject(NgZone);

    // Límite de inactividad: 15 minutos en milisegundos (15 min * 60 s * 1000 ms)
    private readonly INACTIVITY_LIMIT_MS = 15 * 60 * 1000;
    private timerId: any = null;

    // Lista de eventos físicos que reinician el sensor
    private readonly events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    private readonly resetListener = () => this.resetTimer();

    constructor() {
        // Angular 19 Effect: Reacciona automáticamente al estado de la sesión
        effect(() => {
            const isAuth = this.authService.isAuthenticated();
            if (isAuth) {
                this.startMonitoring();
            } else {
                this.stopMonitoring();
            }
        });
    }

    /**
     * Enciende el sensor de movimiento.
     * Se ejecuta fuera de la zona de Angular para máximo rendimiento (no satura el CPU).
     */
    private startMonitoring(): void {
        this.stopMonitoring();

        this.ngZone.runOutsideAngular(() => {
            this.events.forEach(event => {
                window.addEventListener(event, this.resetListener, { passive: true });
            });
            this.resetTimer();
        });
    }

    /**
     * Apaga el sensor cuando el usuario sale de sesión.
     */
    private stopMonitoring(): void {
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }

        this.events.forEach(event => {
            window.removeEventListener(event, this.resetListener);
        });
    }

    /**
     * Reinicia el reloj de arena de 15 minutos.
     */
    private resetTimer(): void {
        if (this.timerId) {
            clearTimeout(this.timerId);
        }

        this.timerId = setTimeout(() => {
            // Al agotarse los 15 minutos, volvemos a la zona de Angular y cerramos la sesión
            this.ngZone.run(() => {
                console.warn('Sesión cerrada automáticamente por inactividad (15 minutos).');
                this.authService.logout();
            });
        }, this.INACTIVITY_LIMIT_MS);
    }
}
