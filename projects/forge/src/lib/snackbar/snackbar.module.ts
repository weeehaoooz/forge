import { NgModule } from '@angular/core';
import { ForgeSnackbarComponent } from './snackbar.component';
import { ForgeSnackbarContainerComponent } from './snackbar-container.component';

/**
 * Convenience NgModule wrapping standalone snackbar components.
 * 
 * Allows developers who prefer `ForgeSnackbarModule` to import all snackbar elements in one go.
 */
@NgModule({
  imports: [
    ForgeSnackbarComponent,
    ForgeSnackbarContainerComponent
  ],
  exports: [
    ForgeSnackbarComponent,
    ForgeSnackbarContainerComponent
  ]
})
export class ForgeSnackbarModule {}
