import { NgModule } from '@angular/core';
import { ForgeRadioDirective } from './radio.directive';
import { ForgeRadioGroupComponent } from './radio-group.component';
import { ForgeRadioComponent } from './radio.component';

/**
 * Convenience NgModule wrapping the standalone radio components and directive.
 * 
 * Allows developers who prefer `ForgeRadioModule` to import it into standalone components
 * or legacy NgModule-based applications.
 */
@NgModule({
  imports: [ForgeRadioDirective, ForgeRadioGroupComponent, ForgeRadioComponent],
  exports: [ForgeRadioDirective, ForgeRadioGroupComponent, ForgeRadioComponent]
})
export class ForgeRadioModule {}
