import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiStateService {
  /**
   * Signal global para manejar el efecto de "Glassmorphism" (difuminado y oscurecimiento).
   * Se activa cuando se abren modales, side-drawers o menús móviles.
   */
  readonly isBlurred = signal<boolean>(false);

  /**
   * Activa explícitamente el estado de difuminado.
   */
  enableBlur(): void {
    this.isBlurred.set(true);
  }

  /**
   * Desactiva explícitamente el estado de difuminado.
   */
  disableBlur(): void {
    this.isBlurred.set(false);
  }

  /**
   * Alterna el estado actual del difuminado.
   */
  toggleBlur(): void {
    this.isBlurred.update(state => !state);
  }
}
