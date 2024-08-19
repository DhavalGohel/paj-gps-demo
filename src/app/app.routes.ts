import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then((m) => m.HomePage),
    canLoad: [AuthGuard]
  },
  {
    path: 'home/:id',
    loadComponent: () =>
      import('./home/home.page').then((m) => m.HomePage),
    canLoad: [AuthGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then( m => m.LoginPage),
    canActivate: [AutoLoginGuard]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
