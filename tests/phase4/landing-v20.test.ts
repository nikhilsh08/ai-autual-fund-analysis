import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { istToUtc } from "@/lib/ist";
import {
  V20RenderError,
  renderV20Checkout,
  renderV20Landing,
  renderV20ThankYou,
  type V20Batch,
  type V20Common,
  type V20Order,
} from "@/lib/landing/render-v20";

const read = (file: string) => readFileSync(fileURLToPath(new URL(`../../src/landing/${file}`, import.meta.url)), "utf8");
const landing = read("mpf-v20.html");
const checkout = read("mpf-v20-checkout.html");
const thankYou = read("mpf-v20-thank-you.html");

const common: V20Common = {
  courseId: "course20",
  siteUrl: "https://www.cashflowcrew.in",
  tracking: { pixelId: "PIXEL123", gtmId: "GTM-TEST", gaId: "G-TEST", ga4ViaGtm: false, clarityId: "clarity1" },
};

const batch: V20Batch = {
  id: "batch20",
  priceRupees: 2999,
  day1StartAt: istToUtc("2026-11-21", "10:00"),
  day2StartAt: istToUtc("2026-11-22", "10:00"),
  bookingCloseAt: istToUtc("2026-11-20", "23:59"),
  durationMinutes: 120,
  language: "English",
};

const hooks = { initiateUrl: "/api/payment/cashfree/initiate", couponUrl: "/api/coupons/validate", cashfreeMode: "sandbox" as const };

const TOKENS = /\{(price|class date|day 2 date|booking close date)\}/;
const mpfOf = (html: string) => JSON.parse(/window\.MPF = (\{.*?\});/.exec(html)![1]);

describe("v20 landing renderer", () => {
  it("fills every token from the batch and links the price card to /v20/checkout", () => {
    const html = renderV20Landing(landing, { batch, fallbackPriceRupees: null, paidSeats: 3 }, common);

    expect(html).not.toMatch(TOKENS);
    expect(html).toContain("₹2,999");
    expect(html).toContain("Saturday <b>21 Nov</b> and Sunday <b>22 Nov</b>");
    expect(html).toContain("Booking for this batch closes 20 Nov, 11:59 PM IST.");
    expect(html).toContain('href="/v20/checkout" data-checkout="1"');
    expect(html).not.toContain('href="checkout.html"');
    expect(html).not.toContain('src="./');
    expect(html).toContain('src="/mpf/assets/portrait.webp"');
    expect(html).toContain('src="/mpf/lenis.min.js"');
  });

  it("has no seat limit: the seat line never counts down and no limit is promised", () => {
    const html = renderV20Landing(landing, { batch, fallbackPriceRupees: null, paidSeats: 37 }, common);
    // 50 is the page's own default: it shows its fixed line, not "13 of 50 seats left".
    expect(mpfOf(html)).toEqual({ seatsLeft: 50, startTime: "10:00 AM IST", language: "English", fillingFast: false });
    expect(html).not.toContain("limited to 50 attendees");
    // Far past 50 bookings the page still does not count down.
    expect(mpfOf(renderV20Landing(landing, { batch, fallbackPriceRupees: null, paidSeats: 400 }, common)).seatsLeft).toBe(50);
    // The same with nothing on sale.
    expect(renderV20Landing(landing, { batch: null, fallbackPriceRupees: 2499, paidSeats: 0 }, common)).not.toContain("limited to 50 attendees");
  });

  it("with a seat limit set for the page, counts down from real bookings", () => {
    const html = renderV20Landing(landing, { batch, fallbackPriceRupees: null, paidSeats: 37, seatLimit: 50 }, common);
    expect(mpfOf(html)).toEqual({ seatsLeft: 13, startTime: "10:00 AM IST", language: "English", fillingFast: false });
    expect(html).toContain("limited to 50 attendees");
  });

  it("adds Pixel, GTM, GA4, Clarity, ViewContent and AddToCart with the course ID", () => {
    const html = renderV20Landing(landing, { batch, fallbackPriceRupees: null, paidSeats: 0 }, common);
    expect(html).toContain("fbq('init','PIXEL123')");
    expect(html).toContain("'GTM-TEST'");
    expect(html).toContain("gtag/js?id=G-TEST");
    expect(html).toContain("clarity.ms/tag/");
    expect(html).toContain("'ViewContent'");
    expect(html).toContain("'AddToCart'");
    expect(html).toContain('"contentIds":["course20"]');
    expect(html).toContain('<link rel="canonical" href="https://www.cashflowcrew.in/v20">');
    expect(html.indexOf("fbq('init'")).toBeLessThan(html.indexOf("</head>"));
  });

  it("with nothing on sale removes the checkout button and says booking opens soon", () => {
    const html = renderV20Landing(landing, { batch: null, fallbackPriceRupees: 2499, paidSeats: 0 }, common);
    expect(html).not.toMatch(TOKENS);
    expect(html).not.toContain('data-checkout="1"');
    expect(html).toContain("Booking for the next batch opens soon.");
    expect(html).toContain("₹2,499");
    expect(mpfOf(html).startTime).toBe("");
  });

  it("refuses a template that lost its window.MPF line", () => {
    expect(() =>
      renderV20Landing(landing.replace("window.MPF = window.MPF ||", "var x ="), { batch, fallbackPriceRupees: null, paidSeats: 0 }, common),
    ).toThrow(V20RenderError);
  });
});

