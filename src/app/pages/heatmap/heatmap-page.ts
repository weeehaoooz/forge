import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import {
  addDays,
  endOfDay,
  endOfISOWeek,
  endOfMonth,
  format,
  isBefore,
  isSameDay,
  startOfDay,
  startOfISOWeek,
  startOfMonth,
  subDays,
  subWeeks
} from 'date-fns';
import {
  ForgeHeatmapComponent,
  ForgeHeatmapModule,
  ForgeButtonDirective,
  ForgeButtonGroupModule,
  DateRangePickerComponent,
  DateRangePreset,
  DateRangeValue,
  HeatmapCellClickEvent,
  HeatmapCellShape,
  HeatmapCellSize,
  HeatmapColorScheme,
  HeatmapDataPoint,
  HeatmapInterval,
  HeatmapMetric,
  HeatmapTimeFormat,
  HeatmapTimeRange
} from '@forge/components';
import {
  LucideRefreshCw,
  LucideCode,
  LucideCheck,
  LucideCalendar,
  LucideClock
} from '@lucide/angular';

@Component({
  selector: 'app-heatmap-page',
  imports: [
    FormsModule,
    JsonPipe,
    ForgeHeatmapModule,
    ForgeButtonDirective,
    ForgeButtonGroupModule,
    DateRangePickerComponent,
    LucideRefreshCw,
    LucideCode,
    LucideCheck,
    LucideCalendar,
    LucideClock
  ],
  templateUrl: './heatmap-page.html',
  styleUrl: './heatmap-page.scss'
})
export class HeatmapPage {
  readonly colorSchemes: HeatmapColorScheme[] = ['indigo', 'blue', 'emerald', 'rose', 'amber', 'violet', 'slate'];

