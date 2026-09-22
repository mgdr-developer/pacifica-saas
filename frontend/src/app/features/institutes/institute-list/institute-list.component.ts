import { Component, inject, OnInit, signal } from '@angular/core'; // <-- Importar signal
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InstituteService } from '../../../core/services/institute.service';
import { AuthService } from '../../../core/services/auth.service';
import { Institute } from '../../../core/models/institute.model';

@Component({
  selector: 'app-institute-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './institute-list.component.html',
  styleUrls: ['./institute-list.component.css']
})
export class InstituteListComponent implements OnInit {
  // Declaramos el Signal con un valor inicial de arreglo vacío
  institutes = signal<Institute[]>([]);

  private instituteService = inject(InstituteService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.instituteService.getInstitutes().subscribe({
      // Utilizamos .set() para inyectar los datos en el Signal
      next: (data) => this.institutes.set(data),
      error: (err) => console.error('Error cargando institutos', err)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}