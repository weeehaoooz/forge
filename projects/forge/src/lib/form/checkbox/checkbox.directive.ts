import { Directive, input } from '@angular/core';

export type CheckboxSize = 'sm' | 'md' | 'lg';
export type CheckboxVariant = 'primary' | 'secondary' | 'success' | 'danger';

@Directive({
  selector: 'input[type="checkbox"][forgeCheckbox], input[type="checkbox"][forge-checkbox]',
  host: {
    'class': 'forge-checkbox',
    '[class.checkbox-sm]': 'size() === "sm"',
    '[class.checkbox-md]': 'size() === "md"',
    '[class.checkbox-lg]': 'size() === "lg"',
    '[class.forge-checkbox-primary]': 'variant() === "primary"',
    '[class.forge-checkbox-secondary]': 'variant() === "secondary"',
    '[class.forge-checkbox-success]': 'variant() === "success"',
    '[class.forge-checkbox-danger]': 'variant() === "danger"',
    '[class.is-invalid]': 'invalid()',
    '[class.is-indeterminate]': 'indeterminate()',
    '[indeterminate]': 'indeterminate()'
  }
})
export class ForgeCheckboxDirective {
  /** Sizing variation for the checkbox */
  readonly size = input<CheckboxSize>('md');

  /** Visual color variant for the checkbox */
  readonly variant = input<CheckboxVariant>('primary');

  /** Whether the checkbox is in an invalid error state */
  readonly invalid = input<boolean>(false);

  /** Whether the checkbox is in an indeterminate visual & property state */
  readonly indeterminate = input<boolean>(false);
}