  // -------------------------------------------------------------
  // Showcase 1: Busiest Times (Exact Match to User Mock)
  // -------------------------------------------------------------
  readonly busiestTimesMetrics = signal<HeatmapMetric[]>([
    {
      id: 'conversations',
      label: 'New conversations',
      unit: 'conversations',
      colorScheme: 'indigo',
      data: [
        // 9 AM
        { day: 'Mon', hour: 9, value: 0 },
        { day: 'Tue', hour: 9, value: 0 },
        { day: 'Wed', hour: 9, value: 1 },
        { day: 'Thu', hour: 9, value: 0 },
        { day: 'Fri', hour: 9, value: 1 },
        { day: 'Sat', hour: 9, value: 1 },
        { day: 'Sun', hour: 9, value: 1 },
        // 10 AM
        { day: 'Mon', hour: 10, value: 0 },
        { day: 'Tue', hour: 10, value: 3 },
        { day: 'Wed', hour: 10, value: 1 },
        { day: 'Thu', hour: 10, value: 2 },
        { day: 'Fri', hour: 10, value: 1 },
        { day: 'Sat', hour: 10, value: 0 },
        { day: 'Sun', hour: 10, value: 0 },
        // 11 AM
        { day: 'Mon', hour: 11, value: 0 },
        { day: 'Tue', hour: 11, value: 1 },
        { day: 'Wed', hour: 11, value: 0 },
        { day: 'Thu', hour: 11, value: 3 },
        { day: 'Fri', hour: 11, value: 0 },
        { day: 'Sat', hour: 11, value: 0 },
        { day: 'Sun', hour: 11, value: 1 },
        // 12 PM
        { day: 'Mon', hour: 12, value: 0 },
        { day: 'Tue', hour: 12, value: 0 },
        { day: 'Wed', hour: 12, value: 0 },
        { day: 'Thu', hour: 12, value: 1 },
        { day: 'Fri', hour: 12, value: 1 },
        { day: 'Sat', hour: 12, value: 0 },
        { day: 'Sun', hour: 12, value: 1 },
        // 1 PM
        { day: 'Mon', hour: 13, value: 0 },
        { day: 'Tue', hour: 13, value: 1 },
        { day: 'Wed', hour: 13, value: 2 },
        { day: 'Thu', hour: 13, value: 8 },
        { day: 'Fri', hour: 13, value: 7 },
        { day: 'Sat', hour: 13, value: 2 },
        { day: 'Sun', hour: 13, value: 1 },
        // 2 PM
        { day: 'Mon', hour: 14, value: 2 },
        { day: 'Tue', hour: 14, value: 1 },
        { day: 'Wed', hour: 14, value: 3 },
        { day: 'Thu', hour: 14, value: 3 },
        { day: 'Fri', hour: 14, value: 1 },
        { day: 'Sat', hour: 14, value: 1 },
        { day: 'Sun', hour: 14, value: 0 },
        // 3 PM
        { day: 'Mon', hour: 15, value: 0 },
        { day: 'Tue', hour: 15, value: 1 },
        { day: 'Wed', hour: 15, value: 0 },
        { day: 'Thu', hour: 15, value: 1 },
        { day: 'Fri', hour: 15, value: 1 },
        { day: 'Sat', hour: 15, value: 0 },
        { day: 'Sun', hour: 15, value: 1 },
        // 4 PM
        { day: 'Mon', hour: 16, value: 0 },
        { day: 'Tue', hour: 16, value: 2 },
        { day: 'Wed', hour: 16, value: 0 },
        { day: 'Thu', hour: 16, value: 2 },
        { day: 'Fri', hour: 16, value: 2 },
        { day: 'Sat', hour: 16, value: 0 },
        { day: 'Sun', hour: 16, value: 2 },
        // 5 PM
        { day: 'Mon', hour: 17, value: 3 },
        { day: 'Tue', hour: 17, value: 4 },
        { day: 'Wed', hour: 17, value: 0 },
        { day: 'Thu', hour: 17, value: 1 },
        { day: 'Fri', hour: 17, value: 1 },
        { day: 'Sat', hour: 17, value: 1 },
        { day: 'Sun', hour: 17, value: 1 }
      ]
    },
    {
      id: 'resolved',
      label: 'Resolved tickets',
      unit: 'tickets',
      colorScheme: 'emerald',
      data: [
        { day: 'Mon', hour: 10, value: 5 },
        { day: 'Mon', hour: 14, value: 6 },
        { day: 'Tue', hour: 11, value: 8 },
        { day: 'Tue', hour: 16, value: 4 },
        { day: 'Wed', hour: 9, value: 3 },
        { day: 'Wed', hour: 15, value: 9 },
        { day: 'Thu', hour: 13, value: 12 },
        { day: 'Thu', hour: 14, value: 7 },
        { day: 'Fri', hour: 11, value: 10 },
        { day: 'Fri', hour: 16, value: 6 }
      ]
    }
  ]);

  readonly isBusiestLoading = signal<boolean>(false);

