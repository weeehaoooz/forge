import { Injectable } from '@angular/core';
import {
  startOfDay,
  endOfDay,
  isSameDay,
  differenceInCalendarDays,
  isBefore,
  isAfter,
  addDays,
  getHours,
  getMinutes,
} from 'date-fns';
import {
  CalendarEvent,
  SpanningEventSegment,
  CalendarTimeSlotEvent,
} from '../models/calendar.types';

@Injectable({
  providedIn: 'root',
})
export class CalendarSpanningService {
  /**
   * Determine if an event should be rendered in the spanning / all-day section.
   */
  isMultiDayOrAllDay(event: CalendarEvent): boolean {
    if (event.allDay) return true;
    const startDay = startOfDay(new Date(event.start));
    const endDay = startOfDay(new Date(event.end));
    return !isSameDay(startDay, endDay);
  }

  /**
   * Compute multi-day spanning event tracks for a 7-day row.
   * Ensures that events spanning across multiple days don't collide in vertical rows.
   */
  computeWeekSpanningTracks(
    weekStart: Date,
    events: CalendarEvent[]
  ): { segments: SpanningEventSegment[]; maxTracks: number } {
    const weekStartDay = startOfDay(new Date(weekStart));
    const weekEndDay = endOfDay(addDays(weekStartDay, 6));
    const multiDayEvents = events.filter((e) => this.isMultiDayOrAllDay(e));

    // Filter events that overlap with this week
    const activeEvents = multiDayEvents.filter((e) => {
      const eStart = new Date(e.start);
      const eEnd = new Date(e.end);
      return (
        (isBefore(eStart, weekEndDay) || isSameDay(eStart, weekEndDay)) &&
        (isAfter(eEnd, weekStartDay) || isSameDay(eEnd, weekStartDay))
      );
    });

    // Sort by start date, then longest duration first
    activeEvents.sort((a, b) => {
      const aStart = new Date(a.start).getTime();
      const bStart = new Date(b.start).getTime();
      const startDiff = aStart - bStart;
      if (startDiff !== 0) return startDiff;
      const durA = new Date(a.end).getTime() - aStart;
      const durB = new Date(b.end).getTime() - bStart;
      return durB - durA;
    });

    // Track matrix for 7 days: array of occupied track indices
    const tracksOccupied: Set<number>[] = Array.from({ length: 7 }, () => new Set<number>());
    const segments: SpanningEventSegment[] = [];
    let maxTrack = 0;

    for (const event of activeEvents) {
      const eStart = startOfDay(new Date(event.start));
      const eEnd = startOfDay(new Date(event.end));

      // Find start column (0..6)
      const diffStart = differenceInCalendarDays(eStart, weekStartDay);
      const isStart = diffStart >= 0;
      const startCol = Math.max(0, Math.min(6, diffStart));

      // Find end column (0..6)
      const diffEnd = differenceInCalendarDays(eEnd, weekStartDay);
      const isEnd = diffEnd <= 6;
      const endCol = Math.max(0, Math.min(6, diffEnd));

      const span = Math.max(1, endCol - startCol + 1);

      // Find lowest track index available for all days in [startCol..endCol]
      let trackIndex = 0;
      while (true) {
        let fits = true;
        for (let col = startCol; col <= endCol; col++) {
          if (tracksOccupied[col].has(trackIndex)) {
            fits = false;
            break;
          }
        }
        if (fits) break;
        trackIndex++;
      }

      // Mark track as occupied
      for (let col = startCol; col <= endCol; col++) {
        tracksOccupied[col].add(trackIndex);
      }

      if (trackIndex + 1 > maxTrack) {
        maxTrack = trackIndex + 1;
      }

      segments.push({
        event,
        startCol,
        span,
        isStart,
        isEnd,
        trackIndex,
      });
    }

    return { segments, maxTracks: maxTrack };
  }

  /**
   * Computes layout position for timed events in a day / week time column.
   * Handles overlapping appointments with side-by-side positioning.
   */
  computeDayTimeSlots(
    dayDate: Date,
    events: CalendarEvent[],
    startHour: number = 0,
    endHour: number = 24
  ): CalendarTimeSlotEvent[] {
    const totalMinutes = (endHour - startHour) * 60;
    const dayStart = startOfDay(new Date(dayDate));

    // Filter timed events belonging to this day
    const timedEvents = events.filter((e) => {
      if (this.isMultiDayOrAllDay(e)) return false;
      return isSameDay(startOfDay(new Date(e.start)), dayStart);
    });

    if (timedEvents.length === 0) return [];

    // Sort by start time asc, then duration desc
    const sorted = [...timedEvents].sort((a, b) => {
      const aStart = new Date(a.start).getTime();
      const bStart = new Date(b.start).getTime();
      const diff = aStart - bStart;
      if (diff !== 0) return diff;
      const durA = new Date(a.end).getTime() - aStart;
      const durB = new Date(b.end).getTime() - bStart;
      return durB - durA;
    });

    // Calculate vertical top and height for each event
    const rawEvents = sorted.map((event) => {
      const eStart = new Date(event.start);
      const eEnd = new Date(event.end);
      const eventStartMinutes = getHours(eStart) * 60 + getMinutes(eStart);
      const eventEndMinutes = Math.max(
        eventStartMinutes + 20, // Min height of 20 min
        getHours(eEnd) * 60 + getMinutes(eEnd)
      );

      const offsetMinutes = Math.max(0, eventStartMinutes - startHour * 60);
      const durationMinutes = Math.min(
        totalMinutes - offsetMinutes,
        eventEndMinutes - eventStartMinutes
      );

      const topPercent = (offsetMinutes / totalMinutes) * 100;
      const heightPercent = Math.max(2.5, (durationMinutes / totalMinutes) * 100);

      return {
        event,
        startMin: eventStartMinutes,
        endMin: eventEndMinutes,
        topPercent,
        heightPercent,
      };
    });

    // Find collision clusters to arrange columns
    const clusters: Array<typeof rawEvents> = [];
    let currentCluster: typeof rawEvents = [];
    let clusterEnd = -1;

    for (const item of rawEvents) {
      if (currentCluster.length === 0) {
        currentCluster.push(item);
        clusterEnd = item.endMin;
      } else if (item.startMin < clusterEnd) {
        currentCluster.push(item);
        clusterEnd = Math.max(clusterEnd, item.endMin);
      } else {
        clusters.push(currentCluster);
        currentCluster = [item];
        clusterEnd = item.endMin;
      }
    }
    if (currentCluster.length > 0) {
      clusters.push(currentCluster);
    }

    // Allocate columns within each cluster
    const result: CalendarTimeSlotEvent[] = [];

    for (const cluster of clusters) {
      const columns: Array<Array<(typeof rawEvents)[0]>> = [];

      for (const item of cluster) {
        let placed = false;
        for (let colIdx = 0; colIdx < columns.length; colIdx++) {
          const lastInCol = columns[colIdx][columns[colIdx].length - 1];
          if (lastInCol.endMin <= item.startMin) {
            columns[colIdx].push(item);
            placed = true;
            break;
          }
        }
        if (!placed) {
          columns.push([item]);
        }
      }

      const totalCols = columns.length;
      for (let colIdx = 0; colIdx < totalCols; colIdx++) {
        for (const item of columns[colIdx]) {
          const widthPercent = 100 / totalCols;
          const leftPercent = colIdx * widthPercent;

          result.push({
            event: item.event,
            topPercent: item.topPercent,
            heightPercent: item.heightPercent,
            leftPercent,
            widthPercent,
          });
        }
      }
    }

    return result;
  }
}
