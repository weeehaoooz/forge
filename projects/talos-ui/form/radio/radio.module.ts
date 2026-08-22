import { NgModule } from '@angular/core';
import { TalosRadioDirective } from './radio/radio.directive';
import { TalosRadioGroupComponent } from './radio-group/radio-group.component';
import { TalosRadioComponent } from './radio/radio.component';

/**
 * Convenience NgModule wrapping the standalone radio components and directive.
 * 
 * Allows developers who prefer `TalosRadioModule` to import it into standalone components
 * or legacy NgModule-based applications.
 */
@NgModule({
  imports: [TalosRadioDirective, TalosRadioGroupComponent, TalosRadioComponent],
  exports: [TalosRadioDirective, TalosRadioGroupComponent, TalosRadioComponent]
})
export class TalosRadioModule { }
