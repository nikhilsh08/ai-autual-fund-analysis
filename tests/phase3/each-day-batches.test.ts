// Day 2 of a batch can be any later date, with its own start time and its own
// length (owner, 23 Nov 2026). Left out, it is the day after day 1, at day 1's
// time, for day 1's length, exactly as every batch was before.
import { beforeEach, describe, expect, it, vi } from "vitest";
import { addMinutes, istDaysBetween, istHm, istToUtc } from "@/lib/ist";

const prisma = vi.hoisted(() => ({
  batch: { findUnique: vi.fn(), findFirst: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn() },
  batchSettings: { findUnique: vi.fn(), findMany: vi.fn(), upsert: vi.fn() },
  batchRegistration: { findMany: vi.fn(), findUnique: vi.fn() },
  orderItem: { findMany: vi.fn() },
  order: { findMany: vi.fn(), findUnique: vi.fn() },
}));
vi.mock("@/lib/dbPrisma", () => ({ dataBasePrisma: prisma }));
vi.mock("@/lib/auth-admin", () => ({ verifyAdmin: vi.fn() }));

import { verifyAdmin } from "@/lib/auth-admin";
import { GET as listRoute, POST as createRoute } from "@/app/api/admin/batches/route";
import { PATCH as patchRoute } from "@/app/api/admin/batches/[id]/route";
import { PUT as settingsPutRoute } from "@/app/api/admin/batch-settings/route";
import { GET as icsRoute } from "@/app/api/batches/[id]/ics/route";
import { batchDisplay } from "@/lib/batches/display";
import { reminderWindow } from "@/lib/batches/reminders";
import {
  computeBatchTimes,
  day2EndAt,
  day2Minutes,
  daysInARow,
  daysMatch,
  nextCycleDays,
  sameLength,
  sameStartTime,
} from "@/lib/batches/schedule";
import { startTimesText, w1Params } from "@/lib/whatsapp/templates";

// Saturday 5 December 2026, 10:30 AM, 2 hours; Wednesday 9 December, 7:00 PM, 3 hours.
const own = {
  day1StartAt: istToUtc("2026-12-05", "10:30"),
  day2StartAt: istToUtc("2026-12-09", "19:00"),
  durationMinutes: 120,
  day2DurationMinutes: 180,
};
// A batch as every batch was before: the day after, same time, same length.
const matching = {
  day1StartAt: istToUtc("2026-12-05", "10:30"),
  day2StartAt: istToUtc("2026-12-06", "10:30"),
  durationMinutes: 120,
};

describe("ist helpers", () => {
  it("gives the IST time of day and the days between two instants", () => {
    expect(istHm(own.day2StartAt)).toBe("19:00");
    expect(istDaysBetween(own.day1StartAt, own.day2StartAt)).toBe(4);
    // 11:30 PM and 12:30 AM IST are one calendar day apart.
    expect(istDaysBetween(istToUtc("2026-12-05", "23:30"), istToUtc("2026-12-06", "00:30"))).toBe(1);
  });
});

