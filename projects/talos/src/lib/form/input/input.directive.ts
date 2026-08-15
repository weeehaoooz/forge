import { Directive, input } from '@angular/core';

export type InputSize = 'sm' | 'md' | 'lg';

@Directive({
  selector: 'input[talosInput], textarea[talosInput], input[talosTextarea], textarea[talosTextarea], input[talos-input], textarea[talos-textarea]',
  host: {
    'class': 'talos-input',
    '[class.input-sm]': 'size() === "sm"',
    '[class.input-md]': 'size() === "md"',
    '[class.input-lg]': 'size() === "lg"',
    '[class.is-invalid]': 'invalid()'
  }
})
export class TalosInputDirective {
  /** Sizing variation for input or textarea */
  readonly size = input<InputSize>('md');

  /** Whether the input is in an invalid error state */
  readonly invalid = input<boolean>(false);
}
