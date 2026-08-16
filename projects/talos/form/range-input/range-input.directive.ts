import { Directive, ElementRef, computed, inject, input } from '@angular/core';
import { RangeInputSize, RangeInputVariant } from './range-input.types';

@Directive({
  selector: 'input[type="range"][talosRangeInput], input[type="range"][talos-range-input]',
  host: {
    'class': 'talos-range-native-input',
    '[class.talos-range-input-sm]': 'size() === "sm"',
    '[class.talos-range-input-md]': 'size() === "md"',
    '[class.talos-range-input-lg]': 'size() === "lg"',
    '[class.talos-range-input-primary]': 'variant() === "primary"',
    '[class.talos-range-input-secondary]': 'variant() === "secondary"',
    '[class.talos-range-input-success]': 'variant() === "success"',
    '[class.talos-range-input-warning]': 'variant() === "warning"',
    '[class.talos-range-input-danger]': 'variant() === "danger"',
    '[class.talos-range-input-info]': 'variant() === "info"',
    '[class.is-invalid]': 'invalid()',
    '[style.--range-fill-percent]': 'fillPercentStyle()'
  }
})
export class TalosRangeInputDirective {
  private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);

  /** Size variant */
  readonly size = input<RangeInputSize>('md');

  /** Visual color variant */
  readonly variant = input<RangeInputVariant>('primary');

  /** Error state */
  readonly invalid = input<boolean>(false);

  protected readonly fillPercentStyle = computed(() => {
    const el = this.elementRef.nativeElement;
    const min = parseFloat(el.min) || 0;
    const max = parseFloat(el.max) || 100;
    const val = parseFloat(el.value) || min;
    const percent = max > min ? ((val - min) / (max - min)) * 100 : 0;
    return `${Math.max(0, Math.min(100, percent))}%`;
  });
}
