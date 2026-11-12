import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { trackInitiateCheckout, trackViewContent } from "@/lib/analytics/track";

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
});
