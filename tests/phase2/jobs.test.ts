import { describe, expect, it, vi } from "vitest";
import { addMinutes, istToUtc } from "@/lib/ist";
import { runBatchesJob, runMessagesJob } from "@/lib/batches/jobs";

// Minimal in-memory Prisma stand-in covering the queries the jobs use.
type Row = Record<string, unknown>;

const num = (v: unknown) => (v instanceof Date ? v.getTime() : (v as number));

function matches(row: Row, where: Row | undefined): boolean {
  if (!where) return true;
  return Object.entries(where).every(([key, cond]) => {
    const value = row[key];
    if (cond instanceof Date) return num(value) === cond.getTime();
    if (cond === null || typeof cond !== "object") return value === cond;
    const c = cond as Record<string, unknown>;
    if ("in" in c) return (c.in as unknown[]).includes(value);
    if ("not" in c) return value !== c.not;
    if ("lt" in c) return num(value) < num(c.lt);
    if ("lte" in c) return num(value) <= num(c.lte);
    if ("gt" in c) return num(value) > num(c.gt);
    if ("gte" in c) return num(value) >= num(c.gte);
    return true;
  });
}

function table<T extends Row>(rows: T[], related: (row: T) => Row = () => ({})) {
  let nextId = rows.length + 1;
  return {
    rows,
    findMany: vi.fn(async ({ where, orderBy }: { where?: Row; orderBy?: Row } = {}) => {
      let out = rows.filter((r) => matches(r, where)).map((r) => ({ ...r, ...related(r) }));
      if (orderBy) {
        const [[key, dir]] = Object.entries(orderBy);
        out = out.sort((a, b) => ((a[key] as number) > (b[key] as number) ? 1 : -1) * (dir === "desc" ? -1 : 1));
      }
      return out;
    }),
    findUnique: vi.fn(async ({ where }: { where: Row }) => {
      const r = rows.find((row) => matches(row, where));
      return r ? { ...r, ...related(r) } : null;
    }),
    updateMany: vi.fn(async ({ where, data }: { where: Row; data: Row }) => {
      const hit = rows.filter((r) => matches(r, where));
      hit.forEach((r) => Object.assign(r, data));
      return { count: hit.length };
    }),
    update: vi.fn(async ({ where, data }: { where: Row; data: Row }) => {
      const r = rows.find((row) => matches(row, where));
      if (r) Object.assign(r, data);
      return r;
    }),
    create: vi.fn(async ({ data }: { data: Row }) => {
      const r = { id: `id${nextId++}`, updatedAt: new Date(), createdAt: new Date(), ...data } as unknown as T;
      rows.push(r);
      return r;
    }),
  };
}

const now = istToUtc("2026-11-20", "19:00");
const day1 = istToUtc("2026-11-21", "19:00");

function mkBatch(overrides: Row = {}) {
  return {
    id: "b1",
    courseId: "c1",
    batchNumber: 1,
    status: "OPEN",
    day1StartAt: day1,
    day2StartAt: addMinutes(day1, 24 * 60),
    durationMinutes: 120,
    bookingCloseAt: addMinutes(day1, -60),
    priceRupees: 1999,
    startTimeIst: "19:00",
    language: null,
    zohoWebinarKeyDay1: "K1",
    zohoWebinarKeyDay2: "K2",
    whatsappGroupLink: "https://chat.whatsapp.com/g",
    surveyUrl: null,
    ...overrides,
  };
}

const settings = {
  id: "s1",
  courseId: "c1",
  anchorDay1Date: istToUtc("2026-11-21", "00:00"),
  cadenceDays: 14,
  defaultPriceRupees: 1999,
  defaultStartTimeIst: "19:00",
  durationMinutes: 120,
  defaultLanguage: null,
  closeHoursBefore: 24,
  newBatchStatus: "DRAFT",
  futureBatchCount: 2,
  autoCreate: true,
  defaultWhatsappGroupLink: null,
  defaultSurveyUrl: "https://forms.example.com/s",
  alertEmails: ["ops@example.com"],
};

describe("runBatchesJob", () => {
  it("closes, creates future batches without overwriting, and alerts", async () => {
    const batches = table([mkBatch({ bookingCloseAt: addMinutes(now, -1) })]);
    const prisma = { batch: batches, batchSettings: table([settings]), batchRegistration: table([]) };
    const sendAlert = vi.fn();

    const report = await runBatchesJob({ prisma: prisma as never, now, sendAlert, registerInZoho: vi.fn(), sendTemplate: vi.fn(), sendConfirmation: vi.fn() });

    expect(report.closed).toBe(1);
    expect(batches.rows[0].status).toBe("CLOSED");
    // futureBatchCount = 2: the existing 21 Nov batch counts, so only 5 Dec
    // is created (as DRAFT); 19 Dec appears once 21 Nov has passed.
    expect(report.created).toBe(1);
    expect(batches.rows.map((b) => b.batchNumber)).toEqual([1, 2]);
    expect(batches.rows[1]).toMatchObject({ status: "DRAFT", priceRupees: 1999, createdBy: "auto" });
    expect(batches.rows[1].day1StartAt).toEqual(istToUtc("2026-12-05", "19:00"));
    expect(report.alerts.some((a) => a.includes("Nothing is on sale"))).toBe(true);
    expect(sendAlert).toHaveBeenCalledWith(expect.any(String), expect.any(String), ["ops@example.com"]);

    // Second run creates nothing new.
    const again = await runBatchesJob({ prisma: prisma as never, now, sendAlert, registerInZoho: vi.fn(), sendTemplate: vi.fn(), sendConfirmation: vi.fn() });
    expect(again.created).toBe(0);
    expect(batches.rows).toHaveLength(2);
  });
});

