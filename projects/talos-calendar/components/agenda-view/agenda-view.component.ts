import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  isToday,
  isTomorrow,
  format,
  startOfDay,
  isAfter,
  isSameDay,
  isBefore,
  addDays,
} from 'date-fns';
import { CalendarEvent } from '../../models/calendar.types';
import {
  LucideMapPin,
  LucideCalendar,
  LucideChevronRight,
} from '@lucide/angular';

interface AgendaDayGroup {
  date: Date;
  dateKey: string;
  isToday: boolean;
  isTomorrow: boolean;
  dayLabel: string;
  events: CalendarEvent[];
}

@Component({
  selector: 'talos-calendar-agenda-view',
  imports: [
    CommonModule,
    LucideMapPin,
    LucideCalendar,
    LucideChevronRight,
  ],
  templateUrl: './agenda-view.component.html',
  styleUrls: ['./agenda-view.component.scss'],
  host: {
    class: 'talos-calendar-agenda-view',
  },
})
export class CalendarAgendaViewComponent {
  readonly currentDate = input.required<Date>();
  readonly events = input<CalendarEvent[]>([]);

  readonly eventClick = output<CalendarEvent>();

  readonly groups = computed<AgendaDayGroup[]>(() => {
    const start = startOfDay(this.currentDate());
    const allEvents = this.events();

    // Filter events on or after the active start date (e.g. up to 30 days ahead)
    const endWindow = addDays(start, 30);
    const relevantEvents = allEvents.filter((e) => {
      return (
        (isAfter(e.end, start) || isSameDay(e.end, start)) &&
        (isBefore(e.start, endWindow) || isSameDay(e.start, endWindow))
      );
    });

    // Sort chronologically
    relevantEvents.sort((a, b) => a.start.getTime() - b.start.getTime());

    // Group by start date
    const map = new Map<string, { date: Date; events: CalendarEvent[] }>();

    for (const ev of relevantEvents) {
      const day = startOfDay(ev.start);
      const key = format(day, 'yyyy-MM-dd');
      if (!map.has(key)) {
        map.set(key, { date: day, events: [] });
      }
      map.get(key)!.events.push(ev);
    }

    const groupList: AgendaDayGroup[] = [];
    map.forEach((value, key) => {
      const d = value.date;
      let label = format(d, 'EEEE, MMMM d, yyyy');
      if (isToday(d)) {
        label = `Today · ${format(d, 'EEEE, MMM d')}`;
      } else if (isTomorrow(d)) {
        label = `Tomorrow · ${format(d, 'EEEE, MMM d')}`;
      }

      groupList.push({
        date: d,
        dateKey: key,
        isToday: isToday(d),
        isTomorrow: isTomorrow(d),
        dayLabel: label,
        events: value.events,
      });
    });

    return groupList;
  });

  onEventClick(event: CalendarEvent) {
    this.eventClick.emit(event);
  }

  formatTime(date: Date): string {
    return format(date, 'h:mm a');
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
