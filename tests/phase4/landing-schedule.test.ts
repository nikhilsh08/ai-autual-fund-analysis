// Wherever a landing page says when the workshop runs, it names BOTH days
// (weekday and date) and the start time (owner, 23 Nov 2026). /v10 and /v20
// carry the same top bar as /v30 — both days, the time, the price and the
// seats line — without the "Book my seat" button.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { istToUtc } from "@/lib/ist";
import { renderLanding, type LandingConfig } from "@/lib/landing/render";
import { renderV20Landing } from "@/lib/landing/render-v20";
import { renderV30Landing } from "@/lib/landing/render-v30";

const read = (file: string) => readFileSync(fileURLToPath(new URL(`../../src/landing/${file}`, import.meta.url)), "utf8");

// Saturday 5 and Sunday 6 December 2026, 10:30 AM IST.
const batch = {
  id: "b1",
  priceRupees: 2999,
  day1StartAt: istToUtc("2026-12-05", "10:30"),
  day2StartAt: istToUtc("2026-12-06", "10:30"),
  bookingCloseAt: istToUtc("2026-12-04", "23:59"),
  durationMinutes: 120,
  language: "English",
};
const common = { courseId: "c1", siteUrl: "https://www.cashflowcrew.in", tracking: { ga4ViaGtm: false } };
const v10Config: LandingConfig = {
  courseId: "c1",
  canonicalUrl: "https://www.cashflowcrew.in/personalfinance",
  title: "t",
  description: "d",
  ga4ViaGtm: false,
  fallbackPriceRupees: 2999,
  fallbackDurationMinutes: 120,
};

// The page as a reader sees it: no scripts, styles or tags.
const plain = (html: string) =>
  html.replace(/<(script|style)[\s\S]*?<\/\1>/g, "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ");

// What each page does itself once it has the batch's start time.
//   /v20, /v30: the page script fills every [data-val="startTime"] from window.MPF.startTime.
//   /v10:       the page fills {{ timeComma }}, {{ bothStart }} and {{ startTime }} from its startTime prop.
const withTimeV20 = (html: string) => html.replace(/<(span|i) data-val="startTime"><\/\1>/g, "10:30 AM IST");
const withTimeV10 = (html: string) =>
  html
    .replaceAll("{{ timeComma }}", ", 10:30 AM IST")
    .replaceAll("{{ bothStart }}", " Both days start at 10:30 AM IST.")
    .replaceAll("{{ startTime }}", "10:30 AM");

const BOTH = "Saturday 5 Dec and Sunday 6 Dec, 10:30 AM IST";
const BOTH_SHORT = "Sat 5 Dec – Sun 6 Dec, 10:30 AM IST";

describe("/v10 (personalfinance): both days and the start time", () => {
  const html = renderLanding(read("mmf-v10.html"), batch, v10Config);
  const shown = withTimeV10(html);
  const text = plain(shown);

  it("gives the start time to the page as it always did", () => {
    expect(html).toContain("&quot;default&quot;:&quot;10:30 AM&quot;");
    expect(html).toContain("timeComma: st ? ', ' + st + ' IST' : ''");
    expect(html).toContain("bothStart: st ? ' Both days start at ' + st + ' IST.' : ''");
  });

  it("top bar: both days, time, price and seats line, as on /v30, with no button", () => {
    const bar = /<div class="abar">.*?<\/div>/s.exec(shown)![0];
    const barText = plain(bar);
    expect(barText).toContain("2-day live workshop");
    expect(barText).toContain(BOTH);
    expect(barText).toContain(BOTH_SHORT);
    expect(barText).toContain("₹2,999");
    expect(barText).toContain("Only 50 seats per batch");
    expect(bar).not.toMatch(/<a\b|<button\b|Book my seat/);
  });

  it("first screen: the facts row lists day 1, day 2 and the time", () => {
    expect(html).toContain('<span>Saturday 5 Dec</span><span class="dot"></span><span>Sunday 6 Dec</span>');
    expect(html).toContain("<span>{{ startTime }} IST</span>");
    expect(text).toContain(`2-day live workshop · ${BOTH} · 2 hours each`);
  });

  it("2-day path, schedule and live-check sections carry the dates and the time", () => {
    expect(html).toContain('window.MMF_DAYS=["Saturday 5 Dec","Sunday 6 Dec"]');
    expect(text).toContain("Day 1 · Saturday 5 Dec");
    expect(text).toContain("Day 2 · Sunday 6 Dec, 10:30 AM IST");
    expect(text).toContain("Live on Sunday 6 Dec, 10:30 AM IST");
    expect(text).toContain(
      "Saturday 5 Dec covers Levels 1 to 3. Sunday 6 Dec covers Levels 4 to 6, with checks shown live on a sample portfolio. Both days start at 10:30 AM IST.",
    );
    expect(text).toContain("Saturday 5 Dec, 10:30 AM IST · Levels 1 to 3");
    expect(text).toContain("Sunday 6 Dec, 10:30 AM IST · Levels 4 to 6");
  });

  it("price card and FAQ: both days and the time", () => {
    expect(text).toContain(`${BOTH} · {{ language }}`);
    expect(text).toContain("4 hours of live teaching across Saturday 5 Dec and Sunday 6 Dec");
    expect(text).toContain(`Next batch: ${BOTH}. Booking for this batch closes Friday, 4 December 2026, 11:59 PM IST.`);
    expect(text).toContain("On Sunday 6 Dec, those checks are run live");
    expect(text).toContain("Each day builds on the one before. Both days start at 10:30 AM IST.");
  });

  it("never names day 1 alone as the start", () => {
    expect(text).not.toMatch(/\bStarts\b|Next batch starts/);
  });

  it("with nothing on sale there is no date or time to give, and the page says so plainly", () => {
    const noneRaw = renderLanding(read("mmf-v10.html"), null, v10Config);
    // No start time reaches the page, so {{ timeComma }} and {{ bothStart }} come out empty.
    expect(noneRaw).toContain("&quot;startTime&quot;:{&quot;editor&quot;:&quot;text&quot;,&quot;default&quot;:&quot;&quot;");
    const none = plain(noneRaw.replaceAll("{{ timeComma }}", "").replaceAll("{{ bothStart }}", ""));
    expect(none).toContain("Saturday to be announced and Sunday to be announced");
    expect(none).toContain("2-day live workshop · Saturday and Sunday · 2 hours each");
    expect(none).toContain("Saturday covers Levels 1 to 3. Sunday covers Levels 4 to 6");
    expect(none).toContain("Booking for the next batch opens soon.");
    expect(noneRaw).toContain('window.MMF_DAYS=["Saturday","Sunday"]');
  });
});

