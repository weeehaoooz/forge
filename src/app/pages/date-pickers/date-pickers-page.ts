import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DatePickerComponent,
  DateTimePickerComponent,
  DateRangePickerComponent,
  DateTimeRangePickerComponent,
  ForgeButtonGroupModule,
  DateRangeValue
} from '@forge/components';

@Component({
  selector: 'app-date-pickers-page',
  imports: [
    ReactiveFormsModule,
    DatePickerComponent,
    DateTimePickerComponent,
    DateRangePickerComponent,
    DateTimeRangePickerComponent,
    ForgeButtonGroupModule
  ],
  templateUrl: './date-pickers-page.html',
  styleUrl: './date-pickers-page.scss'
})
export class DatePickersPage {
  readonly dateForm = new FormGroup({
    startDate: new FormControl<string | null>('2026-08-15', Validators.required),
    appointmentDateTime: new FormControl<string | null>('2026-08-20 14:30', Validators.required),
    dateRange: new FormControl<DateRangeValue | null>({
      startDate: '2026-08-08',
      endDate: '2026-08-14'
    }),
    dateTimeRange: new FormControl<DateRangeValue | null>({
      startDate: '2026-08-08 09:00',
      endDate: '2026-08-14 18:00'
    })
  });

  protected readonly inputSize = signal<'sm' | 'md' | 'lg'>('sm');

  readonly minDateDemo = '2026-08-05';
  readonly maxDateDemo = '2026-08-25';
  readonly minDateTimeDemo = '2026-08-05 09:00';
  readonly maxDateTimeDemo = '2026-08-25 18:00';

  setInputSize(size: 'sm' | 'md' | 'lg'): void {
    this.inputSize.set(size);
  }
}
