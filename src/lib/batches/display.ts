import { formatIstDate, formatIstDateTime, formatIstTime } from "@/lib/ist";

export interface BatchLike {
  id: string;
  batchNumber: number;
  day1StartAt: Date;
  day2StartAt: Date;
  durationMinutes: number;
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
    language: batch.language,
    bookingCloseText: formatIstDateTime(batch.bookingCloseAt),
    day1StartAt: batch.day1StartAt.toISOString(),
    day2StartAt: batch.day2StartAt.toISOString(),
    bookingCloseAt: batch.bookingCloseAt.toISOString(),
  };
}

export type BatchDisplay = ReturnType<typeof batchDisplay>;
