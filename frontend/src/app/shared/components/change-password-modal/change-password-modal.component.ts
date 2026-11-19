import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { LucideAngularModule, ShieldCheck, Lock, Eye, EyeOff, X, Check, AlertCircle, RefreshCw } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './change-password-modal.component.html'
})
export class ChangePasswordModalComponent {
  dialogRef = inject(DialogRef<boolean>);
  authService = inject(AuthService);
  fb = inject(FormBuilder);

  readonly ShieldCheckIcon = ShieldCheck;
  readonly LockIcon = Lock;
  readonly EyeIcon = Eye;
  readonly EyeOffIcon = EyeOff;
  readonly XIcon = X;
  readonly CheckIcon = Check;
  readonly AlertCircleIcon = AlertCircle;
  readonly RefreshCwIcon = RefreshCw;

  // Visibilidad de contraseñas
  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/)
    ]],
    confirmPassword: ['', [Validators.required]]
  });

  // Requisitos dinámicos calculados reactivamente
  newPasswordValue = signal('');

  constructor() {
    this.form.get('newPassword')?.valueChanges.subscribe(val => {
      this.newPasswordValue.set(val || '');
    });
  }

  // Reglas individuales
  hasMinLength = computed(() => this.newPasswordValue().length >= 8);
  hasUppercase = computed(() => /[A-Z]/.test(this.newPasswordValue()));
  hasNumber = computed(() => /\d/.test(this.newPasswordValue()));
  hasSpecialChar = computed(() => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.newPasswordValue()));

  // Fortaleza calculada (0 a 4)
  strengthScore = computed(() => {
    let score = 0;
    if (this.hasMinLength()) score++;
    if (this.hasUppercase()) score++;
    if (this.hasNumber()) score++;
    if (this.hasSpecialChar()) score++;
    return score;
  });

  // Coincidencia de contraseñas
  passwordsMatch = computed(() => {
    const newPwd = this.newPasswordValue();
    const confirmPwd = this.form.get('confirmPassword')?.value;
    return !!confirmPwd && newPwd === confirmPwd;
  });

  toggleShowCurrent(): void {
    this.showCurrentPassword.update(v => !v);
  }

  toggleShowNew(): void {
    this.showNewPassword.update(v => !v);
  }

  toggleShowConfirm(): void {
    this.showConfirmPassword.update(v => !v);
  }

  onSubmit(): void {
    this.errorMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.form.getRawValue();

    if (newPassword !== confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden.');
      return;
    }

    if (this.strengthScore() < 4) {
      this.errorMessage.set('La nueva contraseña debe cumplir con todos los requisitos de seguridad.');
      return;
    }

    this.isSubmitting.set(true);

    this.authService.updatePassword(currentPassword!, newPassword!).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.successMessage.set(res.message || 'Contraseña actualizada exitosamente.');
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1200);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err?.error?.message || err?.error || 'No se pudo actualizar la contraseña. Verifica tu clave actual.');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
