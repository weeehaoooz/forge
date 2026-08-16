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
import {
  RangeInputChangeEvent,
  RangeInputMark,
  RangeInputSize,
  RangeInputTick,
  RangeInputTooltipMode,
  RangeInputValue,
  RangeInputVariant
} from './range-input.types';

let rangeInputCounter = 0;

@Component({
  selector: 'talos-range-input, talos-range-slider, talos-slider',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TalosRangeInputComponent),
      multi: true
    }
  ],
  templateUrl: './range-input.component.html',
  styleUrl: './range-input.component.scss',
  host: {
    'class': 'talos-range-input-host',
    '[class.talos-range-disabled]': 'effectiveDisabled()',
    '[class.talos-range-invalid]': 'effectiveInvalid()',
    '[class.is-floating]': 'isFloatingMode()'
  }
})
export class TalosRangeInputComponent implements ControlValueAccessor {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly trackContainerRef = viewChild<ElementRef<HTMLDivElement>>('sliderTrackContainer');
  private readonly thumb0Ref = viewChild<ElementRef<HTMLDivElement>>('thumb0');
  private readonly thumb1Ref = viewChild<ElementRef<HTMLDivElement>>('thumb1');

  /** Minimum allowed value */
  readonly min = input<number>(0);

  /** Maximum allowed value */
  readonly max = input<number>(100);

  /** Step increment for values */
  readonly step = input<number>(1);

  /** Step interval for tick marks / labels generation (e.g. 10, 20, 25) */
  readonly interval = input<number | null>(null);

  /** Whether the slider operates in dual-thumb range mode */
  readonly range = input<boolean>(false);

  /** Minimum distance between handles in dual mode */
  readonly minRange = input<number>(0);

  /** Maximum distance between handles in dual mode */
  readonly maxRange = input<number | null>(null);

  /** Discrete tick marks with optional custom labels */
  readonly marks = input<RangeInputMark[] | number[] | null>(null);

  /** Whether to show tick mark notches on the track */
  readonly showTicks = input<boolean>(false);

  /** Whether to show interval/tick labels under the track */
  readonly showIntervals = input<boolean>(false);

  /** Alias for showIntervals */
  readonly showLabels = input<boolean>(false);

  /** Whether to snap slider thumb only to configured tick marks */
  readonly snapToTicks = input<boolean>(false);

  /** Sizing variant */
  readonly size = input<RangeInputSize>('md');

  /** Visual color variant */
  readonly variant = input<RangeInputVariant>('primary');

  /** Disabled state */
  readonly disabled = input<boolean>(false);

  /** Read-only state */
  readonly readonly = input<boolean>(false);

  /** Invalid error state */
  readonly invalid = input<boolean>(false);

  /** Top label text */
  readonly label = input<string>('');

  /** Floating label mode toggle */
  readonly floatingLabel = input<boolean>(false);
  readonly floating = input<boolean>(false);

  /** Helper hint text */
  readonly hint = input<string>('');

  /** Whether to render synchronized number inputs */
  readonly showInputs = input<boolean>(false);

  /** Whether to show top value badge when inputs are disabled */
  readonly showValueBadge = input<boolean>(true);

  /** Tooltip display mode ('always' | 'hover' | 'drag' | 'none') */
  readonly showTooltip = input<RangeInputTooltipMode>('hover');

  /** Optional prefix string (e.g. '$') */
  readonly prefix = input<string>('');

  /** Optional suffix string (e.g. '%', '°C') */
  readonly suffix = input<string>('');

  /** Custom value formatter function */
  readonly formatter = input<((value: number) => string) | null>(null);

  /** Accessibility label for single slider */
  readonly ariaLabel = input<string>('Range slider');

  /** Accessibility label for start thumb in range mode */
  readonly ariaLabelStart = input<string>('Minimum range value');

  /** Accessibility label for end thumb in range mode */
  readonly ariaLabelEnd = input<string>('Maximum range value');

  /** Element unique ID */
  readonly id = input<string>('');

  /** Standalone value input binding */
  readonly value = input<RangeInputValue | null>(null);

  /** Emitted when value changes */
  readonly valueChange = output<RangeInputValue>();

  /** Emitted during active dragging or keyboard movement */
  readonly inputChange = output<RangeInputChangeEvent>();

  /** Emitted on drag end, click release or input commit */
  readonly change = output<RangeInputChangeEvent>();

  // Internal reactive states
  private readonly defaultId = `talos-range-${++rangeInputCounter}`;
  readonly elementId = computed(() => this.id() || this.defaultId);

  readonly internalValue = signal<RangeInputValue | null>(null);
  readonly isCvaDisabled = signal<boolean>(false);
  readonly isTouched = signal<boolean>(false);

