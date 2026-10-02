import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UiStateService } from './core/services/ui-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public uiState = inject(UiStateService);
  // Exponemos el signal directamente al template para facilitar la lectura
  isBlurred = this.uiState.isBlurred;
}
