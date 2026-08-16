import { Component, input } from '@angular/core';
import { TalosDialogPadding } from '../dialog.types';

@Component({
  selector: 'talos-dialog-content, [talosDialogContent]',
  templateUrl: './dialog-content.component.html',
  styleUrl: './dialog-content.component.scss',
  host: {
    'class': 'talos-dialog-content-host',
    '[class.padding-none]': 'padding() === "none"',
    '[class.padding-sm]': 'padding() === "sm"',
    '[class.padding-md]': 'padding() === "md"',
    '[class.padding-lg]': 'padding() === "lg"'
  }
})
export class TalosDialogContentComponent {
  /** Internal padding size */
  readonly padding = input<TalosDialogPadding>('md');
}
