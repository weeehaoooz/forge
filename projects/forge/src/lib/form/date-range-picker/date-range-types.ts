export interface DateRangeValue {
  startDate: string | Date | number | null;
  endDate: string | Date | number | null;
}

export interface InternalDateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface DateRangePreset {
  label: string;
  key?: string;
  isDuration?: boolean;
  getValue?: (referenceDate?: Date | null) => InternalDateRange;
  duration?: {
    days?: number;
    weeks?: number;
    months?: number;
    years?: number;
  };
}

export interface RangeCalendarDay {
  date: Date;
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
