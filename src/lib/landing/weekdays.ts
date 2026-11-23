// The designer's page files name the two days in fixed words: "Saturday",
// "Sunday", "Sat", "Sun" and "over one weekend". The days come from the batch
// (Admin → Batches → Day 1 date), which can start on any day of the week, so
// a batch that starts on a Wednesday reads "Wednesday" and "Thursday". A
// batch that starts on a Saturday leaves the page exactly as it was written.

import { addDays, formatIstWeekday, istDaysBetween } from "@/lib/ist";

export interface BatchDays {
  day1StartAt: Date;
  // Absent: the day after day 1.
  day2StartAt?: Date;
}

const DESIGN_DAYS: [string, string] = ["Saturday", "Sunday"];

// The days a page should name: the batch on sale, else day 1 (and day 2, when
// it is not the day after) of the next batch on the cycle in Batch settings,
// else null (the designer's words).
export const daysOnPage = (
  batch: BatchDays | null,
  fallbackDay1?: Date | null,
  fallbackDay2?: Date | null,
): BatchDays | null =>
  batch ?? (fallbackDay1 ? { day1StartAt: fallbackDay1, day2StartAt: fallbackDay2 ?? undefined } : null);

// ["Wednesday", "Thursday"]
export function batchWeekdays(days: BatchDays | null | undefined): [string, string] {
  if (!days) return DESIGN_DAYS;
  return [formatIstWeekday(days.day1StartAt), formatIstWeekday(days.day2StartAt ?? addDays(days.day1StartAt, 1))];
}

const short = (weekday: string) => weekday.slice(0, 3);

// Call this on the page file itself, before any batch or buyer value is put
// in. The short forms are found by the date token that follows them, and a
// buyer's own name ("Sunday", "Sun") must never be rewritten.
export function fillWeekdays(template: string, days: BatchDays | null | undefined): string {
  const [day1, day2] = batchWeekdays(days);
  const designDays = day1 === DESIGN_DAYS[0] && day2 === DESIGN_DAYS[1];
  // "over one weekend" is true only of a Saturday and the Sunday after it;
  // day 2 can be any later date (Admin → Batches → Day 2 date).
  const inARow = !days?.day2StartAt || istDaysBetween(days.day1StartAt, days.day2StartAt) === 1;
  if (designDays && inARow) return template;

  const page = template.replace(/\bover one weekend\b/g, "over two days");
  if (designDays) return page;
  return page
    // One pass, so a Sunday start does not turn "Saturday" into "Monday".
    .replace(/\b(Saturday|Sunday)\b/g, (word) => (word === "Saturday" ? day1 : day2))
    // "Sat {class date}" on /v20 and /v30, "Sat {day 1 short date}" on /v10.
    .replace(/\bSat(?=\s(?:<b>)?\{(?:class date|day 1 short date)\})/g, short(day1))
    .replace(/\bSun(?=\s(?:<b>)?\{(?:day 2 date|day 2 short date)\})/g, short(day2));
}
