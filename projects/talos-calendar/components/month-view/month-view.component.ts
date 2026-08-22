import { Component, input, output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  format,
  isWeekend,
} from 'date-fns';
import {
  CalendarEvent,
  CalendarMonthCell,
  CalendarWeekRow,
  CalendarDateSelectEvent,
} from '../../models/calendar.types';
import { CalendarSpanningService } from '../../services/calendar-spanning.service';

@Component({
  selector: 'talos-calendar-month-view',
  imports: [CommonModule],
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss'],
  host: {
    class: 'talos-calendar-month-view',
  },
})
export class CalendarMonthViewComponent {
  private readonly spanningService = inject(CalendarSpanningService);

  readonly currentDate = input.required<Date>();
  readonly events = input<CalendarEvent[]>([]);
  readonly selectedDate = input<Date | null>(null);

  readonly eventClick = output<CalendarEvent>();
  readonly dateSelect = output<CalendarDateSelectEvent>();

  readonly weekDayLabels: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  readonly weeks = computed<CalendarWeekRow[]>(() => {
    const date = this.currentDate();
    const allEvents = this.events();
    const selected = this.selectedDate();

    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const allDays = eachDayOfInterval({ start: calStart, end: calEnd });
    const weekRows: CalendarWeekRow[] = [];

    for (let i = 0; i < allDays.length; i += 7) {
      const weekDaysRaw = allDays.slice(i, i + 7);
      const weekStart = weekDaysRaw[0];

      const days: CalendarMonthCell[] = weekDaysRaw.map((d) => {
        const singleDayEvents = allEvents.filter((e) => {
          if (this.spanningService.isMultiDayOrAllDay(e)) return false;
          return isSameDay(e.start, d);
        });

        // Sort single-day events by time
        singleDayEvents.sort((a, b) => a.start.getTime() - b.start.getTime());

        return {
          date: d,
          isCurrentMonth: isSameMonth(d, monthStart),
          isToday: isToday(d),
          isSelected: selected ? isSameDay(d, selected) : false,
          isWeekend: isWeekend(d),
          dayNumber: d.getDate(),
          singleDayEvents,
        };
      });

      const { segments, maxTracks } = this.spanningService.computeWeekSpanningTracks(
        weekStart,
        allEvents
      );

      weekRows.push({
        days,
        spanningSegments: segments,
        maxTrackCount: maxTracks,
      });
    }

    return weekRows;
  });

  onDayClick(cell: CalendarMonthCell, event: MouseEvent) {
    if ((event.target as HTMLElement).closest('.event-item')) {
      return;
    }
    this.dateSelect.emit({
      start: cell.date,
      end: cell.date,
      allDay: true,
    });
  }

  onEventClick(event: CalendarEvent, mouseEvent: MouseEvent) {
    mouseEvent.stopPropagation();
    this.eventClick.emit(event);
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
