import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, MoreVertical, Edit2, Trash2, Camera } from 'lucide-angular';
import { UserService } from '../../../core/services/user.service';
import { UiStateService } from '../../../core/services/ui-state.service';
import { ModalService } from '../../../core/services/modal.service';
import { User } from '../../../core/models/user.model';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, UserFormComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  userService = inject(UserService);
  uiState = inject(UiStateService);
  modalService = inject(ModalService);

  // Signals reactivos
  users = signal<User[]>([]);
  selectedUser = signal<User | null>(null);
  isDrawerOpen = signal(false);
  activeDropdownUserId = signal<string | null>(null);

  // Iconos de Lucide
  readonly PlusIcon = Plus;
  readonly MoreVerticalIcon = MoreVertical;
  readonly EditIcon = Edit2;
  readonly TrashIcon = Trash2;
  readonly CameraIcon = Camera;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => this.users.set(data),
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  // Alternar el menú flotante de 3 puntos
  toggleDropdown(userId: string, event: Event): void {
    event.stopPropagation();
    if (this.activeDropdownUserId() === userId) {
      this.activeDropdownUserId.set(null);
    } else {
      this.activeDropdownUserId.set(userId);
    }
  }

  closeDropdown(): void {
    this.activeDropdownUserId.set(null);
  }

  // Abrir el cajón para agregar
  openAddDrawer(): void {
    this.closeDropdown();
    this.selectedUser.set(null);
    this.isDrawerOpen.set(true);
    this.uiState.enableBlur();
  }

  // Abrir el cajón para editar
  openEditDrawer(user: User): void {
    this.closeDropdown();
    this.selectedUser.set(user);
    this.isDrawerOpen.set(true);
    this.uiState.enableBlur();
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
    this.uiState.disableBlur();
  }

  // Guardar o actualizar usuario
  saveUser(data: any): void {
    const current = this.selectedUser();
    if (current) {
      this.userService.updateUser(current.id, data).subscribe({
        next: () => {
          this.loadUsers();
          this.closeDrawer();
        },
        error: (err) => console.error('Error al actualizar usuario:', err)
      });
    } else {
      this.userService.createUser(data).subscribe({
        next: () => {
          this.loadUsers();
          this.closeDrawer();
        },
        error: (err) => console.error('Error al crear usuario:', err)
      });
    }
  }


  // Eliminar usuario con el Modal de Confirmación que ya construimos
  async confirmDelete(user: User): Promise<void> {
    this.closeDropdown();
    const confirmed = await this.modalService.open<boolean>(ConfirmModalComponent, {
      data: {
        title: 'Eliminar Usuario',
        message: `¿Estás seguro de que deseas eliminar permanentemente a "${user.firstName} ${user.paternalLastName}"? Esta acción revocará todos sus accesos.`,
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar',
        type: 'danger'
      }
    });

    if (confirmed) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Error al eliminar usuario:', err)
      });
    }
  }

  // Disparar el selector de archivos desde el menú de 3 puntos
  triggerFileInput(fileInput: HTMLInputElement): void {
    this.closeDropdown();
    fileInput.click();
  }

  // Subir la imagen seleccionada y refrescar la tarjeta
  onFileSelected(event: Event, user: User): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.userService.updateUserAvatar(user.id, file).subscribe({
        next: (updatedUser) => {
          // Actualizamos la lista con la nueva foto
          this.users.update(list => list.map(u => u.id === updatedUser.id ? updatedUser : u));
        },
        error: (err) => console.error('Error al subir avatar:', err)
      });
    }
  }
}
