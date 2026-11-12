export interface CouponRule {
  discount: number;
  discountType: string;
  maxDiscount?: number | null;
  applicableCourseIds?: string[];
  applicableBundleIds?: string[];
  applicableBatchIds?: string[];
}

// Rupees in, rupees out. Mirrors the rules used by checkout preview and the
// initiate route so both always agree.
export function applyCoupon(subtotalRupees: number, coupon: CouponRule): number {
  let discount =
    coupon.discountType === "PERCENTAGE"
      ? (subtotalRupees * coupon.discount) / 100
      : coupon.discount;
  if (coupon.discountType === "PERCENTAGE" && coupon.maxDiscount && discount > coupon.maxDiscount) {
    discount = coupon.maxDiscount;
  }
  return Math.min(discount, subtotalRupees);
}

export function couponAppliesTo(
  coupon: CouponRule,
  selection: { courseIds: string[]; bundleIds: string[]; batchId?: string | null },
): boolean {
  const courses = coupon.applicableCourseIds ?? [];
  const bundles = coupon.applicableBundleIds ?? [];
  const batches = coupon.applicableBatchIds ?? [];

  if (batches.length > 0 && !(selection.batchId && batches.includes(selection.batchId))) {
    return false;
  }

  const restricted = courses.length > 0 || bundles.length > 0;
  if (!restricted) return true;

  return (
    selection.courseIds.some((id) => courses.includes(id)) ||
    selection.bundleIds.some((id) => bundles.includes(id))
  );
}

export function roundRupees(amount: number): number {
  return Math.max(0, Math.round(amount * 100) / 100);
}
