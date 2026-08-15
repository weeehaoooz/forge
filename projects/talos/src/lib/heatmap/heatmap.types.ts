import type { DateRangeValue } from '@talos/components/form/date-range-picker';


/**
 * Talos Heatmap Type Definitions
 */

export type HeatmapColorScheme = 'indigo' | 'blue' | 'emerald' | 'rose' | 'amber' | 'violet' | 'slate' | 'custom';

export type HeatmapTimeFormat = '12h' | '24h';

export type HeatmapCellShape = 'pill' | 'rounded' | 'square';

export type HeatmapCellSize = 'sm' | 'md' | 'lg';

export type HeatmapExportFormat = 'csv' | 'json';

export type HeatmapInterval = 'hour' | 'day';

/**
 * Standard flat data point representing an activity count for a given time slot.
 */
export interface HeatmapDataPoint {
  /** Day label ('Mon', 'Tue', ...), Day index (0-6), or Date string / object ('2026-08-13') */
  day?: string | number | Date;
  /** Specific ISO Date string ('2026-08-13') or Date object */
  date?: string | Date;
  /** Hour of the day (0 to 23), required for 'hour' interval */
  hour?: number;
  /** Numeric count / intensity value */
  value: number;
  /** Optional metadata passed to click events & tooltip */
  meta?: Record<string, unknown>;
}

/**
 * 2D Record Map format: { [colKey: string]: { [rowKey: string | number]: number } }
 */
export type HeatmapMatrixData = Record<string, Record<number | string, number>>;

/**
 * Raw timestamp list format: Array of ISO strings, Date objects, or unix timestamps in ms.
 */
export type HeatmapTimestampData = (string | Date | number)[];

/**
 * Combined developer input data types.
 */
export type HeatmapDataInput = HeatmapDataPoint[] | HeatmapMatrixData | HeatmapTimestampData;

/**
 * Multi-metric dataset item for switching metrics via the header dropdown.
 */
export interface HeatmapMetric {
  id: string;
  label: string;
  data: HeatmapDataInput;
  unit?: string;
  colorScheme?: HeatmapColorScheme;
  customColorStops?: [string, string];
}

/**
 * Internal normalized cell model rendered in the template.
 */
export interface HeatmapCell {
  id: string;
  colKey: string | number;
  colLabel: string;
  rowKey: string | number;
  rowLabel: string;
  value: number;
  intensity: number; // 0.0 to 1.0
  backgroundColor: string;
  textColor: string;
  formattedValue: string;
  tooltipText: string;
  date?: Date;
  meta?: Record<string, unknown>;
}

/**
 * Time range emitted by the component for backend data fetching.
 */
export interface HeatmapTimeRange {
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  interval: HeatmapInterval;
  startHour?: number;
  endHour?: number;
  days: string[];
  dateRange?: DateRangeValue | null;
  swapAxes?: boolean;
}

/**
 * Event payload emitted when a heatmap cell is clicked or activated.
 */
export interface HeatmapCellClickEvent {
  cell: HeatmapCell;
  colKey: string | number;
  rowKey: string | number;
  value: number;
  interval: HeatmapInterval;
  event: MouseEvent | KeyboardEvent;
}
