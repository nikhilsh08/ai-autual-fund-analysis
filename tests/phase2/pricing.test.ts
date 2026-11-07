import { describe, expect, it } from "vitest";
import { applyCoupon, couponAppliesTo, roundRupees } from "@/lib/pricing";

describe("applyCoupon", () => {
  it("applies a percentage with a cap", () => {
    expect(applyCoupon(1999, { discount: 10, discountType: "PERCENTAGE" })).toBeCloseTo(199.9);
    expect(applyCoupon(1999, { discount: 50, discountType: "PERCENTAGE", maxDiscount: 300 })).toBe(300);
  });

  it("applies a fixed amount and never exceeds the subtotal", () => {
    expect(applyCoupon(1999, { discount: 500, discountType: "FIXED" })).toBe(500);
    expect(applyCoupon(400, { discount: 500, discountType: "FIXED" })).toBe(400);
  });

  it("rounds rupees to paise and never goes negative", () => {
    expect(roundRupees(1999 - 199.9)).toBe(1799.1);
    expect(roundRupees(-1)).toBe(0);
  });
});

describe("couponAppliesTo", () => {
  it("applies to everything when unrestricted", () => {
    expect(couponAppliesTo({ discount: 1, discountType: "FIXED" }, { courseIds: ["c1"], bundleIds: [], batchId: "b1" })).toBe(true);
  });

  it("limits a code to specific batches (OWNER D6)", () => {
    const coupon = { discount: 1, discountType: "FIXED", applicableBatchIds: ["b2"] };
    expect(couponAppliesTo(coupon, { courseIds: ["c1"], bundleIds: [], batchId: "b1" })).toBe(false);
    expect(couponAppliesTo(coupon, { courseIds: ["c1"], bundleIds: [], batchId: "b2" })).toBe(true);
    expect(couponAppliesTo(coupon, { courseIds: ["c1"], bundleIds: [] })).toBe(false);
  });

  it("keeps the existing course/bundle restriction", () => {
    const coupon = { discount: 1, discountType: "FIXED", applicableCourseIds: ["c9"] };
    expect(couponAppliesTo(coupon, { courseIds: ["c1"], bundleIds: [] })).toBe(false);
    expect(couponAppliesTo(coupon, { courseIds: ["c9"], bundleIds: [] })).toBe(true);
  });
});
