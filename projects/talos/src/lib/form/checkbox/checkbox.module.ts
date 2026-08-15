import { NgModule } from '@angular/core';
import { TalosCheckboxDirective } from './checkbox.directive';
import { TalosCheckboxGroupDirective } from './checkbox-group.directive';
import { TalosCheckboxGroupComponent } from './checkbox-group.component';
import { TalosCheckboxParentDirective } from './checkbox-parent.directive';
import { TalosCheckboxComponent } from './checkbox.component';

/**
 * Convenience NgModule wrapping standalone checkbox directives and components.
 * 
 * Allows developers who prefer `TalosCheckboxModule` to import all checkbox utilities in one go.
 */
@NgModule({
  imports: [
    TalosCheckboxDirective,
    TalosCheckboxGroupDirective,
    TalosCheckboxGroupComponent,
    TalosCheckboxParentDirective,
    TalosCheckboxComponent
  ],
  exports: [
    TalosCheckboxDirective,
    TalosCheckboxGroupDirective,
    TalosCheckboxGroupComponent,
    TalosCheckboxParentDirective,
    TalosCheckboxComponent
  ]
})
export class TalosCheckboxModule { }
