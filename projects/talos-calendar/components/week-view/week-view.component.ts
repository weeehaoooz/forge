import { Component, input, output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  format,
  setHours,
  setMinutes,
} from 'date-fns';
import {
  CalendarEvent,
  CalendarTimeSlotEvent,
  SpanningEventSegment,
  CalendarDateSelectEvent,
} from '../../models/calendar.types';
import { CalendarSpanningService } from '../../services/calendar-spanning.service';
import { LucideMapPin } from '@lucide/angular';

interface WeekDayColumn {
  date: Date;
  isToday: boolean;
  dayName: string;
  dayNumber: number;
  timedEvents: CalendarTimeSlotEvent[];
}

@Component({
  selector: 'talos-calendar-week-view',
  imports: [CommonModule, LucideMapPin],
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.scss'],
  host: {
    class: 'talos-calendar-week-view',
  },
})
export class CalendarWeekViewComponent {
  private readonly spanningService = inject(CalendarSpanningService);

  readonly currentDate = input.required<Date>();
  readonly events = input<CalendarEvent[]>([]);
  readonly startHour = input<number>(0);
  readonly endHour = input<number>(24);

  readonly eventClick = output<CalendarEvent>();
  readonly dateSelect = output<CalendarDateSelectEvent>();

  readonly hours = computed<number[]>(() => {
    const list: number[] = [];
    for (let h = this.startHour(); h < this.endHour(); h++) {
      list.push(h);
    }
    return list;
  });

  readonly allDayData = computed<{ segments: SpanningEventSegment[]; maxTracks: number }>(() => {
    const date = this.currentDate();
    const allEvents = this.events();
    const weekStart = startOfWeek(date, { weekStartsOn: 0 });
    return this.spanningService.computeWeekSpanningTracks(weekStart, allEvents);
  });

  readonly weekColumns = computed<WeekDayColumn[]>(() => {
    const date = this.currentDate();
    const allEvents = this.events();
    const sHour = this.startHour();
    const eHour = this.endHour();

    const weekStart = startOfWeek(date, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return days.map((d) => {
      const timedEvents = this.spanningService.computeDayTimeSlots(
        d,
        allEvents,
        sHour,
        eHour
      );

      return {
        date: d,
        isToday: isToday(d),
        dayName: format(d, 'EEE'),
        dayNumber: d.getDate(),
        timedEvents,
      };
    });
  });

  readonly currentTimeIndicator = computed(() => {
    const now = new Date();
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

  onSlotClick(dayDate: Date, hour: number) {
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