describe("v20 checkout renderer", () => {
  it("fills the price and dates, wires the hooks and never sends an amount", () => {
    const html = renderV20Checkout(checkout, batch, common, hooks);
    expect(html).not.toMatch(TOKENS);
    expect(html).toContain('data-price="2,999"');
    expect(html).toContain("Book your seat for Saturday 21 Nov and Sunday 22 Nov.");
    expect(html).toContain('"batchId":"batch20"');
    expect(html).toContain('"source":"mpf-v20"');
    expect(html).toContain("onPay: function");
    expect(html).toContain("onCoupon: function");
    expect(html).not.toMatch(/amount\s*:\s*total/i);
    expect(html).toContain('data-clarity-mask="true"');
    expect(html).toContain('href="/v20#seat"');
    expect(html).toContain("'InitiateCheckout'");
  });

  it("preview has no payment hooks and no tracking", () => {
    const html = renderV20Checkout(checkout, batch, common, { ...hooks, preview: true });
    expect(html).not.toContain("onPay: function");
    expect(html).not.toContain("fbq('init'");
  });
});

describe("v20 thank-you renderer", () => {
  const order: V20Order = {
    state: "paid",
    orderId: "ORDER_CF_1",
    name: "Test </script> Buyer",
    email: "buyer@example.com",
    amountRupees: 2999,
    joinDay1: null,
    joinDay2: null,
    whatsappGroup: null,
  };
  const tyHooks = { verifyUrl: "/api/payment/cashfree/verify", bookingUrl: "/api/orders/ORDER_CF_1/booking" };

  it("fires Purchase once with the order ID as eventID, matching CAPI", () => {
    const html = renderV20ThankYou(thankYou, batch, order, common, tyHooks);
    expect(html).not.toMatch(TOKENS);
    expect(html).toContain("'Purchase'");
    expect(html).toContain("{eventID:p.orderId}");
    expect(html).toContain('"orderId":"ORDER_CF_1"');
    expect(html).toContain("/api/orders/ORDER_CF_1/booking");
  });

  it("escapes order values so they cannot close the script", () => {
    const html = renderV20ThankYou(thankYou, batch, order, common, tyHooks);
    expect(html).not.toContain("Test </script> Buyer");
    expect(html).toContain("Test \\u003c/script\\u003e Buyer");
  });

  it("does not fire Purchase for a pending or failed payment", () => {
    for (const state of ["verifying", "failed"] as const) {
      const html = renderV20ThankYou(thankYou, batch, { ...order, state }, common, tyHooks);
      expect(html).not.toContain("'Purchase'");
      expect(html).toContain(`"state":"${state}"`);
    }
  });
});
