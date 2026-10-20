import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceCatalogService } from '../../../core/services/service.service';
import { UiStateService } from '../../../core/services/ui-state.service';
import { ServiceItem } from '../../../core/models/service.model';
import { LucideAngularModule, Edit2, Trash2, Plus, Layers, Search, Sparkles, Tag } from 'lucide-angular';
import { ServiceFormComponent } from '../service-form/service-form.component';
import { ModalService } from '../../../core/services/modal.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ServiceFormComponent],
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  services = signal<ServiceItem[]>([]);
  selectedService = signal<ServiceItem | null>(null);
  isDrawerOpen = signal(false);
  searchTerm = signal('');

  private serviceCatalog = inject(ServiceCatalogService);
  private uiState = inject(UiStateService);
  private modalService = inject(ModalService);
  public authService = inject(AuthService);

  readonly EditIcon = Edit2;
  readonly TrashIcon = Trash2;
  readonly PlusIcon = Plus;
  readonly LayersIcon = Layers;
  readonly SearchIcon = Search;
  readonly SparklesIcon = Sparkles;
  readonly TagIcon = Tag;

  filteredServices = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const list = this.services();
    if (!term) return list;
    return list.filter(s => s.name.toLowerCase().includes(term));
  });

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices() {
    this.serviceCatalog.getServices().subscribe({
      next: (data) => this.services.set(data),
      error: (err) => console.error('Error cargando servicios:', err)
    });
  }

  openAddDrawer() {
    this.selectedService.set(null);
    this.isDrawerOpen.set(true);
    this.uiState.enableBlur();
  }

  openEditDrawer(service: ServiceItem) {
    this.selectedService.set(service);
    this.isDrawerOpen.set(true);
    this.uiState.enableBlur();
  }

  closeDrawer() {
    this.isDrawerOpen.set(false);
    this.uiState.disableBlur();
  }

  saveService(data: Partial<ServiceItem>) {
    const current = this.selectedService();
    if (current) {
      this.serviceCatalog.updateService(current.id, data).subscribe({
        next: () => {
          this.loadServices();
          this.closeDrawer();
        },
        error: (err) => console.error('Error actualizando servicio:', err)
      });
    } else {
      this.serviceCatalog.createService(data).subscribe({
        next: () => {
          this.loadServices();
          this.closeDrawer();
        },
        error: (err) => console.error('Error creando servicio:', err)
      });
    }
  }

  async confirmDelete(service: ServiceItem) {
    const confirmed = await this.modalService.open<boolean>(ConfirmModalComponent, {
      data: {
        title: 'Eliminar Servicio',
        message: `¿Estás seguro de que deseas eliminar permanentemente el servicio "${service.name}" del catálogo? Esta acción no se puede deshacer.`,
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar',
        type: 'danger'
      }
    });

    if (confirmed) {
      this.serviceCatalog.deleteService(service.id).subscribe({
        next: () => this.loadServices(),
        error: (err) => console.error('Error eliminando servicio:', err)
      });
    }
  }
}