  // Active interaction tracking
  readonly focusedThumb = signal<number | null>(null);
  readonly hoveredThumb = signal<number | null>(null);
  readonly draggingThumb = signal<number | null>(null);

  // Effective state computations
  readonly isFloatingMode = computed(() => this.floatingLabel() || this.floating());
  readonly effectiveDisabled = computed(() => this.disabled() || this.isCvaDisabled());
  readonly effectiveInvalid = computed(() => this.invalid());

  /** Determines whether the component is in dual-handle range mode */
  readonly isDualRange = computed<boolean>(() => {
    if (this.range()) return true;
    const v = this.internalValue() ?? this.value();
    return Array.isArray(v);
  });

  /** Resolved start value (single value or lower bound of range) */
  readonly startValue = computed<number>(() => {
    const v = this.internalValue() ?? this.value();
    const min = this.min();
    const max = this.max();

    if (Array.isArray(v)) {
      const val = typeof v[0] === 'number' ? v[0] : min;
      return this.clamp(val, min, max);
    }
    const val = typeof v === 'number' ? v : min;
    return this.clamp(val, min, max);
  });

  /** Resolved end value (upper bound of range mode) */
  readonly endValue = computed<number>(() => {
    const v = this.internalValue() ?? this.value();
    const min = this.min();
    const max = this.max();

    if (Array.isArray(v)) {
      const val = typeof v[1] === 'number' ? v[1] : max;
      return this.clamp(Math.max(this.startValue(), val), min, max);
    }
    return max;
  });

  /** Overall span */
  readonly span = computed<number>(() => {
    const diff = this.max() - this.min();
    return diff > 0 ? diff : 1;
  });

  /** Percentage position of thumb 0 */
  readonly thumb0Percent = computed<number>(() => {
    return this.valueToPercent(this.startValue());
  });

  /** Percentage position of thumb 1 */
  readonly thumb1Percent = computed<number>(() => {
    return this.valueToPercent(this.endValue());
  });

  /** Fill bar left percentage */
  readonly fillLeftPercent = computed<number>(() => {
    if (this.isDualRange()) {
      return this.thumb0Percent();
    }
    return 0;
  });

  /** Fill bar width percentage */
  readonly fillWidthPercent = computed<number>(() => {
    if (this.isDualRange()) {
      return Math.max(0, this.thumb1Percent() - this.thumb0Percent());
    }
    return this.thumb0Percent();
  });

  /** Computed list of tick marks */
  readonly ticks = computed<RangeInputTick[]>(() => {
    const min = this.min();
    const max = this.max();
    const customMarks = this.marks();
    const intervalVal = this.interval();
    const startVal = this.startValue();
    const endVal = this.isDualRange() ? this.endValue() : startVal;
    const isDual = this.isDualRange();

    if (customMarks && customMarks.length > 0) {
      return customMarks.map(m => {
        const val = typeof m === 'number' ? m : m.value;
        const label = typeof m === 'number' ? undefined : m.label;
        const tooltip = typeof m === 'number' ? undefined : m.tooltip;
        const percent = this.valueToPercent(val);
        const active = isDual
          ? val >= startVal && val <= endVal
          : val <= startVal;
        return { value: val, percent, label, tooltip, active };
      });
    }

    if (intervalVal && intervalVal > 0) {
      const list: RangeInputTick[] = [];
      for (let v = min; v <= max; v += intervalVal) {
        const percent = this.valueToPercent(v);
        const active = isDual
          ? v >= startVal && v <= endVal
          : v <= startVal;
        list.push({
          value: v,
          percent,
          label: this.formatDisplayValue(v),
          active
        });
      }
      // Ensure max is included if not strictly a multiple
      if ((max - min) % intervalVal !== 0) {
        list.push({
          value: max,
          percent: 100,
          label: this.formatDisplayValue(max),
          active: isDual ? endVal >= max : startVal >= max
        });
      }
      return list;
    }

    return [];
  });

  /** Computed list of interval/tick labels */
  readonly labels = computed<RangeInputTick[]>(() => {
    const customMarks = this.marks();
    const ticksList = this.ticks();

    if (customMarks && customMarks.length > 0) {
      return ticksList.filter(t => t.label !== undefined);
    }
    return ticksList;
  });

  readonly isDragging = computed(() => this.draggingThumb() !== null);

  private onChange: (val: RangeInputValue) => void = () => { };
  private onTouched: () => void = () => { };

  // --- ControlValueAccessor Implementation ---
  writeValue(val: RangeInputValue | null): void {
    if (val === null || val === undefined) {
      this.internalValue.set(this.range() ? [this.min(), this.max()] : this.min());
    } else {
      this.internalValue.set(val);
    }
  }