describe("schedule: day 2's own date, time and length", () => {
  it("computes day 2 from its own date and time; booking still closes before day 1", () => {
    const times = computeBatchTimes({
      day1Date: istToUtc("2026-12-05", "00:00"),
      startTimeIst: "10:30",
      closeHoursBefore: 12,
      day2Date: istToUtc("2026-12-09", "00:00"),
      day2StartTimeIst: "19:00",
    });
    expect(times.day1StartAt).toEqual(own.day1StartAt);
    expect(times.day2StartAt).toEqual(own.day2StartAt);
    expect(times.bookingCloseAt).toEqual(istToUtc("2026-12-04", "22:30"));
  });

  it("without day 2 inputs, day 2 is the day after day 1 at the same time", () => {
    const times = computeBatchTimes({ day1Date: istToUtc("2026-12-05", "00:00"), startTimeIst: "10:30", closeHoursBefore: 24 });
    expect(times.day2StartAt).toEqual(matching.day2StartAt);
    // A day 2 date alone keeps day 1's time; a day 2 time alone keeps the next day.
    expect(
      computeBatchTimes({ day1Date: own.day1StartAt, startTimeIst: "10:30", closeHoursBefore: 24, day2Date: istToUtc("2026-12-12", "00:00") }).day2StartAt,
    ).toEqual(istToUtc("2026-12-12", "10:30"));
    expect(
      computeBatchTimes({ day1Date: own.day1StartAt, startTimeIst: "10:30", closeHoursBefore: 24, day2StartTimeIst: "07:15" }).day2StartAt,
    ).toEqual(istToUtc("2026-12-06", "07:15"));
  });

  it("tells a batch whose days match from one whose days differ", () => {
    expect(daysMatch(matching)).toBe(true);
    expect(daysMatch({ ...matching, day2DurationMinutes: null })).toBe(true);
    expect(daysMatch({ ...matching, day2DurationMinutes: 120 })).toBe(true);

    expect(daysMatch(own)).toBe(false);
    expect(daysInARow(own)).toBe(false);
    expect(sameStartTime(own)).toBe(false);
    expect(sameLength(own)).toBe(false);
    // Each difference on its own is enough.
    expect(daysMatch({ ...matching, day2StartAt: istToUtc("2026-12-12", "10:30") })).toBe(false);
    expect(daysMatch({ ...matching, day2StartAt: istToUtc("2026-12-06", "19:00") })).toBe(false);
    expect(daysMatch({ ...matching, day2DurationMinutes: 90 })).toBe(false);
  });

  it("ends day 2 after day 2's own length", () => {
    expect(day2Minutes(own)).toBe(180);
    expect(day2Minutes(matching)).toBe(120);
    expect(day2EndAt(own)).toEqual(istToUtc("2026-12-09", "22:00"));
    expect(day2EndAt(matching)).toEqual(istToUtc("2026-12-06", "12:30"));
  });

  it("names day 2 of the next batch on the cycle from Batch settings", () => {
    const now = istToUtc("2026-12-01", "10:00");
    const settings = { anchorDay1Date: istToUtc("2026-11-21", "00:00"), cadenceDays: 14 };
    expect(nextCycleDays(settings, now)).toEqual({ day1: istToUtc("2026-12-05", "00:00"), day2: istToUtc("2026-12-06", "00:00") });
    expect(nextCycleDays({ ...settings, day2OffsetDays: 4 }, now)?.day2).toEqual(istToUtc("2026-12-09", "00:00"));
    expect(nextCycleDays(null, now)).toBeNull();
  });
});

describe("messages and calendar follow day 2", () => {
  it("sends the survey after day 2's own end, and the day 2 reminder before day 2's own start", () => {
    const end = istToUtc("2026-12-09", "22:00");
    expect(reminderWindow("W4", own)).toEqual({ start: addMinutes(end, 30), end: addMinutes(end, 150) });
    expect(reminderWindow("W3_DAY2", own).start).toEqual(istToUtc("2026-12-09", "17:45"));
    // Day 1's reminders are untouched.
    expect(reminderWindow("W2", own).start).toEqual(istToUtc("2026-12-04", "10:30"));
  });

  it("gives both start times in the confirmation message when they differ, one when they match", () => {
    expect(startTimesText(own)).toBe("10:30 AM on day 1 and 7:00 PM on day 2");
    expect(startTimesText(matching)).toBe("10:30 AM");

    const params = (batch: { day1StartAt: Date; day2StartAt: Date }) =>
      w1Params({ name: "Asha", batch, joinLink: "https://j", groupLink: null, orderRef: "O1" });
    expect(params(own)).toEqual([
      "Asha", "Saturday, 5 December 2026", "Wednesday, 9 December 2026", "10:30 AM on day 1 and 7:00 PM on day 2",
      "https://j", "to be shared by email", "O1",
    ]);
    // Same number of slots as before, and the same values for a matching batch.
    expect(params(matching)).toEqual([
      "Asha", "Saturday, 5 December 2026", "Sunday, 6 December 2026", "10:30 AM", "https://j", "to be shared by email", "O1",
    ]);
  });

  it("gives the pages day 2's own time and length, and says when each day must be stated", () => {
    const base = { id: "b1", batchNumber: 7, startTimeIst: "10:30", language: null, priceRupees: 2999, bookingCloseAt: istToUtc("2026-12-04", "23:59") };
    expect(batchDisplay({ ...base, ...own })).toMatchObject({
      startTime: "10:30 AM", durationMinutes: 120, day2StartTime: "7:00 PM", day2DurationMinutes: 180, eachDayStated: true,
      day1Date: "Saturday, 5 December 2026", day2Date: "Wednesday, 9 December 2026",
    });
    expect(batchDisplay({ ...base, ...matching })).toMatchObject({
      startTime: "10:30 AM", day2StartTime: "10:30 AM", day2DurationMinutes: 120, eachDayStated: false,
    });
  });

  it("ends the day 2 calendar entry after day 2's own length", async () => {
    prisma.batch.findUnique.mockResolvedValue({ id: "b1", batchNumber: 7, ...own });
    const res = await icsRoute(new Request("http://localhost/api/batches/b1/ics"), { params: Promise.resolve({ id: "b1" }) });
    const ics = await res.text();
    // Day 1: 10:30 AM to 12:30 PM IST. Day 2: 7:00 PM to 10:00 PM IST.
    expect(ics).toContain("DTSTART:20261205T050000Z");
    expect(ics).toContain("DTEND:20261205T070000Z");
    expect(ics).toContain("DTSTART:20261209T133000Z");
    expect(ics).toContain("DTEND:20261209T163000Z");
  });
});

