// Every date, time, price and session length on the three workshop pages
// (v10, v20, v30) comes from the batch set in the admin panel. Each page is
// rendered with an unusual batch, then checked for those values and for the
// absence of the designers' sample values (₹2,999, 21/22 Nov, 10:00 AM,
// "about 2 hours", ₹1,999, 11:30 AM).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { istToUtc } from "@/lib/ist";
import { renderLanding } from "@/lib/landing/render";
import { renderV20Checkout, renderV20Landing, renderV20ThankYou } from "@/lib/landing/render-v20";
import { renderV30Checkout, renderV30Landing, renderV30ThankYou } from "@/lib/landing/render-v30";

const read = (file: string) => readFileSync(fileURLToPath(new URL(`../../src/landing/${file}`, import.meta.url)), "utf8");

// Admin values nobody would type by accident.
const batch = {
  id: "batchX",
  priceRupees: 3456,
  day1StartAt: istToUtc("2026-12-05", "19:15"),
  day2StartAt: istToUtc("2026-12-06", "19:15"),
  bookingCloseAt: istToUtc("2026-12-04", "21:45"),
  durationMinutes: 90,
  language: "Hindi",
};
const tracking = { ga4ViaGtm: false };
const common = { courseId: "c1", siteUrl: "https://www.cashflowcrew.in", tracking };
const hooks = { initiateUrl: "/i", couponUrl: "/c", cashfreeMode: "sandbox" as const };
const tyHooks = { verifyUrl: "/v", bookingUrl: "/b" };
const order = {
  state: "paid" as const,
  orderId: "O1",
  name: "A",
  email: "a@b.c",
  amountRupees: 3456,
  joinDay1: null,
  joinDay2: null,
  whatsappGroup: null,
};

const SAMPLES = ["2,999", "2999", "1,999", "21 Nov", "22 Nov", "23 Nov", "10:00 AM", "11:30 AM", "about 2 hours"];

// Code comments in the designers' scripts describe formats ("10:00 AM IST")
// and are never shown, so they are left out of the check.
const withoutComments = (html: string) => html.replace(/\/\*[\s\S]*?\*\//g, "").replace(/<!--[\s\S]*?-->/g, "");

function expectOnlyAdminValues(raw: string, opts: { price?: boolean; dates?: boolean; time?: boolean; length?: boolean }) {
  const html = withoutComments(raw);
  for (const s of SAMPLES) expect(html, `sample value "${s}" left in page`).not.toContain(s);
  if (opts.price) expect(html).toContain("3,456");
  if (opts.dates) expect(html).toMatch(/5 Dec/);
  if (opts.time) expect(html).toContain("7:15 PM");
  if (opts.length) expect(html).toContain("1 hour 30 minutes");
}

describe("admin-panel values on every workshop page", () => {
  it("v10 landing", () => {
    const html = renderLanding(read("mmf-v10.html"), batch, {
      courseId: "c1",
      canonicalUrl: "https://www.cashflowcrew.in/v10",
      title: "t",
      description: "d",
      ga4ViaGtm: false,
      fallbackPriceRupees: null,
      fallbackDurationMinutes: 120,
    });
    expectOnlyAdminValues(html, { price: true, dates: true, time: true, length: true });
  });

  it("v20 landing, checkout, thank-you", () => {
    expectOnlyAdminValues(renderV20Landing(read("mpf-v20.html"), { batch, fallbackPriceRupees: null, paidSeats: 0 }, common), {
      price: true, dates: true, time: true,
    });
    expectOnlyAdminValues(renderV20Checkout(read("mpf-v20-checkout.html"), batch, common, hooks), { price: true, dates: true, time: true });
    expectOnlyAdminValues(renderV20ThankYou(read("mpf-v20-thank-you.html"), batch, order, common, tyHooks), {
      dates: true, time: true, length: true,
    });
  });

  it("v30 landing, checkout, thank-you", () => {
    expectOnlyAdminValues(renderV30Landing(read("mpf-v30.html"), { batch, fallbackPriceRupees: null, paidSeats: 0 }, common), {
      price: true, dates: true, time: true, length: true,
    });
    expectOnlyAdminValues(renderV30Checkout(read("mpf-v30-checkout.html"), batch, common, hooks), {
      price: true, dates: true, time: true, length: true,
    });
    expectOnlyAdminValues(renderV30ThankYou(read("mpf-v30-thank-you.html"), batch, order, common, tyHooks), {
      dates: true, time: true, length: true,
    });
  });

  it("nothing on sale: price and session length come from batch settings, never a typed default", () => {
    const v30 = renderV30Landing(
      read("mpf-v30.html"),
      { batch: null, fallbackPriceRupees: 4321, fallbackDurationMinutes: 150, paidSeats: 0 },
      common,
    );
    expect(v30).toContain("4,321");
    expect(v30).toContain("about 2 hours 30 minutes");
    const v20 = renderV20Landing(read("mpf-v20.html"), { batch: null, fallbackPriceRupees: 4321, paidSeats: 0 }, common);
    expect(v20).toContain("4,321");
    expect(v20).not.toContain("2,999");
  });
});
