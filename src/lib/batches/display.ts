import { formatIstDate, formatIstDateTime, formatIstTime } from "@/lib/ist";
import { day2Minutes, daysMatch } from "./schedule";

export interface BatchLike {
  id: string;
  batchNumber: number;
  day1StartAt: Date;
  day2StartAt: Date;
  durationMinutes: number;
  // Length of day 2. Absent or null: the same as day 1.
  day2DurationMinutes?: number | null;
  startTimeIst: string;
  language: string | null;
  priceRupees: number;
  bookingCloseAt: Date;
}

// Public, visitor-safe fields only. Never links, never counts.
export function batchDisplay(batch: BatchLike) {
  return {
    id: batch.id,
    batchNumber: batch.batchNumber,
    priceRupees: batch.priceRupees,
    day1Date: formatIstDate(batch.day1StartAt),
    day2Date: formatIstDate(batch.day2StartAt),
    startTime: formatIstTime(batch.day1StartAt),
    startTimeIst: batch.startTimeIst,
    durationMinutes: batch.durationMinutes,
    // Day 2's own start time and length (the same as day 1 unless set in the
    // admin panel). eachDayStated: day 2 is not simply "the day after, same
    // time, same length", so a page must state each day in full.
    day2StartTime: formatIstTime(batch.day2StartAt),
    day2DurationMinutes: day2Minutes(batch),
    eachDayStated: !daysMatch(batch),
    language: batch.language,
    bookingCloseText: formatIstDateTime(batch.bookingCloseAt),
    day1StartAt: batch.day1StartAt.toISOString(),
    day2StartAt: batch.day2StartAt.toISOString(),
    bookingCloseAt: batch.bookingCloseAt.toISOString(),
  };
}

export type BatchDisplay = ReturnType<typeof batchDisplay>;
