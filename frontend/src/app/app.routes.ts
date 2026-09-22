import { Routes } from '@angular/router';
import { InstituteListComponent } from './features/institutes/institute-list/institute-list.component';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'institutes',
        component: InstituteListComponent,
        canActivate: [authGuard] // <-- ¡El guardia entra en acción aquí!
    },
    // Si entra a la raíz, mándalo al login
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];