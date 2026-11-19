import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { LucideAngularModule, Camera, ShieldCheck, Sun, Moon, Monitor, LogOut, Check } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { ThemeService, ThemeMode } from '../../../core/services/theme.service';
import { ModalService } from '../../../core/services/modal.service';
import { ChangePhotoModalComponent } from '../change-photo-modal/change-photo-modal.component';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './user-dropdown.component.html'
})
export class UserDropdownComponent {
  authService = inject(AuthService);
  userService = inject(UserService);
  themeService = inject(ThemeService);
  modalService = inject(ModalService);
  translocoService = inject(TranslocoService);
  router = inject(Router);
  elementRef = inject(ElementRef);

  // Iconos
  readonly CameraIcon = Camera;
  readonly ShieldCheckIcon = ShieldCheck;
  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;
  readonly MonitorIcon = Monitor;
  readonly LogOutIcon = LogOut;
  readonly CheckIcon = Check;

  // Estado del menú desplegable
  isOpen = signal(false);

  // Idioma actual
  currentLang = signal<string>(this.getInitialLang());

  constructor() {
    const active = this.translocoService.getActiveLang();
    if (active) {
      this.currentLang.set(active);
    }
  }

  toggleDropdown(): void {
    this.isOpen.update(v => !v);
  }

  closeDropdown(): void {
    this.isOpen.set(false);
  }

  // Cierre al hacer clic fuera del componente
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  // Cierre al presionar Escape
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeDropdown();
  }

  // Nombre formateado para mostrar
  get displayName(): string {
    const u = this.authService.currentUser();
    if (!u) return 'Usuario';
    const last = u.paternalLastName ? ` ${u.paternalLastName}` : '';
    return `${u.firstName || ''}${last}`.trim() || u.email;
  }

  // Rol comercial traducido
  get roleLabel(): string {
    return this.userService.getRoleLabel(this.authService.currentRole() || undefined);
  }

  // Clases del badge del rol
  get roleBadgeClass(): string {
    return this.userService.getRoleBadgeClasses(this.authService.currentRole() || undefined);
  }

  // Gestión de Idioma
  private getInitialLang(): string {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('pacifica_lang');
      if (saved) return saved;
    }
    return this.translocoService.getActiveLang() || 'es';
  }

  setLanguage(lang: 'es' | 'en'): void {
    this.translocoService.setActiveLang(lang);
    this.currentLang.set(lang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('pacifica_lang', lang);
    }
  }

  // Gestión de Tema
  setTheme(mode: ThemeMode): void {
    this.themeService.setTheme(mode);
  }

  // Apertura de Modales
  openChangePhotoModal(): void {
    this.closeDropdown();
    this.modalService.open(ChangePhotoModalComponent);
  }

  openChangePasswordModal(): void {
    this.closeDropdown();
    this.modalService.open(ChangePasswordModalComponent);
  }

  async logout(): Promise<void> {
    this.closeDropdown();

    const confirmed = await this.modalService.open<boolean>(ConfirmModalComponent, {
      data: {
        title: 'Cerrar Sesión',
        message: '¿Estás seguro de que deseas salir? Tendrás que volver a iniciar sesión para acceder a tu panel.',
        confirmText: 'Cerrar sesión',
        cancelText: 'Cancelar',
        type: 'danger'
      }
    });

    if (confirmed) {
      this.authService.logout();
      this.router.navigate(['/']);
    }
  }
}
