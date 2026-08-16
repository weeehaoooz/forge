import {
  Component,
  input
} from '@angular/core';
import { TalosCardPadding } from './card.types';

@Component({
  selector: 'talos-card-body, talos-card-content, [talosCardBody], [talosCardContent]',
  templateUrl: './card-body.component.html',
  styleUrl: './card-body.component.scss',
  host: {
    'class': 'talos-card-body-host',
    '[class.talos-card-body-padding-none]': 'padding() === "none"',
    '[class.talos-card-body-padding-sm]': 'padding() === "sm"',
    '[class.talos-card-body-padding-md]': 'padding() === "md"',
    '[class.talos-card-body-padding-lg]': 'padding() === "lg"'
  }
})
export class TalosCardBodyComponent {
  /** Optional override for body padding */
  readonly padding = input<TalosCardPadding | null>(null);
}
