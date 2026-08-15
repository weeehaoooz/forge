import { NgModule } from '@angular/core';
import { TalosSlideToggleDirective } from './slide-toggle.directive';
import { TalosSlideToggleComponent } from './slide-toggle.component';

/**
 * Convenience NgModule wrapping standalone slide-toggle directive and component.
 */
@NgModule({
  imports: [
    TalosSlideToggleDirective,
    TalosSlideToggleComponent
  ],
  exports: [
    TalosSlideToggleDirective,
    TalosSlideToggleComponent
  ]
})
export class TalosSlideToggleModule { }
