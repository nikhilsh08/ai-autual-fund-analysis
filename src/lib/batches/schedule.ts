import { addDays, addMinutes, istMidnight, istToUtc, istYmd } from "@/lib/ist";

const MS_PER_DAY = 86_400_000;

// Day-1 dates on the cycle, as IST-midnight instants, starting with the first
// one on or after `from` (compared by IST calendar day). The anchor can be any
// day of the week; a cadence that is a multiple of 7 keeps that weekday.
export function nextDay1Dates(anchorDay1: Date, cadenceDays: number, from: Date, count: number): Date[] {
  if (cadenceDays <= 0) throw new Error("cadenceDays must be positive");
  const anchor = istMidnight(anchorDay1);
  const fromMidnight = istMidnight(from);
  const step = cadenceDays * MS_PER_DAY;

  let k = Math.max(0, Math.ceil((fromMidnight.getTime() - anchor.getTime()) / step));
  while (anchor.getTime() + k * step < fromMidnight.getTime()) k += 1;

  return Array.from({ length: count }, (_, i) => new Date(anchor.getTime() + (k + i) * step));
}

// Day 1 of the next batch on the cycle in Batch settings, or null when the
// course has no usable settings. The workshop pages use it to name the two
// weekdays while nothing is on sale.
export function nextCycleDay1(
  settings: { anchorDay1Date?: Date | null; cadenceDays?: number | null } | null | undefined,
  now: Date = new Date(),
): Date | null {
  if (!settings?.anchorDay1Date || !settings.cadenceDays || settings.cadenceDays <= 0) return null;
  return nextDay1Dates(settings.anchorDay1Date, settings.cadenceDays, now, 1)[0];
}

export interface BatchTimes {
  day1StartAt: Date;
  day2StartAt: Date;
  bookingCloseAt: Date;
}

export function computeBatchTimes(input: {
  day1Date: Date;
  startTimeIst: string;
  closeHoursBefore: number;
}): BatchTimes {
  const day1StartAt = istToUtc(istYmd(input.day1Date), input.startTimeIst);
  return {
    day1StartAt,
    day2StartAt: addDays(day1StartAt, 1),
    bookingCloseAt: addMinutes(day1StartAt, -input.closeHoursBefore * 60),
  };
}

export interface SaleWindow {
  status: string;
  bookingCloseAt: Date;
  day1StartAt: Date;
}

export function isOnSale(batch: SaleWindow, now: Date): boolean {
  return batch.status === "OPEN" && batch.bookingCloseAt.getTime() > now.getTime();
}

// Earliest OPEN batch whose booking has not closed.
export function pickCurrentBatch<T extends SaleWindow>(batches: T[], now: Date): T | null {
  const open = batches
    .filter((b) => isOnSale(b, now))
    .sort((a, b) => a.day1StartAt.getTime() - b.day1StartAt.getTime());
  return open[0] ?? null;
}

export function day2EndAt(batch: { day2StartAt: Date; durationMinutes: number }): Date {
  return addMinutes(batch.day2StartAt, batch.durationMinutes);
}
