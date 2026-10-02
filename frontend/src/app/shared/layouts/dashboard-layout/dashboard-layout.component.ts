import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Globe, LogOut, Menu, X, LayoutDashboard, Building2, Users } from 'lucide-angular';
import { UiStateService } from '../../../core/services/ui-state.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './dashboard-layout.component.html'
})
export class DashboardLayoutComponent {
  uiState = inject(UiStateService);
  
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

  logout() {
    this.uiState.enableBlur();
    // Aquí integraremos el modal de confirmación de cierre de sesión
  }
}
