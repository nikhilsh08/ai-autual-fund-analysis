import { describe, expect, it } from "vitest";
import { addMinutes, istToUtc } from "@/lib/ist";
import { reminderDue } from "@/lib/batches/reminders";

const batch = {
  day1StartAt: istToUtc("2026-11-21", "19:00"),
  day2StartAt: istToUtc("2026-11-22", "19:00"),
  durationMinutes: 120,
};

describe("reminder windows (spec 3.6)", () => {
  it("W2 is due between 24 h and 23 h before day 1", () => {
    expect(reminderDue("W2", batch, addMinutes(batch.day1StartAt, -24 * 60))).toBe(true);
    expect(reminderDue("W2", batch, addMinutes(batch.day1StartAt, -23 * 60 - 30))).toBe(true);
    expect(reminderDue("W2", batch, addMinutes(batch.day1StartAt, -25 * 60))).toBe(false);
    expect(reminderDue("W2", batch, addMinutes(batch.day1StartAt, -22 * 60))).toBe(false);
  });

  it("W3 is due between 75 and 45 minutes before each day", () => {
    expect(reminderDue("W3_DAY1", batch, addMinutes(batch.day1StartAt, -60))).toBe(true);
    expect(reminderDue("W3_DAY1", batch, addMinutes(batch.day1StartAt, -30))).toBe(false);
    expect(reminderDue("W3_DAY2", batch, addMinutes(batch.day2StartAt, -70))).toBe(true);
    expect(reminderDue("W3_DAY2", batch, addMinutes(batch.day2StartAt, -90))).toBe(false);
  });

  it("W4 is due 30–150 minutes after day 2 ends", () => {
    const end = addMinutes(batch.day2StartAt, 120);
    expect(reminderDue("W4", batch, addMinutes(end, 60))).toBe(true);
    expect(reminderDue("W4", batch, addMinutes(end, 10))).toBe(false);
    expect(reminderDue("W4", batch, addMinutes(end, 200))).toBe(false);
  });

  it("never sends a reminder for a session that has started", () => {
    expect(reminderDue("W2", batch, addMinutes(batch.day1StartAt, 1))).toBe(false);
    expect(reminderDue("W3_DAY1", batch, addMinutes(batch.day1StartAt, 1))).toBe(false);
    expect(reminderDue("W3_DAY2", batch, addMinutes(batch.day2StartAt, 1))).toBe(false);
  });
});
