import {
  Component,
  ElementRef,
  computed,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxSize, CheckboxVariant, TalosCheckboxDirective } from './checkbox.directive';
import { TalosCheckboxGroupDirective } from './checkbox-group.directive';

let checkboxCounter = 0;

@Component({
  selector: 'talos-checkbox',
  imports: [TalosCheckboxDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TalosCheckboxComponent),
      multi: true
    }
  ],
  host: {
    'class': 'talos-checkbox-host'
  },
  template: `
    <label class="talos-checkbox-wrapper" [class.is-disabled]="effectiveDisabled()">
      <input
        #inputEl
        type="checkbox"
        talosCheckbox
        [value]="value()"
        [checked]="isChecked()"
        [size]="effectiveSize()"
        [variant]="effectiveVariant()"
        [disabled]="effectiveDisabled()"
        [invalid]="effectiveInvalid()"
        [indeterminate]="indeterminate()"
        (checkedChange)="onDirectiveCheckedChange($event)"
      />
      <span class="talos-checkbox-label">
        <ng-content></ng-content>
      </span>
    </label>
  `
})
export class TalosCheckboxComponent implements ControlValueAccessor {
  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('inputEl');
  readonly groupDir = inject(TalosCheckboxGroupDirective, { optional: true });

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

  /** Emitted when checked state changes */
  readonly checkedChange = output<boolean>();

  // Internal reactive state for CVA
  readonly internalValue = signal<boolean>(false);
  readonly isDisabled = signal<boolean>(false);
  readonly isTouched = signal<boolean>(false);

  // Effective state computations
  readonly effectiveSize = computed(() => {
    return this.groupDir ? this.groupDir.size() : this.size();
  });

  readonly effectiveVariant = computed(() => {
    return this.groupDir ? this.groupDir.variant() : this.variant();
  });

  readonly effectiveDisabled = computed(() => {
    return this.disabled() || this.isDisabled() || (this.groupDir ? this.groupDir.effectiveDisabled() : false);
  });

  readonly effectiveInvalid = computed(() => {
    return this.invalid() || (this.groupDir ? this.groupDir.invalid() : false);
  });

  readonly isChecked = computed(() => {
    if (this.groupDir && this.value() !== undefined) {
      return this.groupDir.isValueSelected(this.value());
    }
    return this.internalValue() || this.checked();
  });

  private onChange: (val: boolean) => void = () => { };
  private onTouched: () => void = () => { };

  // --- ControlValueAccessor Implementation ---
  writeValue(val: boolean): void {
    this.internalValue.set(!!val);
  }

  registerOnChange(fn: (val: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onDirectiveCheckedChange(isChecked: boolean): void {
    if (this.effectiveDisabled()) return;

    this.internalValue.set(isChecked);
    this.onChange(isChecked);
    this.checkedChange.emit(isChecked);
    this.markAsTouched();
  }

  markAsTouched(): void {
    if (!this.isTouched()) {
      this.isTouched.set(true);
      this.onTouched();
    }
  }

  /** Focuses the native HTML input element */
  focusInput(): void {
    this.inputRef()?.nativeElement.focus();
  }
}
