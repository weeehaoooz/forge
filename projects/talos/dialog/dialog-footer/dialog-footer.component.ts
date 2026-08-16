import { Component, input } from '@angular/core';
import { TalosDialogFooterAlign } from '../dialog.types';

@Component({
  selector: 'talos-dialog-footer, [talosDialogFooter]',
  templateUrl: './dialog-footer.component.html',
  styleUrl: './dialog-footer.component.scss',
  host: {
    'class': 'talos-dialog-footer-host',
    '[class.has-divider]': 'divider()',
    '[class.is-sticky]': 'sticky()',
    '[class.align-start]': 'align() === "start"',
    '[class.align-center]': 'align() === "center"',
    '[class.align-end]': 'align() === "end"',
    '[class.align-space-between]': 'align() === "space-between"'
  }
})
export class TalosDialogFooterComponent {
  /** Button alignment in footer */
  readonly align = input<TalosDialogFooterAlign>('end');

  /** Whether to show a top divider border */
  readonly divider = input<boolean>(true);

  /** Whether the footer sticks to the bottom when content scrolls */
  readonly sticky = input<boolean>(false);
}
