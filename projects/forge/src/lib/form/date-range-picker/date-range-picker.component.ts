import {
  Component,
  ElementRef,
  ViewChild,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import moment from 'moment';
import type { Moment } from 'moment';

import {
  DateRangePreset,
  DateRangeValue,
  InternalDateRange,
  RangeCalendarDay
} from './date-range-types';
import { CalendarMonth, CalendarYear } from '../date-picker/date-picker.component';

let uniqueDateRangePickerId = 0;

@Component({
  selector: 'forge-date-range-picker',
  imports: [OverlayModule, CdkConnectedOverlay, CdkOverlayOrigin],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true
    }
  ],
  host: {
    'class': 'forge-daterangepicker-host',
    '[class.is-open]': 'isOpen()',
    '[class.is-disabled]': 'effectiveDisabled()',
    '[class.datepicker-sm]': 'size() === "sm"',
    '[class.datepicker-md]': 'size() === "md"',
    '[class.datepicker-lg]': 'size() === "lg"',
    '(keydown)': 'onKeyDown($event)',
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class DateRangePickerComponent implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  // Signal Inputs
  readonly placeholder = input<string>('Select date range');
  readonly disabled = input<boolean>(false);
  readonly clearable = input<boolean>(true);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly displayFormat = input<string>(''); // Default resolved via computed if empty
  readonly valueFormat = input<string>(''); // Default resolved via computed if empty
  readonly showTime = input<boolean>(false);
  readonly use24Hour = input<boolean>(true);
  readonly showSeconds = input<boolean>(false);
  readonly minuteStep = input<number>(1);
  readonly minDate = input<string | Date | Moment | null>(null);
  readonly maxDate = input<string | Date | Moment | null>(null);
  readonly minSpan = input<number | null>(null); // in days
  readonly maxSpan = input<number | null>(null); // in days
  readonly firstDayOfWeek = input<number>(0); // 0 = Sun, 1 = Mon
  readonly presets = input<DateRangePreset[] | null>(null);
  readonly presetType = input<'all' | 'calendar' | 'duration'>('all');
  readonly filterDate = input<((date: Moment) => boolean) | null>(null);

  // Signal Outputs
  readonly rangeChange = output<DateRangeValue | null>();
  readonly opened = output<void>();
  readonly closed = output<void>();

  // Element Refs
  @ViewChild('triggerEl') triggerEl?: ElementRef<HTMLDivElement>;
  @ViewChild('startInputEl') startInputEl?: ElementRef<HTMLInputElement>;
  @ViewChild('endInputEl') endInputEl?: ElementRef<HTMLInputElement>;

  // CDK Overlay Connected Positions
  readonly positions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 4
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -4
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 4
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: -4
    }
  ];

  // Accessibility IDs
  readonly componentId = `forge-daterangepicker-${uniqueDateRangePickerId++}`;
  readonly dialogId = `${this.componentId}-dialog`;

  // Internal Committed Selection Signals
  readonly selectedStartDate = signal<Moment | null>(null);
  readonly selectedEndDate = signal<Moment | null>(null);

  // Draft Selection Signals (Active while picking in overlay)
  readonly draftStartDate = signal<Moment | null>(null);
  readonly draftEndDate = signal<Moment | null>(null);
  readonly hoverDate = signal<Moment | null>(null);

  // Draft Time Signals
  readonly draftStartHour = signal<number>(0);
  readonly draftStartMinute = signal<number>(0);
  readonly draftStartSecond = signal<number>(0);

  readonly draftEndHour = signal<number>(23);
  readonly draftEndMinute = signal<number>(59);
  readonly draftEndSecond = signal<number>(59);

  // View state signals
  readonly viewDate = signal<Moment>(moment().startOf('month'));
  readonly isOpen = signal<boolean>(false);
  readonly isDisabledSignal = signal<boolean>(false);
  readonly isTouched = signal<boolean>(false);
  readonly activePresetLabel = signal<string | null>(null);

  // Input Text Signals for bottom action bar & trigger display
  readonly startInputText = signal<string>('');
  readonly endInputText = signal<string>('');

  // Computeds
  readonly effectiveDisabled = computed(() => this.disabled() || this.isDisabledSignal());

  readonly effectiveDisplayFormat = computed(() => {
    const fmt = this.displayFormat();
    if (fmt) return fmt;
    return this.showTime() ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD';
  });

  readonly effectiveValueFormat = computed(() => {
    const fmt = this.valueFormat();
    if (fmt) return fmt;
    return this.showTime() ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD';
  });

  readonly viewDateRight = computed(() => {
    return this.viewDate().clone().add(1, 'month');
  });

  readonly parsedMinDate = computed(() => {
    const min = this.minDate();
    if (!min) return null;
    const m = moment(min);
    return m.isValid() ? (this.showTime() ? m : m.startOf('day')) : null;
  });

  readonly parsedMaxDate = computed(() => {
    const max = this.maxDate();
    if (!max) return null;
    const m = moment(max);
    return m.isValid() ? (this.showTime() ? m : m.endOf('day')) : null;
  });

  readonly formattedTriggerValue = computed(() => {
    const start = this.selectedStartDate();
    const end = this.selectedEndDate();
    const fmt = this.effectiveDisplayFormat();

    if (start && start.isValid() && end && end.isValid()) {
      return `${start.format(fmt)}  —  ${end.format(fmt)}`;
    } else if (start && start.isValid()) {
      return `${start.format(fmt)}  —  ...`;
    }
    return '';
  });

  readonly weekDayNames = computed(() => {
    const names: string[] = [];
    const firstDay = this.firstDayOfWeek();
    const temp = moment().day(firstDay);
    for (let i = 0; i < 7; i++) {
      names.push(temp.format('dd'));
      temp.add(1, 'day');
    }
    return names;
  });

  // Effective Presets List
  readonly effectivePresets = computed<DateRangePreset[]>(() => {
    const custom = this.presets();
    if (custom && custom.length > 0) return custom;

    const type = this.presetType();
    const calendarPresets: DateRangePreset[] = [
      {
        label: 'Today',
        key: 'today',
        getValue: () => ({
          startDate: moment().startOf('day'),
          endDate: moment().endOf('day')
        })
      },
      {
        label: 'Yesterday',
        key: 'yesterday',
        getValue: () => ({
          startDate: moment().subtract(1, 'day').startOf('day'),
          endDate: moment().subtract(1, 'day').endOf('day')
        })
      },
      {
        label: 'This week',
        key: 'this_week',
        getValue: () => ({
          startDate: moment().startOf('week'),
          endDate: moment().endOf('week')
        })
      },
      {
        label: 'Last week',
        key: 'last_week',
        getValue: () => ({
          startDate: moment().subtract(1, 'week').startOf('week'),
          endDate: moment().subtract(1, 'week').endOf('week')
        })
      },
      {
        label: 'This month',
        key: 'this_month',
        getValue: () => ({
          startDate: moment().startOf('month'),
          endDate: moment().endOf('month')
        })
      },
      {
        label: 'Last month',
        key: 'last_month',
        getValue: () => ({
          startDate: moment().subtract(1, 'month').startOf('month'),
          endDate: moment().subtract(1, 'month').endOf('month')
        })
      },
      {
        label: 'This year',
        key: 'this_year',
        getValue: () => ({
          startDate: moment().startOf('year'),
          endDate: moment().endOf('year')
        })
      },
      {
        label: 'Last year',
        key: 'last_year',
        getValue: () => ({
          startDate: moment().subtract(1, 'year').startOf('year'),
          endDate: moment().subtract(1, 'year').endOf('year')
        })
      }
    ];

    const durationPresets: DateRangePreset[] = [
      { label: '+1 Day', isDuration: true, duration: { days: 1 } },
      { label: '+2 Days', isDuration: true, duration: { days: 2 } },
      { label: '+3 Days', isDuration: true, duration: { days: 3 } },
      { label: '+1 Week', isDuration: true, duration: { weeks: 1 } },
      { label: '+2 Weeks', isDuration: true, duration: { weeks: 2 } },
      { label: '+1 Month', isDuration: true, duration: { months: 1 } },
      { label: '+3 Months', isDuration: true, duration: { months: 3 } }
    ];

    if (type === 'calendar') return calendarPresets;
    if (type === 'duration') return durationPresets;
    return [...calendarPresets, ...durationPresets];
  });

  // Days Grid for Left Calendar Month
  readonly leftCalendarDays = computed(() => {
    return this.buildCalendarDays(this.viewDate());
  });

  // Days Grid for Right Calendar Month
  readonly rightCalendarDays = computed(() => {
    return this.buildCalendarDays(this.viewDateRight());
  });

  readonly isPrevDisabled = computed(() => {
    const min = this.parsedMinDate();
    if (!min) return false;
    return this.viewDate().clone().startOf('month').isSameOrBefore(min.clone().startOf('month'));
  });

  readonly isNextDisabled = computed(() => {
    const max = this.parsedMaxDate();
    if (!max) return false;
    return this.viewDateRight().clone().endOf('month').isSameOrAfter(max.clone().endOf('month'));
  });

  readonly leftHeaderLabel = computed(() => {
    return this.viewDate().format('MMMM YYYY');
  });

  readonly rightHeaderLabel = computed(() => {
    return this.viewDateRight().format('MMMM YYYY');
  });

  // ControlValueAccessor Callbacks
  private onChange: (val: unknown) => void = () => { };
  private onTouched: () => void = () => { };

  constructor() {
    // Keep draft inputs synced with draft dates
    effect(() => {
      const start = this.draftStartDate();
      const end = this.draftEndDate();
      const fmt = this.effectiveDisplayFormat();

      if (start && start.isValid()) {
        const fullStart = start.clone().hour(this.draftStartHour()).minute(this.draftStartMinute()).second(this.draftStartSecond());
        this.startInputText.set(fullStart.format(fmt));
      } else {
        this.startInputText.set('');
      }

      if (end && end.isValid()) {
        const fullEnd = end.clone().hour(this.draftEndHour()).minute(this.draftEndMinute()).second(this.draftEndSecond());
        this.endInputText.set(fullEnd.format(fmt));
      } else {
        this.endInputText.set('');
      }
    });
  }

  // ControlValueAccessor Implementation
  writeValue(val: unknown): void {
    if (!val || typeof val !== 'object') {
      this.selectedStartDate.set(null);
      this.selectedEndDate.set(null);
      return;
    }

    let startRaw: unknown = null;
    let endRaw: unknown = null;

    if (Array.isArray(val)) {
      startRaw = val[0];
      endRaw = val[1];
    } else if (val && ('startDate' in val || 'endDate' in val)) {
      const rangeVal = val as DateRangeValue;
      startRaw = rangeVal.startDate;
      endRaw = rangeVal.endDate;
    }

    const parsedStart = this.parseDateValue(startRaw);
    const parsedEnd = this.parseDateValue(endRaw);

    if (parsedStart && parsedStart.isValid()) {
      this.selectedStartDate.set(parsedStart);
      this.viewDate.set(parsedStart.clone().startOf('month'));
    } else {
      this.selectedStartDate.set(null);
    }

    if (parsedEnd && parsedEnd.isValid()) {
      this.selectedEndDate.set(parsedEnd);
    } else {
      this.selectedEndDate.set(null);
    }
  }

  registerOnChange(fn: (val: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabledSignal.set(isDisabled);
  }

  // Dropdown Controls
  toggleOpen(): void {
    if (this.effectiveDisabled()) return;
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.effectiveDisabled() || this.isOpen()) return;
    this.isOpen.set(true);

    const selStart = this.selectedStartDate();
    const selEnd = this.selectedEndDate();

    if (selStart && selStart.isValid()) {
      this.draftStartDate.set(selStart.clone());
      this.viewDate.set(selStart.clone().startOf('month'));
      this.draftStartHour.set(selStart.hour());
      this.draftStartMinute.set(selStart.minute());
      this.draftStartSecond.set(selStart.second());
    } else {
      this.draftStartDate.set(null);
      this.viewDate.set(moment().startOf('month'));
      this.draftStartHour.set(0);
      this.draftStartMinute.set(0);
      this.draftStartSecond.set(0);
    }

    if (selEnd && selEnd.isValid()) {
      this.draftEndDate.set(selEnd.clone());
      this.draftEndHour.set(selEnd.hour());
      this.draftEndMinute.set(selEnd.minute());
      this.draftEndSecond.set(selEnd.second());
    } else {
      this.draftEndDate.set(null);
      this.draftEndHour.set(23);
      this.draftEndMinute.set(59);
      this.draftEndSecond.set(59);
    }

    this.hoverDate.set(null);
    this.opened.emit();
  }

  close(): void {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.markAsTouched();
    this.closed.emit();
  }

  // Dual Calendar Month Navigation
  prevMonth(): void {
    if (this.isPrevDisabled()) return;
    this.viewDate.update((d) => d.clone().subtract(1, 'month'));
  }

  nextMonth(): void {
    if (this.isNextDisabled()) return;
    this.viewDate.update((d) => d.clone().add(1, 'month'));
  }

  // Day Selection Logic
  selectDay(day: RangeCalendarDay): void {
    if (day.isDisabled) return;
    this.activePresetLabel.set(null);

    const start = this.draftStartDate();
    const end = this.draftEndDate();

    if (!start || (start && end)) {
      // Step 1: Set new Start Date & clear End Date
      const newStart = day.date.clone().hour(this.draftStartHour()).minute(this.draftStartMinute()).second(this.draftStartSecond());
      this.draftStartDate.set(newStart);
      this.draftEndDate.set(null);
    } else {
      // Step 2: Set End Date
      let targetDate = day.date.clone();
      if (targetDate.isBefore(start, 'day')) {
        // If clicked date is before start date, swap them
        const newStart = targetDate.clone().hour(this.draftStartHour()).minute(this.draftStartMinute()).second(this.draftStartSecond());
        const newEnd = start.clone().hour(this.draftEndHour()).minute(this.draftEndMinute()).second(this.draftEndSecond());
        this.draftStartDate.set(newStart);
        this.draftEndDate.set(newEnd);
      } else {
        const newEnd = targetDate.clone().hour(this.draftEndHour()).minute(this.draftEndMinute()).second(this.draftEndSecond());
        this.draftEndDate.set(newEnd);
      }
    }
  }

  onDayHover(day: RangeCalendarDay): void {
    if (this.draftStartDate() && !this.draftEndDate()) {
      this.hoverDate.set(day.date);
    } else {
      this.hoverDate.set(null);
    }
  }

  // Preset Selection
  applyPreset(preset: DateRangePreset): void {
    this.activePresetLabel.set(preset.label);

    let newStart: Moment | null = null;
    let newEnd: Moment | null = null;

    if (preset.isDuration || preset.duration) {
      const baseStart = this.draftStartDate() || moment().startOf('day');
      newStart = baseStart.clone().hour(this.draftStartHour()).minute(this.draftStartMinute()).second(this.draftStartSecond());
      newEnd = baseStart.clone();

      if (preset.duration?.days) newEnd.add(preset.duration.days, 'days');
      if (preset.duration?.weeks) newEnd.add(preset.duration.weeks, 'weeks');
      if (preset.duration?.months) newEnd.add(preset.duration.months, 'months');
      if (preset.duration?.years) newEnd.add(preset.duration.years, 'years');

      newEnd.hour(this.draftEndHour()).minute(this.draftEndMinute()).second(this.draftEndSecond());
    } else if (preset.getValue) {
      const range = preset.getValue(this.draftStartDate());
      newStart = range.startDate;
      newEnd = range.endDate;
    }

    if (newStart && newStart.isValid()) {
      this.draftStartDate.set(newStart);
      this.viewDate.set(newStart.clone().startOf('month'));
    }
    if (newEnd && newEnd.isValid()) {
      this.draftEndDate.set(newEnd);
    }
  }

  // Apply & Cancel Overlay Actions
  applySelection(): void {
    const start = this.draftStartDate();
    const end = this.draftEndDate();

    if (!start) {
      this.selectedStartDate.set(null);
      this.selectedEndDate.set(null);
      this.emitValue(null);
      this.close();
      return;
    }

    const finalStart = start.clone().hour(this.draftStartHour()).minute(this.draftStartMinute()).second(this.draftStartSecond());
    const finalEnd = (end || start).clone().hour(this.draftEndHour()).minute(this.draftEndMinute()).second(this.draftEndSecond());

    // Ensure start is before or equal to end
    if (finalEnd.isBefore(finalStart)) {
      this.selectedStartDate.set(finalEnd);
      this.selectedEndDate.set(finalStart);
      this.emitValue({ startDate: finalEnd, endDate: finalStart });
    } else {
      this.selectedStartDate.set(finalStart);
      this.selectedEndDate.set(finalEnd);
      this.emitValue({ startDate: finalStart, endDate: finalEnd });
    }

    this.close();
  }

  cancelSelection(): void {
    this.close();
  }

  onClear(event: MouseEvent): void {
    event.stopPropagation();
    if (this.effectiveDisabled()) return;
    this.selectedStartDate.set(null);
    this.selectedEndDate.set(null);
    this.draftStartDate.set(null);
    this.draftEndDate.set(null);
    this.emitValue(null);
  }

  // Time Manipulations (Start & End)
  adjustStartHour(delta: number): void {
    this.draftStartHour.update((h) => (h + delta + 24) % 24);
  }

  adjustStartMinute(delta: number): void {
    const step = this.minuteStep();
    this.draftStartMinute.update((m) => (m + delta * step + 60) % 60);
  }

  adjustEndHour(delta: number): void {
    this.draftEndHour.update((h) => (h + delta + 24) % 24);
  }

  adjustEndMinute(delta: number): void {
    const step = this.minuteStep();
    this.draftEndMinute.update((m) => (m + delta * step + 60) % 60);
  }

  toggleStartMeridiem(): void {
    this.draftStartHour.update((h) => (h >= 12 ? h - 12 : h + 12));
  }

  toggleEndMeridiem(): void {
    this.draftEndHour.update((h) => (h >= 12 ? h - 12 : h + 12));
  }

  // Direct Typing Handlers for Start & End Input Fields in Footer
  onStartInputChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.startInputText.set(val);

    if (!val.trim()) {
      this.draftStartDate.set(null);
      return;
    }

    const formats = [
      this.effectiveDisplayFormat(),
      this.effectiveValueFormat(),
      'YYYY-MM-DD HH:mm:ss',
      'YYYY-MM-DD HH:mm',
      'YYYY-MM-DD hh:mm A',
      'YYYY-MM-DD',
      'MM/DD/YYYY HH:mm',
      'MM/DD/YYYY',
      'DD/MM/YYYY',
      'YYYY/MM/DD'
    ];
    const parsed = moment(val, formats, false);
    if (parsed.isValid()) {
      this.draftStartDate.set(parsed);
      this.draftStartHour.set(parsed.hour());
      this.draftStartMinute.set(parsed.minute());
      this.draftStartSecond.set(parsed.second());
      this.viewDate.set(parsed.clone().startOf('month'));
    }
  }

  onStartInputBlur(event: FocusEvent): void {
    const start = this.draftStartDate();
    const fmt = this.effectiveDisplayFormat();
    if (start && start.isValid()) {
      const fullStart = start.clone().hour(this.draftStartHour()).minute(this.draftStartMinute()).second(this.draftStartSecond());
      this.startInputText.set(fullStart.format(fmt));
    } else {
      this.startInputText.set('');
    }
  }

  onEndInputChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.endInputText.set(val);

    if (!val.trim()) {
      this.draftEndDate.set(null);
      return;
    }

    const formats = [
      this.effectiveDisplayFormat(),
      this.effectiveValueFormat(),
      'YYYY-MM-DD HH:mm:ss',
      'YYYY-MM-DD HH:mm',
      'YYYY-MM-DD hh:mm A',
      'YYYY-MM-DD',
      'MM/DD/YYYY HH:mm',
      'MM/DD/YYYY',
      'DD/MM/YYYY',
      'YYYY/MM/DD'
    ];
    const parsed = moment(val, formats, false);
    if (parsed.isValid()) {
      this.draftEndDate.set(parsed);
      this.draftEndHour.set(parsed.hour());
      this.draftEndMinute.set(parsed.minute());
      this.draftEndSecond.set(parsed.second());
    }
  }

  onEndInputBlur(event: FocusEvent): void {
    const end = this.draftEndDate();
    const fmt = this.effectiveDisplayFormat();
    if (end && end.isValid()) {
      const fullEnd = end.clone().hour(this.draftEndHour()).minute(this.draftEndMinute()).second(this.draftEndSecond());
      this.endInputText.set(fullEnd.format(fmt));
    } else {
      this.endInputText.set('');
    }
  }

  onFooterInputKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.applySelection();
    }
  }


  // Helper Calendar Builder
  private buildCalendarDays(viewMonth: Moment): RangeCalendarDay[] {
    const start = this.draftStartDate();
    const end = this.draftEndDate();
    const hover = this.hoverDate();
    const min = this.parsedMinDate();
    const max = this.parsedMaxDate();
    const filter = this.filterDate();
    const firstDay = this.firstDayOfWeek();
    const minS = this.minSpan();
    const maxS = this.maxSpan();

    const days: RangeCalendarDay[] = [];
    const startOfMonth = viewMonth.clone().startOf('month');

    let gridStart = startOfMonth.clone().day(firstDay);
    if (gridStart.isAfter(startOfMonth)) {
      gridStart.subtract(7, 'days');
    }

    const today = moment().startOf('day');

    for (let i = 0; i < 42; i++) {
      const current = gridStart.clone().add(i, 'days');
      const isCurrentMonth = current.isSame(viewMonth, 'month');
      const isToday = current.isSame(today, 'day');

      const isSelectedStart = !!(start && current.isSame(start, 'day'));
      const isSelectedEnd = !!(end && current.isSame(end, 'day'));

      let isInRange = false;
      if (start && end) {
        const rangeStart = start.isBefore(end) ? start : end;
        const rangeEnd = start.isBefore(end) ? end : start;
        isInRange = current.isAfter(rangeStart, 'day') && current.isBefore(rangeEnd, 'day');
      }

      let isHoveredRange = false;
      if (start && !end && hover) {
        const rangeStart = start.isBefore(hover) ? start : hover;
        const rangeEnd = start.isBefore(hover) ? hover : start;
        isHoveredRange = current.isSameOrAfter(rangeStart, 'day') && current.isSameOrBefore(rangeEnd, 'day');
      }

      let isDisabled = false;
      if (min && current.isBefore(min, 'day')) isDisabled = true;
      if (max && current.isAfter(max, 'day')) isDisabled = true;
      if (filter && !filter(current.clone())) isDisabled = true;

      // Span validation
      if (start && !end && (minS || maxS)) {
        const diffDays = Math.abs(current.diff(start, 'days'));
        if (minS !== null && diffDays < minS) isDisabled = true;
        if (maxS !== null && diffDays > maxS) isDisabled = true;
      }

      days.push({
        date: current,
        dayNumber: current.date(),
        isCurrentMonth,
        isToday,
        isSelectedStart,
        isSelectedEnd,
        isInRange,
        isHoveredRange,
        isDisabled,
        isFocused: false
      });
    }

    return days;
  }

  private parseDateValue(val: unknown): Moment | null {
    if (!val) return null;
    if (moment.isMoment(val)) return val.clone();
    if (val instanceof Date) return moment(val);

    const formats = [
      this.effectiveDisplayFormat(),
      this.effectiveValueFormat(),
      'YYYY-MM-DD HH:mm:ss',
      'YYYY-MM-DD HH:mm',
      'YYYY-MM-DD',
      'MM/DD/YYYY',
      moment.ISO_8601
    ];
    const parsed = moment(val, formats, true);
    return parsed.isValid() ? parsed : moment(val);
  }

  private emitValue(range: InternalDateRange | null): void {
    if (!range || !range.startDate || !range.endDate) {
      this.onChange(null);
      this.rangeChange.emit(null);
      return;
    }

    const fmt = this.effectiveValueFormat();
    const outStart = this.formatOutputDate(range.startDate, fmt);
    const outEnd = this.formatOutputDate(range.endDate, fmt);

    const outVal: DateRangeValue = {
      startDate: outStart as any,
      endDate: outEnd as any
    };

    this.onChange(outVal);
    this.rangeChange.emit(outVal);
  }

  private formatOutputDate(date: Moment, fmt: string): unknown {
    if (fmt === 'moment') return date.clone();
    if (fmt === 'date') return date.toDate();
    return date.format(fmt);
  }

  markAsTouched(): void {
    if (!this.isTouched()) {
      this.isTouched.set(true);
      this.onTouched();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.effectiveDisabled()) return;

    if (!this.isOpen()) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        this.open();
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) return;
    const target = event.target as Node;
    const clickedInsideHost = this.elementRef.nativeElement.contains(target);
    const clickedInsideOverlay = target instanceof Element && !!target.closest('.daterangepicker-dropdown-panel');

    if (!clickedInsideHost && !clickedInsideOverlay) {
      this.close();
    }
  }
}
