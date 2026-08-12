import { NgModule } from '@angular/core';
import { ForgeCheckboxDirective } from './checkbox.directive';
import { ForgeCheckboxGroupDirective } from './checkbox-group.directive';
import { ForgeCheckboxGroupComponent } from './checkbox-group.component';
import { ForgeCheckboxParentDirective } from './checkbox-parent.directive';
import { ForgeCheckboxComponent } from './checkbox.component';

/**
 * Convenience NgModule wrapping standalone checkbox directives and components.
 * 
 * Allows developers who prefer `ForgeCheckboxModule` to import all checkbox utilities in one go.
 */
@NgModule({
  imports: [
    ForgeCheckboxDirective,
    ForgeCheckboxGroupDirective,
    ForgeCheckboxGroupComponent,
    ForgeCheckboxParentDirective,
    ForgeCheckboxComponent
  ],
  exports: [
    ForgeCheckboxDirective,
    ForgeCheckboxGroupDirective,
    ForgeCheckboxGroupComponent,
    ForgeCheckboxParentDirective,
    ForgeCheckboxComponent
  ]
})
export class ForgeCheckboxModule {}
