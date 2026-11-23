import { describe, expect, it } from "vitest";
import { istToUtc, istYmd } from "@/lib/ist";
import { computeBatchTimes, isOnSale, nextDay1Dates, pickCurrentBatch } from "@/lib/batches/schedule";

const anchor = istToUtc("2026-11-21", "00:00"); // Saturday

describe("nextDay1Dates", () => {
  it("returns Saturdays on the 14-day cycle from the first one on or after `from`", () => {
    const dates = nextDay1Dates(anchor, 14, istToUtc("2026-11-10", "10:00"), 3).map(istYmd);
    expect(dates).toEqual(["2026-11-21", "2026-12-05", "2026-12-19"]);
  });

  it("includes the anchor day when `from` is on that IST day", () => {
    expect(nextDay1Dates(anchor, 14, istToUtc("2026-11-21", "23:00"), 1).map(istYmd)).toEqual(["2026-11-21"]);
  });

  it("skips to the next cycle the day after", () => {
    expect(nextDay1Dates(anchor, 14, istToUtc("2026-11-22", "00:01"), 1).map(istYmd)).toEqual(["2026-12-05"]);
  });

  it("starts at the anchor when `from` is earlier", () => {
    expect(nextDay1Dates(anchor, 14, istToUtc("2026-01-01", "00:00"), 2).map(istYmd)).toEqual(["2026-11-21", "2026-12-05"]);
  });
});

describe("computeBatchTimes", () => {
  it("derives day 1, day 2 and booking close in UTC", () => {
    const times = computeBatchTimes({ day1Date: anchor, startTimeIst: "19:00", closeHoursBefore: 24 });
    expect(times.day1StartAt.toISOString()).toBe("2026-11-21T13:30:00.000Z");
    expect(times.day2StartAt.toISOString()).toBe("2026-11-22T13:30:00.000Z");
    expect(times.bookingCloseAt.toISOString()).toBe("2026-11-20T13:30:00.000Z");
  });
});

describe("pickCurrentBatch", () => {
  const mk = (status: string, day1: string, close: string) => ({
    status,
    day1StartAt: istToUtc(day1, "19:00"),
    bookingCloseAt: istToUtc(close, "19:00"),
  });

  it("returns the earliest OPEN batch whose booking is still open", () => {
    const now = istToUtc("2026-11-15", "12:00");
    const batches = [
      mk("OPEN", "2026-12-05", "2026-12-04"),
      mk("OPEN", "2026-11-21", "2026-11-20"),
      mk("DRAFT", "2026-11-07", "2026-11-06"),
    ];
    expect(pickCurrentBatch(batches, now)?.day1StartAt).toEqual(istToUtc("2026-11-21", "19:00"));
  });

  it("treats the close time itself as closed", () => {
    const close = istToUtc("2026-11-20", "19:00");
    const batch = mk("OPEN", "2026-11-21", "2026-11-20");
    expect(isOnSale(batch, new Date(close.getTime() - 1))).toBe(true);
    expect(isOnSale(batch, close)).toBe(false);
    expect(pickCurrentBatch([batch], close)).toBeNull();
  });
});
