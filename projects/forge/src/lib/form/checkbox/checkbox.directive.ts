import {
  Directive,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  output
} from '@angular/core';
import { ForgeCheckboxGroupDirective } from './checkbox-group.directive';

export type CheckboxSize = 'sm' | 'md' | 'lg';
export type CheckboxVariant = 'primary' | 'secondary' | 'success' | 'danger';

@Directive({
  selector: 'input[type="checkbox"][forgeCheckbox], input[type="checkbox"][forge-checkbox]',
  exportAs: 'forgeCheckbox',
  host: {
    'class': 'forge-checkbox',
    '[class.checkbox-sm]': 'effectiveSize() === "sm"',
    '[class.checkbox-md]': 'effectiveSize() === "md"',
    '[class.checkbox-lg]': 'effectiveSize() === "lg"',
    '[class.forge-checkbox-primary]': 'effectiveVariant() === "primary"',
    '[class.forge-checkbox-secondary]': 'effectiveVariant() === "secondary"',
    '[class.forge-checkbox-success]': 'effectiveVariant() === "success"',
    '[class.forge-checkbox-danger]': 'effectiveVariant() === "danger"',
    '[class.is-invalid]': 'effectiveInvalid()',
    '[class.is-indeterminate]': 'indeterminate()',
    '[checked]': 'isChecked()',
    '[disabled]': 'effectiveDisabled()',
    '[indeterminate]': 'indeterminate()',
    '(change)': 'onNativeChange($event)'
  }
})
export class ForgeCheckboxDirective {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);
  readonly groupDir = inject(ForgeCheckboxGroupDirective, { optional: true });

  /** Value associated with this checkbox when part of a group */
  readonly value = input<any>(undefined);

  /** Standalone checked state */
  readonly checked = input<boolean>(false);

  /** Sizing variation for the checkbox */
  readonly size = input<CheckboxSize>('md');

  /** Visual color variant for the checkbox */
  readonly variant = input<CheckboxVariant>('primary');

  /** Whether the checkbox is disabled */
  readonly disabled = input<boolean>(false);

  /** Whether the checkbox is in an invalid error state */
  readonly invalid = input<boolean>(false);

  /** Whether the checkbox is in an indeterminate visual & property state */
  readonly indeterminate = input<boolean>(false);

  /** Output event emitted when checked state changes */
  readonly checkedChange = output<boolean>();

  // Computed state
  readonly effectiveSize = computed(() => {
    return this.groupDir ? this.groupDir.size() : this.size();
  });

  readonly effectiveVariant = computed(() => {
    return this.groupDir ? this.groupDir.variant() : this.variant();
  });

  readonly effectiveDisabled = computed(() => {
    return this.disabled() || (this.groupDir ? this.groupDir.effectiveDisabled() : false);
  });

  readonly effectiveInvalid = computed(() => {
    return this.invalid() || (this.groupDir ? this.groupDir.invalid() : false);
  });

  readonly isChecked = computed(() => {
    if (this.groupDir && this.value() !== undefined) {
      return this.groupDir.isValueSelected(this.value());
    }
    return this.checked();
  });

  constructor() {
    // Keep native input element indeterminate property synced
    effect(() => {
      const isIndeterminate = this.indeterminate();
      if (this.elementRef.nativeElement) {
        this.elementRef.nativeElement.indeterminate = isIndeterminate;
      }
    });
  }

  onNativeChange(event: Event): void {
    if (this.effectiveDisabled()) return;

    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;

    if (this.groupDir && this.value() !== undefined) {
      this.groupDir.toggleValue(this.value());
    }

    this.checkedChange.emit(isChecked);
  }
}
