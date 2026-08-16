import {
  Directive,
  ElementRef,
  computed,
  inject,
  input,
  output
} from '@angular/core';

export type SlideToggleSize = 'sm' | 'md' | 'lg';
export type SlideToggleVariant = 'primary' | 'secondary' | 'success' | 'danger';

@Directive({
  selector: 'input[type="checkbox"][talosSlideToggle], input[type="checkbox"][talos-slide-toggle], input[type="checkbox"][talosSwitch], input[type="checkbox"][talos-switch]',
  exportAs: 'talosSlideToggle',
  host: {
    'class': 'talos-slide-toggle',
    'role': 'switch',
    '[class.slide-toggle-sm]': 'size() === "sm"',
    '[class.slide-toggle-md]': 'size() === "md"',
    '[class.slide-toggle-lg]': 'size() === "lg"',
    '[class.talos-slide-toggle-primary]': 'variant() === "primary"',
    '[class.talos-slide-toggle-secondary]': 'variant() === "secondary"',
    '[class.talos-slide-toggle-success]': 'variant() === "success"',
    '[class.talos-slide-toggle-danger]': 'variant() === "danger"',
    '[class.is-invalid]': 'invalid()',
    '[checked]': 'checked()',
    '[disabled]': 'disabled()',
    '(change)': 'onNativeChange($event)'
  }
})
export class TalosSlideToggleDirective {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);

  /** Standalone checked state */
  readonly checked = input<boolean>(false);

  /** Sizing variation for the slide toggle */
  readonly size = input<SlideToggleSize>('md');

  /** Visual color variant for the slide toggle */
  readonly variant = input<SlideToggleVariant>('primary');

  /** Whether the slide toggle is disabled */
  readonly disabled = input<boolean>(false);

  /** Whether the slide toggle is in an invalid error state */
  readonly invalid = input<boolean>(false);

  /** Output event emitted when checked state changes */
  readonly checkedChange = output<boolean>();

  onNativeChange(event: Event): void {
    if (this.disabled()) return;

    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;

    this.checkedChange.emit(isChecked);
  }
}
