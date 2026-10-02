import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstituteService } from '../../../core/services/institute.service';
import { UiStateService } from '../../../core/services/ui-state.service';
import { Institute } from '../../../core/models/institute.model';
import { LucideAngularModule, Edit2, Trash2, Plus, Phone, Building2 } from 'lucide-angular';

@Component({
  selector: 'app-institute-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './institute-list.component.html',
  styleUrls: ['./institute-list.component.css']
})
export class InstituteListComponent implements OnInit {
  institutes = signal<Institute[]>([]);

  private instituteService = inject(InstituteService);
  private uiState = inject(UiStateService);

  // Iconos
  readonly EditIcon = Edit2;
  readonly TrashIcon = Trash2;
  readonly PlusIcon = Plus;
  readonly PhoneIcon = Phone;
  readonly BuildingIcon = Building2;

  // Signal temporal para controlar side-drawer (próximo paso)
  isDrawerOpen = signal(false);

  ngOnInit(): void {
    this.loadInstitutes();
  }

  loadInstitutes() {
    this.instituteService.getInstitutes().subscribe({
      next: (data) => this.institutes.set(data),
      error: (err) => console.error('Error cargando institutos', err)
    });
  }

  openAddDrawer() {
    this.isDrawerOpen.set(true);
    this.uiState.enableBlur();
    console.log("Abriendo side-drawer para nuevo instituto");
  }

  openEditDrawer(institute: Institute) {
    this.isDrawerOpen.set(true);
    this.uiState.enableBlur();
    console.log("Abriendo side-drawer para editar", institute);
  }

  confirmDelete(institute: Institute) {
    this.uiState.enableBlur();
    // Modal de confirmación nativo por ahora
    if(confirm(`¿Estás seguro de eliminar el instituto: ${institute.name}?`)) {
      console.log("Eliminando...", institute);
      this.uiState.disableBlur();
    } else {
      this.uiState.disableBlur();
    }
  }
}