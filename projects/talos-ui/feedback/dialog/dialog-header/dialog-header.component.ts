import { Component, inject, input, output } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { LucideX } from '@lucide/angular';
import { TalosDialogVariant } from '../dialog.types';
import { TalosDialogTitleDirective, TalosDialogDescriptionDirective } from '../dialog.directives';

@Component({
  selector: 'talos-dialog-header, [talosDialogHeader]',
  imports: [LucideX, TalosDialogTitleDirective, TalosDialogDescriptionDirective],
  templateUrl: './dialog-header.component.html',
  styleUrl: './dialog-header.component.scss',
  host: {
    'class': 'talos-dialog-header-host',
    '[class.has-divider]': 'divider()',
    '[class.variant-danger]': 'variant() === "danger"',
    '[class.variant-warning]': 'variant() === "warning"',
    '[class.variant-info]': 'variant() === "info"',
    '[class.variant-success]': 'variant() === "success"'
  }
})
export class TalosDialogHeaderComponent {
  /** Main dialog title */
  readonly title = input<string>();

  /** Subtitle or helper description */
  readonly subtitle = input<string>();

  /** Visual accent variant */
  readonly variant = input<TalosDialogVariant>('default');

  /** Whether to show a bottom divider line */
  readonly divider = input<boolean>(true);

  /** Whether to show the top-right X close button */
  readonly showCloseButton = input<boolean>(true);

  /** Accessible label for the close button */
  readonly closeButtonAriaLabel = input<string>('Close dialog');

  /** Emitted when the close button is clicked */
  readonly closeClick = output<MouseEvent>();

  private readonly dialogRef = inject(DialogRef, { optional: true });

  protected handleClose(event: MouseEvent): void {
    this.closeClick.emit(event);
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
