import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { trackInitiateCheckout, trackPurchase, trackViewContent } from "@/lib/analytics/track";

type G = { window?: Record<string, unknown> };

describe("analytics track helper (spec 4)", () => {
  const g = globalThis as unknown as G;
  const fbq = vi.fn();
  const gtag = vi.fn();

  beforeEach(() => {
    g.window = { fbq, gtag };
    fbq.mockReset();
    gtag.mockReset();
    delete process.env.NEXT_PUBLIC_GA4_VIA_GTM;
  });

  afterEach(() => {
    delete g.window;
  });

  it("sends ViewContent to the Pixel and view_item to gtag with no personal data", () => {
    trackViewContent({ contentIds: ["c1"], contentName: "Master Mutual Funds workshop", value: 1999 });
    expect(fbq).toHaveBeenCalledWith("track", "ViewContent", {
      content_ids: ["c1"],
      content_type: "product",
      content_name: "Master Mutual Funds workshop",
      value: 1999,
      currency: "INR",
    });
    expect(gtag).toHaveBeenCalledWith("event", "view_item", {
      currency: "INR",
      value: 1999,
      items: [{ item_id: "c1", item_name: "Master Mutual Funds workshop", price: 1999 }],
    });
  });

  it("pushes to dataLayer instead of gtag when GA4 is owned by GTM", () => {
    process.env.NEXT_PUBLIC_GA4_VIA_GTM = "true";
    trackInitiateCheckout({ contentIds: ["c1"], contentName: "Master Mutual Funds workshop", value: 1999 });
    expect(gtag).not.toHaveBeenCalled();
    expect((g.window as unknown as { dataLayer: unknown[] }).dataLayer).toEqual([
      expect.objectContaining({ event: "begin_checkout" }),
    ]);
    expect(fbq).toHaveBeenCalledWith("track", "InitiateCheckout", expect.objectContaining({ value: 1999 }));
  });

  it("does nothing when no tag is loaded", () => {
    g.window = {};
    expect(() => trackViewContent({ contentIds: ["c1"], contentName: "x", value: 1 })).not.toThrow();
  });

  // The Pixel and gtag are added after the page hydrates, later than the
  // first effect of the checkout page.
  it("waits for a tag that loads after the event instead of dropping it", () => {
    vi.useFakeTimers();
    try {
      g.window = {};
      trackInitiateCheckout({ contentIds: ["c1"], contentName: "Master Mutual Funds workshop", value: 399 });
      expect(fbq).not.toHaveBeenCalled();

      vi.advanceTimersByTime(600);
      Object.assign(g.window as object, { fbq, gtag });
      vi.advanceTimersByTime(400);

      expect(fbq).toHaveBeenCalledTimes(1);
      expect(fbq).toHaveBeenCalledWith("track", "InitiateCheckout", expect.objectContaining({ value: 399, content_ids: ["c1"] }));
      expect(gtag).toHaveBeenCalledTimes(1);
      expect(gtag).toHaveBeenCalledWith("event", "begin_checkout", expect.objectContaining({ value: 399 }));

      vi.advanceTimersByTime(20_000);
      expect(fbq).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it("gives up quietly when the tag never loads", () => {
    vi.useFakeTimers();
    try {
      g.window = {};
      trackInitiateCheckout({ contentIds: ["c1"], contentName: "x", value: 1 });
      vi.advanceTimersByTime(60_000);
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it("sends Purchase once per order, with the order ID as the Pixel eventID", () => {
    const store = new Map<string, string>();
    const localStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    };
    g.window = { fbq, gtag, localStorage };
    const purchase = {
      orderId: "ORDER_CF_1",
      value: 2999,
      items: [{ item_id: "c1", item_name: "Master Personal Finance with AI", price: 2999 }],
    };

    expect(trackPurchase(purchase)).toBe(true);
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "Purchase",
      { value: 2999, currency: "INR", content_ids: ["c1"], content_type: "product" },
      { eventID: "ORDER_CF_1" },
    );
    expect(gtag).toHaveBeenCalledWith("event", "purchase", {
      transaction_id: "ORDER_CF_1",
      value: 2999,
      currency: "INR",
      items: purchase.items,
    });

    // A reload of the thank-you page.
    expect(trackPurchase(purchase)).toBe(false);
    expect(fbq).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledTimes(1);
  });
});
