import { beforeEach, describe, expect, it, vi } from "vitest";
import { istToUtc } from "@/lib/ist";

const prisma = vi.hoisted(() => ({
  batch: { findUnique: vi.fn(), findFirst: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn() },
  batchSettings: { findUnique: vi.fn(), findMany: vi.fn(), upsert: vi.fn() },
  batchRegistration: { findMany: vi.fn(), findUnique: vi.fn() },
  orderItem: { findMany: vi.fn() },
  order: { findMany: vi.fn() },
  coupon: { findMany: vi.fn() },
  course: { findMany: vi.fn() },
}));
vi.mock("@/lib/dbPrisma", () => ({ dataBasePrisma: prisma }));
vi.mock("@/lib/auth-admin", () => ({ verifyAdmin: vi.fn() }));

import { verifyAdmin } from "@/lib/auth-admin";
import { GET as listRoute, POST as createRoute } from "@/app/api/admin/batches/route";
import { POST as openRoute } from "@/app/api/admin/batches/[id]/open/route";
import { PATCH as patchRoute } from "@/app/api/admin/batches/[id]/route";
import { GET as guestsRoute } from "@/app/api/admin/batches/[id]/guests/route";
import { csvCell, toCsv } from "@/lib/batches/csv";

const admin = { id: "admin1", email: "admin@cashflowcrew.in", role: "ADMIN" } as never;
const ctx = (id: string) => ({ params: Promise.resolve({ id }) });
const json = (url: string, method: string, body?: unknown) =>
  new Request(`http://localhost${url}`, {
    method,
    headers: { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

const draft = {
  id: "b1",
  courseId: "c1",
  batchNumber: 3,
  status: "DRAFT",
  priceRupees: 1999,
  startTimeIst: "19:00",
  day1StartAt: istToUtc("2099-01-03", "19:00"),
  day2StartAt: istToUtc("2099-01-04", "19:00"),
  bookingCloseAt: istToUtc("2099-01-02", "19:00"),
  durationMinutes: 120,
  zohoWebinarKeyDay1: null,
  zohoWebinarKeyDay2: null,
  whatsappGroupLink: null,
};

describe("admin batch routes (spec 8.1)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(verifyAdmin).mockResolvedValue(admin);
    prisma.batch.update.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({ ...draft, ...data }));
  });

  it("rejects non-admins on every handler", async () => {
    vi.mocked(verifyAdmin).mockResolvedValue(null);
    expect((await listRoute(json("/api/admin/batches", "GET"))).status).toBe(403);
    expect((await createRoute(json("/api/admin/batches", "POST", {}))).status).toBe(403);
    expect((await openRoute(json("/api/admin/batches/b1/open", "POST"), ctx("b1"))).status).toBe(403);
    expect((await patchRoute(json("/api/admin/batches/b1", "PATCH", {}), ctx("b1"))).status).toBe(403);
    expect((await guestsRoute(json("/api/admin/batches/b1/guests", "GET"), ctx("b1"))).status).toBe(403);
  });

  it("creates a DRAFT batch with computed times and the next batch number", async () => {
    prisma.batchSettings.findUnique.mockResolvedValue(null);
    prisma.batch.findFirst.mockResolvedValue({ batchNumber: 4 });
    prisma.batch.create.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({ id: "new", ...data }));

    const res = await createRoute(
      json("/api/admin/batches", "POST", { courseId: "c1", day1Date: "2026-11-21", startTimeIst: "19:00", priceRupees: 1999, closeHoursBefore: 24 }),
    );
    expect(res.status).toBe(201);
    const { data } = prisma.batch.create.mock.calls[0][0];
    expect(data).toMatchObject({ batchNumber: 5, status: "DRAFT", priceRupees: 1999, createdBy: "admin1" });
    expect(data.day1StartAt.toISOString()).toBe("2026-11-21T13:30:00.000Z");
    expect(data.bookingCloseAt.toISOString()).toBe("2026-11-20T13:30:00.000Z");
  });

  it("refuses a day 1 that is not a Saturday", async () => {
    const res = await createRoute(
      json("/api/admin/batches", "POST", { courseId: "c1", day1Date: "2026-11-22", startTimeIst: "19:00", priceRupees: 1999, closeHoursBefore: 24 }),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).message).toMatch(/Saturday/);
  });

  it("will not open a batch without Zoho keys and a WhatsApp link", async () => {
    prisma.batch.findUnique.mockResolvedValue(draft);
    prisma.batchSettings.findUnique.mockResolvedValue(null);
    const res = await openRoute(json("/api/admin/batches/b1/open", "POST"), ctx("b1"));
    expect(res.status).toBe(400);
    const { message } = await res.json();
    expect(message).toMatch(/Zoho webinar keys/);
    expect(message).toMatch(/WhatsApp group link/);
    expect(prisma.batch.update).not.toHaveBeenCalled();
  });

  it("opens a ready batch (default group link counts)", async () => {
    prisma.batch.findUnique.mockResolvedValue({ ...draft, zohoWebinarKeyDay1: "K1", zohoWebinarKeyDay2: "K2" });
    prisma.batchSettings.findUnique.mockResolvedValue({ defaultWhatsappGroupLink: "https://chat.whatsapp.com/g" });
    const res = await openRoute(json("/api/admin/batches/b1/open", "POST"), ctx("b1"));
    expect(res.status).toBe(200);
    expect(prisma.batch.update).toHaveBeenCalledWith({ where: { id: "b1" }, data: { status: "OPEN" } });
  });

  it("patches only whitelisted fields and recomputes times when the day changes", async () => {
    prisma.batch.findUnique.mockResolvedValue(draft);

    const bad = await patchRoute(json("/api/admin/batches/b1", "PATCH", { status: "OPEN" }), ctx("b1"));
    expect(bad.status).toBe(400);

    const ok = await patchRoute(json("/api/admin/batches/b1", "PATCH", { day1Date: "2099-01-10", priceRupees: 2499 }), ctx("b1"));
    expect(ok.status).toBe(200);
    const { data } = prisma.batch.update.mock.calls[0][0];
    expect(data.priceRupees).toBe(2499);
    expect(data.day1StartAt).toEqual(istToUtc("2099-01-10", "19:00"));
    expect(data.day2StartAt).toEqual(istToUtc("2099-01-11", "19:00"));
    expect(data.bookingCloseAt).toEqual(istToUtc("2099-01-09", "19:00"));
  });

  it("lists batches with booked counts and readiness flags", async () => {
    prisma.batch.findMany.mockResolvedValue([{ ...draft, status: "OPEN", zohoWebinarKeyDay1: "K1", zohoWebinarKeyDay2: "K2" }]);
    prisma.orderItem.findMany.mockResolvedValue([{ batchId: "b1" }, { batchId: "b1" }]);
    prisma.batchRegistration.findMany.mockResolvedValue([{ batchId: "b1", zohoState: "FAILED" }]);
    prisma.batchSettings.findMany.mockResolvedValue([]);

    const res = await listRoute(json("/api/admin/batches", "GET"));
    const { batches } = await res.json();
    expect(batches[0]).toMatchObject({ bookedCount: 2, isOnSaleNow: true, zohoReady: true, whatsappReady: false, zohoFailed: 1 });
    expect(batches[0]).not.toHaveProperty("seats");
  });

  it("returns the guest list as escaped CSV named after the batch", async () => {
    prisma.batch.findUnique.mockResolvedValue({ id: "b1", batchNumber: 3 });
    prisma.batchRegistration.findMany.mockResolvedValue([
      {
        id: "r1", orderId: "o1", name: 'Asha "AR" Rao, Jr', email: "asha@example.com", phone: "=9876543210",
        zohoState: "REGISTERED", zohoLastError: null, joinLinkDay1: "x", joinLinkDay2: "y", whatsappOptIn: true,
        msgConfirmationAt: new Date("2026-11-01T00:00:00Z"), msgReminder24hAt: null, msgReminderDay1At: null, msgReminderDay2At: null, msgSurveyAt: null,
      },
    ]);
    prisma.order.findMany.mockResolvedValue([{ id: "o1", orderId: "ORDER_CF_1", totalAmount: 1999, couponId: "cp1", createdAt: new Date(), paymentTransaction: { createdAt: new Date("2026-11-01T00:00:00Z") } }]);
    prisma.coupon.findMany.mockResolvedValue([{ id: "cp1", code: "EARLY" }]);

    const res = await guestsRoute(json("/api/admin/batches/b1/guests?format=csv", "GET"), ctx("b1"));
    expect(res.headers.get("content-disposition")).toBe('attachment; filename="batch-3-guests.csv"');
    const csv = await res.text();
    expect(csv.split("\r\n")[0]).toContain("Name,Email,Phone,Paid amount (INR),Coupon,Order ID");
    expect(csv).toContain('"Asha ""AR"" Rao, Jr",asha@example.com,\'=9876543210,1999,EARLY,ORDER_CF_1,2026-11-01T00:00:00.000Z,REGISTERED,yes,yes');
  });

  it("filters guests by search and state and reports totals", async () => {
    prisma.batch.findUnique.mockResolvedValue({ id: "b1", batchNumber: 3 });
    prisma.batchRegistration.findMany.mockResolvedValue([
      { id: "r1", orderId: "o1", name: "Asha", email: "asha@example.com", phone: "1", zohoState: "REGISTERED", joinLinkDay1: "x", joinLinkDay2: "y", whatsappOptIn: true },
      { id: "r2", orderId: "o2", name: "Ravi", email: "ravi@example.com", phone: "2", zohoState: "FAILED", joinLinkDay1: null, joinLinkDay2: null, whatsappOptIn: false },
    ]);
    prisma.order.findMany.mockResolvedValue([
      { id: "o1", orderId: "A1", totalAmount: 1999, couponId: null, createdAt: new Date(), paymentTransaction: null },
      { id: "o2", orderId: "B2", totalAmount: 1499, couponId: null, createdAt: new Date(), paymentTransaction: null },
    ]);

    const all = await (await guestsRoute(json("/api/admin/batches/b1/guests", "GET"), ctx("b1"))).json();
    expect(all.totals).toEqual({ booked: 2, pending: 0, failed: 1, revenueRupees: 3498 });

    const searched = await (await guestsRoute(json("/api/admin/batches/b1/guests?search=ravi", "GET"), ctx("b1"))).json();
    expect(searched.guests.map((g: { name: string }) => g.name)).toEqual(["Ravi"]);
    expect(searched.guests[0]).not.toHaveProperty("joinLinkDay1");
  });
});

describe("csv helpers", () => {
  it("escapes quotes, separators, newlines and formula prefixes", () => {
    expect(csvCell('a "b"')).toBe('"a ""b"""');
    expect(csvCell("x,y")).toBe('"x,y"');
    expect(csvCell("line\nbreak")).toBe('"line\nbreak"');
    expect(csvCell("+91 98")).toBe("'+91 98");
    expect(csvCell(null)).toBe("");
    expect(toCsv(["a", "b"], [[1, "c"]])).toBe("a,b\r\n1,c\r\n");
  });
});
