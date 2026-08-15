/**
 * Forge Category Bar Type Definitions
 */

export type CategoryBarSize = 'xs' | 'sm' | 'md' | 'lg';

export type CategoryBarShape = 'pill' | 'rounded' | 'square';

export type CategoryBarLabelPosition = 'top' | 'bottom' | 'none';

export type CategoryBarColorScheme =
  | 'blue'
  | 'emerald'
  | 'violet'
  | 'amber'
  | 'rose'
  | 'cyan'
  | 'lime'
  | 'indigo'
  | 'pink'
  | 'orange'
  | 'fuchsia'
  | 'teal'
  | 'sky'
  | 'red'
  | 'slate'
  | 'purple';

/**
 * Individual category segment definition for the category bar.
 */
export interface CategoryBarSegment {
  /** Segment numeric value (width will be proportional to value / sum(values)) */
  value: number;
  /** Human-readable category label (displayed in tooltip, legend, or accessibility text) */
  label?: string;
  /** Specific CSS color string (e.g. '#3b82f6', 'rgb(59, 130, 246)', 'var(--forge-primary-color)') */
  color?: string;
  /** Named color scheme preset (e.g. 'blue', 'emerald', 'violet', 'amber', 'rose', etc.) */
  colorScheme?: CategoryBarColorScheme | string;
  /** Custom tooltip text or template text */
  tooltip?: string;
  /** Optional metadata passed to click and hover events */
  meta?: Record<string, unknown>;
}

/**
 * Marker needle definition for the category bar.
 */
export interface CategoryBarMarker {
  /** Numeric value indicating where the marker sits along the range */
  value: number;
  /** Custom label displayed for the marker (e.g. 'Target: $220k', 'Current: 220') */
  label?: string;
  /** Custom marker color (defaults to neutral dark/white or category color) */
  color?: string;
  /** Custom tooltip content for the marker */
  tooltip?: string;
  /** Whether to animate marker position changes (defaults to true) */
  showAnimation?: boolean;
  /** Custom marker shape / style ('pill' | 'line' | 'pin' | 'needle') */
  variant?: 'pill' | 'line' | 'pin' | 'needle';
}

/**
 * Normalized computed segment model used internally by the template.
 */
export interface CategoryBarComputedSegment {
  index: number;
  value: number;
  label: string;
  color: string;
  percentage: number;
  cumulativeStart: number;
  cumulativeEnd: number;
  cumulativeStartPercent: number;
  cumulativeEndPercent: number;
  formattedValue: string;
  tooltipText: string;
  raw: CategoryBarSegment;
}

/**
 * Scale boundary label item.
 */
export interface CategoryBarScaleLabel {
  index: number;
  value: number;
  text: string;
  leftPercent: number;
}

/**
 * Event emitted when a segment is clicked.
 */
export interface CategoryBarSegmentClickEvent {
  segment: CategoryBarComputedSegment;
  index: number;
  event: Event;
}

export type CategoryBarClickEvent = CategoryBarSegmentClickEvent;

/**
 * Event emitted when the marker is clicked.
 */
export interface CategoryBarMarkerClickEvent {
  marker: CategoryBarMarker;
  value: number;
  percent: number;
  event: Event;
}
