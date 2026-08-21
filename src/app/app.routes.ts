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
    path: 'autocomplete',
    loadComponent: () => import('./pages/autocomplete/autocomplete-page').then(m => m.AutocompletePage)
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
    path: 'slide-toggle',
    loadComponent: () => import('./pages/slide-toggle/slide-toggle-page').then(m => m.SlideTogglePage)
  },
  {
    path: 'layout',
    loadComponent: () => import('./pages/layout/layout-page').then(m => m.LayoutPage)
  },
  {
    path: 'snackbar',
    loadComponent: () => import('./pages/snackbar/snackbar-page').then(m => m.SnackbarPage)
  },
  {
    path: 'alert',
    loadComponent: () => import('./pages/alert/alert-page').then(m => m.AlertPage)
  },
  {
    path: 'heatmap',
    loadComponent: () => import('./pages/heatmap/heatmap-page').then(m => m.HeatmapPage)
  },
  {
    path: 'category-bar',
    loadComponent: () => import('./pages/category-bar/category-bar-page').then(m => m.CategoryBarPage)
  },
  {
    path: 'range-input',
    loadComponent: () => import('./pages/range-input/range-input-page').then(m => m.RangeInputPage)
  },
  {
    path: 'status-tag',
    loadComponent: () => import('./pages/status-tag/status-tag-page').then(m => m.StatusTagPage)
  },
  {
    path: 'badges',
    loadComponent: () => import('./pages/badge/badge-page').then(m => m.BadgePage)
  },
  {
    path: 'chips',
    loadComponent: () => import('./pages/chips/chips-page').then(m => m.ChipsPage)
  },
  {
    path: 'cards',
    loadComponent: () => import('./pages/cards/cards-page').then(m => m.CardsPage)
  },
  {
    path: 'dialog',
    loadComponent: () => import('./pages/dialog/dialog-page').then(m => m.DialogPage)
  },
  {
    path: 'drop-zone',
    loadComponent: () => import('./pages/drop-zone/drop-zone-page').then(m => m.DropZonePage)
  }
];


