import {
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideRefreshCw,
  LucideUpload,
  LucideMaximize2,
  LucideMinimize2,
  LucideChevronDown,
  LucideCheck,
  LucideFileSpreadsheet,
  LucideFileJson,
  LucideCalendar,
  LucideClock
} from '@lucide/angular';
import moment from 'moment';
import type { Moment } from 'moment';
import { DateRangePickerComponent } from '@forge/components/form/date-range-picker';
import type { DateRangePreset, DateRangeValue } from '@forge/components/form/date-range-picker';
import {
  HeatmapCell,
  HeatmapCellClickEvent,
  HeatmapCellShape,
  HeatmapCellSize,
  HeatmapColorScheme,
  HeatmapDataInput,
  HeatmapDataPoint,
  HeatmapExportFormat,
  HeatmapInterval,
  HeatmapMatrixData,
  HeatmapMetric,
  HeatmapTimeFormat,
  HeatmapTimeRange,
  HeatmapTimestampData
} from './heatmap.types';

const DEFAULT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface ColorStop {
  r: number;
  g: number;
  b: number;
}

const PALETTE_CONFIG: Record<
  HeatmapColorScheme,
  { zero: { bg: string; text: string }; min: ColorStop; max: ColorStop; gradientCss: string }
> = {
  indigo: {
    zero: { bg: '#eef2ff', text: '#4338ca' },
    min: { r: 219, g: 228, b: 255 }, // #dbe4ff
    max: { r: 67, g: 56, b: 202 },    // #4338ca
    gradientCss: 'linear-gradient(90deg, #dbe4ff 0%, #818cf8 50%, #4338ca 100%)'
  },
  blue: {
    zero: { bg: '#eff6ff', text: '#1d4ed8' },
    min: { r: 219, g: 234, b: 254 }, // #dbeafe
    max: { r: 29, g: 78, b: 216 },   // #1d4ed8
    gradientCss: 'linear-gradient(90deg, #dbeafe 0%, #60a5fa 50%, #1d4ed8 100%)'
  },
  emerald: {
    zero: { bg: '#ecfdf5', text: '#047857' },
    min: { r: 209, g: 250, b: 229 }, // #d1fae5
    max: { r: 4, g: 120, b: 87 },    // #047857
    gradientCss: 'linear-gradient(90deg, #d1fae5 0%, #34d399 50%, #047857 100%)'
  },
  rose: {
    zero: { bg: '#fff1f2', text: '#be123c' },
    min: { r: 255, g: 228, b: 230 }, // #ffe4e6
    max: { r: 190, g: 18, b: 60 },   // #be123c
    gradientCss: 'linear-gradient(90deg, #ffe4e6 0%, #fb7185 50%, #be123c 100%)'
  },
  amber: {
    zero: { bg: '#fffbeb', text: '#b45309' },
    min: { r: 254, g: 243, b: 199 }, // #fef3c7
    max: { r: 180, g: 83, b: 9 },    // #b45309
    gradientCss: 'linear-gradient(90deg, #fef3c7 0%, #fbbf24 50%, #b45309 100%)'
  },
  violet: {
    zero: { bg: '#f5f3ff', text: '#6d28d9' },
    min: { r: 237, g: 233, b: 254 }, // #ede9fe
    max: { r: 109, g: 40, b: 217 },  // #6d28d9
    gradientCss: 'linear-gradient(90deg, #ede9fe 0%, #a78bfa 50%, #6d28d9 100%)'
  },
  slate: {
    zero: { bg: '#f8fafc', text: '#334155' },
    min: { r: 226, g: 232, b: 240 }, // #e2e8f0
    max: { r: 51, g: 65, b: 85 },    // #334155
    gradientCss: 'linear-gradient(90deg, #e2e8f0 0%, #94a3b8 50%, #334155 100%)'
  },
  custom: {
    zero: { bg: '#eef2ff', text: '#4338ca' },
    min: { r: 219, g: 228, b: 255 },
    max: { r: 67, g: 56, b: 202 },
    gradientCss: 'linear-gradient(90deg, #dbe4ff 0%, #4338ca 100%)'
  }
};

