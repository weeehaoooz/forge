import type { Moment } from 'moment';

export interface DateRangeValue {
  startDate: string | Date | Moment | null;
  endDate: string | Date | Moment | null;
}

export interface InternalDateRange {
  startDate: Moment | null;
  endDate: Moment | null;
}

export interface DateRangePreset {
  label: string;
  key?: string;
  isDuration?: boolean;
  getValue?: (referenceDate?: Moment | null) => InternalDateRange;
  duration?: {
    days?: number;
    weeks?: number;
    months?: number;
    years?: number;
  };
}

export interface RangeCalendarDay {
  date: Moment;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelectedStart: boolean;
  isSelectedEnd: boolean;
  isInRange: boolean;
  isHoveredRange: boolean;
  isDisabled: boolean;
  isFocused: boolean;
}
