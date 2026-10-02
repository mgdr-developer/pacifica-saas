import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, X, LogIn, Mail, Lock, AlertCircle } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Iconos
  readonly XIcon = X;
  readonly LogInIcon = LogIn;
  readonly MailIcon = Mail;
  readonly LockIcon = Lock;
  readonly AlertIcon = AlertCircle;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  isLoading = false;
  errorMessage = '';

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: () => {
        this.isLoading = false;
        this.close.emit(); // Cerramos el modal
        this.router.navigate(['/dashboard']); // Redirigimos al panel privado
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Credenciales inválidas. Por favor, intenta de nuevo.';
        console.error('Error en login', err);
      }
    });
  }

  closeModal() {
    this.close.emit();
  }
}