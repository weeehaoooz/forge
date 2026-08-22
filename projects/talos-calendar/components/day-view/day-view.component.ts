import { Component, input, output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  isToday,
  isSameDay,
  format,
  setHours,
  setMinutes,
  startOfDay,
  endOfDay,
  isBefore,
  isAfter,
} from 'date-fns';
import {
  CalendarEvent,
  CalendarTimeSlotEvent,
  CalendarDateSelectEvent,
} from '../../models/calendar.types';
import { CalendarSpanningService } from '../../services/calendar-spanning.service';
import {
  LucideClock,
  LucideMapPin,
  LucideAlignLeft,
} from '@lucide/angular';

@Component({
  selector: 'talos-calendar-day-view',
  imports: [
    CommonModule,
    LucideClock,
    LucideMapPin,
    LucideAlignLeft,
  ],
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.scss'],
  host: {
    class: 'talos-calendar-day-view',
  },
})
export class CalendarDayViewComponent {
  private readonly spanningService = inject(CalendarSpanningService);

  readonly currentDate = input.required<Date>();
  readonly events = input<CalendarEvent[]>([]);
  readonly startHour = input<number>(0);
  readonly endHour = input<number>(24);

  readonly eventClick = output<CalendarEvent>();
  readonly dateSelect = output<CalendarDateSelectEvent>();

  readonly isCurrentDateToday = computed(() => isToday(this.currentDate()));

  readonly allDayEvents = computed<CalendarEvent[]>(() => {
    const day = this.currentDate();
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);

    return this.events().filter((e) => {
      if (!this.spanningService.isMultiDayOrAllDay(e)) return false;
      return (
        (isBefore(e.start, dayEnd) || isSameDay(e.start, dayEnd)) &&
        (isAfter(e.end, dayStart) || isSameDay(e.end, dayStart))
      );
    });
  });

  readonly hours = computed<number[]>(() => {
    const list: number[] = [];
    for (let h = this.startHour(); h < this.endHour(); h++) {
      list.push(h);
    }
    return list;
  });

  readonly timedEvents = computed<CalendarTimeSlotEvent[]>(() => {
    return this.spanningService.computeDayTimeSlots(
      this.currentDate(),
      this.events(),
      this.startHour(),
      this.endHour()
    );
  });

  readonly currentTimeIndicator = computed(() => {
    const now = new Date();
    if (!isSameDay(now, this.currentDate())) return null;

    const sHour = this.startHour();
    const eHour = this.endHour();
    const totalMinutes = (eHour - sHour) * 60;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    if (currentMinutes < sHour * 60 || currentMinutes > eHour * 60) {
      return null;
    }
    const offset = currentMinutes - sHour * 60;
    return (offset / totalMinutes) * 100;
  });

  onSlotClick(hour: number) {
    const dayDate = this.currentDate();
    const start = setMinutes(setHours(dayDate, hour), 0);
    const end = setMinutes(setHours(dayDate, hour + 1), 0);
    this.dateSelect.emit({
      start,
      end,
      allDay: false,
    });
  }

  onEventClick(event: CalendarEvent, mouseEvent: MouseEvent) {
    mouseEvent.stopPropagation();
    this.eventClick.emit(event);
  }

  formatHourLabel(hour: number): string {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  }

  formatTime(date: Date): string {
    return format(date, 'h:mmaaa');
  }

  getEventColorClass(color?: string): string {
    if (!color) return 'event-color-blue';
    const presets = [
      'blue',
      'indigo',
      'purple',
      'pink',
      'rose',
      'red',
      'orange',
      'amber',
      'emerald',
      'teal',
      'cyan',
    ];
    if (presets.includes(color.toLowerCase())) {
      return `event-color-${color.toLowerCase()}`;
    }
    return 'event-color-custom';
  }
}
