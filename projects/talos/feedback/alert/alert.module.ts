import { NgModule } from '@angular/core';
import { TalosAlertComponent } from './alert/alert.component';
import { TalosAlertContainerComponent } from './alert-container/alert-container.component';
import {
  TalosAlertTitleDirective,
  TalosAlertDescriptionDirective,
  TalosAlertActionsDirective,
  TalosAlertIconDirective
} from './alert.directives';

/**
 * Convenience NgModule wrapping standalone alert components and directives.
 */
@NgModule({
  imports: [
    TalosAlertComponent,
    TalosAlertContainerComponent,
    TalosAlertTitleDirective,
    TalosAlertDescriptionDirective,
    TalosAlertActionsDirective,
    TalosAlertIconDirective
  ],
  exports: [
    TalosAlertComponent,
    TalosAlertContainerComponent,
    TalosAlertTitleDirective,
    TalosAlertDescriptionDirective,
    TalosAlertActionsDirective,
    TalosAlertIconDirective
  ]
})
export class TalosAlertModule {}