describe("/v20 (personalfinance1): both days and the start time", () => {
  const html = renderV20Landing(read("mpf-v20.html"), { batch, fallbackPriceRupees: null, paidSeats: 0 }, common);
  const text = plain(withTimeV20(html));

  it("gives the start time to the page script", () => {
    expect(html).toContain('"startTime":"10:30 AM IST"');
  });

  it("top bar: both days, time, price and seats line, as on /v30, with no button", () => {
    const bar = /<div class="bar">.*?<\/div>/s.exec(html)![0];
    const barText = plain(withTimeV20(bar));
    expect(barText).toContain("2-day live workshop");
    expect(barText).toContain(BOTH);
    expect(barText).toContain(BOTH_SHORT);
    expect(barText).toContain("₹2,999");
    // The seats line is the page's own ("Only 50 seats per batch", or seats left with a seat limit).
    expect(bar).toContain('<span class="bl seat"><span data-val="barSeats"></span></span>');
    expect(bar).toContain('<span class="bs seat"><span data-val="barSeatsShort"></span></span>');
    expect(html).toContain("'Only 50 seats per batch'");
    expect(bar).not.toMatch(/<a\b|<button\b|Book my seat/);
  });

  it("first screen, 2-day path and schedule name both days with the time", () => {
    expect(text).toContain(`2-day live workshop · ${BOTH} · Live online`);
    expect(text).toContain(`Next batch: ${BOTH}`);
    expect(text).toContain("Day 1 · Saturday 5 Dec, 10:30 AM IST");
    expect(text).toContain("Day 2 · Sunday 6 Dec, 10:30 AM IST");
    expect(text).toContain(`The six levels, hour by hour, on ${BOTH}`);
    expect(text).toContain("Day 1 · Saturday 5 Dec, 10:30 AM IST · Levels 1 to 3");
    expect(text).toContain("Day 2 · Sunday 6 Dec, 10:30 AM IST · Levels 4 to 6");
  });

  it("price card, FAQ and bottom bar name both days with the time", () => {
    expect(text).toContain(`Next batch: ${BOTH}. Booking for this batch closes 4 Dec, 11:59 PM IST.`);
    expect(text).toContain(`2-day live workshop, ${BOTH}`);
    expect(text).toContain("Day 1 is Saturday 5 Dec; Day 2 is Sunday 6 Dec. Both days start at 10:30 AM IST. Both days are live online.");
    expect(html).toContain("'Sat 5 Dec – Sun 6 Dec · ' + (cfg.startTime || 'live online')");
  });

  it("never names day 1 alone as the start, and never sends the reader elsewhere for the time", () => {
    expect(text).not.toContain("Next batch starts");
    expect(text).not.toContain("The start time is shown above");
  });

  it("with nothing on sale the new lines fall back to plain wording", () => {
    const none = renderV20Landing(read("mpf-v20.html"), { batch: null, fallbackPriceRupees: 2999, paidSeats: 0 }, common);
    // The page script removes every [data-if="hasStart"] part: "Next batch: to be announced."
    expect(none).toContain('Next batch: <span data-if="hasStart">Saturday </span>to be announced<span data-if="hasStart">');
    expect(none).toContain('Saturday<span data-if="hasStart"> to be announced</span> and Sunday<span data-if="hasStart">');
  });
});

describe("/v30 (personalfinance2): both days and the start time", () => {
  const html = renderV30Landing(read("mpf-v30.html"), { batch, fallbackPriceRupees: null, paidSeats: 0 }, common);
  const text = plain(withTimeV20(html));

  it("top bar: the phone-size line now carries the time too; the wide line and its button are unchanged", () => {
    const bar = /<div class="bar">.*?<\/div>/s.exec(html)![0];
    const barText = plain(withTimeV20(bar));
    expect(barText).toContain(BOTH);
    expect(barText).toContain(BOTH_SHORT);
    expect(barText).toContain("₹2,999");
    expect(bar).toContain('<a class="barbtn" href="#seat">Book my seat</a>');
  });

  it("2-day path, schedule, price card and FAQ name both days with the time", () => {
    expect(text).toContain("Day 1 · Saturday 5 Dec, 10:30 AM IST");
    expect(text).toContain("Day 2 · Sunday 6 Dec, 10:30 AM IST");
    expect(text).toContain("Day 1 is Saturday 5 Dec; Day 2 is Sunday 6 Dec. Both days start at 10:30 AM IST.");
    expect(text).toContain(`Next batch: ${BOTH}.`);
    expect(text).not.toContain("Next batch starts");
  });
});
