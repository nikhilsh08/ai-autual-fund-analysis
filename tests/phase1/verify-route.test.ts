import { describe, expect, it, vi } from "vitest";

vi.mock("@/server/actions/payment.action", () => ({
  verifyCashfreePayment: vi.fn(),
}));

import { verifyCashfreePayment } from "@/server/actions/payment.action";
import { POST } from "@/app/api/payment/cashfree/verify/route";

const post = (body: unknown) =>
  POST(
    new Request("http://localhost/api/payment/cashfree/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );

describe("POST /api/payment/cashfree/verify (N2)", () => {
  it("returns only success and status, never the order or lead", async () => {
    vi.mocked(verifyCashfreePayment).mockResolvedValue({
      success: true,
      status: "PAID",
      data: { orderId: "ORD1", lead: { email: "buyer@example.com", phone: "9999999999" } },
    });

    const res = await post({ orderId: "ORD1" });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, status: "PAID" });
  });

  it("returns 400 and no data when verification fails", async () => {
    vi.mocked(verifyCashfreePayment).mockResolvedValue({
      success: false,
      status: "FAILED",
      data: { lead: { email: "buyer@example.com" } },
      error: "nope",
    });

    const res = await post({ orderId: "ORD2" });

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ success: false, status: "FAILED" });
  });

  it("returns 400 when orderId is missing", async () => {
    const res = await post({});
    expect(res.status).toBe(400);
  });
});