  registerOnChange(fn: (val: RangeInputValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isCvaDisabled.set(isDisabled);
  }

  // --- Value Helpers & Formatting ---
  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private valueToPercent(value: number): number {
    const min = this.min();
    const span = this.span();
    const percent = ((value - min) / span) * 100;
    return Math.max(0, Math.min(100, percent));
  }

  private percentToValue(percent: number): number {
    const min = this.min();
    const span = this.span();
    return min + (percent / 100) * span;
  }

  private snapValue(value: number): number {
    const min = this.min();
    const max = this.max();

    if (this.snapToTicks()) {
      const availableTicks = this.ticks();
      if (availableTicks.length > 0) {
        let closest = availableTicks[0].value;
        let minDiff = Math.abs(value - closest);
        for (const t of availableTicks) {
          const diff = Math.abs(value - t.value);
          if (diff < minDiff) {
            minDiff = diff;
            closest = t.value;
          }
        }
        return closest;
      }
    }

    const step = this.step();
    if (step <= 0) return this.clamp(value, min, max);

    const stepsCount = Math.round((value - min) / step);
    const steppedVal = min + stepsCount * step;

    // Handle floating-point rounding precision
    const stepDecimals = (step.toString().split('.')[1] || '').length;
    const roundedVal = parseFloat(steppedVal.toFixed(stepDecimals));

    return this.clamp(roundedVal, min, max);
  }

  formatDisplayValue(val: number): string {
    const customFormatter = this.formatter();
    if (customFormatter) {
      return customFormatter(val);
    }
    const pre = this.prefix();
    const suf = this.suffix();
    return `${pre}${val.toLocaleString()}${suf}`;
  }

  isTooltipVisible(thumbIndex: number): boolean {
    const mode = this.showTooltip();
    if (mode === 'none') return false;
    if (mode === 'always') return true;
    if (mode === 'drag') return this.draggingThumb() === thumbIndex;
    if (mode === 'hover') {
      return (
        this.hoveredThumb() === thumbIndex ||
        this.draggingThumb() === thumbIndex ||
        this.focusedThumb() === thumbIndex
      );
    }
    return false;
  }

  // --- Interaction & Event Handlers ---
  private emitUpdate(newVal: RangeInputValue, source: 'drag' | 'keyboard' | 'input' | 'track-click', isFinal = false): void {
    this.internalValue.set(newVal);
    this.onChange(newVal);
    this.valueChange.emit(newVal);

    const event: RangeInputChangeEvent = { value: newVal, source };
    this.inputChange.emit(event);

    if (isFinal) {
      this.change.emit(event);
      this.markAsTouched();
    }
  }

  private markAsTouched(): void {
    if (!this.isTouched()) {
      this.isTouched.set(true);
      this.onTouched();
    }
  }

  onThumbFocus(thumbIndex: number): void {
    this.focusedThumb.set(thumbIndex);
  }

  onThumbBlur(thumbIndex: number): void {
    if (this.focusedThumb() === thumbIndex) {
      this.focusedThumb.set(null);
    }
    this.markAsTouched();
  }

  onThumbMouseEnter(thumbIndex: number): void {
    this.hoveredThumb.set(thumbIndex);
  }

  onThumbMouseLeave(thumbIndex: number): void {
    if (this.hoveredThumb() === thumbIndex) {
      this.hoveredThumb.set(null);
    }
  }

  onThumbPointerDown(thumbIndex: number, event: PointerEvent): void {
    if (this.effectiveDisabled() || this.readonly()) return;

    event.preventDefault();
    event.stopPropagation();

    this.draggingThumb.set(thumbIndex);
    this.focusedThumb.set(thumbIndex);

    const target = event.currentTarget as HTMLElement;
    target.setPointerCapture(event.pointerId);

    const onPointerMove = (e: PointerEvent) => {
      if (this.draggingThumb() !== thumbIndex) return;
      this.updateValueFromPointer(thumbIndex, e.clientX, 'drag', false);
    };

    const onPointerUp = (e: PointerEvent) => {
      target.removeEventListener('pointermove', onPointerMove);
      target.removeEventListener('pointerup', onPointerUp);
      target.removeEventListener('pointercancel', onPointerUp);

      try {
        target.releasePointerCapture(e.pointerId);
      } catch { }

      if (this.draggingThumb() === thumbIndex) {
        this.updateValueFromPointer(thumbIndex, e.clientX, 'drag', true);
        this.draggingThumb.set(null);
      }
    };

    target.addEventListener('pointermove', onPointerMove);
    target.addEventListener('pointerup', onPointerUp);
    target.addEventListener('pointercancel', onPointerUp);
  }

  onTrackPointerDown(event: PointerEvent): void {
    if (this.effectiveDisabled() || this.readonly()) return;

    const trackContainer = this.trackContainerRef()?.nativeElement;
    if (!trackContainer) return;

    const rect = trackContainer.getBoundingClientRect();
    const clickX = event.clientX;
    const clickRatio = (clickX - rect.left) / rect.width;
    const rawVal = this.percentToValue(clickRatio * 100);

    let chosenThumb = 0;
    if (this.isDualRange()) {
      const dist0 = Math.abs(rawVal - this.startValue());
      const dist1 = Math.abs(rawVal - this.endValue());
      chosenThumb = dist0 <= dist1 ? 0 : 1;
    }

    this.updateValueFromPointer(chosenThumb, clickX, 'track-click', true);

    // Focus chosen thumb
    if (chosenThumb === 0) {
      this.thumb0Ref()?.nativeElement.focus();
    } else {
      this.thumb1Ref()?.nativeElement.focus();
    }
  }

  private updateValueFromPointer(thumbIndex: number, clientX: number, source: 'drag' | 'track-click', isFinal: boolean): void {
    const trackContainer = this.trackContainerRef()?.nativeElement;
    if (!trackContainer) return;

    const rect = trackContainer.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawVal = this.percentToValue(ratio * 100);
    const steppedVal = this.snapValue(rawVal);

    if (this.isDualRange()) {
      let start = this.startValue();
      let end = this.endValue();
      const minDistance = this.minRange();
      const maxDistance = this.maxRange();

      if (thumbIndex === 0) {
        start = Math.min(steppedVal, end - minDistance);
        if (maxDistance !== null && end - start > maxDistance) {
          start = end - maxDistance;
        }
      } else {
        end = Math.max(steppedVal, start + minDistance);
        if (maxDistance !== null && end - start > maxDistance) {
          end = start + maxDistance;
        }
      }

      this.emitUpdate([start, end], source, isFinal);
    } else {
      this.emitUpdate(steppedVal, source, isFinal);
    }
  }

  onThumbKeyDown(thumbIndex: number, event: KeyboardEvent): void {
    if (this.effectiveDisabled() || this.readonly()) return;

    const step = this.step();
    const span = this.span();
    const largeStep = Math.max(step * 10, span / 10);

    let delta = 0;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        delta = step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        delta = -step;
        break;
      case 'PageUp':
        delta = largeStep;
        break;
      case 'PageDown':
        delta = -largeStep;
        break;
      case 'Home':
        delta = -(span + 1);
        break;
      case 'End':
        delta = span + 1;
        break;
      default:
        return;
    }

    event.preventDefault();

    if (this.isDualRange()) {
      let start = this.startValue();
      let end = this.endValue();
      const minDistance = this.minRange();

      if (thumbIndex === 0) {
        const nextVal = this.snapValue(start + delta);
        start = Math.min(nextVal, end - minDistance);
      } else {
        const nextVal = this.snapValue(end + delta);
        end = Math.max(nextVal, start + minDistance);
      }

      this.emitUpdate([start, end], 'keyboard', true);
    } else {
      const nextVal = this.snapValue(this.startValue() + delta);
      this.emitUpdate(nextVal, 'keyboard', true);
    }
  }

