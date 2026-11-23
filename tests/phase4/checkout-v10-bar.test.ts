// The black bar at the top of the /v10 checkout page gives the same line as
// the landing page's bar (owner, 23 Nov 2026): both days with their dates,
// the start time, the price and the seats line, and no button. Both bars are
// filled from the same batch, so they must read the same.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import V10ScheduleBar from "@/components/landing/V10ScheduleBar";
import { formatIstTime, istToUtc } from "@/lib/ist";
import { renderLanding, type LandingConfig } from "@/lib/landing/render";

const template = readFileSync(fileURLToPath(new URL("../../src/landing/mmf-v10.html", import.meta.url)), "utf8");

const cfg: LandingConfig = {
  courseId: "c1",
  canonicalUrl: "https://www.cashflowcrew.in/personalfinance",
  title: "t",
  description: "d",
  ga4ViaGtm: false,
  fallbackPriceRupees: null,
  fallbackDurationMinutes: 120,
};

const batchOn = (day1: string, day2: string, time: string, priceRupees: number) => ({
  id: "b1",
  priceRupees,
  day1StartAt: istToUtc(day1, time),
  day2StartAt: istToUtc(day2, time),
  bookingCloseAt: istToUtc(day1, time),
  durationMinutes: 120,
  language: null,
});

// The words of a bar, in order, without tags.
const words = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

// The landing page's bar as the visitor sees it: the page itself puts the
// start time where {{ timeComma }} stands.
function landingBar(batch: ReturnType<typeof batchOn>): string {
  const html = renderLanding(template, batch, cfg);
  const bar = /<div class="abar">(.*?)<\/div>/s.exec(html)![1];
  return words(bar.replaceAll("{{ timeComma }}", `, ${formatIstTime(batch.day1StartAt)} IST`));
}

const checkoutBar = (batch: ReturnType<typeof batchOn>) => renderToStaticMarkup(createElement(V10ScheduleBar, { batch }));

describe("/v10 checkout page: the black bar", () => {
  it("reads the same as the landing page's bar for a Saturday batch", () => {
    const batch = batchOn("2026-12-05", "2026-12-06", "11:30", 399);
    const bar = words(checkoutBar(batch));
    expect(bar).toBe(landingBar(batch));
    expect(bar).toContain("2-day live workshop · Saturday 5 Dec and Sunday 6 Dec , 11:30 AM IST");
    expect(bar).toContain("Sat 5 Dec – Sun 6 Dec , 11:30 AM IST");
    expect(bar).toContain("₹399");
    expect(bar).toContain("Only 50 seats per batch");
  });

  it("follows the batch: another day, time and price give another bar, again the same as the landing page's", () => {
    // Wednesday 13 and Thursday 14 January 2027, 6:45 PM, ₹4,321.
    const batch = batchOn("2027-01-13", "2027-01-14", "18:45", 4321);
    const bar = words(checkoutBar(batch));
    expect(bar).toBe(landingBar(batch));
    expect(bar).toContain("Wednesday 13 Jan and Thursday 14 Jan , 6:45 PM IST");
    expect(bar).toContain("Wed 13 Jan – Thu 14 Jan , 6:45 PM IST");
    expect(bar).not.toMatch(/Saturday|Sunday|5 Dec|399/);
    expect(bar).toContain("₹4,321");
  });

  it("has no button or link, and marks the dates and the price in bold like the landing page", () => {
    const html = checkoutBar(batchOn("2026-12-05", "2026-12-06", "11:30", 399));
    expect(html).not.toMatch(/<a\b|<button\b|Book my seat/);
    expect(html).toContain("<b>5 Dec</b>");
    expect(html).toContain("<b>6 Dec</b>");
    expect(html).toContain("<b>₹399</b>");
  });
});
