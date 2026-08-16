import { NgModule } from '@angular/core';
import { TalosDialogHeaderComponent } from './dialog-header/dialog-header.component';
import { TalosDialogContentComponent } from './dialog-content/dialog-content.component';
import { TalosDialogFooterComponent } from './dialog-footer/dialog-footer.component';
import { TalosConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import {
  TalosDialogTitleDirective,
  TalosDialogDescriptionDirective,
  TalosDialogCloseDirective
} from './dialog.directives';

const DIALOG_COMPONENTS = [
  TalosDialogHeaderComponent,
  TalosDialogContentComponent,
  TalosDialogFooterComponent,
  TalosConfirmDialogComponent,
  TalosDialogTitleDirective,
  TalosDialogDescriptionDirective,
  TalosDialogCloseDirective
];

@NgModule({
  imports: [...DIALOG_COMPONENTS],
  exports: [...DIALOG_COMPONENTS]
})
export class TalosDialogModule {}