describe("runMessagesJob", () => {
  function setup(registrationOverrides: Row = {}) {
    const batch = mkBatch();
    const batches = table([batch]);
    const registrations = table(
      [
        {
          id: "r1",
          batchId: "b1",
          orderId: "o1",
          name: "Asha",
          phone: "9876543210",
          whatsappOptIn: true,
          zohoState: "REGISTERED",
          zohoAttempts: 0,
          zohoAlertedAt: null,
          joinLinkDay1: "https://meeting.zoho.in/j/1",
          joinLinkDay2: "https://meeting.zoho.in/j/2",
          msgConfirmationAt: new Date(),
          msgReminder24hAt: null,
          msgReminderDay1At: null,
          msgReminderDay2At: null,
          msgSurveyAt: null,
          createdAt: now,
          updatedAt: now,
          ...registrationOverrides,
        },
      ],
      () => ({ batch }),
    );
    const prisma = { batch: batches, batchSettings: table([settings]), batchRegistration: registrations };
    const sendTemplate = vi.fn().mockResolvedValue({ ok: true });
    const deps = { prisma: prisma as never, sendAlert: vi.fn(), registerInZoho: vi.fn(), sendTemplate, sendConfirmation: vi.fn().mockResolvedValue(true) };
    return { registrations, sendTemplate, deps };
  }

  it("sends W2 exactly once across repeated runs", async () => {
    const { registrations, sendTemplate, deps } = setup();
    const inWindow = addMinutes(day1, -23 * 60 - 30);

    const first = await runMessagesJob({ ...deps, now: inWindow });
    expect(first.w2).toBe(1);
    expect(sendTemplate).toHaveBeenCalledTimes(1);
    expect(sendTemplate.mock.calls[0][0]).toMatchObject({ phone: "+919876543210", idempotencyKey: "msgReminder24hAt:r1" });
    expect(registrations.rows[0].msgReminder24hAt).toBeInstanceOf(Date);

    const second = await runMessagesJob({ ...deps, now: addMinutes(inWindow, 15) });
    expect(second.w2).toBe(0);
    expect(sendTemplate).toHaveBeenCalledTimes(1);
  });

  it("sends the survey with the batch number and skips invalid phones", async () => {
    const { sendTemplate, deps } = setup({ phone: "12345" });
    const afterEnd = addMinutes(addMinutes(day1, 24 * 60 + 120), 60);
    const report = await runMessagesJob({ ...deps, now: afterEnd });
    expect(report.skippedInvalidPhone).toBe(1);
    expect(sendTemplate).not.toHaveBeenCalled();

    const valid = setup();
    const ok = await runMessagesJob({ ...valid.deps, now: afterEnd });
    expect(ok.w4).toBe(1);
    expect(valid.sendTemplate.mock.calls[0][0].params[1]).toBe("https://forms.example.com/s?batch=1");
  });

  it("retries Zoho with backoff and sends W1 once the link exists", async () => {
    const { deps } = setup({ zohoState: "FAILED", zohoAttempts: 2, updatedAt: now, msgConfirmationAt: null });
    const tooSoon = await runMessagesJob({ ...deps, now: addMinutes(now, 5) });
    expect(tooSoon.zohoRetried).toBe(0);
    const later = await runMessagesJob({ ...deps, now: addMinutes(now, 11) });
    expect(later.zohoRetried).toBe(1);
    expect(deps.registerInZoho).toHaveBeenCalledWith("r1");

    const registered = setup({ msgConfirmationAt: null });
    const report = await runMessagesJob({ ...registered.deps, now });
    expect(report.w1).toBe(1);
    expect(registered.deps.sendConfirmation).toHaveBeenCalledWith("r1");
  });

  it("alerts once when a registration has failed for 30 minutes", async () => {
    const { registrations, deps } = setup({ zohoState: "FAILED", zohoAttempts: 5, createdAt: addMinutes(now, -45) });
    await runMessagesJob({ ...deps, now });
    await runMessagesJob({ ...deps, now: addMinutes(now, 15) });
    expect(deps.sendAlert).toHaveBeenCalledTimes(1);
    expect(deps.sendAlert.mock.calls[0][1]).toContain("Order o1");
    expect(registrations.rows[0].zohoAlertedAt).toBeInstanceOf(Date);
  });
});
