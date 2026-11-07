// All dates are stored in UTC and shown in IST (Asia/Kolkata, UTC+05:30,
// no daylight saving), so a fixed offset is exact.
export const IST_OFFSET_MINUTES = 330;

const MS_PER_MINUTE = 60_000;
const MS_PER_DAY = 86_400_000;

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const pad = (n: number) => String(n).padStart(2, "0");

export interface IstParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number;
}

export function toIstParts(date: Date): IstParts {
  const shifted = new Date(date.getTime() + IST_OFFSET_MINUTES * MS_PER_MINUTE);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    weekday: shifted.getUTCDay(),
  };
}

// "2026-11-21" + "19:00" in IST -> the UTC instant.
export function istToUtc(dateYmd: string, timeHm: string): Date {
  const [y, m, d] = dateYmd.split("-").map(Number);
  const [hh, mm] = timeHm.split(":").map(Number);
  if ([y, m, d, hh, mm].some((n) => Number.isNaN(n))) {
    throw new Error(`Invalid IST date/time: ${dateYmd} ${timeHm}`);
  }
  return new Date(Date.UTC(y, m - 1, d, hh, mm) - IST_OFFSET_MINUTES * MS_PER_MINUTE);
}

export function istYmd(date: Date): string {
  const p = toIstParts(date);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

export function istMidnight(date: Date): Date {
  return istToUtc(istYmd(date), "00:00");
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * MS_PER_MINUTE);
}

export function isValidTimeHm(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

// "Saturday, 21 November 2026"
export function formatIstDate(date: Date): string {
  const p = toIstParts(date);
  return `${WEEKDAYS[p.weekday]}, ${p.day} ${MONTHS[p.month - 1]} ${p.year}`;
}

// "7:00 PM"
export function formatIstTime(date: Date): string {
  const p = toIstParts(date);
  const suffix = p.hour >= 12 ? "PM" : "AM";
  const hour12 = p.hour % 12 === 0 ? 12 : p.hour % 12;
  return `${hour12}:${pad(p.minute)} ${suffix}`;
}

// "Friday, 20 November 2026, 11:59 PM IST"
export function formatIstDateTime(date: Date): string {
  return `${formatIstDate(date)}, ${formatIstTime(date)} IST`;
}

// "19:00" -> "7:00 PM" (for a time-of-day string without a date)
export function formatTimeHm(timeHm: string): string {
  return formatIstTime(istToUtc("2026-01-01", timeHm));
}
