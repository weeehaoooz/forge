import { Directive, input } from '@angular/core';

export type InputSize = 'sm' | 'md' | 'lg';

@Directive({
  selector: 'input[forgeInput], textarea[forgeInput], input[forgeTextarea], textarea[forgeTextarea], input[forge-input], textarea[forge-textarea]',
  host: {
    'class': 'forge-input',
    '[class.input-sm]': 'size() === "sm"',
    '[class.input-md]': 'size() === "md"',
    '[class.input-lg]': 'size() === "lg"',
    '[class.is-invalid]': 'invalid()'
  }
})
export class ForgeInputDirective {
  /** Sizing variation for input or textarea */
  readonly size = input<InputSize>('md');

  /** Whether the input is in an invalid error state */
  readonly invalid = input<boolean>(false);
}