  onNumberInputChange(thumbIndex: number, event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const parsed = parseFloat(inputEl.value);
    if (isNaN(parsed)) return;

    const steppedVal = this.snapValue(parsed);

    if (this.isDualRange()) {
      let start = this.startValue();
      let end = this.endValue();
      const minDistance = this.minRange();

      if (thumbIndex === 0) {
        start = Math.min(steppedVal, end - minDistance);
      } else {
        end = Math.max(steppedVal, start + minDistance);
      }

      inputEl.value = (thumbIndex === 0 ? start : end).toString();
      this.emitUpdate([start, end], 'input', true);
    } else {
      inputEl.value = steppedVal.toString();
      this.emitUpdate(steppedVal, 'input', true);
    }
  }

  onTickClick(tick: RangeInputTick, event: MouseEvent): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    event.stopPropagation();

    const targetVal = tick.value;
    if (this.isDualRange()) {
      const dist0 = Math.abs(targetVal - this.startValue());
      const dist1 = Math.abs(targetVal - this.endValue());
      let start = this.startValue();
      let end = this.endValue();

      if (dist0 <= dist1) {
        start = Math.min(targetVal, end - this.minRange());
      } else {
        end = Math.max(targetVal, start + this.minRange());
      }
      this.emitUpdate([start, end], 'track-click', true);
    } else {
      this.emitUpdate(targetVal, 'track-click', true);
    }
  }

  onLabelClick(tick: RangeInputTick, event: MouseEvent): void {
    this.onTickClick(tick, event);
  }
}
