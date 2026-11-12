import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("cashfree-pg", () => ({
  CFEnvironment: { SANDBOX: "SANDBOX", PRODUCTION: "PRODUCTION" },
  Cashfree: class {
    XApiVersion = "";
    PGFetchOrder = vi.fn().mockResolvedValue({ data: { order_status: "PAID" } });
    PGOrderFetchPayments = vi.fn().mockResolvedValue({
      data: [{ payment_status: "SUCCESS", cf_payment_id: 1, payment_amount: 1999, payment_currency: "INR", payment_group: "upi" }],
    });
  },
}));

const { tx, prisma } = vi.hoisted(() => {
  const tx = {
    order: { findUnique: vi.fn(), update: vi.fn() },
    user: { findUnique: vi.fn(), create: vi.fn() },
    purchase: { upsert: vi.fn() },
    batchRegistration: { upsert: vi.fn() },
    course: { findMany: vi.fn() },
    paymentTransaction: { upsert: vi.fn() },
  };
  const prisma = {
    order: { findUnique: vi.fn(), update: vi.fn() },
    coupon: { update: vi.fn() },
    $transaction: vi.fn(async (fn: (t: typeof tx) => Promise<unknown>) => fn(tx)),
  };
  return { tx, prisma };
});

vi.mock("@/lib/dbPrisma", () => ({ dataBasePrisma: prisma }));
vi.mock("@/lib/trainer-central", () => ({ enrollUserInTrainerCentral: vi.fn() }));
vi.mock("@/lib/meta-capi", () => ({ sendMetaCAPIPurchaseEvent: vi.fn() }));
vi.mock("@/lib/batches/registration", () => ({ processBatchRegistrationForOrder: vi.fn() }));

import { enrollUserInTrainerCentral } from "@/lib/trainer-central";
import { processBatchRegistrationForOrder } from "@/lib/batches/registration";
import { verifyCashfreePayment } from "@/server/actions/payment.action";

function order(item: Record<string, unknown>) {
  return {
    id: "o1",
    orderId: "ORDER_CF_1",
    status: "PENDING",
    guestEmail: "asha@example.com",
    guestPhone: "9876543210",
    whatsappOptIn: true,
    totalAmount: 1999,
    couponId: null,
    lead: { name: "Asha Rao", email: "asha@example.com", phone: "9876543210" },
    items: [item],
    bundleItems: [],
  };
}

const workshopItem = {
  courseId: "c1",
  batchId: "b1",
  price: 1999,
  course: { id: "c1", title: "MMF", type: "LIVE", tcCourseId: "tc-mmf", useBatches: true },
};
const recordedItem = {
  courseId: "c2",
  batchId: null,
  price: 999,
  course: { id: "c2", title: "Recorded", type: "RECORDED", tcCourseId: "tc-rec", useBatches: false },
};

describe("verifyCashfreePayment — batch orders (spec 3.3)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tx.user.findUnique.mockResolvedValue(null);
    tx.user.create.mockResolvedValue({ id: "u1", email: "asha@example.com", name: "Asha Rao" });
    tx.order.findUnique.mockResolvedValue({ status: "PENDING" });
  });

  it("creates one registration, skips TrainerCentral, and triggers Zoho/W1 exactly once even when processed twice", async () => {
    const local = order(workshopItem);
    prisma.order.findUnique.mockResolvedValueOnce(local).mockResolvedValueOnce({ ...local, status: "PAID" });

    const first = await verifyCashfreePayment("ORDER_CF_1");
    expect(first.success).toBe(true);
    expect(tx.batchRegistration.upsert).toHaveBeenCalledTimes(1);
    expect(tx.batchRegistration.upsert.mock.calls[0][0]).toMatchObject({
      where: { orderId: "o1" },
      create: { batchId: "b1", orderId: "o1", email: "asha@example.com", phone: "9876543210", whatsappOptIn: true },
    });
    expect(enrollUserInTrainerCentral).not.toHaveBeenCalled();
    expect(processBatchRegistrationForOrder).toHaveBeenCalledTimes(1);
    expect(processBatchRegistrationForOrder).toHaveBeenCalledWith("o1");

    // Webhook and browser redirect race: second call sees PAID and exits.
    const second = await verifyCashfreePayment("ORDER_CF_1");
    expect(second.status).toBe("PAID");
    expect(tx.batchRegistration.upsert).toHaveBeenCalledTimes(1);
    expect(processBatchRegistrationForOrder).toHaveBeenCalledTimes(1);
  });

  it("still enrols recorded courses in TrainerCentral and creates no registration", async () => {
    prisma.order.findUnique.mockResolvedValue(order(recordedItem));

    await verifyCashfreePayment("ORDER_CF_1");

    expect(enrollUserInTrainerCentral).toHaveBeenCalledTimes(1);
    expect(enrollUserInTrainerCentral).toHaveBeenCalledWith("RECORDED", "asha@example.com", "Asha Rao", "tc-rec");
    expect(tx.batchRegistration.upsert).not.toHaveBeenCalled();
    expect(processBatchRegistrationForOrder).not.toHaveBeenCalled();
  });
});
