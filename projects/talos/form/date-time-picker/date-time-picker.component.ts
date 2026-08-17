import {
  Component,
  ViewChild,
  forwardRef,
  input,
  output,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DatePickerComponent } from '@daedal-dev/talos-ui/form/date-picker';

let uniqueDateTimePickerId = 0;

@Component({
  selector: 'talos-date-time-picker',
  imports: [DatePickerComponent],
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
    'class': 'talos-datetimepicker-host'
  }
})
export class DateTimePickerComponent implements ControlValueAccessor {
  // Signal Inputs
  readonly placeholder = input<string>('Select date & time');
  readonly label = input<string>('');
  readonly floatingLabel = input<boolean>(false);
  readonly floating = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly clearable = input<boolean>(true);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly displayFormat = input<string>('yyyy-MM-dd HH:mm');
  readonly valueFormat = input<string>('yyyy-MM-dd HH:mm');
  readonly use24Hour = input<boolean>(true);
  readonly showSeconds = input<boolean>(false);
  readonly minuteStep = input<number>(1);
  readonly minDate = input<string | Date | number | null>(null);
  readonly maxDate = input<string | Date | number | null>(null);
  readonly firstDayOfWeek = input<number>(0);
  readonly filterDate = input<((date: Date) => boolean) | null>(null);

  // Signal Outputs
  readonly dateTimeChange = output<unknown>();
  readonly opened = output<void>();
  readonly closed = output<void>();

  @ViewChild(DatePickerComponent) corePicker?: DatePickerComponent;

  // Component unique IDs
  readonly componentId = `talos-datetimepicker-${uniqueDateTimePickerId++}`;

  readonly currentValue = signal<unknown>(null);
  private onChange: (val: unknown) => void = () => { };
  private onTouched: () => void = () => { };

  writeValue(val: unknown): void {
    this.currentValue.set(val);
  }

  registerOnChange(fn: (val: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Delegated to inner date-picker via disabled input
  }

  onDateChange(val: unknown): void {
    this.currentValue.set(val);
    this.onChange(val);
    this.dateTimeChange.emit(val);
  }

  onOpened(): void {
    this.opened.emit();
  }

  onClosed(): void {
    this.onTouched();
    this.closed.emit();
  }
}
