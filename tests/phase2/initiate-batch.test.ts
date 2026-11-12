import { beforeEach, describe, expect, it, vi } from "vitest";
import { istToUtc } from "@/lib/ist";

const prisma = vi.hoisted(() => ({
  bundle: { findMany: vi.fn() },
  course: { findMany: vi.fn() },
  batch: { findUnique: vi.fn() },
  coupon: { findUnique: vi.fn() },
  user: { findUnique: vi.fn() },
  lead: { upsert: vi.fn() },
  order: { create: vi.fn() },
}));

vi.mock("@/lib/dbPrisma", () => ({ dataBasePrisma: prisma }));
vi.mock("@/lib/authDetails", () => ({ currentUser: vi.fn().mockResolvedValue(null) }));
vi.mock("@/server/actions/payment.action", () => ({
  createCashfreeOrder: vi.fn().mockResolvedValue({ success: true, data: { payment_session_id: "sess" } }),
}));

import { createCashfreeOrder } from "@/server/actions/payment.action";
import { POST } from "@/app/api/payment/cashfree/initiate/route";

const workshop = { id: "c1", price: 99999, isPublished: true, useBatches: true, tcCourseId: "tc" };
const openBatch = {
  id: "b1",
  courseId: "c1",
  status: "OPEN",
  priceRupees: 1999,
  bookingCloseAt: istToUtc("2099-01-01", "00:00"),
  day1StartAt: istToUtc("2099-01-02", "19:00"),
};

const post = (body: Record<string, unknown>) =>
  POST(
    new Request("http://localhost/api/payment/cashfree/initiate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Asha", email: "asha@example.com", phone: "9876543210", courseIds: ["c1"], ...body }),
    }),
  );

describe("POST /api/payment/cashfree/initiate — batch course (spec 3.2)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prisma.course.findMany.mockResolvedValue([workshop]);
    prisma.batch.findUnique.mockResolvedValue(openBatch);
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.lead.upsert.mockResolvedValue({ id: "lead1" });
    prisma.order.create.mockResolvedValue({});
  });

  it("requires a batchId for a batch course", async () => {
    const res = await post({});
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: "batch_required" });
  });

  it("rejects a closed batch with 409", async () => {
    prisma.batch.findUnique.mockResolvedValue({ ...openBatch, status: "CLOSED" });
    const res = await post({ batchId: "b1" });
    expect(res.status).toBe(409);
    expect(await res.json()).toMatchObject({ error: "batch_not_on_sale" });
  });

  it("rejects a batch whose booking has closed", async () => {
    prisma.batch.findUnique.mockResolvedValue({ ...openBatch, bookingCloseAt: new Date(Date.now() - 1000) });
    expect((await post({ batchId: "b1" })).status).toBe(409);
  });

  it("refuses to mix a batch course with bundles", async () => {
    prisma.bundle.findMany.mockResolvedValue([{ id: "bu1", price: 10, courseIds: ["c2"] }]);
    const res = await post({ batchId: "b1", bundleIds: ["bu1"] });
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: "batch_course_must_be_alone" });
  });

  it("charges the batch price, ignores any client amount, and records batchId + consent", async () => {
    const res = await post({ batchId: "b1", amount: 1, whatsappOptIn: true });
    expect(res.status).toBe(200);

    const created = prisma.order.create.mock.calls[0][0].data;
    expect(created.totalAmount).toBe(1999);
    expect(created.whatsappOptIn).toBe(true);
    expect(created.items.create[0]).toMatchObject({ courseId: "c1", price: 1999, batchId: "b1" });
    expect(vi.mocked(createCashfreeOrder).mock.calls[0][1]).toBe(1999);
  });

  it("does not block a repeat buyer who already owns the course", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: "u1", email: "asha@example.com" });
    const res = await post({ batchId: "b1" });
    expect(res.status).toBe(200);
    expect(prisma.order.create.mock.calls[0][0].data.userId).toBe("u1");
  });

  it("applies a batch-scoped coupon only to its batch", async () => {
    prisma.coupon.findUnique.mockResolvedValue({
      id: "cp",
      code: "B2ONLY",
      discount: 100,
      discountType: "FIXED",
      expiryDate: new Date("2099-01-01"),
      usageLimit: null,
      usedCount: 0,
      minAmount: 0,
      applicableCourseIds: [],
      applicableBundleIds: [],
      applicableBatchIds: ["b2"],
    });
    const res = await post({ batchId: "b1", couponCode: "B2ONLY" });
    expect(res.status).toBe(400);
  });
});
