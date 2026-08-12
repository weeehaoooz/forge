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
  CalendarDay,
  CalendarMonth,
  CalendarYear
} from '../date-picker/date-picker.component';

let uniqueDateTimePickerId = 0;

@Component({
  selector: 'forge-date-time-picker',
  imports: [OverlayModule, CdkConnectedOverlay, CdkOverlayOrigin],
  templateUrl: './date-time-picker.component.html',
  styleUrl: './date-time-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true
    }
  ],
  host: {
    'class': 'forge-datetimepicker-host',
    '[class.is-open]': 'isOpen()',
    '[class.is-disabled]': 'effectiveDisabled()',
    '[class.datepicker-sm]': 'size() === "sm"',
    '[class.datepicker-md]': 'size() === "md"',
    '[class.datepicker-lg]': 'size() === "lg"',
    '(keydown)': 'onKeyDown($event)',
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class DateTimePickerComponent implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  // Signal Inputs
  readonly placeholder = input<string>('Select date & time');
  readonly disabled = input<boolean>(false);
  readonly clearable = input<boolean>(true);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly displayFormat = input<string>('YYYY-MM-DD HH:mm');
  readonly valueFormat = input<string>('YYYY-MM-DD HH:mm'); // 'YYYY-MM-DD HH:mm', 'moment', or 'date'
  readonly use24Hour = input<boolean>(true);
  readonly showSeconds = input<boolean>(false);
  readonly minuteStep = input<number>(1);
  readonly minDate = input<string | Date | Moment | null>(null);
  readonly maxDate = input<string | Date | Moment | null>(null);
  readonly firstDayOfWeek = input<number>(0); // 0 = Sun, 1 = Mon
  readonly filterDate = input<((date: Moment) => boolean) | null>(null);

  // Signal Outputs
  readonly dateTimeChange = output<unknown>();
  readonly opened = output<void>();
  readonly closed = output<void>();

  // View Children
  @ViewChild('triggerEl') triggerEl?: ElementRef<HTMLDivElement>;
  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;

  // CDK Overlay Flexible Positioning Strategy (Auto-adapts to space & viewport boundaries)
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

  // Component unique IDs
  readonly componentId = `forge-datetimepicker-${uniqueDateTimePickerId++}`;
  readonly dialogId = `${this.componentId}-dialog`;

  // Internal State Signals
  readonly selectedDateTime = signal<Moment | null>(null);
  readonly viewDate = signal<Moment>(moment());
  readonly viewMode = signal<'day' | 'month' | 'year'>('day');
  readonly isOpen = signal<boolean>(false);
  readonly isDisabledSignal = signal<boolean>(false);
  readonly isTouched = signal<boolean>(false);
  readonly focusedDate = signal<Moment | null>(null);
  readonly inputText = signal<string>('');

  // Draft time signals (edits before user commits or selects day)
  readonly draftHour = signal<number>(moment().hour());
  readonly draftMinute = signal<number>(moment().minute());
  readonly draftSecond = signal<number>(moment().second());

  // Computed state
  readonly effectiveDisabled = computed(() => this.disabled() || this.isDisabledSignal());

  readonly formattedValue = computed(() => {
    const sel = this.selectedDateTime();
    if (!sel || !sel.isValid()) {
      return '';
    }
    return sel.format(this.displayFormat());
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
    const m = moment(min);
    return m.isValid() ? m : null;
  });

  readonly parsedMaxDate = computed(() => {
    const max = this.maxDate();
    if (!max) return null;
    const m = moment(max);
    return m.isValid() ? m : null;
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

  readonly calendarDays = computed(() => {
    const view = this.viewDate();
    const sel = this.selectedDateTime();
    const foc = this.focusedDate();
    const min = this.parsedMinDate();
    const max = this.parsedMaxDate();
    const filter = this.filterDate();
    const firstDay = this.firstDayOfWeek();

    const days: CalendarDay[] = [];
    const startOfMonth = view.clone().startOf('month');

    let gridStart = startOfMonth.clone().day(firstDay);
    if (gridStart.isAfter(startOfMonth)) {
      gridStart.subtract(7, 'days');
    }

    const today = moment().startOf('day');

    for (let i = 0; i < 42; i++) {
      const current = gridStart.clone().add(i, 'days');
      const isCurrentMonth = current.isSame(view, 'month');
      const isToday = current.isSame(today, 'day');
      const isSelected = sel ? current.isSame(sel, 'day') : false;
      const isFocused = foc ? current.isSame(foc, 'day') : false;

      let isDisabled = false;
      if (min && current.isBefore(min, 'day')) {
        isDisabled = true;
      }
      if (max && current.isAfter(max, 'day')) {
        isDisabled = true;
      }
      if (filter && !filter(current.clone())) {
        isDisabled = true;
      }

      days.push({
        date: current,
        dayNumber: current.date(),
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
    const sel = this.selectedDateTime();
    const min = this.parsedMinDate();
    const max = this.parsedMaxDate();
    const months: CalendarMonth[] = [];
    const currentMonthIdx = moment().month();

    for (let i = 0; i < 12; i++) {
      const m = view.clone().month(i);
      const endOfMonth = m.clone().endOf('month');
      const startOfMonth = m.clone().startOf('month');
      let isDisabled = false;
      if (min && endOfMonth.isBefore(min, 'day')) {
        isDisabled = true;
      }
      if (max && startOfMonth.isAfter(max, 'day')) {
        isDisabled = true;
      }

      months.push({
        name: m.format('MMM'),
        monthIndex: i,
        isSelected: sel ? sel.year() === view.year() && sel.month() === i : false,
        isCurrentMonth: moment().year() === view.year() && currentMonthIdx === i,
        isDisabled
      });
    }
    return months;
  });

  readonly yearList = computed(() => {
    const viewYear = this.viewDate().year();
    const sel = this.selectedDateTime();
    const min = this.parsedMinDate();
    const max = this.parsedMaxDate();
    const startYear = Math.floor(viewYear / 12) * 12;
    const years: CalendarYear[] = [];
    const currentYear = moment().year();

    for (let i = 0; i < 12; i++) {
      const y = startYear + i;
      let isDisabled = false;
      if (min && y < min.year()) {
        isDisabled = true;
      }
      if (max && y > max.year()) {
        isDisabled = true;
      }

      years.push({
        year: y,
        isSelected: sel ? sel.year() === y : false,
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
      return view.clone().startOf('month').isSameOrBefore(min.clone().startOf('month'));
    } else if (mode === 'month') {
      return view.year() <= min.year();
    } else {
      const startYear = Math.floor(view.year() / 12) * 12;
      return startYear <= min.year();
    }
  });

  readonly isNextDisabled = computed(() => {
    const max = this.parsedMaxDate();
    if (!max) return false;
    const view = this.viewDate();
    const mode = this.viewMode();
    if (mode === 'day') {
      return view.clone().endOf('month').isSameOrAfter(max.clone().endOf('month'));
    } else if (mode === 'month') {
      return view.year() >= max.year();
    } else {
      const startYear = Math.floor(view.year() / 12) * 12;
      return startYear + 11 >= max.year();
    }
  });

  readonly isNowDisabled = computed(() => {
    return this.isDateTimeDisabled(moment());
  });

  readonly currentHeaderLabel = computed(() => {
    const view = this.viewDate();
    const mode = this.viewMode();
    if (mode === 'day') {
      return view.format('MMMM YYYY');
    } else if (mode === 'month') {
      return view.format('YYYY');
    } else {
      const start = Math.floor(view.year() / 12) * 12;
      return `${start} - ${start + 11}`;
    }
  });

  // ControlValueAccessor Callbacks
  private onChange: (val: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      const sel = this.selectedDateTime();
      if (sel && sel.isValid()) {
        this.draftHour.set(sel.hour());
        this.draftMinute.set(sel.minute());
        this.draftSecond.set(sel.second());
        this.inputText.set(sel.format(this.displayFormat()));
      } else {
        this.inputText.set('');
      }
    });
  }

  // ControlValueAccessor Implementation
  writeValue(val: unknown): void {
    if (val === null || val === undefined || val === '') {
      this.selectedDateTime.set(null);
      return;
    }

    let parsed: Moment;
    if (moment.isMoment(val)) {
      parsed = val.clone();
    } else if (val instanceof Date) {
      parsed = moment(val);
    } else {
      parsed = moment(val, [this.valueFormat(), this.displayFormat(), moment.ISO_8601], true);
      if (!parsed.isValid()) {
        parsed = moment(val);
      }
    }

    if (parsed.isValid()) {
      this.selectedDateTime.set(parsed);
      this.viewDate.set(parsed.clone());
      this.focusedDate.set(parsed.clone());
      this.draftHour.set(parsed.hour());
      this.draftMinute.set(parsed.minute());
      this.draftSecond.set(parsed.second());
    } else {
      this.selectedDateTime.set(null);
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

    const sel = this.selectedDateTime();
    if (sel && sel.isValid()) {
      this.viewDate.set(sel.clone());
      this.focusedDate.set(sel.clone());
      this.draftHour.set(sel.hour());
      this.draftMinute.set(sel.minute());
      this.draftSecond.set(sel.second());
    } else {
      const now = moment();
      this.viewDate.set(now.clone());
      this.focusedDate.set(now.clone());
      this.draftHour.set(now.hour());
      this.draftMinute.set(now.minute());
      this.draftSecond.set(now.second());
    }

    this.opened.emit();
  }

  close(): void {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.markAsTouched();
    this.closed.emit();
  }

  // Header & Calendar Navigation
  prevPeriod(): void {
    if (this.isPrevDisabled()) return;
    const mode = this.viewMode();
    if (mode === 'day') {
      this.viewDate.update((d) => d.clone().subtract(1, 'month'));
    } else if (mode === 'month') {
      this.viewDate.update((d) => d.clone().subtract(1, 'year'));
    } else {
      this.viewDate.update((d) => d.clone().subtract(12, 'years'));
    }
  }

  nextPeriod(): void {
    if (this.isNextDisabled()) return;
    const mode = this.viewMode();
    if (mode === 'day') {
      this.viewDate.update((d) => d.clone().add(1, 'month'));
    } else if (mode === 'month') {
      this.viewDate.update((d) => d.clone().add(1, 'year'));
    } else {
      this.viewDate.update((d) => d.clone().add(12, 'years'));
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
    this.viewDate.update((d) => d.clone().month(monthIdx));
    this.viewMode.set('day');
  }

  selectYear(year: number): void {
    this.viewDate.update((d) => d.clone().year(year));
    this.viewMode.set('month');
  }

  selectDay(day: CalendarDay): void {
    if (day.isDisabled) return;
    const baseDate = day.date.clone().hour(this.draftHour()).minute(this.draftMinute()).second(this.draftSecond());
    this.commitSelection(baseDate);
  }

  // Time Manipulations
  adjustHour(delta: number): void {
    this.draftHour.update((h) => (h + delta + 24) % 24);
    this.updateSelectedTime();
  }

  adjustMinute(delta: number): void {
    const step = this.minuteStep();
    this.draftMinute.update((m) => (m + delta * step + 60) % 60);
    this.updateSelectedTime();
  }

  adjustSecond(delta: number): void {
    this.draftSecond.update((s) => (s + delta + 60) % 60);
    this.updateSelectedTime();
  }

  // Direct typing handlers for time inputs
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

  private clampDateTime(date: Moment): Moment {
    const min = this.parsedMinDate();
    const max = this.parsedMaxDate();
    let clamped = date.clone();
    if (min && clamped.isBefore(min)) {
      clamped = min.clone();
    }
    if (max && clamped.isAfter(max)) {
      clamped = max.clone();
    }
    return clamped;
  }

  private updateSelectedTime(): void {
    const current = this.selectedDateTime() || this.viewDate().clone();
    let updated = current.clone().hour(this.draftHour()).minute(this.draftMinute()).second(this.draftSecond());
    updated = this.clampDateTime(updated);
    this.draftHour.set(updated.hour());
    this.draftMinute.set(updated.minute());
    this.draftSecond.set(updated.second());
    this.commitSelection(updated);
  }

  selectNow(): void {
    const now = moment();
    if (this.isDateTimeDisabled(now)) return;
    this.draftHour.set(now.hour());
    this.draftMinute.set(now.minute());
    this.draftSecond.set(now.second());
    this.commitSelection(now);
    this.close();
  }

  applySelection(): void {
    const sel = this.selectedDateTime() || this.viewDate().clone();
    const finalVal = sel.clone().hour(this.draftHour()).minute(this.draftMinute()).second(this.draftSecond());
    this.commitSelection(finalVal);
    this.close();
  }

  onClear(event: MouseEvent): void {
    event.stopPropagation();
    if (this.effectiveDisabled()) return;
    this.selectedDateTime.set(null);
    this.inputText.set('');
    this.onChange(null);
    this.dateTimeChange.emit(null);
  }

  // Direct typing in trigger input field
  onInputChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.inputText.set(val);

    if (!val.trim()) {
      this.selectedDateTime.set(null);
      this.onChange(null);
      this.dateTimeChange.emit(null);
      return;
    }

    const formats = [
      this.displayFormat(),
      this.valueFormat(),
      'YYYY-MM-DD HH:mm:ss',
      'YYYY-MM-DD HH:mm',
      'YYYY-MM-DD hh:mm A',
      'YYYY-MM-DD',
      'MM/DD/YYYY HH:mm'
    ];
    const parsed = moment(val, formats, true);
    if (parsed.isValid() && !this.isDateTimeDisabled(parsed)) {
      this.selectedDateTime.set(parsed);
      this.viewDate.set(parsed.clone());
      this.focusedDate.set(parsed.clone());
      this.draftHour.set(parsed.hour());
      this.draftMinute.set(parsed.minute());
      this.draftSecond.set(parsed.second());
      const outValue = this.formatOutputValue(parsed);
      this.onChange(outValue);
      this.dateTimeChange.emit(outValue);
    }
  }

  onInputBlur(event: FocusEvent): void {
    const sel = this.selectedDateTime();
    if (sel && sel.isValid()) {
      this.inputText.set(sel.format(this.displayFormat()));
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
        const formats = [
          this.displayFormat(),
          this.valueFormat(),
          'YYYY-MM-DD HH:mm:ss',
          'YYYY-MM-DD HH:mm',
          'YYYY-MM-DD hh:mm A',
          'YYYY-MM-DD',
          'MM/DD/YYYY HH:mm'
        ];
        const parsed = moment(val, formats, false);
        if (parsed.isValid() && !this.isDateTimeDisabled(parsed)) {
          this.draftHour.set(parsed.hour());
          this.draftMinute.set(parsed.minute());
          this.draftSecond.set(parsed.second());
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

  private commitSelection(date: Moment): void {
    this.selectedDateTime.set(date);
    const outValue = this.formatOutputValue(date);
    this.onChange(outValue);
    this.dateTimeChange.emit(outValue);
  }

  private formatOutputValue(date: Moment): unknown {
    const fmt = this.valueFormat();
    if (fmt === 'moment') {
      return date.clone();
    } else if (fmt === 'date') {
      return date.toDate();
    } else {
      return date.format(fmt);
    }
  }

  private isDateTimeDisabled(date: Moment): boolean {
    const min = this.parsedMinDate();
    const max = this.parsedMaxDate();
    const filter = this.filterDate();

    if (min && date.isBefore(min, 'day')) return true;
    if (max && date.isAfter(max, 'day')) return true;
    if (filter && !filter(date.clone())) return true;
    return false;
  }

  markAsTouched(): void {
    if (!this.isTouched()) {
      this.isTouched.set(true);
      this.onTouched();
    }
  }

  // Keyboard controls
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
        this.navigateKeyboardDay(currentFocused.clone().subtract(1, 'day'));
        break;

      case 'ArrowRight':
        event.preventDefault();
        this.navigateKeyboardDay(currentFocused.clone().add(1, 'day'));
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.navigateKeyboardDay(currentFocused.clone().subtract(1, 'week'));
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.navigateKeyboardDay(currentFocused.clone().add(1, 'week'));
        break;

      case 'Enter':
        event.preventDefault();
        this.applySelection();
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

  private navigateKeyboardDay(newDate: Moment): void {
    if (!newDate.isSame(this.viewDate(), 'month')) {
      this.viewDate.set(newDate.clone());
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
