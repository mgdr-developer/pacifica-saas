import { InjectionToken } from '@angular/core';

/**
 * Token de inyección estandarizado para proveer datos dinámicos al componente proyectado (el "cartucho").
 */
export const MODAL_DATA = new InjectionToken<unknown>('MODAL_DATA');

/**
 * Opciones de configuración agnósticas para el ModalService.
 */
export interface ModalOptions<D = unknown> {
  /**
   * Datos de entrada que se inyectarán en el componente hijo vía MODAL_DATA.
   */
  data?: D;

  /**
   * Ancho personalizado del modal (opcional). Por defecto es responsive (mobile-first).
   */
  width?: string;

  /**
   * Clases CSS adicionales para el contenedor del panel.
   */
  panelClass?: string | string[];
}

/**
 * Contrato de datos para el cartucho de confirmación estándar.
 */
export interface ConfirmModalData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}
