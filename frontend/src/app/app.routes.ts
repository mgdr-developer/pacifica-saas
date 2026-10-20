import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './shared/layouts/public-layout/public-layout.component';
import { DashboardLayoutComponent } from './shared/layouts/dashboard-layout/dashboard-layout.component';
import { authGuard } from './core/guards/auth.guard'; // <-- 1. GUARDIA DEL PORTÓN
import { permissionGuard } from './core/guards/permission.guard'; // <-- 2. GUARDIA DE OFICINA

export const routes: Routes = [
  // 1. PUBLIC LAYOUT (Landing Page de libre acceso)
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
    ]
  },

  // 2. DASHBOARD LAYOUT (Privado: Requiere Gafete Activo)
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard], // <-- PORTÓN BLINDADO: Nadie entra sin sesión activa
    children: [
      {
        path: 'institutes',
        loadComponent: () => import('./features/institutes/institute-list/institute-list.component').then(m => m.InstituteListComponent)
      },
      {
        path: 'users',
        canActivate: [permissionGuard('users:manage')], // <-- OFICINA BLINDADA: Solo quien tenga la llave 'users:manage'
        loadComponent: () => import('./features/users/user-list/user-list.component').then(m => m.UserListComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./features/services/service-list/service-list.component').then(m => m.ServiceListComponent)
      },
      // Redirección por defecto adentro del dashboard
      { path: '', redirectTo: 'institutes', pathMatch: 'full' }
    ]
  },

  // Ruta por defecto (Fallback a la Landing)
  { path: '**', redirectTo: '' }
];
