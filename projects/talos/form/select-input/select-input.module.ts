import { NgModule } from '@angular/core';
import { SelectInputComponent } from './select-input/select-input.component';
import { OptionComponent } from './option/option.component';
import { OptionGroupComponent } from './option-group/option-group.component';

/**
 * Convenience NgModule wrapping the standalone select input components.
 * 
 * Allows developers who prefer `SelectInputModule` to import it into standalone components
 * or legacy NgModule-based applications.
 */
@NgModule({
  imports: [SelectInputComponent, OptionComponent, OptionGroupComponent],
  exports: [SelectInputComponent, OptionComponent, OptionGroupComponent]
})
export class SelectInputModule { }
