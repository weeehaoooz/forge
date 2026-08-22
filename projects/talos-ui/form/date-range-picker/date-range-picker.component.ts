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
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInCalendarDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  getDate,
  getHours,
  getMinutes,
  getSeconds,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isValid,
  set,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
  subYears
} from 'date-fns';

import {
  DateRangePreset,
  DateRangeValue,
  InternalDateRange,
  RangeCalendarDay
} from './date-range-types';
import { formatDate, parseFlexibleDate } from '@daedal-dev/talos-ui/core';

let uniqueDateRangePickerId = 0;

@Component({
  selector: 'talos-date-range-picker',
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
    'class': 'talos-daterangepicker-host',
    '[class.is-open]': 'isOpen()',
    '[class.is-disabled]': 'effectiveDisabled()',
    '[class.has-label]': '!!label()',
    '[class.is-floating]': 'isFloatingMode()',
    '[class.is-floated]': 'isFloated()',
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
  readonly label = input<string>('');
  readonly floatingLabel = input<boolean>(false);
  readonly floating = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly clearable = input<boolean>(true);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly displayFormat = input<string>(''); // Default resolved via computed if empty
  readonly valueFormat = input<string>(''); // Default resolved via computed if empty
  readonly showTime = input<boolean>(false);
  readonly use24Hour = input<boolean>(true);
  readonly showSeconds = input<boolean>(false);
  readonly minuteStep = input<number>(1);
  readonly minDate = input<string | Date | number | null>(null);
  readonly maxDate = input<string | Date | number | null>(null);
  readonly minSpan = input<number | null>(null); // in days
  readonly maxSpan = input<number | null>(null); // in days
  readonly firstDayOfWeek = input<number>(0); // 0 = Sun, 1 = Mon
  readonly presets = input<DateRangePreset[] | null>(null);
  readonly presetType = input<'all' | 'calendar' | 'duration'>('all');
  readonly filterDate = input<((date: Date) => boolean) | null>(null);

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
  readonly componentId = `talos-daterangepicker-${uniqueDateRangePickerId++}`;
  readonly dialogId = `${this.componentId}-dialog`;

  // Internal Committed Selection Signals
  readonly selectedStartDate = signal<Date | null>(null);
  readonly selectedEndDate = signal<Date | null>(null);

  // Draft Selection Signals (Active while picking in overlay)
  readonly draftStartDate = signal<Date | null>(null);
  readonly draftEndDate = signal<Date | null>(null);
  readonly hoverDate = signal<Date | null>(null);

  // Draft Time Signals
  readonly draftStartHour = signal<number>(0);
  readonly draftStartMinute = signal<number>(0);
  readonly draftStartSecond = signal<number>(0);

  readonly draftEndHour = signal<number>(23);
  readonly draftEndMinute = signal<number>(59);
  readonly draftEndSecond = signal<number>(59);

  // View state signals
  readonly viewDate = signal<Date>(startOfMonth(new Date()));
  readonly isOpen = signal<boolean>(false);
  readonly isDisabledSignal = signal<boolean>(false);
  readonly isTouched = signal<boolean>(false);
  readonly activePresetLabel = signal<string | null>(null);

  // Input Text Signals for bottom action bar & trigger display
  readonly startInputText = signal<string>('');
  readonly endInputText = signal<string>('');

  // Computeds
  readonly isFloatingMode = computed(() => this.floatingLabel() || this.floating());
  readonly isFloated = computed(() => {
    if (!this.isFloatingMode()) return false;
    return this.isOpen() || !!this.formattedTriggerValue();
  });
  readonly effectiveDisabled = computed(() => this.disabled() || this.isDisabledSignal());

  readonly effectiveDisplayFormat = computed(() => {
    const fmt = this.displayFormat();
    if (fmt) return fmt;
    return this.showTime() ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd';
  });

  readonly effectiveValueFormat = computed(() => {
    const fmt = this.valueFormat();
    if (fmt) return fmt;
    return this.showTime() ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd';
  });

  readonly viewDateRight = computed(() => {
    return addMonths(this.viewDate(), 1);
  });

  readonly parsedMinDate = computed(() => {
    const min = this.minDate();
    if (!min) return null;
    const d = parseFlexibleDate(min);
    return d && isValid(d) ? (this.showTime() ? d : startOfDay(d)) : null;
  });

  readonly parsedMaxDate = computed(() => {
    const max = this.maxDate();
    if (!max) return null;
    const d = parseFlexibleDate(max);
    return d && isValid(d) ? (this.showTime() ? d : endOfDay(d)) : null;
  });

  readonly formattedTriggerValue = computed(() => {
    const start = this.selectedStartDate();
    const end = this.selectedEndDate();
    const fmt = this.effectiveDisplayFormat();

    if (start && isValid(start) && end && isValid(end)) {
      return `${formatDate(start, fmt)}  —  ${formatDate(end, fmt)}`;
    } else if (start && isValid(start)) {
      return `${formatDate(start, fmt)}  —  ...`;
    }
    return '';
  });

  readonly weekDayNames = computed(() => {
    const names: string[] = [];
    const firstDay = (this.firstDayOfWeek() % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const base = startOfWeek(new Date(), { weekStartsOn: firstDay });
    for (let i = 0; i < 7; i++) {
      names.push(formatDate(addDays(base, i), 'EEEEEE'));
    }
    return names;
  });

  // Effective Presets List
  readonly effectivePresets = computed<DateRangePreset[]>(() => {
    const custom = this.presets();
    if (custom && custom.length > 0) return custom;

    const type = this.presetType();
    const firstDay = (this.firstDayOfWeek() % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6;

    const calendarPresets: DateRangePreset[] = [
      {
        label: 'Today',
        key: 'today',
        getValue: () => ({
          startDate: startOfDay(new Date()),
          endDate: endOfDay(new Date())
        })
      },
      {
        label: 'Yesterday',
        key: 'yesterday',
        getValue: () => ({
          startDate: startOfDay(subDays(new Date(), 1)),
          endDate: endOfDay(subDays(new Date(), 1))
        })
      },
      {
        label: 'This week',
        key: 'this_week',
        getValue: () => ({
          startDate: startOfWeek(new Date(), { weekStartsOn: firstDay }),
          endDate: endOfWeek(new Date(), { weekStartsOn: firstDay })
        })
      },
      {
        label: 'Last week',
        key: 'last_week',
        getValue: () => ({
          startDate: startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: firstDay }),
          endDate: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: firstDay })
        })
      },
      {
        label: 'This month',
        key: 'this_month',
        getValue: () => ({
          startDate: startOfMonth(new Date()),
          endDate: endOfMonth(new Date())
        })
      },
      {
        label: 'Last month',
        key: 'last_month',
        getValue: () => ({
          startDate: startOfMonth(subMonths(new Date(), 1)),
          endDate: endOfMonth(subMonths(new Date(), 1))
        })
      },
      {
        label: 'This year',
        key: 'this_year',
        getValue: () => ({
          startDate: startOfYear(new Date()),
          endDate: endOfYear(new Date())
        })
      },
      {
        label: 'Last year',
        key: 'last_year',
        getValue: () => ({
          startDate: startOfYear(subYears(new Date(), 1)),
          endDate: endOfYear(subYears(new Date(), 1))
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
    return !isAfter(startOfMonth(this.viewDate()), startOfMonth(min));
  });

  readonly isNextDisabled = computed(() => {
    const max = this.parsedMaxDate();
    if (!max) return false;
    return !isBefore(endOfMonth(this.viewDateRight()), endOfMonth(max));
  });

  readonly leftHeaderLabel = computed(() => {
    return formatDate(this.viewDate(), 'MMMM yyyy');
  });

  readonly rightHeaderLabel = computed(() => {
    return formatDate(this.viewDateRight(), 'MMMM yyyy');
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

      if (start && isValid(start)) {
        const fullStart = set(start, {
          hours: this.draftStartHour(),
          minutes: this.draftStartMinute(),
          seconds: this.draftStartSecond()
        });
        this.startInputText.set(formatDate(fullStart, fmt));
      } else {
        this.startInputText.set('');
      }

      if (end && isValid(end)) {
        const fullEnd = set(end, {
          hours: this.draftEndHour(),
          minutes: this.draftEndMinute(),
          seconds: this.draftEndSecond()
        });
        this.endInputText.set(formatDate(fullEnd, fmt));
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

    const parsedStart = parseFlexibleDate(startRaw, [this.effectiveValueFormat(), this.effectiveDisplayFormat()]);
    const parsedEnd = parseFlexibleDate(endRaw, [this.effectiveValueFormat(), this.effectiveDisplayFormat()]);

    if (parsedStart && isValid(parsedStart)) {
      this.selectedStartDate.set(parsedStart);
      this.viewDate.set(startOfMonth(parsedStart));
    } else {
      this.selectedStartDate.set(null);
    }

    if (parsedEnd && isValid(parsedEnd)) {
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

    if (selStart && isValid(selStart)) {
      this.draftStartDate.set(selStart);
      this.viewDate.set(startOfMonth(selStart));
      this.draftStartHour.set(getHours(selStart));
      this.draftStartMinute.set(getMinutes(selStart));
      this.draftStartSecond.set(getSeconds(selStart));
    } else {
      this.draftStartDate.set(null);
      this.viewDate.set(startOfMonth(new Date()));
      this.draftStartHour.set(0);
      this.draftStartMinute.set(0);
      this.draftStartSecond.set(0);
    }

    if (selEnd && isValid(selEnd)) {
      this.draftEndDate.set(selEnd);
      this.draftEndHour.set(getHours(selEnd));
      this.draftEndMinute.set(getMinutes(selEnd));
      this.draftEndSecond.set(getSeconds(selEnd));
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
    this.viewDate.update((d) => subMonths(d, 1));
  }

  nextMonth(): void {
    if (this.isNextDisabled()) return;
    this.viewDate.update((d) => addMonths(d, 1));
  }

  // Day Selection Logic
  selectDay(day: RangeCalendarDay): void {
    if (day.isDisabled) return;
    this.activePresetLabel.set(null);

    const start = this.draftStartDate();
    const end = this.draftEndDate();

    if (!start || (start && end)) {
      // Step 1: Set new Start Date & clear End Date
      const newStart = set(day.date, {
        hours: this.draftStartHour(),
        minutes: this.draftStartMinute(),
        seconds: this.draftStartSecond()
      });
      this.draftStartDate.set(newStart);
      this.draftEndDate.set(null);
    } else {
      // Step 2: Set End Date
      const targetDate = day.date;
      if (isBefore(startOfDay(targetDate), startOfDay(start))) {
        // If clicked date is before start date, swap them
        const newStart = set(targetDate, {
          hours: this.draftStartHour(),
          minutes: this.draftStartMinute(),
          seconds: this.draftStartSecond()
        });
        const newEnd = set(start, {
          hours: this.draftEndHour(),
          minutes: this.draftEndMinute(),
          seconds: this.draftEndSecond()
        });
        this.draftStartDate.set(newStart);
        this.draftEndDate.set(newEnd);
      } else {
        const newEnd = set(targetDate, {
          hours: this.draftEndHour(),
          minutes: this.draftEndMinute(),
          seconds: this.draftEndSecond()
        });
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

    let newStart: Date | null = null;
    let newEnd: Date | null = null;

    if (preset.isDuration || preset.duration) {
      const baseStart = this.draftStartDate() || startOfDay(new Date());
      newStart = set(baseStart, {
        hours: this.draftStartHour(),
        minutes: this.draftStartMinute(),
        seconds: this.draftStartSecond()
      });
      let calculatedEnd = baseStart;

      if (preset.duration?.days) calculatedEnd = addDays(calculatedEnd, preset.duration.days);
      if (preset.duration?.weeks) calculatedEnd = addWeeks(calculatedEnd, preset.duration.weeks);
      if (preset.duration?.months) calculatedEnd = addMonths(calculatedEnd, preset.duration.months);
      if (preset.duration?.years) calculatedEnd = addYears(calculatedEnd, preset.duration.years);

      newEnd = set(calculatedEnd, {
        hours: this.draftEndHour(),
        minutes: this.draftEndMinute(),
        seconds: this.draftEndSecond()
      });
    } else if (preset.getValue) {
      const range = preset.getValue(this.draftStartDate());
      newStart = range.startDate;
      newEnd = range.endDate;
    }

    if (newStart && isValid(newStart)) {
      this.draftStartDate.set(newStart);
      this.viewDate.set(startOfMonth(newStart));
    }
    if (newEnd && isValid(newEnd)) {
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

    const finalStart = set(start, {
      hours: this.draftStartHour(),
      minutes: this.draftStartMinute(),
      seconds: this.draftStartSecond()
    });
    const finalEnd = set(end || start, {
      hours: this.draftEndHour(),
      minutes: this.draftEndMinute(),
      seconds: this.draftEndSecond()
    });

    // Ensure start is before or equal to end
    if (isBefore(finalEnd, finalStart)) {
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

    const parsed = parseFlexibleDate(val, [this.effectiveDisplayFormat(), this.effectiveValueFormat()]);
    if (parsed && isValid(parsed)) {
      this.draftStartDate.set(parsed);
      this.draftStartHour.set(getHours(parsed));
      this.draftStartMinute.set(getMinutes(parsed));
      this.draftStartSecond.set(getSeconds(parsed));
      this.viewDate.set(startOfMonth(parsed));
    }
  }

  onStartInputBlur(event: FocusEvent): void {
    const start = this.draftStartDate();
    const fmt = this.effectiveDisplayFormat();
    if (start && isValid(start)) {
      const fullStart = set(start, {
        hours: this.draftStartHour(),
        minutes: this.draftStartMinute(),
        seconds: this.draftStartSecond()
      });
      this.startInputText.set(formatDate(fullStart, fmt));
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

    const parsed = parseFlexibleDate(val, [this.effectiveDisplayFormat(), this.effectiveValueFormat()]);
    if (parsed && isValid(parsed)) {
      this.draftEndDate.set(parsed);
      this.draftEndHour.set(getHours(parsed));
      this.draftEndMinute.set(getMinutes(parsed));
      this.draftEndSecond.set(getSeconds(parsed));
    }
  }

  onEndInputBlur(event: FocusEvent): void {
    const end = this.draftEndDate();
    const fmt = this.effectiveDisplayFormat();
    if (end && isValid(end)) {
      const fullEnd = set(end, {
        hours: this.draftEndHour(),
        minutes: this.draftEndMinute(),
        seconds: this.draftEndSecond()
      });
      this.endInputText.set(formatDate(fullEnd, fmt));
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
  private buildCalendarDays(viewMonth: Date): RangeCalendarDay[] {
    const start = this.draftStartDate();
    const end = this.draftEndDate();
    const hover = this.hoverDate();
    const min = this.parsedMinDate();
    const max = this.parsedMaxDate();
    const filter = this.filterDate();
    const firstDay = (this.firstDayOfWeek() % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const minS = this.minSpan();
    const maxS = this.maxSpan();

    const days: RangeCalendarDay[] = [];
    const monthStart = startOfMonth(viewMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: firstDay });
    const today = startOfDay(new Date());

    for (let i = 0; i < 42; i++) {
      const current = addDays(gridStart, i);
      const isCurrentMonth = isSameMonth(current, viewMonth);
      const isToday = isSameDay(current, today);

      const isSelectedStart = !!(start && isSameDay(current, start));
      const isSelectedEnd = !!(end && isSameDay(current, end));

      let isInRange = false;
      if (start && end) {
        const rangeStart = isBefore(start, end) ? start : end;
        const rangeEnd = isBefore(start, end) ? end : start;
        isInRange = isAfter(startOfDay(current), startOfDay(rangeStart)) && isBefore(startOfDay(current), startOfDay(rangeEnd));
      }

      let isHoveredRange = false;
      if (start && !end && hover) {
        const rangeStart = isBefore(start, hover) ? start : hover;
        const rangeEnd = isBefore(start, hover) ? hover : start;
        isHoveredRange = (isSameDay(current, rangeStart) || isAfter(startOfDay(current), startOfDay(rangeStart))) &&
          (isSameDay(current, rangeEnd) || isBefore(startOfDay(current), startOfDay(rangeEnd)));
      }

      let isDisabled = false;
      if (min && isBefore(startOfDay(current), startOfDay(min))) isDisabled = true;
      if (max && isAfter(startOfDay(current), startOfDay(max))) isDisabled = true;
      if (filter && !filter(current)) isDisabled = true;

      // Span validation
      if (start && !end && (minS !== null || maxS !== null)) {
        const diffDays = Math.abs(differenceInCalendarDays(current, start));
        if (minS !== null && diffDays < minS) isDisabled = true;
        if (maxS !== null && diffDays > maxS) isDisabled = true;
      }

      days.push({
        date: current,
        dayNumber: getDate(current),
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

  private formatOutputDate(date: Date, fmt: string): unknown {
    if (fmt === 'date') return date;
    if (fmt === 'iso') return date.toISOString();
    return formatDate(date, fmt);
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
