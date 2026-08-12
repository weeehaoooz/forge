import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'buttons', pathMatch: 'full' },
  {
    path: 'buttons',
    loadComponent: () => import('./pages/buttons/buttons-page').then(m => m.ButtonsPage)
  },
  {
    path: 'inputs',
    loadComponent: () => import('./pages/inputs/inputs-page').then(m => m.InputsPage)
  },
  {
    path: 'select',
    loadComponent: () => import('./pages/select/select-page').then(m => m.SelectPage)
  },
  {
    path: 'date-pickers',
    loadComponent: () => import('./pages/date-pickers/date-pickers-page').then(m => m.DatePickersPage)
  },
  {
    path: 'checkboxes',
    loadComponent: () => import('./pages/checkboxes/checkboxes-page').then(m => m.CheckboxesPage)
  },
  {
    path: 'radio',
    loadComponent: () => import('./pages/radio/radio-page').then(m => m.RadioPage)
  },
  {
    path: 'layout',
    loadComponent: () => import('./pages/layout/layout-page').then(m => m.LayoutPage)
  }
];