@Component({
  selector: 'forge-heatmap',
  imports: [
    CommonModule,
    FormsModule,
    DateRangePickerComponent,
    LucideRefreshCw,
    LucideUpload,
    LucideMaximize2,
    LucideMinimize2,
    LucideChevronDown,
    LucideCheck,
    LucideFileSpreadsheet,
    LucideFileJson,
    LucideCalendar,
    LucideClock
  ],
  templateUrl: './heatmap.component.html',
  styleUrl: './heatmap.component.scss',
  host: {
    'class': 'forge-heatmap',
    '[class.forge-heatmap-expanded]': 'isExpanded()',
    '[class.forge-heatmap-loading]': 'loading()',
    '[class.forge-heatmap-sm]': 'cellSize() === "sm"',
    '[class.forge-heatmap-md]': 'cellSize() === "md"',
    '[class.forge-heatmap-lg]': 'cellSize() === "lg"',
    '[class.forge-heatmap-pill]': 'cellShape() === "pill"',
    '[class.forge-heatmap-rounded]': 'cellShape() === "rounded"',
    '[class.forge-heatmap-square]': 'cellShape() === "square"',
    '[attr.role]': '"region"',
    '[attr.aria-label]': 'title()'
  }
})
export class ForgeHeatmapComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  // Inputs & Models
  readonly data = input<HeatmapDataInput>([]);
  readonly metrics = input<HeatmapMetric[]>([]);
  readonly selectedMetricId = model<string | undefined>(undefined);
  readonly interval = model<HeatmapInterval>('hour');
  readonly dateRange = model<DateRangeValue | null>(null);
  readonly title = input<string>('Busiest times');
  readonly hoursRange = input<[number, number]>([9, 17]);
  readonly timeFormat = input<HeatmapTimeFormat>('12h');
  readonly days = input<string[]>(DEFAULT_DAYS);
  readonly colorScheme = input<HeatmapColorScheme>('indigo');
  readonly customColorStops = input<[string, string] | undefined>(undefined);
  readonly showLegend = input<boolean>(true);
  readonly showValues = input<boolean>(true);
  readonly cellShape = input<HeatmapCellShape>('pill');
  readonly cellSize = input<HeatmapCellSize>('md');
  readonly loading = input<boolean>(false);
  readonly showToolbar = input<boolean>(true);
  readonly showRefresh = input<boolean>(true);
  readonly showExport = input<boolean>(true);
  readonly showExpand = input<boolean>(true);
  readonly showIntervalToggle = input<boolean>(false);
  readonly showDateRangePicker = input<boolean>(false);
  readonly dateRangePresets = input<DateRangePreset[] | null>(null);
  readonly unit = input<string>('');
  readonly maxValue = input<number | undefined>(undefined);
  readonly minValue = input<number | undefined>(undefined);

  // Outputs
  readonly cellClick = output<HeatmapCellClickEvent>();
  readonly cellHover = output<HeatmapCell | null>();
  readonly timeRangeChange = output<HeatmapTimeRange>();
  readonly refresh = output<void>();
  readonly metricChange = output<HeatmapMetric>();
  readonly export = output<{ format: HeatmapExportFormat; data: unknown }>();

  // State signals
  readonly isExpanded = signal<boolean>(false);
  readonly isMetricDropdownOpen = signal<boolean>(false);
  readonly isExportDropdownOpen = signal<boolean>(false);
  readonly hoveredCell = signal<HeatmapCell | null>(null);
  readonly focusedCoord = signal<{ colIndex: number; rowIndex: number } | null>(null);

  // Active Metric computation
  readonly currentMetric = computed<HeatmapMetric | undefined>(() => {
    const list = this.metrics();
    if (!list || list.length === 0) return undefined;
    const selectedId = this.selectedMetricId();
    if (selectedId) {
      const found = list.find((m) => m.id === selectedId);
      if (found) return found;
    }
    return list[0];
  });

  // Effective Active Color Scheme
  readonly activeColorScheme = computed<HeatmapColorScheme>(() => {
    const metric = this.currentMetric();
    if (metric && metric.colorScheme) return metric.colorScheme;
    return this.colorScheme();
  });

  // Effective Unit
  readonly activeUnit = computed<string>(() => {
    const metric = this.currentMetric();
    if (metric && metric.unit !== undefined) return metric.unit;
    return this.unit();
  });

  // Effective Raw Data Input
  readonly activeDataInput = computed<HeatmapDataInput>(() => {
    const metric = this.currentMetric();
    if (metric) return metric.data;
    return this.data();
  });

  // Hours array from range (for hour-by-hour mode)
  readonly hours = computed<number[]>(() => {
    const [start, end] = this.hoursRange();
    const clampedStart = Math.max(0, Math.min(23, start));
    const clampedEnd = Math.max(clampedStart, Math.min(23, end));
    const result: number[] = [];
    for (let h = clampedStart; h <= clampedEnd; h++) {
      result.push(h);
    }
    return result;
  });

  // Resolved Date Range (Moment bounds)
  readonly parsedDateRange = computed<{ start: Moment | null; end: Moment | null }>(() => {
    const dr = this.dateRange();
    if (!dr || (!dr.startDate && !dr.endDate)) {
      return { start: null, end: null };
    }
    const s = dr.startDate ? moment(dr.startDate).startOf('day') : null;
    const e = dr.endDate ? moment(dr.endDate).endOf('day') : (s ? s.clone().endOf('day') : null);
    return { start: s, end: e };
  });

  // Day list for Day-by-Day mode (weeks grouping)
  readonly dayModeWeeks = computed<{ label: string; start: Moment; end: Moment; days: Moment[] }[]>(() => {
    const { start, end } = this.parsedDateRange();
    const effectiveStart = start || moment().subtract(3, 'weeks').startOf('isoWeek');
    const effectiveEnd = end || moment().endOf('isoWeek');

    const weeks: { label: string; start: Moment; end: Moment; days: Moment[] }[] = [];
    const currentWeekStart = effectiveStart.clone().startOf('isoWeek');
    const lastWeekEnd = effectiveEnd.clone().endOf('isoWeek');

    while (currentWeekStart.isSameOrBefore(lastWeekEnd, 'day')) {
      const currentWeekEnd = currentWeekStart.clone().add(6, 'days');
      const daysInWeek: Moment[] = [];

      for (let i = 0; i < 7; i++) {
        daysInWeek.push(currentWeekStart.clone().add(i, 'days'));
      }

      const label = `${currentWeekStart.format('MMM D')} - ${currentWeekEnd.format('MMM D')}`;
      weeks.push({
        label,
        start: currentWeekStart.clone(),
        end: currentWeekEnd.clone(),
        days: daysInWeek
      });

      currentWeekStart.add(1, 'week');
    }

    return weeks;
  });

  // Normalized Value Map:
  // For 'hour': Map<`${colKey}_${hour}`, { value, meta }>
  // For 'day': Map<`${YYYY-MM-DD}`, { value, meta }> AND Map<`${colKey}`, { value, meta }>
  readonly normalizedValueMap = computed<Map<string, { value: number; meta?: Record<string, unknown> }>>(() => {
    const map = new Map<string, { value: number; meta?: Record<string, unknown> }>();
    const rawInput = this.activeDataInput();
    const currentDays = this.days();
    const currentInterval = this.interval();

    if (!rawInput) return map;

    if (Array.isArray(rawInput)) {
      if (rawInput.length === 0) return map;

      const firstItem = rawInput[0];

      if (
        typeof firstItem === 'string' ||
        firstItem instanceof Date ||
        (typeof firstItem === 'number' && firstItem > 1000000000)
      ) {
        // Raw Timestamp list
        (rawInput as HeatmapTimestampData).forEach((ts) => {
          const date = new Date(ts);
          if (!isNaN(date.getTime())) {
            const m = moment(date);
            if (currentInterval === 'day') {
              const dayKey = m.format('YYYY-MM-DD');
              const existing = map.get(dayKey);
              if (existing) existing.value += 1;
              else map.set(dayKey, { value: 1 });
            } else {
              const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              const dayName = dayNames[date.getDay()];
              const matchedDay = currentDays.find((d) => d.toLowerCase().startsWith(dayName.toLowerCase())) || dayName;
              const hour = date.getHours();
              const key = `${matchedDay}_${hour}`;
              const existing = map.get(key);
              if (existing) existing.value += 1;
              else map.set(key, { value: 1 });
            }
          }
        });
      } else {
        // HeatmapDataPoint array
        (rawInput as HeatmapDataPoint[]).forEach((point) => {
          if (currentInterval === 'day') {
            let dayKey = '';
            if (point.date) {
              dayKey = moment(point.date).format('YYYY-MM-DD');
            } else if (point.day instanceof Date) {
              dayKey = moment(point.day).format('YYYY-MM-DD');
            } else if (typeof point.day === 'string' && /^\d{4}-\d{2}-\d{2}/.test(point.day)) {
              dayKey = point.day.substring(0, 10);
            } else {
              dayKey = String(point.day ?? '');
            }

            if (dayKey) {
              const existing = map.get(dayKey);
              if (existing) {
                existing.value += point.value;
                if (point.meta) existing.meta = { ...existing.meta, ...point.meta };
              } else {
                map.set(dayKey, { value: point.value, meta: point.meta });
              }
            }
          } else {
            // Hour by hour
            let dayKey = '';
            if (point.day instanceof Date) {
              const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              const dayName = dayNames[point.day.getDay()];
              dayKey = currentDays.find((d) => d.toLowerCase().startsWith(dayName.toLowerCase())) || dayName;
            } else if (typeof point.day === 'number') {
              dayKey = currentDays[point.day] || String(point.day);
            } else {
              dayKey = String(point.day ?? '');
            }

            const hour = point.hour ?? 0;
            const key = `${dayKey}_${hour}`;
            const existing = map.get(key);
            if (existing) {
              existing.value += point.value;
              if (point.meta) existing.meta = { ...existing.meta, ...point.meta };
            } else {
              map.set(key, { value: point.value, meta: point.meta });
            }
          }
        });
      }
    } else if (typeof rawInput === 'object') {
      // HeatmapMatrixData
      const matrix = rawInput as HeatmapMatrixData;
      Object.entries(matrix).forEach(([outerKey, innerObj]) => {
        if (typeof innerObj === 'object' && innerObj !== null) {
          Object.entries(innerObj).forEach(([innerKey, val]) => {
            const numVal = Number(val) || 0;
            if (currentInterval === 'day') {
              const key = `${outerKey}_${innerKey}`;
              map.set(key, { value: numVal });
            } else {
              const isInnerHour = !isNaN(Number(innerKey));
              if (isInnerHour) {
                const hour = Number(innerKey);
                const key = `${outerKey}_${hour}`;
                map.set(key, { value: numVal });
              } else {
                const hour = Number(outerKey);
                const key = `${innerKey}_${hour}`;
                map.set(key, { value: numVal });
              }
            }
          });
        }
      });
    }

    return map;
  });

  // Effective min & max value for heat scale
  readonly computedScaleBounds = computed<{ min: number; max: number }>(() => {
    const customMin = this.minValue();
    const customMax = this.maxValue();
    const map = this.normalizedValueMap();

    let dataMax = 0;
    for (const item of map.values()) {
      if (item.value > dataMax) dataMax = item.value;
    }

    const min = customMin !== undefined ? customMin : 0;
    const max = customMax !== undefined ? customMax : Math.max(1, dataMax);

    return { min, max };
  });

  // Gradient CSS for Legend bar
  readonly legendGradientCss = computed<string>(() => {
    const scheme = this.activeColorScheme();
    return PALETTE_CONFIG[scheme]?.gradientCss || PALETTE_CONFIG.indigo.gradientCss;
  });

  // Grid Matrix computation
  readonly gridRows = computed<{ key: string | number; label: string; cells: HeatmapCell[] }[]>(() => {
    const currentInterval = this.interval();
    const map = this.normalizedValueMap();
    const { min, max } = this.computedScaleBounds();
    const scheme = this.activeColorScheme();
    const palette = PALETTE_CONFIG[scheme] || PALETTE_CONFIG.indigo;
    const unitStr = this.activeUnit();
    const unitSuffix = unitStr ? ` ${unitStr}` : '';

    if (currentInterval === 'day') {
      // Day-by-Day Mode: Rows = Weeks, Columns = Mon..Sun
      const weeks = this.dayModeWeeks();
      const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

      return weeks.map((week, weekIdx) => {
        const cells: HeatmapCell[] = week.days.map((d, dayIdx) => {
          const dateStr = d.format('YYYY-MM-DD');
          const dayName = dayLabels[dayIdx];
          const entry = map.get(dateStr) || map.get(`${dayName}_${weekIdx}`);
          const val = entry?.value ?? 0;

          const intensity = max > min ? Math.max(0, Math.min(1, (val - min) / (max - min))) : 0;

          let bgColor = '';
          let textColor = '';

          if (val === 0) {
            bgColor = palette.zero.bg;
            textColor = palette.zero.text;
          } else {
            const r = Math.round(palette.min.r + (palette.max.r - palette.min.r) * intensity);
            const g = Math.round(palette.min.g + (palette.max.g - palette.min.g) * intensity);
            const b = Math.round(palette.min.b + (palette.max.b - palette.min.b) * intensity);
            bgColor = `rgb(${r}, ${g}, ${b})`;
            textColor = intensity >= 0.55 ? '#ffffff' : palette.zero.text;
          }

          const tooltip = `${d.format('dddd, MMMM D, YYYY')}: ${val}${unitSuffix}`;

          return {
            id: dateStr,
            colKey: dayName,
            colLabel: `${dayName} (${d.format('D')})`,
            rowKey: week.label,
            rowLabel: week.label,
            value: val,
            intensity,
            backgroundColor: bgColor,
            textColor,
            formattedValue: String(val),
            tooltipText: tooltip,
            date: d.toDate(),
            meta: entry?.meta
          };
        });

        return {
          key: week.label,
          label: week.label,
          cells
        };
      });
    }

    // Hour-by-Hour Mode: Rows = Hours, Columns = Days
    const hoursList = this.hours();
    const colsList = this.days();
    const format = this.timeFormat();

    return hoursList.map((hour) => {
      const hourLabel = this.formatHourLabel(hour, format);
      const cells: HeatmapCell[] = colsList.map((col) => {
        const key = `${col}_${hour}`;
        const entry = map.get(key);
        const val = entry?.value ?? 0;

        const intensity = max > min ? Math.max(0, Math.min(1, (val - min) / (max - min))) : 0;

        let bgColor = '';
        let textColor = '';

        if (val === 0) {
          bgColor = palette.zero.bg;
          textColor = palette.zero.text;
        } else {
          const r = Math.round(palette.min.r + (palette.max.r - palette.min.r) * intensity);
          const g = Math.round(palette.min.g + (palette.max.g - palette.min.g) * intensity);
          const b = Math.round(palette.min.b + (palette.max.b - palette.min.b) * intensity);
          bgColor = `rgb(${r}, ${g}, ${b})`;
          textColor = intensity >= 0.55 ? '#ffffff' : palette.zero.text;
        }

        const tooltip = `${col} ${hourLabel}: ${val}${unitSuffix}`;

        return {
          id: key,
          colKey: col,
          colLabel: col,
          rowKey: hour,
          rowLabel: hourLabel,
          value: val,
          intensity,
          backgroundColor: bgColor,
          textColor,
          formattedValue: String(val),
          tooltipText: tooltip,
          meta: entry?.meta
        };
      });

      return {
        key: hour,
        label: hourLabel,
        cells
      };
    });
  });

  constructor() {
    // Notify parent on time range boundaries changes
    effect(() => {
      const days = this.days();
      const hours = this.hours();
      const inter = this.interval();
      const dr = this.dateRange();

      this.timeRangeChange.emit({
        interval: inter,
        startHour: hours.length > 0 ? hours[0] : undefined,
        endHour: hours.length > 0 ? hours[hours.length - 1] : undefined,
        days,
        startDate: dr?.startDate ? new Date(dr.startDate as any) : undefined,
        endDate: dr?.endDate ? new Date(dr.endDate as any) : undefined,
        dateRange: dr
      });
    });

    // Close dropdowns on outside click
    if (typeof document !== 'undefined') {
      document.addEventListener('click', (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!this.elementRef.nativeElement.contains(target)) {
          this.isMetricDropdownOpen.set(false);
          this.isExportDropdownOpen.set(false);
        }
      });
    }
  }

  formatHourLabel(hour: number, format: HeatmapTimeFormat): string {
    if (format === '24h') {
      return `${hour.toString().padStart(2, '0')}:00`;
    }
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  }

  setInterval(newInterval: HeatmapInterval): void {
    this.interval.set(newInterval);
  }

  onDateRangePickerChange(val: DateRangeValue | null): void {
    this.dateRange.set(val);
  }

  toggleExpand(): void {
    this.isExpanded.update((v) => !v);
  }

  toggleMetricDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isMetricDropdownOpen.update((v) => !v);
    this.isExportDropdownOpen.set(false);
  }

  toggleExportDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isExportDropdownOpen.update((v) => !v);
    this.isMetricDropdownOpen.set(false);
  }

  selectMetric(metric: HeatmapMetric): void {
    this.selectedMetricId.set(metric.id);
    this.isMetricDropdownOpen.set(false);
    this.metricChange.emit(metric);
  }

  onRefreshClick(): void {
    this.refresh.emit();
  }

  onCellMouseEnter(cell: HeatmapCell): void {
    this.hoveredCell.set(cell);
    this.cellHover.emit(cell);
  }

  onCellMouseLeave(): void {
    this.hoveredCell.set(null);
    this.cellHover.emit(null);
  }

  onCellClick(cell: HeatmapCell, event: MouseEvent): void {
    this.cellClick.emit({
      cell,
      colKey: cell.colKey,
      rowKey: cell.rowKey,
      value: cell.value,
      interval: this.interval(),
      event
    });
  }

  onKeydown(event: KeyboardEvent, colIdx: number, rowIdx: number): void {
    const rows = this.gridRows();
    const cols = this.days();
    let targetRow = rowIdx;
    let targetCol = colIdx;

    if (event.key === 'ArrowUp') {
      targetRow = Math.max(0, rowIdx - 1);
      event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      targetRow = Math.min(rows.length - 1, rowIdx + 1);
      event.preventDefault();
    } else if (event.key === 'ArrowLeft') {
      targetCol = Math.max(0, colIdx - 1);
      event.preventDefault();
    } else if (event.key === 'ArrowRight') {
      targetCol = Math.min(cols.length - 1, colIdx + 1);
      event.preventDefault();
    } else if (event.key === 'Enter' || event.key === ' ') {
      const cell = rows[rowIdx]?.cells[colIdx];
      if (cell) {
        this.cellClick.emit({
          cell,
          colKey: cell.colKey,
          rowKey: cell.rowKey,
          value: cell.value,
          interval: this.interval(),
          event
        });
      }
      event.preventDefault();
      return;
    }

    if (targetRow !== rowIdx || targetCol !== colIdx) {
      this.focusedCoord.set({ colIndex: targetCol, rowIndex: targetRow });
      const cellEl = this.elementRef.nativeElement.querySelector(
        `[data-cell-coord="${targetRow}_${targetCol}"]`
      ) as HTMLElement;
      cellEl?.focus();
    }
  }

  triggerExport(format: HeatmapExportFormat): void {
    this.isExportDropdownOpen.set(false);
    const rows = this.gridRows();
    const cols = this.days();

    if (format === 'csv') {
      const header = ['Period', ...cols].join(',');
      const body = rows.map((r) => [r.label, ...r.cells.map((c) => c.value)].join(',')).join('\n');
      const csvContent = `${header}\n${body}`;

      this.downloadFile(csvContent, 'text/csv;charset=utf-8;', `heatmap_${this.title().toLowerCase().replace(/\s+/g, '_')}.csv`);
      this.export.emit({ format: 'csv', data: csvContent });
    } else if (format === 'json') {
      const jsonRecords: Record<string, Record<string, number>> = {};
      rows.forEach((r) => {
        jsonRecords[r.label] = {};
        r.cells.forEach((c) => {
          jsonRecords[r.label][c.colKey] = c.value;
        });
      });
      const jsonStr = JSON.stringify(jsonRecords, null, 2);
      this.downloadFile(jsonStr, 'application/json;charset=utf-8;', `heatmap_${this.title().toLowerCase().replace(/\s+/g, '_')}.json`);
      this.export.emit({ format: 'json', data: jsonRecords });
    }
  }

  private downloadFile(content: string, mimeType: string, filename: string): void {
    if (typeof window === 'undefined') return;
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
