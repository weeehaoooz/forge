import {
  Component,
  ElementRef,
  computed,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TalosRadioDirective, RadioSize, RadioVariant } from '../radio/radio.directive';
import { TalosRadioComponent } from '../radio/radio.component';

export type RadioDirection = 'vertical' | 'horizontal';

let groupUniqueIdCounter = 0;

@Component({
  selector: 'talos-radio-group',
  template: '<ng-content></ng-content>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TalosRadioGroupComponent),
      multi: true
    }
  ],
  host: {
    'class': 'talos-radio-group',
    'role': 'radiogroup',
    '[class.direction-vertical]': 'direction() === "vertical"',
    '[class.direction-horizontal]': 'direction() === "horizontal"',
    '[class.is-disabled]': 'effectiveDisabled()',
    '[class.is-invalid]': 'invalid()',
    '(keydown)': 'onKeyDown($event)'
  }
})
export class TalosRadioGroupComponent implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  // Signal Inputs
  readonly name = input<string>(`talos-radio-group-${++groupUniqueIdCounter}`);
  readonly size = input<RadioSize>('md');
  readonly variant = input<RadioVariant>('primary');
  readonly direction = input<RadioDirection>('vertical');
  readonly disabled = input<boolean>(false);
  readonly invalid = input<boolean>(false);

  // Signal Outputs
  readonly valueChange = output<unknown>();

  // Content Queries for child radios
  readonly radios = contentChildren(TalosRadioComponent, { descendants: true });

  // Internal reactive state
  readonly value = signal<unknown>(null);
  readonly isDisabled = signal<boolean>(false);
  readonly isTouched = signal<boolean>(false);

  // Computed state
  readonly effectiveDisabled = computed(() => this.disabled() || this.isDisabled());

  // ControlValueAccessor Callbacks
  private onChange: (val: unknown) => void = () => { };
  private onTouched: () => void = () => { };

  constructor() {
    // Notify child radios when group state changes
    effect(() => {
      const childRadios = this.radios();
      const currentVal = this.value();
      childRadios.forEach((radio) => {
        radio.markForCheck();
      });
    });
  }

  // --- ControlValueAccessor Interface ---
  writeValue(val: unknown): void {
    this.value.set(val);
  }

  registerOnChange(fn: (val: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  selectValue(val: unknown): void {
    if (this.effectiveDisabled()) return;
    if (this.value() !== val) {
      this.value.set(val);
      this.onChange(val);
      this.valueChange.emit(val);
    }
    this.markAsTouched();
  }

  markAsTouched(): void {
    if (!this.isTouched()) {
      this.isTouched.set(true);
      this.onTouched();
    }
  }

  // --- Keyboard Navigation (Arrow Keys) ---
  onKeyDown(event: KeyboardEvent): void {
    if (this.effectiveDisabled()) return;

    const childRadios = this.radios().filter((r) => !r.effectiveDisabled());
    if (childRadios.length === 0) return;

    const currentIdx = childRadios.findIndex((r) => r.value() === this.value());

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight': {
        event.preventDefault();
        const nextIdx = currentIdx < 0 ? 0 : (currentIdx + 1) % childRadios.length;
        const nextRadio = childRadios[nextIdx];
        this.selectValue(nextRadio.value());
        nextRadio.focusInput();
        break;
      }
      case 'ArrowUp':
      case 'ArrowLeft': {
        event.preventDefault();
        const prevIdx = currentIdx < 0 ? childRadios.length - 1 : (currentIdx - 1 + childRadios.length) % childRadios.length;
        const prevRadio = childRadios[prevIdx];
        this.selectValue(prevRadio.value());
        prevRadio.focusInput();
        break;
      }
    }
  }
}
