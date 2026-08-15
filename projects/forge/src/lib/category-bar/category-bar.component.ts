import {
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { ForgeTooltipDirective } from '../tooltip/tooltip.directive';
import {
  CategoryBarColorScheme,
  CategoryBarComputedSegment,
  CategoryBarLabelPosition,
  CategoryBarMarker,
  CategoryBarMarkerClickEvent,
  CategoryBarScaleLabel,
  CategoryBarSegment,
  CategoryBarSegmentClickEvent,
  CategoryBarShape,
  CategoryBarSize
} from './category-bar.types';

const PRESET_PALETTE: Record<string, string> = {
  blue: '#3b82f6',
  emerald: '#10b981',
  violet: '#8b5cf6',
  purple: '#9333ea',
  amber: '#f59e0b',
  orange: '#f97316',
  rose: '#f43f5e',
  pink: '#ec4899',
  cyan: '#06b6d4',
  lime: '#84cc16',
  indigo: '#6366f1',
  teal: '#14b8a6',
  sky: '#0284c7',
  red: '#ef4444',
  slate: '#64748b'
};

const DEFAULT_COLOR_ORDER: string[] = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#6366f1', // indigo
  '#14b8a6'  // teal
];

@Component({
  selector: 'forge-category-bar',
  imports: [ForgeTooltipDirective],
  templateUrl: './category-bar.component.html',
  styleUrl: './category-bar.component.scss',
  host: {
    'class': 'forge-category-bar',
    '[class.forge-category-bar-animated]': 'animated()',
    '[class.forge-category-bar-sm]': 'size() === "sm"',
    '[class.forge-category-bar-md]': 'size() === "md"',
    '[class.forge-category-bar-lg]': 'size() === "lg"',
    '[class.forge-category-bar-xs]': 'size() === "xs"',
    '[attr.role]': '"meter"',
    '[attr.aria-valuenow]': 'markerVal()',
    '[attr.aria-valuemin]': 'computedMin()',
    '[attr.aria-valuemax]': 'computedMax()',
    '[attr.aria-label]': 'ariaLabel()'
  }
})
export class ForgeCategoryBarComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  /**
   * Simple numeric values array for each category (e.g. [120, 80, 60, 40]).
   */
  readonly values = input<number[] | null>(null);

  /**
   * Detailed category segments with labels, colors, and metadata.
   */
  readonly categories = input<CategoryBarSegment[] | null>(null);

  /**
   * Custom palette or color list for segments. Can be CSS color strings or preset names.
   */
  readonly colors = input<string[]>(DEFAULT_COLOR_ORDER);

  /**
   * Numeric position for the needle marker.
   */
  readonly markerValue = input<number | null>(null);

  /**
   * Detailed marker object definition.
   */
  readonly marker = input<CategoryBarMarker | null>(null);

  /**
   * Minimum scale bound (defaults to 0).
   */
  readonly minValue = input<number | null>(null);

  /**
   * Maximum scale bound (defaults to sum of all category values).
   */
  readonly maxValue = input<number | null>(null);

  /**
   * Whether to show category scale labels at segment boundaries.
   */
  readonly showLabels = input<boolean>(true);

  /**
   * Custom boundary label strings. If not provided, computed cumulative values are shown.
   */
  readonly labels = input<string[] | null>(null);

  /**
   * Placement of scale boundary labels: 'top', 'bottom', or 'none'.
   */
  readonly labelPosition = input<CategoryBarLabelPosition>('top');

  /**
   * Custom label formatter function for boundary values.
   */
  readonly labelFormatter = input<((value: number, index: number) => string) | null>(null);

  /**
   * Custom value formatter for segment tooltip / legends.
   */
  readonly valueFormatter = input<((value: number) => string) | null>(null);

  /**
   * Custom marker value formatter for tooltip.
   */
  readonly markerFormatter = input<((value: number) => string) | null>(null);

  /**
   * Height size variant of the category bar: 'xs' (6px), 'sm' (8px), 'md' (12px), 'lg' (16px).
   */
  readonly size = input<CategoryBarSize>('md');

  /**
   * Corner shape of the bar: 'pill' (fully rounded capsule), 'rounded' (6px), 'square' (0px).
   */
  readonly shape = input<CategoryBarShape>('pill');

  /**
   * Optional title above the bar.
   */
  readonly title = input<string>('');

  /**
   * Optional subtitle below the title.
   */
  readonly subtitle = input<string>('');

  /**
   * Whether to display a bottom legend row with category names and color indicators.
   */
  readonly showLegend = input<boolean>(false);

  /**
   * Whether hovering segments or marker displays interactive tooltips.
   */
  readonly showTooltip = input<boolean>(true);

  /**
   * Enable smooth CSS transition animation.
   */
  readonly animated = input<boolean>(true);

  /**
   * Output event when a segment is clicked.
   */
  readonly segmentClick = output<CategoryBarSegmentClickEvent>();

  /**
   * Output event when the marker is clicked.
   */
  readonly markerClick = output<CategoryBarMarkerClickEvent>();

  /**
   * Output event when a segment is hovered.
   */
  readonly segmentHover = output<CategoryBarComputedSegment | null>();

  // Internal reactive hover states
  protected readonly hoveredSegment = signal<CategoryBarComputedSegment | null>(null);
  protected readonly hoveredMarker = signal<boolean>(false);
  protected readonly tooltipPosition = signal<{ x: number; y: number } | null>(null);

  /**
   * Resolves raw category items from either `categories` or `values` input.
   */
  private readonly rawCategories = computed<CategoryBarSegment[]>(() => {
    const cats = this.categories();
    if (cats && cats.length > 0) {
      return cats;
    }
    const vals = this.values();
    if (vals && vals.length > 0) {
      return vals.map((val, idx) => ({
        value: val,
        label: `Category ${idx + 1}`
      }));
    }
    return [];
  });

  /**
   * Resolved color array mapping named color presets to hex codes if needed.
   */
  private readonly resolvedPalette = computed<string[]>(() => {
    const customColors = this.colors();
    if (customColors && customColors.length > 0) {
      return customColors.map(c => PRESET_PALETTE[c] || c);
    }
    return DEFAULT_COLOR_ORDER;
  });

  /**
   * Total sum of all positive category values.
   */
  protected readonly totalSum = computed<number>(() => {
    const raw = this.rawCategories();
    return raw.reduce((sum, item) => sum + Math.max(0, item.value || 0), 0);
  });

  /**
   * Computed minimum boundary.
   */
  protected readonly computedMin = computed<number>(() => {
    const customMin = this.minValue();
    return customMin !== null ? customMin : 0;
  });

  /**
   * Computed maximum boundary.
   */
  protected readonly computedMax = computed<number>(() => {
    const customMax = this.maxValue();
    if (customMax !== null) {
      return customMax;
    }
    const sum = this.totalSum();
    return sum > 0 ? sum : 100;
  });

  /**
   * Normalized computed segments for rendering with cumulative positions and percentages.
   */
  protected readonly normalizedSegments = computed<CategoryBarComputedSegment[]>(() => {
    const raw = this.rawCategories();
    const total = this.totalSum();
    const palette = this.resolvedPalette();
    const vFormatter = this.valueFormatter();

    if (raw.length === 0 || total <= 0) {
      return [];
    }

    let cumulative = 0;

    return raw.map((item, index) => {
      const val = Math.max(0, item.value || 0);
      const percentage = (val / total) * 100;
      const start = cumulative;
      const end = cumulative + val;
      const startPercent = (start / total) * 100;
      const endPercent = (end / total) * 100;
      cumulative = end;

      // Color resolution
      let color = item.color;
      if (!color && item.colorScheme) {
        color = PRESET_PALETTE[item.colorScheme] || item.colorScheme;
      }
      if (!color) {
        color = palette[index % palette.length];
      }

      const formattedVal = vFormatter ? vFormatter(val) : val.toLocaleString();
      const label = item.label || `Category ${index + 1}`;
      const tooltipText = item.tooltip || `${label}: ${formattedVal} (${percentage.toFixed(1)}%)`;

      return {
        index,
        value: val,
        label,
        color,
        percentage,
        cumulativeStart: start,
        cumulativeEnd: end,
        cumulativeStartPercent: startPercent,
        cumulativeEndPercent: endPercent,
        formattedValue: formattedVal,
        tooltipText,
        raw: item
      };
    });
  });

  /**
   * Computed scale boundary labels positioned at tick intersections.
   */
  protected readonly scaleLabels = computed<CategoryBarScaleLabel[]>(() => {
    if (!this.showLabels() || this.labelPosition() === 'none') {
      return [];
    }

    const customLabels = this.labels();
    const segments = this.normalizedSegments();
    const lFormatter = this.labelFormatter();
    const min = this.computedMin();
    const max = this.computedMax();

    if (customLabels && customLabels.length > 0) {
      const count = customLabels.length;
      return customLabels.map((text, index) => {
        const leftPercent = count > 1 ? (index / (count - 1)) * 100 : 0;
        return {
          index,
          value: min + ((max - min) * leftPercent) / 100,
          text,
          leftPercent
        };
      });
    }

    if (segments.length === 0) {
      return [];
    }

    // Generate boundary ticks: [0, seg1.end, seg2.end, ...]
    const ticks: CategoryBarScaleLabel[] = [];

    // Start tick (0 / min)
    const startVal = min;
    const startText = lFormatter ? lFormatter(startVal, 0) : startVal.toLocaleString();
    ticks.push({
      index: 0,
      value: startVal,
      text: startText,
      leftPercent: 0
    });

    segments.forEach((seg, idx) => {
      const val = seg.cumulativeEnd;
      const text = lFormatter ? lFormatter(val, idx + 1) : val.toLocaleString();
      ticks.push({
        index: idx + 1,
        value: val,
        text,
        leftPercent: seg.cumulativeEndPercent
      });
    });

    return ticks;
  });

  /**
   * Resolved marker value.
   */
  protected readonly markerVal = computed<number | null>(() => {
    const m = this.marker();
    if (m && typeof m.value === 'number') {
      return m.value;
    }
    const mv = this.markerValue();
    return typeof mv === 'number' ? mv : null;
  });

  /**
   * Marker needle placement and metadata.
   */
  protected readonly markerState = computed<{
    visible: boolean;
    percent: number;
    color: string;
    label: string;
    tooltip: string;
    variant: 'pill' | 'line' | 'pin' | 'needle';
  } | null>(() => {
    const val = this.markerVal();
    if (val === null) {
      return null;
    }

    const min = this.computedMin();
    const max = this.computedMax();
    const span = max - min;
    if (span <= 0) {
      return null;
    }

    const rawPercent = ((val - min) / span) * 100;
    const clampedPercent = Math.max(0, Math.min(100, rawPercent));

    const m = this.marker();
    const mFormatter = this.markerFormatter();
    const formattedVal = mFormatter ? mFormatter(val) : val.toLocaleString();

    // Pick marker color: custom marker color -> category color at that position -> primary accent
    let color = m?.color;
    if (!color) {
      const segments = this.normalizedSegments();
      const currentSegment = segments.find(
        s => clampedPercent >= s.cumulativeStartPercent && clampedPercent <= s.cumulativeEndPercent
      );
      color = currentSegment ? currentSegment.color : '#6366f1';
    }

    const label = m?.label || `Marker: ${formattedVal}`;
    const tooltip = m?.tooltip || `${label} (${clampedPercent.toFixed(1)}%)`;
    const variant = m?.variant || 'pill';

    return {
      visible: true,
      percent: clampedPercent,
      color,
      label,
      tooltip,
      variant
    };
  });

  /**
   * Accessible description for screen readers.
   */
  protected readonly ariaLabel = computed<string>(() => {
    const t = this.title();
    const mVal = this.markerVal();
    const total = this.totalSum();
    if (t) {
      return `${t}, Total: ${total}${mVal !== null ? `, Current Marker: ${mVal}` : ''}`;
    }
    return `Category bar with ${this.rawCategories().length} categories, Total: ${total}`;
  });

  // Event handlers
  onSegmentClick(seg: CategoryBarComputedSegment, event: Event): void {
    this.segmentClick.emit({
      segment: seg,
      index: seg.index,
      event
    });
  }

  onSegmentMouseEnter(seg: CategoryBarComputedSegment, event: MouseEvent): void {
    this.hoveredSegment.set(seg);
    this.segmentHover.emit(seg);
    this.updateTooltipPos(event);
  }

  onSegmentMouseLeave(): void {
    this.hoveredSegment.set(null);
    this.segmentHover.emit(null);
  }

  onMarkerMouseEnter(event: MouseEvent): void {
    this.hoveredMarker.set(true);
    this.updateTooltipPos(event);
  }

  onMarkerMouseLeave(): void {
    this.hoveredMarker.set(false);
  }

  onMarkerClick(event: Event): void {
    const ms = this.markerState();
    const mVal = this.markerVal();
    if (ms && mVal !== null) {
      const mObj: CategoryBarMarker = this.marker() || { value: mVal };
      this.markerClick.emit({
        marker: mObj,
        value: mVal,
        percent: ms.percent,
        event
      });
    }
  }

  private updateTooltipPos(event: MouseEvent): void {
    const hostEl = this.elementRef.nativeElement;
    const rect = hostEl.getBoundingClientRect();
    this.tooltipPosition.set({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  }
}
