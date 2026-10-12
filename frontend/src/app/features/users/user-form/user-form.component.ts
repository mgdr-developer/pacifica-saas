import { Component, EventEmitter, Input, Output, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, X, Save, User as UserIcon, Camera, Mail, Phone, Lock, Shield, Loader2 } from 'lucide-angular';
import { trigger, style, transition, animate } from '@angular/animations';
import { UserService } from '../../../core/services/user.service';
import { Role, User, UserCreateRequest, UserUpdateRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class UserFormComponent implements OnInit {
  @Input() user: User | null = null;
  @Output() closeDrawer = new EventEmitter<void>();
  @Output() save = new EventEmitter<UserCreateRequest | UserUpdateRequest>();

  private fb = inject(FormBuilder);
  userService = inject(UserService);

  // Iconos
  readonly XIcon = X;
  readonly SaveIcon = Save;
  readonly UserIcon = UserIcon;
  readonly CameraIcon = Camera;
  readonly MailIcon = Mail;
  readonly PhoneIcon = Phone;
  readonly LockIcon = Lock;
  readonly ShieldIcon = Shield;
  readonly LoaderIcon = Loader2;

  // Estado reactivo con Signals
  roles = signal<Role[]>([]);
  avatarPreview = signal<string | null>(null);
  isUploadingAvatar = signal<boolean>(false);

  // Formulario Reactivo
  userForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    paternalLastName: ['', [Validators.required, Validators.minLength(2)]],
    maternalLastName: [''],
    phone: [''],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    roleId: [null as number | null, [Validators.required]],
    avatarUrl: ['']
  });

  ngOnInit(): void {
    // 1. Cargar la lista de roles desde la base de datos
    this.userService.getRoles().subscribe({
      next: (data) => this.roles.set(data),
      error: (err) => console.error('Error al cargar roles:', err)
    });

    // 2. Si estamos en modo edición, precargar los valores del usuario
    if (this.user) {
      this.userForm.patchValue({
        firstName: this.user.firstName,
        paternalLastName: this.user.paternalLastName,
        maternalLastName: this.user.maternalLastName || '',
        phone: this.user.phone || '',
        email: this.user.email,
        roleId: this.user.role.id,
        avatarUrl: this.user.avatarUrl || ''
      });
      // El correo no se puede cambiar en edición para evitar conflictos
      this.userForm.get('email')?.disable();
      this.avatarPreview.set(this.userService.getAvatarUrl(this.user));
    } else {
      // En modo creación, la contraseña es obligatoria
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  // Subir avatar desde el formulario y previsualizarlo de inmediato
  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // 1. Previsualización instantánea local en el navegador
      const localPreviewUrl = URL.createObjectURL(file);
      this.avatarPreview.set(localPreviewUrl);

      // 2. Subida asíncrona al backend
      this.isUploadingAvatar.set(true);
      this.userService.uploadAvatar(file).subscribe({
        next: (res) => {
          this.userForm.patchValue({ avatarUrl: res.avatarUrl });
          this.isUploadingAvatar.set(false);
        },
        error: (err) => {
          console.error('Error al subir avatar:', err);
          this.isUploadingAvatar.set(false);
        }
      });
    }
  }


  // Enviar el formulario
  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    // getRawValue() incluye campos deshabilitados como 'email' en modo edición si hiciera falta
    this.save.emit(this.userForm.getRawValue() as any);
  }
}
