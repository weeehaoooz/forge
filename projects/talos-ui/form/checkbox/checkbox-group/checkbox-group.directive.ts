import {
  Directive,
  ElementRef,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxSize, CheckboxVariant } from '../checkbox/checkbox.directive';

export type CheckboxDirection = 'vertical' | 'horizontal';

let groupCounter = 0;

@Directive({
  selector: '[talosCheckboxGroup], [talos-checkbox-group]',
  exportAs: 'talosCheckboxGroup',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TalosCheckboxGroupDirective),
      multi: true
    }
  ],
  host: {
    'class': 'talos-checkbox-group',
    'role': 'group',
    '[class.direction-vertical]': 'direction() === "vertical"',
    '[class.direction-horizontal]': 'direction() === "horizontal"',
    '[class.is-disabled]': 'effectiveDisabled()',
    '[class.is-invalid]': 'invalid()'
  }
})
export class TalosCheckboxGroupDirective implements ControlValueAccessor {
  readonly elementRef = inject(ElementRef<HTMLElement>);

  /** Name attribute for the checkbox group */
  readonly name = input<string>(`talos-checkbox-group-${++groupCounter}`);

  /** Size applied to all child checkboxes unless overridden */
  readonly size = input<CheckboxSize>('md');

  /** Visual color variant applied to all child checkboxes */
  readonly variant = input<CheckboxVariant>('primary');

  /** Layout direction of checkboxes within group */
  readonly direction = input<CheckboxDirection>('vertical');

  /** Whether the entire checkbox group is disabled */
  readonly disabled = input<boolean>(false);

  /** Whether the group is in an invalid error state */
  readonly invalid = input<boolean>(false);

  /** Emits when group selection array changes */
  readonly valueChange = output<any[]>();

  // Internal state
  readonly value = signal<any[]>([]);
  readonly isDisabled = signal<boolean>(false);
  readonly isTouched = signal<boolean>(false);

  /** Effective disabled state taking into account CVA and input */
  readonly effectiveDisabled = computed(() => this.disabled() || this.isDisabled());

  private onChange: (val: any[]) => void = () => { };
  private onTouched: () => void = () => { };

  // --- ControlValueAccessor Interface ---
  writeValue(val: any[]): void {
    if (Array.isArray(val)) {
      this.value.set([...val]);
    } else if (val === null || val === undefined) {
      this.value.set([]);
    } else {
      this.value.set([val]);
    }
  }

  registerOnChange(fn: (val: any[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  /** Helper to check if a specific item value is currently selected in group */
  isValueSelected(val: any): boolean {
    return this.value().includes(val);
  }

  /** Toggles the selection status of a value in the group array */
  toggleValue(val: any): void {
    if (this.effectiveDisabled() || val === undefined) return;

    const current = this.value();
    let updated: any[];

    if (current.includes(val)) {
      updated = current.filter((v) => v !== val);
    } else {
      updated = [...current, val];
    }

    this.value.set(updated);
    this.onChange(updated);
    this.valueChange.emit(updated);
    this.markAsTouched();
  }

  /** Selects all passed values */
  selectAll(values: any[]): void {
    if (this.effectiveDisabled()) return;
    const uniqueValues = Array.from(new Set(values));
    this.value.set(uniqueValues);
    this.onChange(uniqueValues);
    this.valueChange.emit(uniqueValues);
    this.markAsTouched();
  }

  /** Deselects all values */
  deselectAll(): void {
    if (this.effectiveDisabled()) return;
    this.value.set([]);
    this.onChange([]);
    this.valueChange.emit([]);
    this.markAsTouched();
  }

  markAsTouched(): void {
    if (!this.isTouched()) {
      this.isTouched.set(true);
      this.onTouched();
    }
  }
}
