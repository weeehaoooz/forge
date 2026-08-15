import { NgModule } from '@angular/core';
import { ForgeAutocompleteComponent } from './autocomplete.component';

/**
 * Convenience NgModule wrapping the standalone ForgeAutocompleteComponent.
 */
@NgModule({
  imports: [ForgeAutocompleteComponent],
  exports: [ForgeAutocompleteComponent]
})
export class ForgeAutocompleteModule {}
