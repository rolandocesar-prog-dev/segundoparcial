import { Routes } from '@angular/router';
import { UiComponent } from './ui/ui';

export const routes: Routes = [
  { path: 'ui', component: UiComponent },
  { path: '', pathMatch: 'full', redirectTo: '' }, // ← Sin redirección circular
  { path: '**', redirectTo: '' }
];