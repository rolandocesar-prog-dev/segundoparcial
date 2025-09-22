import { Routes } from '@angular/router';
import { UiComponent } from './ui/ui';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'ui', component: UiComponent }
];