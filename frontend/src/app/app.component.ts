import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InstituteListComponent } from './features/institutes/institute-list/institute-list.component';
import { LoginComponent } from './features/auth/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InstituteListComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
