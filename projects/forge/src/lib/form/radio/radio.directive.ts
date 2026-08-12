import { Directive, input } from '@angular/core';

export type RadioSize = 'sm' | 'md' | 'lg';
export type RadioVariant = 'primary' | 'secondary' | 'success' | 'danger';

@Directive({
  selector: 'input[type="radio"][forgeRadio], input[type="radio"][forge-radio]',
  host: {
    'class': 'forge-radio',
    '[class.radio-sm]': 'size() === "sm"',
    '[class.radio-md]': 'size() === "md"',
    '[class.radio-lg]': 'size() === "lg"',
    '[class.forge-radio-primary]': 'variant() === "primary"',
    '[class.forge-radio-secondary]': 'variant() === "secondary"',
    '[class.forge-radio-success]': 'variant() === "success"',
    '[class.forge-radio-danger]': 'variant() === "danger"',
    '[class.is-invalid]': 'invalid()'
  }
})
export class ForgeRadioDirective {
  /** Sizing variation for the radio button */
  readonly size = input<RadioSize>('md');

  /** Visual color variant for the radio button */
  readonly variant = input<RadioVariant>('primary');

  /** Whether the radio button is in an invalid error state */
  readonly invalid = input<boolean>(false);
}
