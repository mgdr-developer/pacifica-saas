import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Globe, LogIn } from 'lucide-angular';
import { UiStateService } from '../../../core/services/ui-state.service';
import { LoginComponent } from '../../../features/auth/login/login.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule, LoginComponent],
  templateUrl: './public-layout.component.html'
})
export class PublicLayoutComponent {
  uiState = inject(UiStateService);
  
  // Iconos
  readonly GlobeIcon = Globe;
  readonly LogInIcon = LogIn;

  // Signal para controlar la visibilidad del modal de Login
  isLoginModalOpen = signal(false);

  openLoginModal() {
    this.isLoginModalOpen.set(true);
    this.uiState.enableBlur();
  }

  closeLoginModal() {
    this.isLoginModalOpen.set(false);
    this.uiState.disableBlur();
  }
}

