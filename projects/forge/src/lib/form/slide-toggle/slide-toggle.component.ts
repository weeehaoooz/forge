import {
  Component,
  ElementRef,
  computed,
  forwardRef,
  input,
  output,
  signal,
  viewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  ForgeSlideToggleDirective,
  SlideToggleSize,
  SlideToggleVariant
} from './slide-toggle.directive';

export type SlideToggleLabelPosition = 'before' | 'after';

let slideToggleCounter = 0;

@Component({
  selector: 'forge-slide-toggle, forge-switch',
  imports: [ForgeSlideToggleDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ForgeSlideToggleComponent),
      multi: true
    }
  ],
  host: {
    'class': 'forge-slide-toggle-host'
  },
  template: `
    <label
      class="forge-slide-toggle-wrapper"
      [class.is-disabled]="effectiveDisabled()"
      [class.is-checked]="isChecked()"
      [class.label-before]="labelPosition() === 'before'"
    >
      @if (labelPosition() === 'before') {
        <span class="forge-slide-toggle-label">
          <ng-content></ng-content>
        </span>
      }

      <span class="forge-slide-toggle-switch">
        <input
          #inputEl
          type="checkbox"
          forgeSlideToggle
          [id]="elementId()"
          [checked]="isChecked()"
          [size]="size()"
          [variant]="variant()"
          [disabled]="effectiveDisabled()"
          [invalid]="effectiveInvalid()"
          (checkedChange)="onDirectiveCheckedChange($event)"
        />
        <span class="forge-slide-toggle-track">
          <span class="forge-slide-toggle-thumb"></span>
        </span>
      </span>

      @if (labelPosition() === 'after') {
        <span class="forge-slide-toggle-label">
          <ng-content></ng-content>
        </span>
      }
    </label>
  `
})
export class ForgeSlideToggleComponent implements ControlValueAccessor {
  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  /** Standalone checked state input */
  readonly checked = input<boolean>(false);

  /** Sizing variation for the toggle switch */
  readonly size = input<SlideToggleSize>('md');

  /** Visual color variant for the toggle switch */
  readonly variant = input<SlideToggleVariant>('primary');

  /** Whether the toggle switch is disabled */
  readonly disabled = input<boolean>(false);

  /** Whether the toggle switch is in an invalid error state */
  readonly invalid = input<boolean>(false);

  /** Position of the label text relative to the toggle switch */
  readonly labelPosition = input<SlideToggleLabelPosition>('after');

  /** Element HTML ID */
  readonly id = input<string>('');

  /** Emitted when checked state changes */
  readonly checkedChange = output<boolean>();

  // Internal reactive state for CVA & ID generation
  private readonly defaultId = `forge-slide-toggle-${++slideToggleCounter}`;
  readonly elementId = computed(() => this.id() || this.defaultId);

  readonly internalValue = signal<boolean>(false);
  readonly isDisabled = signal<boolean>(false);
  readonly isTouched = signal<boolean>(false);

  // Effective state computations
  readonly effectiveDisabled = computed(() => this.disabled() || this.isDisabled());
  readonly effectiveInvalid = computed(() => this.invalid());

  readonly isChecked = computed(() => this.internalValue() || this.checked());

  private onChange: (val: boolean) => void = () => {};
  private onTouched: () => void = () => {};

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
