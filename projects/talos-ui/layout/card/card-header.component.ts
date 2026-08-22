import {
  Component,
  input
} from '@angular/core';

@Component({
  selector: 'talos-card-header, [talosCardHeader]',
  templateUrl: './card-header.component.html',
  styleUrl: './card-header.component.scss',
  host: {
    'class': 'talos-card-header-host',
    '[class.is-bordered]': 'bordered()'
  }
})
export class TalosCardHeaderComponent {
  /** Optional title text displayed in the header */
  readonly title = input<string>('');

  /** Optional subtitle text displayed beneath the title */
  readonly subtitle = input<string>('');

  /** Adds a divider border beneath the header */
  readonly bordered = input<boolean>(false);
}
