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
  endOfDay,
  endOfMonth,
  getDate,
  getHours,
  getMinutes,
  getMonth,
  getSeconds,
  getYear,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isValid,
  set,
  setMonth,
  setYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
  subYears
} from 'date-fns';
import { formatDate, parseFlexibleDate } from '@forge/components/core';

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isFocused: boolean;
}

export interface CalendarMonth {
  name: string;
  monthIndex: number;
  isSelected: boolean;
  isCurrentMonth: boolean;
  isDisabled: boolean;
}

export interface CalendarYear {
  year: number;
  isSelected: boolean;
  isCurrentYear: boolean;
  isDisabled: boolean;
}

let uniqueDatePickerId = 0;

@Component({
  selector: 'forge-date-picker',
  imports: [OverlayModule, CdkConnectedOverlay, CdkOverlayOrigin],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ],
  host: {
    'class': 'forge-datepicker-host',
    '[class.is-open]': 'isOpen()',
    '[class.is-disabled]': 'effectiveDisabled()',
    '[class.datepicker-sm]': 'size() === "sm"',
    '[class.datepicker-md]': 'size() === "md"',
    '[class.datepicker-lg]': 'size() === "lg"',
    '(keydown)': 'onKeyDown($event)',
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class DatePickerComponent implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  // Signal Inputs
  readonly placeholder = input<string>('Select date');
  readonly disabled = input<boolean>(false);
  readonly clearable = input<boolean>(true);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly displayFormat = input<string>('');
  readonly valueFormat = input<string>(''); // 'yyyy-MM-dd', 'yyyy-MM-dd HH:mm', 'date', or custom format tokens
  readonly showTime = input<boolean>(false);
  readonly use24Hour = input<boolean>(true);
  readonly showSeconds = input<boolean>(false);
  readonly minuteStep = input<number>(1);
  readonly minDate = input<string | Date | number | null>(null);
  readonly maxDate = input<string | Date | number | null>(null);
  readonly firstDayOfWeek = input<number>(0); // 0 = Sunday, 1 = Monday
  readonly filterDate = input<((date: Date) => boolean) | null>(null);

  // Signal Outputs
  readonly dateChange = output<unknown>();
  readonly opened = output<void>();
  readonly closed = output<void>();

  // Element Refs
  @ViewChild('triggerEl') triggerEl?: ElementRef<HTMLDivElement>;
  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;

  // CDK Overlay Flexible Positioning Strategy
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

  // Component unique IDs for accessibility
  readonly componentId = `forge-datepicker-${uniqueDatePickerId++}`;
  readonly dialogId = `${this.componentId}-dialog`;

  // Component Internal State Signals
  readonly selectedDate = signal<Date | null>(null);
  readonly viewDate = signal<Date>(new Date());
  readonly viewMode = signal<'day' | 'month' | 'year'>('day');
  readonly isOpen = signal<boolean>(false);
  readonly isDisabledSignal = signal<boolean>(false);
  readonly isTouched = signal<boolean>(false);
  readonly focusedDate = signal<Date | null>(null);
  readonly inputText = signal<string>('');

  // Draft time signals (active when showTime is true)
  readonly draftHour = signal<number>(new Date().getHours());
  readonly draftMinute = signal<number>(new Date().getMinutes());
  readonly draftSecond = signal<number>(new Date().getSeconds());

  // Computed state
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

  readonly formattedValue = computed(() => {
    const sel = this.selectedDate();
    if (!sel || !isValid(sel)) {
      return '';
    }
    return formatDate(sel, this.effectiveDisplayFormat());
  });

  readonly displayHour = computed(() => {
    const h = this.draftHour();
    if (this.use24Hour()) {
      return h.toString().padStart(2, '0');
    }
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return h12.toString().padStart(2, '0');
  });

  readonly displayMinute = computed(() => {
    return this.draftMinute().toString().padStart(2, '0');
  });

  readonly displaySecond = computed(() => {
    return this.draftSecond().toString().padStart(2, '0');
  });

  readonly meridiem = computed<'AM' | 'PM'>(() => {
    return this.draftHour() >= 12 ? 'PM' : 'AM';
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

  readonly weekDayNames = computed(() => {
    const names: string[] = [];
    const firstDay = (this.firstDayOfWeek() % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const base = startOfWeek(new Date(), { weekStartsOn: firstDay });
    for (let i = 0; i < 7; i++) {
      names.push(formatDate(addDays(base, i), 'EEEEEE'));
    }
    return names;
  });

  readonly calendarDays = computed(() => {
    const view = this.viewDate();
    const sel = this.selectedDate();
    const foc = this.focusedDate();
    const min = this.parsedMinDate();
    const max = this.parsedMaxDate();
    const filter = this.filterDate();
    const firstDay = (this.firstDayOfWeek() % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6;

    const days: CalendarDay[] = [];
    const monthStart = startOfMonth(view);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: firstDay });
    const today = startOfDay(new Date());

    for (let i = 0; i < 42; i++) {
      const current = addDays(gridStart, i);
      const isCurrentMonth = isSameMonth(current, view);
      const isToday = isSameDay(current, today);
      const isSelected = sel ? isSameDay(current, sel) : false;
      const isFocused = foc ? isSameDay(current, foc) : false;

      let isDisabled = false;
      if (min && isBefore(startOfDay(current), startOfDay(min))) {
        isDisabled = true;
      }
      if (max && isAfter(startOfDay(current), startOfDay(max))) {
        isDisabled = true;
      }
      if (filter && !filter(current)) {
        isDisabled = true;
      }

      days.push({
        date: current,
        dayNumber: getDate(current),
        isCurrentMonth,
        isToday,
        isSelected,
        isDisabled,
        isFocused
      });
    }

    return days;
  });

  readonly monthList = computed(() => {
    const view = this.viewDate();
    const sel = this.selectedDate();
    const min = this.parsedMinDate();
    const max = this.parsedMaxDate();
    const months: CalendarMonth[] = [];
    const now = new Date();
    const currentMonthIdx = getMonth(now);
    const viewYear = getYear(view);

    for (let i = 0; i < 12; i++) {
      const m = setMonth(view, i);
      const mEnd = endOfMonth(m);
      const mStart = startOfMonth(m);
      let isDisabled = false;
      if (min && isBefore(mEnd, startOfDay(min))) {
        isDisabled = true;
      }
      if (max && isAfter(mStart, endOfDay(max))) {
        isDisabled = true;
      }

      months.push({
        name: formatDate(m, 'MMM'),
        monthIndex: i,
        isSelected: sel ? getYear(sel) === viewYear && getMonth(sel) === i : false,
        isCurrentMonth: getYear(now) === viewYear && currentMonthIdx === i,
        isDisabled
      });
    }
    return months;
  });

  readonly yearList = computed(() => {
    const viewYear = getYear(this.viewDate());
    const sel = this.selectedDate();
    const min = this.parsedMinDate();
    const max = this.parsedMaxDate();
    const startYear = Math.floor(viewYear / 12) * 12;
    const years: CalendarYear[] = [];
    const currentYear = getYear(new Date());

    for (let i = 0; i < 12; i++) {
      const y = startYear + i;
      let isDisabled = false;
      if (min && y < getYear(min)) {
        isDisabled = true;
      }
      if (max && y > getYear(max)) {
        isDisabled = true;
      }

      years.push({
        year: y,
        isSelected: sel ? getYear(sel) === y : false,
        isCurrentYear: currentYear === y,
        isDisabled
      });
    }
    return years;
  });

  readonly isPrevDisabled = computed(() => {
    const min = this.parsedMinDate();
    if (!min) return false;
    const view = this.viewDate();
    const mode = this.viewMode();
    if (mode === 'day') {
      return !isAfter(startOfMonth(view), startOfMonth(min));
    } else if (mode === 'month') {
      return getYear(view) <= getYear(min);
    } else {
      const startYear = Math.floor(getYear(view) / 12) * 12;
      return startYear <= getYear(min);
    }
  });

  readonly isNextDisabled = computed(() => {
    const max = this.parsedMaxDate();
    if (!max) return false;
    const view = this.viewDate();
    const mode = this.viewMode();
    if (mode === 'day') {
      return !isBefore(endOfMonth(view), endOfMonth(max));
    } else if (mode === 'month') {
      return getYear(view) >= getYear(max);
    } else {
      const startYear = Math.floor(getYear(view) / 12) * 12;
      return startYear + 11 >= getYear(max);
    }
  });

  readonly isTodayDisabled = computed(() => {
    return this.isDateDisabled(startOfDay(new Date()));
  });

  readonly isNowDisabled = computed(() => {
    return this.isDateDisabled(new Date());
  });

  readonly currentHeaderLabel = computed(() => {
    const view = this.viewDate();
    const mode = this.viewMode();
    if (mode === 'day') {
      return formatDate(view, 'MMMM yyyy');
    } else if (mode === 'month') {
      return formatDate(view, 'yyyy');
    } else {
      const start = Math.floor(getYear(view) / 12) * 12;
      return `${start} - ${start + 11}`;
    }
  });

  // ControlValueAccessor Callbacks
  private onChange: (val: unknown) => void = () => { };
  private onTouched: () => void = () => { };

  constructor() {
    // Keep focused date synced with viewDate when viewDate changes
    effect(() => {
      if (!this.focusedDate()) {
        this.focusedDate.set(this.viewDate());
      }
    });

    // Keep inputText synced with selectedDate
    effect(() => {
      const sel = this.selectedDate();
      if (sel && isValid(sel)) {
        if (this.showTime()) {
          this.draftHour.set(getHours(sel));
          this.draftMinute.set(getMinutes(sel));
          this.draftSecond.set(getSeconds(sel));
        }
        this.inputText.set(formatDate(sel, this.effectiveDisplayFormat()));
      } else {
        this.inputText.set('');
      }
    });
  }

  // ControlValueAccessor Implementation
  writeValue(val: unknown): void {
    if (val === null || val === undefined || val === '') {
      this.selectedDate.set(null);
      return;
    }

    const parsed = parseFlexibleDate(val, [this.effectiveValueFormat(), this.effectiveDisplayFormat()]);

    if (parsed && isValid(parsed)) {
      this.selectedDate.set(parsed);
      this.viewDate.set(parsed);
      this.focusedDate.set(parsed);
      if (this.showTime()) {
        this.draftHour.set(getHours(parsed));
        this.draftMinute.set(getMinutes(parsed));
        this.draftSecond.set(getSeconds(parsed));
      }
    } else {
      this.selectedDate.set(null);
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
    this.viewMode.set('day');

    const sel = this.selectedDate();
    if (sel && isValid(sel)) {
      this.viewDate.set(sel);
      this.focusedDate.set(sel);
      if (this.showTime()) {
        this.draftHour.set(getHours(sel));
        this.draftMinute.set(getMinutes(sel));
        this.draftSecond.set(getSeconds(sel));
      }
    } else {
      const now = new Date();
      this.viewDate.set(now);
      this.focusedDate.set(now);
      if (this.showTime()) {
        this.draftHour.set(getHours(now));
        this.draftMinute.set(getMinutes(now));
        this.draftSecond.set(getSeconds(now));
      }
    }

    this.opened.emit();
  }

  close(): void {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.markAsTouched();
    this.closed.emit();
  }

  // Navigation & Selection Logic
  prevPeriod(): void {
    if (this.isPrevDisabled()) return;
    const mode = this.viewMode();
    if (mode === 'day') {
      this.viewDate.update((d) => subMonths(d, 1));
    } else if (mode === 'month') {
      this.viewDate.update((d) => subYears(d, 1));
    } else {
      this.viewDate.update((d) => subYears(d, 12));
    }
  }

  nextPeriod(): void {
    if (this.isNextDisabled()) return;
    const mode = this.viewMode();
    if (mode === 'day') {
      this.viewDate.update((d) => addMonths(d, 1));
    } else if (mode === 'month') {
      this.viewDate.update((d) => addYears(d, 1));
    } else {
      this.viewDate.update((d) => addYears(d, 12));
    }
  }

  toggleViewMode(): void {
    const current = this.viewMode();
    if (current === 'day') {
      this.viewMode.set('month');
    } else if (current === 'month') {
      this.viewMode.set('year');
    } else {
      this.viewMode.set('day');
    }
  }

  selectMonth(monthIdx: number): void {
    this.viewDate.update((d) => setMonth(d, monthIdx));
    this.viewMode.set('day');
  }

  selectYear(year: number): void {
    this.viewDate.update((d) => setYear(d, year));
    this.viewMode.set('month');
  }

  selectDay(day: CalendarDay): void {
    if (day.isDisabled) return;
    if (this.showTime()) {
      const baseDate = set(day.date, {
        hours: this.draftHour(),
        minutes: this.draftMinute(),
        seconds: this.draftSecond()
      });
      this.commitSelection(baseDate);
    } else {
      this.commitSelection(day.date);
      this.close();
    }
  }

  selectToday(): void {
    const today = startOfDay(new Date());
    if (this.isDateDisabled(today)) return;
    this.commitSelection(today);
    this.close();
  }

  selectNow(): void {
    const now = new Date();
    if (this.isDateDisabled(now)) return;
    this.draftHour.set(getHours(now));
    this.draftMinute.set(getMinutes(now));
    this.draftSecond.set(getSeconds(now));
    this.commitSelection(now);
    this.close();
  }

  applySelection(): void {
    const sel = this.selectedDate() || this.viewDate();
    const finalVal = set(sel, {
      hours: this.draftHour(),
      minutes: this.draftMinute(),
      seconds: this.draftSecond()
    });
    this.commitSelection(finalVal);
    this.close();
  }

  // Time Manipulations
  adjustHour(delta: number): void {
    this.draftHour.update((h) => (h + delta + 24) % 24);
    if (this.showTime()) this.updateSelectedTime();
  }

  adjustMinute(delta: number): void {
    const step = this.minuteStep();
    this.draftMinute.update((m) => (m + delta * step + 60) % 60);
    if (this.showTime()) this.updateSelectedTime();
  }

  adjustSecond(delta: number): void {
    this.draftSecond.update((s) => (s + delta + 60) % 60);
    if (this.showTime()) this.updateSelectedTime();
  }

  onHourInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const rawVal = inputEl.value.replace(/\D/g, '');
    if (rawVal === '') return;

    let num = parseInt(rawVal, 10);
    if (isNaN(num)) return;

    if (this.use24Hour()) {
      num = Math.max(0, Math.min(23, num));
      this.draftHour.set(num);
    } else {
      num = Math.max(1, Math.min(12, num));
      const isPm = this.meridiem() === 'PM';
      let h24: number;
      if (isPm) {
        h24 = num === 12 ? 12 : num + 12;
      } else {
        h24 = num === 12 ? 0 : num;
      }
      this.draftHour.set(h24);
    }
    this.updateSelectedTime();
  }

  onHourBlur(event: FocusEvent): void {
    const inputEl = event.target as HTMLInputElement;
    inputEl.value = this.displayHour();
  }

  onMinuteInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const rawVal = inputEl.value.replace(/\D/g, '');
    if (rawVal === '') return;

    let num = parseInt(rawVal, 10);
    if (isNaN(num)) return;

    num = Math.max(0, Math.min(59, num));
    this.draftMinute.set(num);
    this.updateSelectedTime();
  }

  onMinuteBlur(event: FocusEvent): void {
    const inputEl = event.target as HTMLInputElement;
    inputEl.value = this.displayMinute();
  }

  onSecondInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const rawVal = inputEl.value.replace(/\D/g, '');
    if (rawVal === '') return;

    let num = parseInt(rawVal, 10);
    if (isNaN(num)) return;

    num = Math.max(0, Math.min(59, num));
    this.draftSecond.set(num);
    this.updateSelectedTime();
  }

  onSecondBlur(event: FocusEvent): void {
    const inputEl = event.target as HTMLInputElement;
    inputEl.value = this.displaySecond();
  }

  onTimeInputKeydown(event: KeyboardEvent, type: 'hour' | 'minute' | 'second'): void {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (type === 'hour') this.adjustHour(1);
      else if (type === 'minute') this.adjustMinute(1);
      else if (type === 'second') this.adjustSecond(1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (type === 'hour') this.adjustHour(-1);
      else if (type === 'minute') this.adjustMinute(-1);
      else if (type === 'second') this.adjustSecond(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.applySelection();
    }
  }

  toggleMeridiem(): void {
    this.draftHour.update((h) => (h >= 12 ? h - 12 : h + 12));
    this.updateSelectedTime();
  }

  private updateSelectedTime(): void {
    const current = this.selectedDate() || this.viewDate();
    const updated = set(current, {
      hours: this.draftHour(),
      minutes: this.draftMinute(),
      seconds: this.draftSecond()
    });
    this.draftHour.set(getHours(updated));
    this.draftMinute.set(getMinutes(updated));
    this.draftSecond.set(getSeconds(updated));
    this.commitSelection(updated);
  }

  onClear(event: MouseEvent): void {
    event.stopPropagation();
    if (this.effectiveDisabled()) return;
    this.selectedDate.set(null);
    this.inputText.set('');
    this.onChange(null);
    this.dateChange.emit(null);
  }

  // Direct typing in trigger input field
  onInputChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.inputText.set(val);

    if (!val.trim()) {
      this.selectedDate.set(null);
      this.onChange(null);
      this.dateChange.emit(null);
      return;
    }

    const parsed = parseFlexibleDate(val, [this.effectiveDisplayFormat(), this.effectiveValueFormat()]);
    if (parsed && isValid(parsed) && !this.isDateDisabled(parsed)) {
      this.selectedDate.set(parsed);
      this.viewDate.set(parsed);
      this.focusedDate.set(parsed);
      if (this.showTime()) {
        this.draftHour.set(getHours(parsed));
        this.draftMinute.set(getMinutes(parsed));
        this.draftSecond.set(getSeconds(parsed));
      }
      const outValue = this.formatOutputValue(parsed);
      this.onChange(outValue);
      this.dateChange.emit(outValue);
    }
  }

  onInputBlur(event: FocusEvent): void {
    const sel = this.selectedDate();
    if (sel && isValid(sel)) {
      this.inputText.set(formatDate(sel, this.effectiveDisplayFormat()));
    } else {
      this.inputText.set('');
    }
    this.markAsTouched();
  }

  onInputKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      const val = this.inputText();
      if (val.trim()) {
        const parsed = parseFlexibleDate(val, [this.effectiveDisplayFormat(), this.effectiveValueFormat()]);
        if (parsed && isValid(parsed) && !this.isDateDisabled(parsed)) {
          if (this.showTime()) {
            this.draftHour.set(getHours(parsed));
            this.draftMinute.set(getMinutes(parsed));
            this.draftSecond.set(getSeconds(parsed));
          }
          this.commitSelection(parsed);
        }
      }
      this.close();
    } else if (event.key === 'ArrowDown' || (event.altKey && event.key === 'ArrowDown')) {
      if (!this.isOpen()) {
        event.preventDefault();
        this.open();
      }
    } else if (event.key === 'Escape') {
      if (this.isOpen()) {
        event.preventDefault();
        this.close();
      }
    }
  }

  private commitSelection(date: Date): void {
    this.selectedDate.set(date);
    const outValue = this.formatOutputValue(date);
    this.onChange(outValue);
    this.dateChange.emit(outValue);
  }

  private formatOutputValue(date: Date): unknown {
    const fmt = this.effectiveValueFormat();
    if (fmt === 'date') {
      return date;
    } else if (fmt === 'iso') {
      return date.toISOString();
    } else {
      return formatDate(date, fmt);
    }
  }

  private isDateDisabled(date: Date): boolean {
    const min = this.parsedMinDate();
    const max = this.parsedMaxDate();
    const filter = this.filterDate();

    if (min && isBefore(startOfDay(date), startOfDay(min))) return true;
    if (max && isAfter(startOfDay(date), startOfDay(max))) return true;
    if (filter && !filter(date)) return true;
    return false;
  }

  markAsTouched(): void {
    if (!this.isTouched()) {
      this.isTouched.set(true);
      this.onTouched();
    }
  }

  // Keyboard accessibility
  onKeyDown(event: KeyboardEvent): void {
    if (this.effectiveDisabled()) return;

    if (!this.isOpen()) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        this.open();
      }
      return;
    }

    const currentFocused = this.focusedDate() || this.viewDate();

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.navigateKeyboardDay(subDays(currentFocused, 1));
        break;

      case 'ArrowRight':
        event.preventDefault();
        this.navigateKeyboardDay(addDays(currentFocused, 1));
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.navigateKeyboardDay(subWeeks(currentFocused, 1));
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.navigateKeyboardDay(addWeeks(currentFocused, 1));
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (currentFocused && !this.isDateDisabled(currentFocused)) {
          if (this.showTime()) {
            const baseDate = set(currentFocused, {
              hours: this.draftHour(),
              minutes: this.draftMinute(),
              seconds: this.draftSecond()
            });
            this.commitSelection(baseDate);
          } else {
            this.commitSelection(currentFocused);
            this.close();
          }
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.close();
        this.triggerEl?.nativeElement.focus();
        break;

      case 'Tab':
        this.close();
        break;
    }
  }

  private navigateKeyboardDay(newDate: Date): void {
    if (!isSameMonth(newDate, this.viewDate())) {
      this.viewDate.set(newDate);
    }
    this.focusedDate.set(newDate);
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) return;
    const target = event.target as Node;
    const clickedInsideHost = this.elementRef.nativeElement.contains(target);
    const clickedInsideOverlay = target instanceof Element && !!target.closest('.datepicker-dropdown-panel');

    if (!clickedInsideHost && !clickedInsideOverlay) {
      this.close();
    }
  }
}
