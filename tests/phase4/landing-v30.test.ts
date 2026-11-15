import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { istToUtc } from "@/lib/ist";
import {
  V30RenderError,
  renderV30Checkout,
  renderV30Landing,
  renderV30RefundPolicy,
  renderV30ThankYou,
  type V30Batch,
  type V30Common,
  type V30Order,
} from "@/lib/landing/render-v30";

const read = (file: string) => readFileSync(fileURLToPath(new URL(`../../src/landing/${file}`, import.meta.url)), "utf8");
const landing = read("mpf-v30.html");
const checkout = read("mpf-v30-checkout.html");
const thankYou = read("mpf-v30-thank-you.html");
const refund = read("mpf-v30-refund-policy.html");

const common: V30Common = {
  courseId: "course30",
  siteUrl: "https://www.cashflowcrew.in",
  tracking: { pixelId: "PIXEL123", gtmId: "GTM-TEST", gaId: "G-TEST", ga4ViaGtm: false, clarityId: "clarity1" },
};

const batch: V30Batch = {
  id: "batch30",
  priceRupees: 2999,
  day1StartAt: istToUtc("2026-11-21", "10:00"),
  day2StartAt: istToUtc("2026-11-22", "10:00"),
  bookingCloseAt: istToUtc("2026-11-20", "23:59"),
  durationMinutes: 120,
  language: "English",
};

const hooks = { initiateUrl: "/api/payment/cashfree/initiate", couponUrl: "/api/coupons/validate", cashfreeMode: "sandbox" as const };
const tyHooks = { verifyUrl: "/api/payment/cashfree/verify", bookingUrl: "/api/orders/O1/booking" };

const TOKENS =
  /\{(price|class date|day 2 date|booking close date|class time|course id|batch id|order status|order id|buyer name|buyer email|amount paid|day 1 start iso|day 2 start iso)\}/;