  // -------------------------------------------------------------
  // Showcase 2: Date Range Picker & Interval Switcher (Hour vs Day)
  // -------------------------------------------------------------
  readonly activeInterval = signal<HeatmapInterval>('hour');
  readonly selectedDateRange = signal<DateRangeValue>({
    startDate: format(subDays(new Date(), 20), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  readonly rangePresets: DateRangePreset[] = [
    {
      label: 'This Week',
      getValue: () => ({
        startDate: startOfISOWeek(new Date()),
        endDate: endOfISOWeek(new Date())
      })
    },
    {
      label: 'Last 14 Days',
      getValue: () => ({
        startDate: startOfDay(subDays(new Date(), 13)),
        endDate: endOfDay(new Date())
      })
    },
    {
      label: 'This Month',
      getValue: () => ({
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date())
      })
    },
    {
      label: 'Last 30 Days',
      getValue: () => ({
        startDate: startOfDay(subDays(new Date(), 29)),
        endDate: endOfDay(new Date())
      })
    }
  ];

  readonly flexibleDataPoints = signal<HeatmapDataPoint[]>([]);

  // -------------------------------------------------------------
  // Showcase 3: Simulated Backend API & TimeRange listener
  // -------------------------------------------------------------
  readonly lastEmittedRange = signal<HeatmapTimeRange | null>(null);
  readonly apiDataPoints = signal<HeatmapDataPoint[]>([]);
  readonly isApiLoading = signal<boolean>(false);

  // -------------------------------------------------------------
  // Showcase 4: Developer Input Playground
  // -------------------------------------------------------------
  readonly selectedInputFormat = signal<'points' | 'timestamps' | 'matrix'>('points');
  readonly customJsonText = signal<string>(
    JSON.stringify(
      [
        { day: 'Mon', hour: 9, value: 4 },
        { day: 'Mon', hour: 13, value: 12 },
        { day: 'Tue', hour: 11, value: 6 },
        { day: 'Wed', hour: 14, value: 15 },
        { day: 'Thu', hour: 10, value: 8 },
        { day: 'Thu', hour: 13, value: 20 },
        { day: 'Fri', hour: 15, value: 18 },
        { day: 'Sat', hour: 12, value: 7 },
        { day: 'Sun', hour: 16, value: 5 }
      ],
      null,
      2
    )
  );

  readonly parsedPlaygroundData = computed(() => {
    try {
      return JSON.parse(this.customJsonText());
    } catch {
      return [];
    }
  });

  readonly playgroundJsonError = computed(() => {
    try {
      JSON.parse(this.customJsonText());
      return null;
    } catch (e: any) {
      return e.message;
    }
  });

  // -------------------------------------------------------------
  // Showcase 5: 24/7 Traffic Density & Customizer
  // -------------------------------------------------------------
  readonly customizerScheme = signal<HeatmapColorScheme>('indigo');
  readonly customizerCellShape = signal<HeatmapCellShape>('pill');
  readonly customizerCellSize = signal<HeatmapCellSize>('md');
  readonly customizerTimeFormat = signal<HeatmapTimeFormat>('12h');
  readonly customizerShowValues = signal<boolean>(true);
  readonly customizer24hData = signal<HeatmapDataPoint[]>([]);

  // -------------------------------------------------------------
  // Event Logs
  // -------------------------------------------------------------
  readonly eventLogs = signal<string[]>([]);

  constructor() {
    this.generateFlexibleData();
    this.generateRandomApiData();
    this.generate24hData();
  }

  onIntervalToggle(inter: HeatmapInterval): void {
    this.activeInterval.set(inter);
    this.generateFlexibleData();
    this.logEvent(`Interval changed to: ${inter.toUpperCase()}`);
  }

  onDateRangeChanged(dr: DateRangeValue | null): void {
    if (dr) {
      this.selectedDateRange.set(dr);
      this.generateFlexibleData();
      const s = dr.startDate ? format(new Date(dr.startDate as any), 'yyyy-MM-dd') : 'null';
      const e = dr.endDate ? format(new Date(dr.endDate as any), 'yyyy-MM-dd') : 'null';
      this.logEvent(`Date range selected: ${s} to ${e}`);
    }
  }

  onTimeRangeChange(range: HeatmapTimeRange): void {
    this.lastEmittedRange.set(range);
    const startStr = range.startDate ? format(new Date(range.startDate as any), 'yyyy-MM-dd') : 'N/A';
    const endStr = range.endDate ? format(new Date(range.endDate as any), 'yyyy-MM-dd') : 'N/A';
    this.logEvent(`Time range emitted: interval=${range.interval}, dates=[${startStr} - ${endStr}]`);
  }

  simulateBusiestRefresh(): void {
    this.isBusiestLoading.set(true);
    this.logEvent('Refreshing "Busiest times" data from backend...');
    setTimeout(() => {
      this.isBusiestLoading.set(false);
      this.logEvent('Refreshed data successfully!');
    }, 1200);
  }

  simulateApiFetch(): void {
    this.isApiLoading.set(true);
    this.logEvent('Calling GET /analytics/heatmap...');
    setTimeout(() => {
      this.generateRandomApiData();
      this.isApiLoading.set(false);
      this.logEvent(`Fetched ${this.apiDataPoints().length} data points successfully.`);
    }, 900);
  }

  onCellClick(event: HeatmapCellClickEvent): void {
    this.logEvent(`Clicked cell [${event.colKey}, ${event.cell.rowLabel}]: ${event.value} (${event.cell.tooltipText})`);
  }

  setInputFormatPreset(format: 'points' | 'timestamps' | 'matrix'): void {
    this.selectedInputFormat.set(format);

    if (format === 'points') {
      this.customJsonText.set(
        JSON.stringify(
          [
            { day: 'Mon', hour: 9, value: 4 },
            { day: 'Mon', hour: 13, value: 12 },
            { day: 'Tue', hour: 11, value: 6 },
            { day: 'Wed', hour: 14, value: 15 },
            { day: 'Thu', hour: 10, value: 8 },
            { day: 'Thu', hour: 13, value: 20 },
            { day: 'Fri', hour: 15, value: 18 },
            { day: 'Sat', hour: 12, value: 7 },
            { day: 'Sun', hour: 16, value: 5 }
          ],
          null,
          2
        )
      );
    } else if (format === 'timestamps') {
      const now = new Date();
      const mockTimestamps = [
        new Date(now.getTime() - 3600000 * 2).toISOString(),
        new Date(now.getTime() - 3600000 * 2).toISOString(),
        new Date(now.getTime() - 3600000 * 5).toISOString(),
        new Date(now.getTime() - 86400000 * 1).toISOString(),
        new Date(now.getTime() - 86400000 * 1).toISOString(),
        new Date(now.getTime() - 86400000 * 1).toISOString(),
        new Date(now.getTime() - 86400000 * 2).toISOString(),
        new Date(now.getTime() - 86400000 * 3).toISOString()
      ];
      this.customJsonText.set(JSON.stringify(mockTimestamps, null, 2));
    } else if (format === 'matrix') {
      const matrix = {
        Mon: { 9: 2, 10: 5, 13: 8, 17: 3 },
        Tue: { 10: 4, 11: 7, 14: 9 },
        Wed: { 9: 1, 13: 11, 15: 4 },
        Thu: { 11: 6, 13: 18, 16: 5 },
        Fri: { 10: 3, 14: 12, 17: 8 }
      };
      this.customJsonText.set(JSON.stringify(matrix, null, 2));
    }
  }

  private generateFlexibleData(): void {
    const inter = this.activeInterval();
    const dr = this.selectedDateRange();
    const points: HeatmapDataPoint[] = [];

    const start = dr.startDate ? new Date(dr.startDate as any) : subWeeks(new Date(), 3);
    const end = dr.endDate ? new Date(dr.endDate as any) : new Date();

    if (inter === 'day') {
      let curr = start;
      while (isSameDay(curr, end) || isBefore(curr, end)) {
        const val = Math.floor(Math.random() * 30);
        points.push({
          date: format(curr, 'yyyy-MM-dd'),
          value: val
        });
        curr = addDays(curr, 1);
      }
    } else {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      days.forEach((day) => {
        for (let h = 9; h <= 17; h++) {
          const val = Math.floor(Math.random() * 12);
          points.push({ day, hour: h, value: val });
        }
      });
    }

    this.flexibleDataPoints.set(points);
  }

  private generateRandomApiData(): void {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const points: HeatmapDataPoint[] = [];

    days.forEach((day) => {
      for (let h = 9; h <= 17; h++) {
        const baseProb = h === 13 || h === 14 ? 0.85 : 0.45;
        if (Math.random() < baseProb) {
          const val = Math.floor(Math.random() * 10) + (h === 13 ? 4 : 1);
          points.push({ day, hour: h, value: val });
        }
      }
    });

    this.apiDataPoints.set(points);
  }

  private generate24hData(): void {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const points: HeatmapDataPoint[] = [];

    days.forEach((day) => {
      for (let h = 0; h <= 23; h++) {
        let weight = 0;
        if (h >= 0 && h <= 5) weight = Math.floor(Math.random() * 3);
        else if (h >= 6 && h <= 8) weight = Math.floor(Math.random() * 8) + 2;
        else if (h >= 9 && h <= 17) weight = Math.floor(Math.random() * 25) + 10;
        else if (h >= 18 && h <= 21) weight = Math.floor(Math.random() * 14) + 4;
        else weight = Math.floor(Math.random() * 6);

        points.push({ day, hour: h, value: weight });
      }
    });

    this.customizer24hData.set(points);
  }

  private logEvent(msg: string): void {
    const time = new Date().toLocaleTimeString();
    this.eventLogs.update((logs) => [`[${time}] ${msg}`, ...logs.slice(0, 8)]);
  }
}
