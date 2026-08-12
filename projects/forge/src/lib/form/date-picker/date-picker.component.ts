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

export interface CalendarDay {
  date: Moment;
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
  readonly displayFormat = input<string>('YYYY-MM-DD');
  readonly valueFormat = input<string>('YYYY-MM-DD'); // 'YYYY-MM-DD', 'moment', or 'date'
  readonly minDate = input<string | Date | Moment | null>(null);
  readonly maxDate = input<string | Date | Moment | null>(null);
  readonly firstDayOfWeek = input<number>(0); // 0 = Sunday, 1 = Monday
  readonly filterDate = input<((date: Moment) => boolean) | null>(null);

  // Signal Outputs
  readonly dateChange = output<unknown>();
  readonly opened = output<void>();
  readonly closed = output<void>();

  // Element Refs
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

  // Component unique IDs for accessibility
  readonly componentId = `forge-datepicker-${uniqueDatePickerId++}`;
  readonly dialogId = `${this.componentId}-dialog`;

  // Component Internal State Signals
  readonly selectedDate = signal<Moment | null>(null);
  readonly viewDate = signal<Moment>(moment());
  readonly viewMode = signal<'day' | 'month' | 'year'>('day');
  readonly isOpen = signal<boolean>(false);
  readonly isDisabledSignal = signal<boolean>(false);
  readonly isTouched = signal<boolean>(false);
  readonly focusedDate = signal<Moment | null>(null);
  readonly inputText = signal<string>('');

  // Computed state
  readonly effectiveDisabled = computed(() => this.disabled() || this.isDisabledSignal());

  readonly formattedValue = computed(() => {
    const sel = this.selectedDate();
    if (!sel || !sel.isValid()) {
      return '';
    }
    return sel.format(this.displayFormat());
  });

  readonly parsedMinDate = computed(() => {
    const min = this.minDate();
    if (!min) return null;
    const m = moment(min);
    return m.isValid() ? m.startOf('day') : null;
  });

  readonly parsedMaxDate = computed(() => {
    const max = this.maxDate();
    if (!max) return null;
    const m = moment(max);
    return m.isValid() ? m.endOf('day') : null;
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
    const sel = this.selectedDate();
    const foc = this.focusedDate();
    const min = this.parsedMinDate();
    const max = this.parsedMaxDate();
    const filter = this.filterDate();
    const firstDay = this.firstDayOfWeek();

    const days: CalendarDay[] = [];
    const startOfMonth = view.clone().startOf('month');

    // Calculate grid start day based on firstDayOfWeek
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
    const sel = this.selectedDate();
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
    const sel = this.selectedDate();
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

  readonly isTodayDisabled = computed(() => {
    return this.isDateDisabled(moment().startOf('day'));
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
    // Keep focused date synced with viewDate when viewDate changes
    effect(() => {
      if (!this.focusedDate()) {
        this.focusedDate.set(this.viewDate().clone());
      }
    });

    // Keep inputText synced with selectedDate
    effect(() => {
      const sel = this.selectedDate();
      if (sel && sel.isValid()) {
        this.inputText.set(sel.format(this.displayFormat()));
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
      this.selectedDate.set(parsed);
      this.viewDate.set(parsed.clone());
      this.focusedDate.set(parsed.clone());
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
    if (sel && sel.isValid()) {
      this.viewDate.set(sel.clone());
      this.focusedDate.set(sel.clone());
    } else {
      const today = moment();
      this.viewDate.set(today.clone());
      this.focusedDate.set(today.clone());
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
    this.commitSelection(day.date.clone());
    this.close();
  }

  selectToday(): void {
    const today = moment().startOf('day');
    if (this.isDateDisabled(today)) return;
    this.commitSelection(today);
    this.close();
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

    const formats = [
      this.displayFormat(),
      this.valueFormat(),
      'YYYY-MM-DD',
      'MM/DD/YYYY',
      'DD/MM/YYYY',
      'YYYY/MM/DD'
    ];
    const parsed = moment(val, formats, true);
    if (parsed.isValid() && !this.isDateDisabled(parsed)) {
      this.selectedDate.set(parsed);
      this.viewDate.set(parsed.clone());
      this.focusedDate.set(parsed.clone());
      const outValue = this.formatOutputValue(parsed);
      this.onChange(outValue);
      this.dateChange.emit(outValue);
    }
  }

  onInputBlur(event: FocusEvent): void {
    const sel = this.selectedDate();
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
          'YYYY-MM-DD',
          'MM/DD/YYYY',
          'DD/MM/YYYY',
          'YYYY/MM/DD'
        ];
        const parsed = moment(val, formats, false);
        if (parsed.isValid() && !this.isDateDisabled(parsed)) {
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
    this.selectedDate.set(date);
    const outValue = this.formatOutputValue(date);
    this.onChange(outValue);
    this.dateChange.emit(outValue);
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

  private isDateDisabled(date: Moment): boolean {
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
      case ' ':
        event.preventDefault();
        if (currentFocused && !this.isDateDisabled(currentFocused)) {
          this.commitSelection(currentFocused.clone());
          this.close();
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
