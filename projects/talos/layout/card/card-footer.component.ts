import {
  Component,
  input
} from '@angular/core';
import { TalosCardFooterAlign } from './card.types';

@Component({
  selector: 'talos-card-footer, [talosCardFooter]',
  templateUrl: './card-footer.component.html',
  styleUrl: './card-footer.component.scss',
  host: {
    'class': 'talos-card-footer-host',
    '[class.is-bordered]': 'bordered()',
    '[class.align-start]': 'align() === "start"',
    '[class.align-center]': 'align() === "center"',
    '[class.align-end]': 'align() === "end"',
    '[class.align-between]': 'align() === "between"'
  }
})
export class TalosCardFooterComponent {
  /** Adds a divider border above the footer */
  readonly bordered = input<boolean>(false);

  /** Horizontal alignment of elements within the footer */
  readonly align = input<TalosCardFooterAlign>('end');
}
