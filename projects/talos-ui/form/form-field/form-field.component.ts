import {
  AfterContentChecked,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  signal
} from '@angular/core';

let formFieldUniqueId = 0;

@Component({
  selector: 'talos-form-field',
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  host: {
    'class': 'talos-form-field-host',
    '[class.is-floating]': 'isFloatingMode()',
    '[class.is-floated]': 'isFloated()',
    '[class.is-focused]': 'isFocused()',
    '[class.is-disabled]': 'disabled()',
    '[class.is-invalid]': 'invalid() || !!error()',
    '[class.is-textarea]': 'isTextarea()',
    '[class.form-field-sm]': 'size() === "sm"',
    '[class.form-field-md]': 'size() === "md"',
    '[class.form-field-lg]': 'size() === "lg"',
    '(focusin)': 'onFocusIn()',
    '(focusout)': 'onFocusOut()',
    '(input)': 'onInput()'
  }
})
export class TalosFormFieldComponent implements AfterContentChecked {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  // Signal Inputs
  readonly label = input<string>('');
  readonly floating = input<boolean>(false);
  readonly floatingLabel = input<boolean>(false);
  readonly hint = input<string>('');
  readonly error = input<string>('');
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly invalid = input<boolean>(false);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly forId = input<string>('');

  // Internal state
  readonly isFocused = signal<boolean>(false);
  readonly hasValue = signal<boolean>(false);
  readonly isTextarea = signal<boolean>(false);

  private readonly autoId = `talos-field-${++formFieldUniqueId}`;
  readonly inputId = computed(() => this.forId() || `${this.autoId}-input`);

  readonly isFloatingMode = computed(() => this.floating() || this.floatingLabel());

  readonly isFloated = computed(() => {
    if (!this.isFloatingMode()) {
      return false;
    }
    return this.isFocused() || this.hasValue();
  });

  ngAfterContentChecked(): void {
    this.checkValue();
  }

  onFocusIn(): void {
    this.isFocused.set(true);
    this.checkValue();
  }

  onFocusOut(): void {
    this.isFocused.set(false);
    this.checkValue();
  }

  onInput(): void {
    this.checkValue();
  }

  onLabelClick(): void {
    const root = this.elementRef.nativeElement as HTMLElement;
    const inputEl = root.querySelector('input, textarea, select, [tabindex="0"]') as HTMLElement | null;
    if (inputEl) {
      inputEl.focus();
    }
  }

  checkValue(): void {
    const root = this.elementRef.nativeElement as HTMLElement;
    const textareaEl = root.querySelector('textarea');
    this.isTextarea.set(!!textareaEl);

    const inputEl = root.querySelector('input, textarea, select') as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
    if (inputEl) {
      this.hasValue.set(!!inputEl.value);
    }
  }
}