// Relative links to the designer's folder must all be rewritten.
const RELATIVE = /["'(]\.\/(assets|fonts|lenis|checkout|index|refund-policy)/;

// Every inline script must still parse after the config objects are replaced.
function expectScriptsParse(html: string) {
  const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  expect(scripts.length).toBeGreaterThan(0);
  for (const s of scripts) expect(() => new Function(s)).not.toThrow();
}

const jsonAfter = (html: string, name: string) => JSON.parse(new RegExp(`window\\.${name}=(\\{.*?\\})[;,]`).exec(html)![1]);

const order = (over: Partial<V30Order> = {}): V30Order => ({
  state: "paid",
  orderId: "O1",
  name: "Asha",
  email: "asha@example.com",
  amountRupees: 2999,
  joinDay1: null,
  joinDay2: null,
  whatsappGroup: null,
  ...over,
});

describe("v30 landing", () => {
  it("fills every token from the batch and rewrites every path", () => {
    const html = renderV30Landing(landing, { batch, fallbackPriceRupees: null, paidSeats: 37 }, common);
    expect(html).not.toMatch(TOKENS);
    expect(html).not.toMatch(RELATIVE);
    expect(html).toContain("₹2,999");
    expect(html).toContain("21 Nov");
    expect(html).toContain('href="/v30/checkout" data-checkout="1"');
    expect(html).toContain("/mpf30/fonts/newsreader-roman.woff2");
    expect(html).toContain('"/mpf30/lenis.min.js"');
    expect(html).toContain('href="/v30/refund-policy"');
    expect(jsonAfter(html, "MPF")).toEqual({ seatsLeft: 13, startTime: "10:00 AM IST", language: "English" });
    expectScriptsParse(html);
  });

  it("adds Pixel, GTM, GA4, Clarity and the landing events", () => {
    const html = renderV30Landing(landing, { batch, fallbackPriceRupees: null, paidSeats: 0 }, common);
    expect(html).toContain("fbq('init','PIXEL123')");
    expect(html).toContain("GTM-TEST");
    expect(html).toContain("gtag/js?id=G-TEST");
    expect(html).toContain("clarity.ms/tag/");
    expect(html).toContain("'ViewContent'");
    expect(html).toContain('<link rel="canonical" href="https://www.cashflowcrew.in/v30">');
  });

  it("removes the checkout button when nothing is on sale", () => {
    const html = renderV30Landing(landing, { batch: null, fallbackPriceRupees: 2999, paidSeats: 0 }, common);
    expect(html).not.toContain('data-checkout="1">');
    expect(html).not.toMatch(TOKENS);
    expectScriptsParse(html);
  });

  it("throws when the template loses its markers", () => {
    expect(() => renderV30Landing("<html></html>", { batch, fallbackPriceRupees: null, paidSeats: 0 }, common)).toThrow(V30RenderError);
  });
});

describe("v30 checkout", () => {
  it("passes the course, batch, price and source to the page script; never an amount to charge", () => {
    const html = renderV30Checkout(checkout, batch, common, hooks);
    expect(html).not.toMatch(TOKENS);
    expect(html).not.toMatch(RELATIVE);
    expect(jsonAfter(html, "MPF_CHECKOUT")).toEqual({
      price: "₹2,999",
      courseId: "course30",
      batchId: "batch30",
      initiateUrl: "/api/payment/cashfree/initiate",
      couponUrl: "/api/coupons/validate",
      cashfreeMode: "sandbox",
      landingSource: "mpf-v30",
      preview: false,
    });
    expect(html).toContain('data-clarity-mask="true"');
    expect(html.match(/data-clarity-mask/g)).toHaveLength(1);
    expectScriptsParse(html);
  });

  it("adds the tags and a GA4 begin_checkout only when GA4 runs without GTM", () => {
    const direct = renderV30Checkout(checkout, batch, common, hooks);
    expect(direct).toContain("fbq('init','PIXEL123')");
    expect(direct).toContain('gtag(\'event\',"begin_checkout"');
    const viaGtm = renderV30Checkout(checkout, batch, { ...common, tracking: { ...common.tracking, ga4ViaGtm: true } }, hooks);
    expect(viaGtm).not.toContain('gtag(\'event\',"begin_checkout"');
  });

  it("preview: no tracking and payment off", () => {
    const html = renderV30Checkout(checkout, batch, common, { ...hooks, preview: true });
    expect(html).not.toContain("PIXEL123");
    expect(jsonAfter(html, "MPF_CHECKOUT").preview).toBe(true);
  });
});

describe("v30 thank-you", () => {
  it("paid: order details, dates and the GA4 purchase; Meta Purchase stays in the page script", () => {
    const html = renderV30ThankYou(thankYou, batch, order({ joinDay1: "https://j/1", joinDay2: "https://j/2" }), common, tyHooks);
    expect(html).not.toMatch(TOKENS);
    expect(html).not.toMatch(RELATIVE);
    const o = jsonAfter(html, "MPF_ORDER");
    expect(o).toMatchObject({ status: "paid", orderId: "O1", amount: "₹2,999.00", joinDay1: "https://j/1", durationMinutes: 120, preview: false });
    expect(o.day1Start).toBe(batch.day1StartAt.toISOString());
    expect(html).toContain('gtag(\'event\',"purchase"');
    expect(html).toContain("eventID:");
    expect(html).toContain('<main data-clarity-mask="true">');
    expect(html).toContain('href="/v30/checkout"');
    expectScriptsParse(html);
  });

  it("pending: page state 'pending', re-checks the payment, no purchase event", () => {
    const html = renderV30ThankYou(thankYou, batch, order({ state: "verifying" }), common, tyHooks);
    expect(jsonAfter(html, "MPF_ORDER").status).toBe("pending");
    expect(html).toContain("/api/payment/cashfree/verify");
    expect(html).not.toContain('gtag(\'event\',"purchase"');
    expectScriptsParse(html);
  });

  it("escapes buyer details inside the script", () => {
    const html = renderV30ThankYou(thankYou, batch, order({ name: "</script><b>x" }), common, tyHooks);
    expect(html).not.toContain("</script><b>x");
    expectScriptsParse(html);
  });
});

describe("v30 refund policy", () => {
  it("rewrites the logo, fonts and back link", () => {
    const html = renderV30RefundPolicy(refund, common);
    expect(html).not.toMatch(RELATIVE);
    expect(html).toContain("/mpf30/assets/logo-64.webp");
    expect(html).toContain('href="/v30"');
  });
});
