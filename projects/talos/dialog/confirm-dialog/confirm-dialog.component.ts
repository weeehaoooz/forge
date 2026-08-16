import { Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { DialogRef } from '@angular/cdk/dialog';
import {
  LucideAlertTriangle,
  LucideInfo,
  LucideCheckCircle2,
  LucideAlertCircle,
  LucideHelpCircle
} from '@lucide/angular';
import { TalosButtonDirective } from '@talos/components/button';
import { TALOS_DIALOG_DATA, TalosConfirmDialogOptions } from '../dialog.types';
import { TalosDialogHeaderComponent } from '../dialog-header/dialog-header.component';
import { TalosDialogContentComponent } from '../dialog-content/dialog-content.component';
import { TalosDialogFooterComponent } from '../dialog-footer/dialog-footer.component';

@Component({
  selector: 'talos-confirm-dialog',
  imports: [
    NgTemplateOutlet,
    TalosButtonDirective,
    TalosDialogHeaderComponent,
    TalosDialogContentComponent,
    TalosDialogFooterComponent,
    LucideAlertTriangle,
    LucideInfo,
    LucideCheckCircle2,
    LucideAlertCircle
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  host: {
    'class': 'talos-confirm-dialog-host'
  }
})
export class TalosConfirmDialogComponent {
  readonly data = inject<TalosConfirmDialogOptions>(TALOS_DIALOG_DATA, { optional: true }) || {
    title: 'Confirmation',
    message: 'Are you sure you want to proceed?'
  };

  private readonly dialogRef = inject(DialogRef);

  protected readonly title = this.data.title;
  protected readonly message = this.data.message;
  protected readonly isTemplateMessage = typeof this.data.message !== 'string';
  protected readonly confirmText = this.data.confirmText ?? 'Confirm';
  protected readonly cancelText = this.data.cancelText ?? 'Cancel';
  protected readonly variant = this.data.variant ?? 'primary';
  protected readonly showCancel = this.data.showCancel ?? true;

  protected get confirmButtonVariant(): 'primary' | 'danger' | 'secondary' {
    if (this.variant === 'danger') return 'danger';
    return 'primary';
  }

  protected onConfirm(): void {
    this.dialogRef.close(true);
  }

  protected onCancel(): void {
    this.dialogRef.close(false);
  }
}
