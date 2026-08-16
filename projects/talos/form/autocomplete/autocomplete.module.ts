import { NgModule } from '@angular/core';
import { TalosAutocompleteComponent } from './autocomplete.component';

/**
 * Convenience NgModule wrapping the standalone TalosAutocompleteComponent.
 */
@NgModule({
  imports: [TalosAutocompleteComponent],
  exports: [TalosAutocompleteComponent]
})
export class TalosAutocompleteModule { }
