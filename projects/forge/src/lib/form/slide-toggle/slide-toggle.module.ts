import { NgModule } from '@angular/core';
import { ForgeSlideToggleDirective } from './slide-toggle.directive';
import { ForgeSlideToggleComponent } from './slide-toggle.component';

/**
 * Convenience NgModule wrapping standalone slide-toggle directive and component.
 */
@NgModule({
  imports: [
    ForgeSlideToggleDirective,
    ForgeSlideToggleComponent
  ],
  exports: [
    ForgeSlideToggleDirective,
    ForgeSlideToggleComponent
  ]
})
export class ForgeSlideToggleModule {}
