import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstituteService } from '../../../core/services/institute.service';
import { UiStateService } from '../../../core/services/ui-state.service';
import { Institute } from '../../../core/models/institute.model';
import { LucideAngularModule, Edit2, Trash2, Plus, Phone, Building2 } from 'lucide-angular';
import { InstituteFormComponent } from '../institute-form/institute-form.component';

@Component({
  selector: 'app-institute-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, InstituteFormComponent],
  templateUrl: './institute-list.component.html',
  styleUrls: ['./institute-list.component.css']
})
export class InstituteListComponent implements OnInit {
  institutes = signal<Institute[]>([]);
  selectedInstitute = signal<Institute | null>(null);
  isDrawerOpen = signal(false);

  private instituteService = inject(InstituteService);
  private uiState = inject(UiStateService);

  readonly EditIcon = Edit2;
  readonly TrashIcon = Trash2;
  readonly PlusIcon = Plus;
  readonly PhoneIcon = Phone;
  readonly BuildingIcon = Building2;

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
    this.selectedInstitute.set(null);
    this.isDrawerOpen.set(true);
    this.uiState.enableBlur();
  }

  openEditDrawer(institute: Institute) {
    this.selectedInstitute.set(institute);
    this.isDrawerOpen.set(true);
    this.uiState.enableBlur();
  }

  closeDrawer() {
    this.isDrawerOpen.set(false);
    this.uiState.disableBlur();
  }

  saveInstitute(data: Partial<Institute>) {
    const current = this.selectedInstitute();
    if (current) {
      this.instituteService.updateInstitute(current.id, data).subscribe({
        next: () => {
          this.loadInstitutes();
          this.closeDrawer();
        },
        error: (err) => console.error('Error actualizando', err)
      });
    } else {
      this.instituteService.createInstitute(data).subscribe({
        next: () => {
          this.loadInstitutes();
          this.closeDrawer();
        },
        error: (err) => console.error('Error guardando', err)
      });
    }
  }

  confirmDelete(institute: Institute) {
    this.uiState.enableBlur();
    if(confirm(`¿Estás seguro de eliminar el instituto: ${institute.name}? Esta acción no se puede deshacer.`)) {
      this.instituteService.deleteInstitute(institute.id).subscribe({
        next: () => {
          this.loadInstitutes();
          this.uiState.disableBlur();
        },
        error: (err) => {
          console.error('Error eliminando', err);
          this.uiState.disableBlur();
        }
      });
    } else {
      this.uiState.disableBlur();
    }
  }
}