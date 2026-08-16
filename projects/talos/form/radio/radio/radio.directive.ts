import { Directive, input } from '@angular/core';

export type RadioSize = 'sm' | 'md' | 'lg';
export type RadioVariant = 'primary' | 'secondary' | 'success' | 'danger';

@Directive({
  selector: 'input[type="radio"][talosRadio], input[type="radio"][talos-radio]',
  host: {
    'class': 'talos-radio',
    '[class.radio-sm]': 'size() === "sm"',
    '[class.radio-md]': 'size() === "md"',
    '[class.radio-lg]': 'size() === "lg"',
    '[class.talos-radio-primary]': 'variant() === "primary"',
    '[class.talos-radio-secondary]': 'variant() === "secondary"',
    '[class.talos-radio-success]': 'variant() === "success"',
    '[class.talos-radio-danger]': 'variant() === "danger"',
    '[class.is-invalid]': 'invalid()'
  }
})
export class TalosRadioDirective {
  /** Sizing variation for the radio button */
  readonly size = input<RadioSize>('md');

  /** Visual color variant for the radio button */
  readonly variant = input<RadioVariant>('primary');

  /** Whether the radio button is in an invalid error state */
  readonly invalid = input<boolean>(false);
}
