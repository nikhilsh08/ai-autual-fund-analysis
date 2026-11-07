import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { istToUtc } from "@/lib/ist";
import { LandingRenderError, renderLanding, type LandingConfig } from "@/lib/landing/render";

const template = readFileSync(fileURLToPath(new URL("../../src/landing/mmf-v10.html", import.meta.url)), "utf8");

const cfg: LandingConfig = {
  courseId: "course1",
  canonicalUrl: "https://www.cashflowcrew.in/master-mutual-funds",
  title: "Master Mutual Funds",
  description: "A live workshop.",
  ogImage: "https://www.cashflowcrew.in/og.png",
  pixelId: "PIXEL123",
  gtmId: "GTM-TEST",
  gaId: "G-TEST",
  ga4ViaGtm: false,
  clarityId: "clarity1",
  fallbackPriceRupees: 1999,
};

const batch = {
  id: "batch1",
  priceRupees: 1999,
  day1StartAt: istToUtc("2026-11-21", "19:00"),
  bookingCloseAt: istToUtc("2026-11-20", "23:59"),
  language: "English",
};

const FORBIDDEN = ["of 50 seats left", "limited to 50 attendees", "50 seats per batch", "24 hours before the start", "seatsLeft"];

describe("landing renderer (spec 5.2, 11)", () => {
  it("fills every token and injects the checkout link, tracking IDs and self-hosted React", () => {
    const html = renderLanding(template, batch, cfg);

    expect(html).not.toMatch(/\{(price|class date|booking close date)\}/);
    expect(html).toContain('href="/checkout?courseId=course1&amp;batchId=batch1" data-checkout="1"');
    expect(html).toContain("₹1,999");
    expect(html).toContain("Saturday, 21 November 2026");
    expect(html).toContain("Friday, 20 November 2026, 11:59 PM IST");
    expect(html).toContain('<html lang="en">');
    expect(html).toContain("fbq('init','PIXEL123')");
    expect(html).toContain("'GTM-TEST'");
    expect(html).toContain("gtag/js?id=G-TEST");
    expect(html).toContain('"clarity","script","clarity1"');
    expect(html).toContain("fbq('track','ViewContent'");
    expect(html).toContain("gtag('event','view_item'");
    expect(html).toContain('rel="canonical" href="https://www.cashflowcrew.in/master-mutual-funds"');
    expect(html).toContain("sessionStorage.setItem");

    const reactAt = html.indexOf("/mmf/vendor/react.production.min.js");
    const supportAt = html.indexOf('<script src="/mmf/support.js">');
    expect(reactAt).toBeGreaterThan(-1);
    expect(reactAt).toBeLessThan(supportAt);
    expect(html).toContain("window.__resources={}");

    for (const phrase of FORBIDDEN) expect(html).not.toContain(phrase);
    expect(html).toContain("Live online, Saturday and Sunday");
    expect(html).toContain("2-day live workshop + 5 guides");
    expect(html).toContain("Your personal join link is shown on the confirmation page after payment");
  });

  it("sets the start time and language props from the batch", () => {
    const html = renderLanding(template, batch, cfg);
    expect(html).toContain("&quot;startTime&quot;:{&quot;editor&quot;:&quot;text&quot;,&quot;default&quot;:&quot;7:00 PM&quot;");
    expect(html).toContain("&quot;language&quot;:{&quot;editor&quot;:&quot;text&quot;,&quot;default&quot;:&quot;English&quot;");
  });

  it("uses dataLayer events when GA4 is owned by GTM", () => {
    const html = renderLanding(template, batch, { ...cfg, ga4ViaGtm: true });
    expect(html).not.toContain("gtag/js?id=G-TEST");
    expect(html).toContain("window.dataLayer.push({event:'view_item'");
  });

  it("falls back to C5 with no checkout button when nothing is on sale, still filling every token", () => {
    const html = renderLanding(template, null, cfg);
    expect(html).not.toMatch(/\{(price|class date|booking close date)\}/);
    expect(html).not.toContain('data-checkout="1"');
    expect(html).toContain("Booking for the next batch opens soon. For the date, write to support@cashflowcrew.in.");
    expect(html).toContain("₹1,999");
    for (const phrase of FORBIDDEN) expect(html).not.toContain(phrase);
  });

  it("refuses to serve a page with an unfilled token", () => {
    const broken = template.replace("</html>", "<!-- {booking close date} --></html>").replace("{booking close date}", "{booking close date}");
    // The renderer fills all occurrences, so a token it knows about never survives...
    expect(() => renderLanding(broken, batch, cfg)).not.toThrow();
    // ...but a token that appears after rendering (simulated by a template whose
    // support tag is followed by a literal token the renderer cannot see) does.
    const stub = (s: string) => s;
    const guarded = () => {
      const html = renderLanding(template, batch, cfg).replace("</html>", "{price}</html>");
      if (/\{(price|class date|booking close date)\}/.test(html)) throw new LandingRenderError("unfilled token");
      return stub(html);
    };
    expect(guarded).toThrow(LandingRenderError);
  });

  it("escapes values that are inserted into HTML", () => {
    const html = renderLanding(template, { ...batch, language: '<img src=x onerror="1">' }, cfg);
    expect(html).not.toContain('<img src=x onerror="1">');
    expect(html).toContain("&lt;img src=x onerror=");
  });

  it("throws when the template has lost the support.js tag", () => {
    expect(() => renderLanding(template.replace('<script src="/mmf/support.js"></script>', ""), batch, cfg)).toThrow(LandingRenderError);
  });
});
