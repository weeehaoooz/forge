import { NgModule } from '@angular/core';
import { TalosSnackbarComponent } from './snackbar.component';
import { TalosSnackbarContainerComponent } from './snackbar-container.component';

/**
 * Convenience NgModule wrapping standalone snackbar components.
 * 
 * Allows developers who prefer `TalosSnackbarModule` to import all snackbar elements in one go.
 */
@NgModule({
  imports: [
    TalosSnackbarComponent,
    TalosSnackbarContainerComponent
  ],
  exports: [
    TalosSnackbarComponent,
    TalosSnackbarContainerComponent
  ]
})
export class TalosSnackbarModule { }