describe("admin panel: each day's own date, time and length", () => {
  const admin = { id: "admin1", email: "admin@cashflowcrew.in", role: "ADMIN" } as never;
  const ctx = (id: string) => ({ params: Promise.resolve({ id }) });
  const json = (url: string, method: string, body?: unknown) =>
    new Request(`http://localhost${url}`, {
      method,
      headers: { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  const create = (body: Record<string, unknown>) =>
    createRoute(json("/api/admin/batches", "POST", { courseId: "c1", day1Date: "2026-12-05", startTimeIst: "10:30", priceRupees: 2999, closeHoursBefore: 24, ...body }));
  const patch = (body: Record<string, unknown>) => patchRoute(json("/api/admin/batches/b1", "PATCH", body), ctx("b1"));
  const saved = () => prisma.batch.update.mock.calls[0][0].data as Record<string, unknown>;

  // Saturday 3 January 2099, 7:00 PM. `follows`: day 2 is the day after, same
  // time. `ownDay2`: day 2 is four days later at 8:30 PM, for 3 hours.
  const follows = {
    id: "b1", courseId: "c1", batchNumber: 3, status: "DRAFT", priceRupees: 1999, startTimeIst: "19:00",
    day1StartAt: istToUtc("2099-01-03", "19:00"),
    day2StartAt: istToUtc("2099-01-04", "19:00"),
    bookingCloseAt: istToUtc("2099-01-02", "19:00"),
    durationMinutes: 120,
    day2DurationMinutes: null as number | null,
  };
  const ownDay2 = { ...follows, day2StartAt: istToUtc("2099-01-07", "20:30"), day2DurationMinutes: 180 };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(verifyAdmin).mockResolvedValue(admin);
    prisma.batchSettings.findUnique.mockResolvedValue(null);
    prisma.batch.findFirst.mockResolvedValue(null);
    prisma.batch.create.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({ id: "new", ...data }));
    prisma.batch.update.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({ ...follows, ...data }));
  });

  it("creates a batch whose day 2 has its own date, time and length", async () => {
    const res = await create({ durationMinutes: 120, day2Date: "2026-12-09", day2StartTimeIst: "19:00", day2DurationMinutes: 180 });
    expect(res.status).toBe(201);
    const { data } = prisma.batch.create.mock.calls[0][0];
    expect(data.day1StartAt).toEqual(own.day1StartAt);
    expect(data.day2StartAt).toEqual(own.day2StartAt);
    expect(data).toMatchObject({ durationMinutes: 120, day2DurationMinutes: 180, startTimeIst: "10:30" });
    // Booking closes 24 hours before day 1, whatever day 2 is.
    expect(data.bookingCloseAt).toEqual(istToUtc("2026-12-04", "10:30"));
  });

  it("creates a batch as before when day 2 is left out, and stores no day 2 length that only repeats day 1", async () => {
    await create({});
    expect(prisma.batch.create.mock.calls[0][0].data).toMatchObject({ day2StartAt: matching.day2StartAt, day2DurationMinutes: null });

    prisma.batch.create.mockClear();
    await create({ durationMinutes: 90, day2DurationMinutes: 90 });
    expect(prisma.batch.create.mock.calls[0][0].data).toMatchObject({ durationMinutes: 90, day2DurationMinutes: null });
  });

  it("refuses a day 2 that is not on a later date than day 1", async () => {
    for (const day2Date of ["2026-12-05", "2026-12-04"]) {
      const res = await create({ day2Date });
      expect(res.status).toBe(400);
      expect((await res.json()).message).toBe("Day 2 must be on a later date than day 1");
    }
    expect(prisma.batch.create).not.toHaveBeenCalled();

    prisma.batch.findUnique.mockResolvedValue(follows);
    const res = await patch({ day2Date: "2099-01-03" });
    expect(res.status).toBe(400);
    expect(prisma.batch.update).not.toHaveBeenCalled();
  });

  it("changes day 2 alone: day 1 and booking close stay where they are", async () => {
    prisma.batch.findUnique.mockResolvedValue(follows);
    expect((await patch({ day2Date: "2099-01-08", day2StartTimeIst: "07:15", day2DurationMinutes: 150 })).status).toBe(200);
    expect(saved()).toMatchObject({
      day1StartAt: follows.day1StartAt,
      bookingCloseAt: follows.bookingCloseAt,
      day2StartAt: istToUtc("2099-01-08", "07:15"),
      day2DurationMinutes: 150,
    });
  });

  it("moving day 1 keeps a day 2 of its own the same number of days later, at its own time", async () => {
    prisma.batch.findUnique.mockResolvedValue(ownDay2);
    await patch({ day1Date: "2099-01-10" });
    expect(saved()).toMatchObject({ day1StartAt: istToUtc("2099-01-10", "19:00"), day2StartAt: istToUtc("2099-01-14", "20:30") });
  });

  it("changing day 1's time moves day 2 only while day 2 still follows day 1", async () => {
    prisma.batch.findUnique.mockResolvedValue(follows);
    await patch({ startTimeIst: "18:00" });
    expect(saved()).toMatchObject({ day1StartAt: istToUtc("2099-01-03", "18:00"), day2StartAt: istToUtc("2099-01-04", "18:00") });

    prisma.batch.update.mockClear();
    prisma.batch.findUnique.mockResolvedValue(ownDay2);
    await patch({ startTimeIst: "18:00" });
    expect(saved()).toMatchObject({ day1StartAt: istToUtc("2099-01-03", "18:00"), day2StartAt: ownDay2.day2StartAt });
  });

  it("sets, clears and tidies day 2's length without touching the dates", async () => {
    prisma.batch.findUnique.mockResolvedValue(follows);
    await patch({ day2DurationMinutes: 180 });
    expect(saved()).toEqual({ day2DurationMinutes: 180 });

    // null = the same as day 1 again.
    prisma.batch.update.mockClear();
    prisma.batch.findUnique.mockResolvedValue(ownDay2);
    await patch({ day2DurationMinutes: null });
    expect(saved()).toEqual({ day2DurationMinutes: null });

    // Day 1 raised to day 2's length: nothing of its own is left to store.
    prisma.batch.update.mockClear();
    await patch({ durationMinutes: 180 });
    expect(saved()).toEqual({ durationMinutes: 180, day2DurationMinutes: null });
  });

  it("lists each batch with day 2 as the form shows it", async () => {
    prisma.batch.findMany.mockResolvedValue([ownDay2]);
    prisma.orderItem.findMany.mockResolvedValue([]);
    prisma.batchRegistration.findMany.mockResolvedValue([]);
    prisma.batchSettings.findMany.mockResolvedValue([]);
    const { batches } = await (await listRoute(json("/api/admin/batches", "GET"))).json();
    expect(batches[0]).toMatchObject({
      day1Text: "Saturday, 3 January 2099",
      day2Text: "Wednesday, 7 January 2099",
      day2Date: "2099-01-07",
      day2StartTimeIst: "20:30",
      day2DurationMinutes: 180,
    });
  });

  it("saves day 2 of the cycle in Batch settings and previews both days", async () => {
    prisma.batchSettings.upsert.mockImplementation(async ({ create: row }: { create: Record<string, unknown> }) => ({ id: "s1", ...row }));
    const put = (body: Record<string, unknown>) =>
      settingsPutRoute(
        json("/api/admin/batch-settings", "PUT", {
          courseId: "c1", anchorDay1Date: "2026-12-05", cadenceDays: 14, defaultPriceRupees: 2999, defaultStartTimeIst: "10:30",
          durationMinutes: 120, closeHoursBefore: 24, ...body,
        }),
      );

    const res = await put({ day2OffsetDays: 4, defaultDay2StartTimeIst: "19:00", day2DurationMinutes: 180 });
    expect(res.status).toBe(200);
    const { settings } = await res.json();
    expect(settings).toMatchObject({ day2OffsetDays: 4, defaultDay2StartTimeIst: "19:00", day2DurationMinutes: 180 });
    for (const next of settings.preview) {
      expect(next.text).toMatch(/^Saturday, /);
      expect(next.day2Text).toMatch(/^Wednesday, /);
    }

    // A day 2 that only repeats day 1 is stored as "follows day 1".
    const plain = await (await put({ day2OffsetDays: 1, defaultDay2StartTimeIst: "10:30", day2DurationMinutes: 120 })).json();
    expect(plain.settings).toMatchObject({ day2OffsetDays: null, defaultDay2StartTimeIst: null, day2DurationMinutes: null });
    expect(plain.settings.preview[0].day2Text).toMatch(/^Sunday, /);

    // Left out altogether (an older admin panel): the same.
    const old = await (await put({})).json();
    expect(old.settings).toMatchObject({ day2OffsetDays: null, defaultDay2StartTimeIst: null, day2DurationMinutes: null });

    expect((await put({ day2OffsetDays: 0 })).status).toBe(400);
  });
});
