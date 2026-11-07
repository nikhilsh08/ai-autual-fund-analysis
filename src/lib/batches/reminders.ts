import { addMinutes } from "@/lib/ist";
import { day2EndAt } from "./schedule";

export type ReminderKind = "W2" | "W3_DAY1" | "W3_DAY2" | "W4";

export interface ReminderBatch {
  day1StartAt: Date;
  day2StartAt: Date;
  durationMinutes: number;
}

// Windows from spec 3.6. Reminders are only ever sent before a session
// starts; the survey only after day 2 ends.
export function reminderWindow(kind: ReminderKind, batch: ReminderBatch): { start: Date; end: Date } {
  switch (kind) {
    case "W2":
      return { start: addMinutes(batch.day1StartAt, -24 * 60), end: addMinutes(batch.day1StartAt, -23 * 60) };
    case "W3_DAY1":
      return { start: addMinutes(batch.day1StartAt, -75), end: addMinutes(batch.day1StartAt, -45) };
    case "W3_DAY2":
      return { start: addMinutes(batch.day2StartAt, -75), end: addMinutes(batch.day2StartAt, -45) };
    case "W4": {
      const end = day2EndAt(batch);
      return { start: addMinutes(end, 30), end: addMinutes(end, 150) };
    }
  }
}

export function reminderDue(kind: ReminderKind, batch: ReminderBatch, now: Date): boolean {
  const { start, end } = reminderWindow(kind, batch);
  return now.getTime() >= start.getTime() && now.getTime() <= end.getTime();
}
