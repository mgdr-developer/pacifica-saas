import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogRef } from '@angular/cdk/dialog';
import { LucideAngularModule, Camera, UploadCloud, X, Check, AlertCircle, RefreshCw } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-photo-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './change-photo-modal.component.html'
})
export class ChangePhotoModalComponent {
  dialogRef = inject(DialogRef<boolean>);
  authService = inject(AuthService);

  readonly CameraIcon = Camera;
  readonly UploadCloudIcon = UploadCloud;
  readonly XIcon = X;
  readonly CheckIcon = Check;
  readonly AlertCircleIcon = AlertCircle;
  readonly RefreshCwIcon = RefreshCw;

  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  isUploading = signal(false);
  errorMessage = signal<string | null>(null);
  isDragging = signal(false);

  // Obtiene la foto actual del usuario o avatar generado
  currentAvatarUrl(): string {
    return this.authService.getAvatarUrl();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  private handleFile(file: File): void {
    this.errorMessage.set(null);

    // Validación de tipo
    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Por favor selecciona una imagen válida (JPG, PNG o WebP).');
      return;
    }

    // Validación de tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage.set('La imagen excede el límite permitido de 5MB.');
      return;
    }

    this.selectedFile.set(file);

    // Generar previsualización en vivo
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  resetSelection(): void {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    this.errorMessage.set(null);
  }

  savePhoto(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.isUploading.set(true);
    this.errorMessage.set(null);

    this.authService.uploadProfileAvatar(file).subscribe({
      next: () => {
        this.isUploading.set(false);
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isUploading.set(false);
        this.errorMessage.set(err?.error?.message || 'Ocurrió un error al subir la foto de perfil. Inténtalo de nuevo.');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
