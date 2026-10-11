import { Injectable, Type, inject } from '@angular/core';
import { Dialog, DialogConfig } from '@angular/cdk/dialog';
import { firstValueFrom } from 'rxjs';
import { UiStateService } from './ui-state.service';
import { MODAL_DATA, ModalOptions } from '../models/modal.model';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private readonly dialog = inject(Dialog);
  private readonly uiState = inject(UiStateService);

  /**
   * Abre un modal agnóstico proyectando dinámicamente cualquier componente Standalone ("Cartucho").
   * Transforma el Observable de cierre en una Promesa tipada (<T>) para consumo con async/await.
   *
   * @template T Tipo del valor de retorno cuando el modal se cierra.
   * @template D Tipo de los datos de entrada pasados al modal.
   * @param component Componente Standalone que se va a proyectar.
   * @param options Configuración opcional con datos de entrada y dimensiones.
   * @returns Promesa que se resuelve con el resultado emitido por el modal.
   */
  async open<T = boolean, D = unknown>(
    component: Type<unknown>,
    options?: ModalOptions<D>
  ): Promise<T | undefined> {
    // 1. Atenuar la sala: activar el estado visual global (Dark Glassmorphism)
    this.uiState.isBlurred.set(true);

    // 2. Clases base Dark Glassmorphism & Mobile-First
    const defaultPanelClasses = [
      'bg-zinc-900',
      'border',
      'border-zinc-800',
      'rounded-2xl',
      'shadow-2xl',
      'shadow-black/50',
      'w-[95vw]',
      'md:max-w-lg',
      'max-h-[85vh]',
      'overflow-y-auto',
      'outline-none'
    ];

    const mergedPanelClass = options?.panelClass
      ? Array.isArray(options.panelClass)
        ? [...defaultPanelClasses, ...options.panelClass]
        : [...defaultPanelClasses, options.panelClass]
      : defaultPanelClasses;

    // 3. Configuración del CDK Dialog
    const config: DialogConfig<D, any> = {
      // Regla estricta: Decisión explícita (prohibido cerrar por backdrop o tecla ESC)
      disableClose: true,
      hasBackdrop: true,
      // Cortina invisible para que el UiStateService maneje el desenfoque sin duplicar capas
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: mergedPanelClass,
      width: options?.width,
      data: options?.data,
      providers: [
        { provide: MODAL_DATA, useValue: options?.data }
      ]
    };

    // 4. Inyección dinámica en el DOM
    const dialogRef = this.dialog.open<T, D>(component, config);

    try {
      // 5. Flujo lineal con Promesas: resolvemos la promesa cuando el modal se cierra
      const result = await firstValueFrom(dialogRef.closed);
      return result;
    } finally {
      // 6. Encender las luces: restaurar el estado visual global sin importar cómo terminó
      this.uiState.isBlurred.set(false);
    }
  }
}
