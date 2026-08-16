import {
  Directive,
  HostListener,
  inject,
  input,
  OnInit,
  ElementRef
} from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';

let uniqueTitleId = 0;
let uniqueDescId = 0;

/**
 * Directive for the dialog title element.
 * Automatically handles accessible ARIA labeling.
 */
@Directive({
  selector: '[talosDialogTitle]',
  host: {
    'class': 'talos-dialog-title',
    '[attr.id]': 'id()'
  }
})
export class TalosDialogTitleDirective implements OnInit {
  /** Optional custom ID for accessibility linking */
  readonly id = input<string>(`talos-dialog-title-${++uniqueTitleId}`);
  private readonly dialogRef = inject(DialogRef, { optional: true });

  ngOnInit(): void {
    if (this.dialogRef) {
      // Allow CDK or parent container to associate the title ID
    }
  }
}

/**
 * Directive for the dialog description/subtitle element.
 * Automatically handles accessible ARIA descriptions.
 */
@Directive({
  selector: '[talosDialogDescription]',
  host: {
    'class': 'talos-dialog-description',
    '[attr.id]': 'id()'
  }
})
export class TalosDialogDescriptionDirective {
  /** Optional custom ID for accessibility linking */
  readonly id = input<string>(`talos-dialog-desc-${++uniqueDescId}`);
}

/**
 * Directive placed on buttons inside a dialog to trigger dismissal.
 * Passes the optional [talosDialogClose] value as the dialog result.
 */
@Directive({
  selector: '[talosDialogClose]',
  host: {
    '(click)': 'onClick($event)'
  }
})
export class TalosDialogCloseDirective {
  /** Value returned when closing the dialog */
  readonly dialogResult = input<unknown>(undefined, { alias: 'talosDialogClose' });

  private readonly dialogRef = inject(DialogRef, { optional: true });

  protected onClick(event: MouseEvent): void {
    if (this.dialogRef) {
      this.dialogRef.close(this.dialogResult());
    }
  }
}
