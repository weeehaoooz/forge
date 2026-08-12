import {
  Component,
  ElementRef,
  ViewChild,
  forwardRef,
  input,
  output,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import moment from 'moment';
import type { Moment } from 'moment';

import { DateRangePickerComponent } from '../date-range-picker/date-range-picker.component';
import { DateRangePreset, DateRangeValue } from '../date-range-picker/date-range-types';

let uniqueDateTimeRangePickerId = 0;

@Component({
  selector: 'forge-date-time-range-picker',
  imports: [DateRangePickerComponent],
  templateUrl: './date-time-range-picker.component.html',
  styleUrl: './date-time-range-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimeRangePickerComponent),
      multi: true
    }
  ],
  host: {
    'class': 'forge-datetimerangepicker-host'
  }
})
export class DateTimeRangePickerComponent implements ControlValueAccessor {
  // Signal Inputs
  readonly placeholder = input<string>('Select date & time range');
  readonly disabled = input<boolean>(false);
  readonly clearable = input<boolean>(true);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly displayFormat = input<string>('YYYY-MM-DD HH:mm');
  readonly valueFormat = input<string>('YYYY-MM-DD HH:mm');
  readonly use24Hour = input<boolean>(true);
  readonly showSeconds = input<boolean>(false);
  readonly minuteStep = input<number>(1);
  readonly minDate = input<string | Date | Moment | null>(null);
  readonly maxDate = input<string | Date | Moment | null>(null);
  readonly minSpan = input<number | null>(null);
  readonly maxSpan = input<number | null>(null);
  readonly firstDayOfWeek = input<number>(0);
  readonly presets = input<DateRangePreset[] | null>(null);
  readonly presetType = input<'all' | 'calendar' | 'duration'>('all');
  readonly filterDate = input<((date: Moment) => boolean) | null>(null);

  // Signal Outputs
  readonly dateTimeRangeChange = output<DateRangeValue | null>();
  readonly opened = output<void>();
  readonly closed = output<void>();

  @ViewChild(DateRangePickerComponent) corePicker?: DateRangePickerComponent;

  // Component unique IDs
  readonly componentId = `forge-datetimerangepicker-${uniqueDateTimeRangePickerId++}`;

  readonly currentValue = signal<DateRangeValue | null>(null);
  private onChange: (val: unknown) => void = () => { };
  private onTouched: () => void = () => { };

  writeValue(val: unknown): void {
    if (!val || typeof val !== 'object') {
      this.currentValue.set(null);
    } else {
      this.currentValue.set(val as DateRangeValue);
    }
  }

  registerOnChange(fn: (val: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Delegated to inner date-range-picker component via input
  }

  onRangeChange(val: DateRangeValue | null): void {
    this.currentValue.set(val);
    this.onChange(val);
    this.dateTimeRangeChange.emit(val);
  }

  onOpened(): void {
    this.opened.emit();
  }

  onClosed(): void {
    this.onTouched();
    this.closed.emit();
  }
}
