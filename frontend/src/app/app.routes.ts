import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './shared/layouts/public-layout/public-layout.component';
import { DashboardLayoutComponent } from './shared/layouts/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
  // 1. PUBLIC LAYOUT (Landing Page)
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      // Cargamos la Landing Page
      { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
    ]
  },
  
  // 2. DASHBOARD LAYOUT (Privado)
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    // Aquí podrías agregar un AuthGuard más adelante: canActivate: [AuthGuard]
    children: [
      {
        path: 'institutes',
        // Cargamos la lista de institutos que construimos antes
        loadComponent: () => import('./features/institutes/institute-list/institute-list.component').then(m => m.InstituteListComponent)
      },
      // Redirección por defecto del dashboard
      { path: '', redirectTo: 'institutes', pathMatch: 'full' }
    ]
  },
  
  // Ruta por defecto (Fallback)
  { path: '**', redirectTo: '' }
];