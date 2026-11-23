import { describe, expect, it } from "vitest";
import {
  formatIstDate,
  formatIstDateTime,
  formatIstTime,
  formatTimeHm,
  istMidnight,
  istToUtc,
  istYmd,
  isValidTimeHm,
} from "@/lib/ist";

describe("IST helpers", () => {
  it("converts IST wall time to the UTC instant", () => {
    expect(istToUtc("2026-11-21", "19:00").toISOString()).toBe("2026-11-21T13:30:00.000Z");
    expect(istToUtc("2026-11-21", "00:00").toISOString()).toBe("2026-11-20T18:30:00.000Z");
  });

  it("formats per OWNER D13", () => {
    const start = istToUtc("2026-11-21", "19:00");
    expect(formatIstDate(start)).toBe("Saturday, 21 November 2026");
    expect(formatIstTime(start)).toBe("7:00 PM");
    expect(formatIstDateTime(istToUtc("2026-11-20", "23:59"))).toBe("Friday, 20 November 2026, 11:59 PM IST");
    expect(formatTimeHm("09:05")).toBe("9:05 AM");
    expect(formatTimeHm("00:00")).toBe("12:00 AM");
  });

  it("uses the IST calendar day, not the UTC one", () => {
    const lateUtc = new Date("2026-11-20T20:00:00.000Z"); // 01:30 IST on the 21st
    expect(istYmd(lateUtc)).toBe("2026-11-21");
    expect(istMidnight(lateUtc).toISOString()).toBe("2026-11-20T18:30:00.000Z");
  });

  it("validates HH:mm", () => {
    expect(isValidTimeHm("19:00")).toBe(true);
    expect(isValidTimeHm("7:00")).toBe(false);
    expect(isValidTimeHm("24:00")).toBe(false);
  });
});
