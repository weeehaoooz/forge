import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { format, parse, isValid, addHours } from 'date-fns';
import {
  TalosDialogRef,
  TALOS_DIALOG_DATA,
  TalosDialogModule,
} from '@daedal-dev/talos-ui/feedback/dialog';
import { TalosButtonDirective } from '@daedal-dev/talos-ui/button/button';
import { TalosFormFieldComponent } from '@daedal-dev/talos-ui/form/form-field';
import { TalosInputDirective } from '@daedal-dev/talos-ui/form/input';
import { TalosSlideToggleComponent } from '@daedal-dev/talos-ui/form/slide-toggle';
import { SelectInputComponent, OptionComponent } from '@daedal-dev/talos-ui/form/select-input';
import {
  CalendarEvent,
  CalendarEventColor,
  CalendarDateSelectEvent,
} from '../../models/calendar.types';
import { LucideTrash2 } from '@lucide/angular';

export interface AppointmentDialogData {
  event?: CalendarEvent;
  dateSelection?: CalendarDateSelectEvent;
  mode: 'create' | 'edit';
}

export type AppointmentDialogResult =
  | { action: 'create'; event: CalendarEvent }
  | { action: 'update'; event: CalendarEvent }
  | { action: 'delete'; eventId: string };

@Component({
  selector: 'talos-appointment-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TalosDialogModule,
    TalosButtonDirective,
    TalosFormFieldComponent,
    TalosInputDirective,
    TalosSlideToggleComponent,
    SelectInputComponent,
    OptionComponent,
    LucideTrash2,
  ],
  templateUrl: './appointment-dialog.component.html',
  styleUrls: ['./appointment-dialog.component.scss'],
})
export class AppointmentDialogComponent {
  private readonly dialogRef = inject<TalosDialogRef<AppointmentDialogResult, AppointmentDialogData>>(
    TalosDialogRef
  );
  readonly data = inject<AppointmentDialogData>(TALOS_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);

  readonly isEdit = this.data.mode === 'edit';
  readonly colorOptions: { id: CalendarEventColor; label: string; hex: string }[] = [
    { id: 'blue', label: 'Blue', hex: '#2563eb' },
    { id: 'indigo', label: 'Indigo', hex: '#4f46e5' },
    { id: 'purple', label: 'Purple', hex: '#9333ea' },
    { id: 'pink', label: 'Pink', hex: '#db2777' },
    { id: 'rose', label: 'Rose', hex: '#e11d48' },
    { id: 'emerald', label: 'Emerald', hex: '#059669' },
    { id: 'teal', label: 'Teal', hex: '#0d9488' },
    { id: 'amber', label: 'Amber', hex: '#d97706' },
    { id: 'orange', label: 'Orange', hex: '#ea580c' },
    { id: 'cyan', label: 'Cyan', hex: '#0891b2' },
  ];

  readonly categories: string[] = [
    'Work',
    'Meeting',
    'Conference',
    'Personal',
    'Client',
    'Project',
    'Review',
  ];

  selectedColor = signal<CalendarEventColor>(
    this.data.event?.color ?? 'blue'
  );

  form = this.fb.group({
    title: [this.data.event?.title ?? '', [Validators.required]],
    startDate: [
      format(
        this.data.event?.start ?? this.data.dateSelection?.start ?? new Date(),
        'yyyy-MM-dd'
      ),
      [Validators.required],
    ],
    startTime: [
      format(
        this.data.event?.start ?? this.data.dateSelection?.start ?? new Date(),
        'HH:mm'
      ),
    ],
    endDate: [
      format(
        this.data.event?.end ??
          this.data.dateSelection?.end ??
          addHours(new Date(), 1),
        'yyyy-MM-dd'
      ),
      [Validators.required],
    ],
    endTime: [
      format(
        this.data.event?.end ??
          this.data.dateSelection?.end ??
          addHours(new Date(), 1),
        'HH:mm'
      ),
    ],
    allDay: [
      this.data.event?.allDay ?? this.data.dateSelection?.allDay ?? false,
    ],
    category: [this.data.event?.category ?? 'Work'],
    location: [this.data.event?.location ?? ''],
    description: [this.data.event?.description ?? ''],
  });

  onSelectColor(color: CalendarEventColor) {
    this.selectedColor.set(color);
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    const isAllDay = !!val.allDay;

    let start: Date;
    let end: Date;

    if (isAllDay) {
      start = parse(val.startDate!, 'yyyy-MM-dd', new Date());
      end = parse(val.endDate!, 'yyyy-MM-dd', new Date());
    } else {
      start = parse(
        `${val.startDate} ${val.startTime || '09:00'}`,
        'yyyy-MM-dd HH:mm',
        new Date()
      );
      end = parse(
        `${val.endDate} ${val.endTime || '10:00'}`,
        'yyyy-MM-dd HH:mm',
        new Date()
      );
    }

    if (!isValid(start)) start = new Date();
    if (!isValid(end)) end = addHours(start, 1);

    const savedEvent: CalendarEvent = {
      id: this.data.event?.id ?? `event_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: val.title!.trim(),
      description: val.description?.trim() || undefined,
      start,
      end,
      allDay: isAllDay,
      color: this.selectedColor(),
      category: val.category || undefined,
      location: val.location?.trim() || undefined,
    };

    this.dialogRef.close({ action: this.isEdit ? 'update' : 'create', event: savedEvent });
  }

  onDelete() {
    if (this.data.event) {
      this.dialogRef.close({ action: 'delete', eventId: this.data.event.id });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
