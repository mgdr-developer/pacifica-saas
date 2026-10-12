import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LucideAngularModule, Globe, LogOut, Menu, X, LayoutDashboard, Building2, Users } from 'lucide-angular';
import { UiStateService } from '../../../core/services/ui-state.service';
import { ModalService } from '../../../core/services/modal.service';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './dashboard-layout.component.html'
})
export class DashboardLayoutComponent {
  uiState = inject(UiStateService);
  modalService = inject(ModalService);
  authService = inject(AuthService);
  router = inject(Router);

  // Iconos
  readonly GlobeIcon = Globe;
  readonly LogOutIcon = LogOut;
  readonly MenuIcon = Menu;
  readonly XIcon = X;
  readonly DashboardIcon = LayoutDashboard;
  readonly BuildingIcon = Building2;
  readonly UsersIcon = Users;

  // Signal para el menú móvil
  isMobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
    if (this.isMobileMenuOpen()) {
      this.uiState.enableBlur();
    } else {
      this.uiState.disableBlur();
    }
  }

  async logout() {
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
      // 1. Si el menú móvil estaba abierto, lo cerramos
      this.isMobileMenuOpen.set(false);
      // 2. Destruimos el gafete (token) en localStorage
      this.authService.logout();
      // 3. Redirigimos a la página principal pública
      this.router.navigate(['/']);
    }
  }

}
