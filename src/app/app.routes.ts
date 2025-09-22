import { Routes } from '@angular/router';
import { UiComponent } from './ui/ui';

export const routes: Routes = [
  { path: 'ui', component: UiComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },  // ← Cambiado
  { path: 'home', redirectTo: '', pathMatch: 'full' },   // ← Agregado
  { path: '**', redirectTo: '' }
];