import { Directive, ElementRef, computed, inject, input } from '@angular/core';
import { RangeInputSize, RangeInputVariant } from './range-input.types';

@Directive({
  selector: 'input[type="range"][forgeRangeInput], input[type="range"][forge-range-input]',
  host: {
    'class': 'forge-range-native-input',
    '[class.forge-range-input-sm]': 'size() === "sm"',
    '[class.forge-range-input-md]': 'size() === "md"',
    '[class.forge-range-input-lg]': 'size() === "lg"',
    '[class.forge-range-input-primary]': 'variant() === "primary"',
    '[class.forge-range-input-secondary]': 'variant() === "secondary"',
    '[class.forge-range-input-success]': 'variant() === "success"',
    '[class.forge-range-input-warning]': 'variant() === "warning"',
    '[class.forge-range-input-danger]': 'variant() === "danger"',
    '[class.forge-range-input-info]': 'variant() === "info"',
    '[class.is-invalid]': 'invalid()',
    '[style.--range-fill-percent]': 'fillPercentStyle()'
  }
})
export class ForgeRangeInputDirective {
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
