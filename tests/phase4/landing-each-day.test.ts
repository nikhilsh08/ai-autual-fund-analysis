// Day 2 of a batch can be any later date, with its own start time and its own
// length (owner, 23 Nov 2026). The three workshop pages, their booking pages
// and their thank-you pages then give each day its own details. A batch whose
// days match (the day after, same time, same length) reads exactly as before.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import V10ScheduleBar from "@/components/landing/V10ScheduleBar";
import { formatIstTime, istToUtc } from "@/lib/ist";
import { eachDayOf, fillEachDayMpf, fillEachDayV10 } from "@/lib/landing/each-day";
import { renderLanding, type LandingConfig } from "@/lib/landing/render";
import { renderV20Checkout, renderV20Landing, renderV20ThankYou } from "@/lib/landing/render-v20";
import { renderV30Checkout, renderV30Landing, renderV30ThankYou } from "@/lib/landing/render-v30";
import { fillWeekdays } from "@/lib/landing/weekdays";
import { MMF_COPY, day2DetailsOf } from "@/lib/mmf-copy";

const read = (file: string) => readFileSync(fileURLToPath(new URL(`../../src/landing/${file}`, import.meta.url)), "utf8");

const MPF_FILES = [
  "mpf-v20.html", "mpf-v20-checkout.html", "mpf-v20-thank-you.html",
  "mpf-v30.html", "mpf-v30-checkout.html", "mpf-v30-thank-you.html",
] as const;

const base = { id: "b1", priceRupees: 2999, bookingCloseAt: istToUtc("2026-12-04", "23:59"), language: "English" };
// As every batch was before: Saturday and Sunday, 10:30 AM, 2 hours each.
const matching = { ...base, day1StartAt: istToUtc("2026-12-05", "10:30"), day2StartAt: istToUtc("2026-12-06", "10:30"), durationMinutes: 120 };
// Saturday 5 Dec, 10:30 AM, 2 hours; Wednesday 9 Dec, 7:00 PM, 3 hours.
const differ = {
  ...base,
  day1StartAt: istToUtc("2026-12-05", "10:30"),
  day2StartAt: istToUtc("2026-12-09", "19:00"),
  durationMinutes: 120,
  day2DurationMinutes: 180,
};
// Two Saturdays a week apart, same time and length.
const gap = { ...matching, day2StartAt: istToUtc("2026-12-12", "10:30") };
// In a row and at the same time; only the lengths differ (2 hours, then 1 hour 30 minutes).
const lengths = { ...matching, day2DurationMinutes: 90 };

const common = { courseId: "c1", siteUrl: "https://www.cashflowcrew.in", tracking: { ga4ViaGtm: false } };
const hooks = { initiateUrl: "/i", couponUrl: "/c", cashfreeMode: "sandbox" as const };
const tyHooks = { verifyUrl: "/v", bookingUrl: "/b" };
const order = {
  state: "paid" as const, orderId: "O1", name: "A", email: "a@b.c", amountRupees: 2999,
  joinDay1: null, joinDay2: null, whatsappGroup: null,
};
const v10Config: LandingConfig = {
  courseId: "c1",
  canonicalUrl: "https://www.cashflowcrew.in/personalfinance",
  title: "t",
  description: "d",
  ga4ViaGtm: false,
  fallbackPriceRupees: null,
  fallbackDurationMinutes: 120,
};

type Batch = typeof matching & { day2DurationMinutes?: number };
const pages = (batch: Batch) => ({
  v10: renderLanding(read("mmf-v10.html"), batch, v10Config),
  v20: renderV20Landing(read("mpf-v20.html"), { batch, fallbackPriceRupees: null, paidSeats: 0 }, common),
  v20Checkout: renderV20Checkout(read("mpf-v20-checkout.html"), batch, common, hooks),
  v20ThankYou: renderV20ThankYou(read("mpf-v20-thank-you.html"), batch, order, common, tyHooks),
  v30: renderV30Landing(read("mpf-v30.html"), { batch, fallbackPriceRupees: null, paidSeats: 0 }, common),
  v30Checkout: renderV30Checkout(read("mpf-v30-checkout.html"), batch, common, hooks),
  v30ThankYou: renderV30ThankYou(read("mpf-v30-thank-you.html"), batch, order, common, tyHooks),
});
const MPF_PAGES = ["v20", "v20Checkout", "v20ThankYou", "v30", "v30Checkout", "v30ThankYou"] as const;

// What a visitor reads: no scripts, styles or tags; bold dates stay joined to their commas.
const words = (html: string) =>
  html
    .replace(/<script\b[\s\S]*?<\/script>/g, " ")
    .replace(/<style\b[\s\S]*?<\/style>/g, " ")
    .replace(/<\/?b>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .replace(/ ([,.;])/g, "$1")
    .trim();

// The page's one shared start-time hook (/v20 and /v30 files).
const TIME_HOOK = /<(span|i) data-(?:val|out)="startTime"><\/\1>/;
const BOTH = "Saturday 5 Dec, 10:30 AM IST and Wednesday 9 Dec, 7:00 PM IST";
const SHORT = "Sat 5 Dec 10:30 AM · Wed 9 Dec 7 PM IST";

describe("a batch whose two days match", () => {
  it("leaves every page file exactly as it is", () => {
    const days = eachDayOf(matching);
    expect(days).toEqual({ times: null, inARow: true, minutes: [120, 120] });
    for (const file of MPF_FILES) expect(fillEachDayMpf(read(file), days), file).toBe(read(file));
    expect(fillEachDayV10(read("mmf-v10.html"), days)).toBe(read("mmf-v10.html"));
  });
});

describe("a batch whose days differ in date, time and length", () => {
  const html = pages(differ);

  it("/v10 gives each day its own time and length everywhere the days are named", () => {
    const page = words(html.v10);
    // Top bar: wide screens, then phones.
    expect(page).toContain(`2-day live workshop · ${BOTH}`);
    expect(page).toContain(SHORT);
    // First screen, 2-day path, schedule, price card, FAQ.
    expect(page).toContain(`2-day live workshop · ${BOTH} · 2 hours and 3 hours`);
    expect(html.v10).toContain("<span>Saturday 5 Dec, 10:30 AM IST</span>");
    expect(html.v10).toContain("<span>Wednesday 9 Dec, 7:00 PM IST</span>");
    expect(page).toContain("Day 2 · Wednesday 9 Dec, 7:00 PM IST");
    expect(page).toContain("Live on Wednesday 9 Dec, 7:00 PM IST");
    expect(page).toContain("Wednesday 9 Dec, 7:00 PM IST · Levels 4 to 6");
    expect(page).toContain("Two days, 2 hours and 3 hours.");
    expect(page).toContain("Saturday 2 hours + Wednesday 3 hours, live online");
    expect(page).toContain(`Next batch: ${BOTH}. Booking for this batch closes`);
    expect(page).toContain("Each day builds on the one before. Day 1 starts at 10:30 AM IST and Day 2 at 7:00 PM IST.");
    // The two lengths are added up, and "one weekend" is no longer said.
    expect(page).toContain("In 5 hours over two days");
    expect(page).toContain("5 hours of live teaching across Saturday 5 Dec and Wednesday 9 Dec");
    expect(page).not.toContain("over one weekend");
  });

  it("/v10 never prints day 1's time after day 2's date", () => {
    // {{ timeComma }} is the page's own value for day 1's time: it stays only after day 1.
    expect(html.v10).toContain("Saturday 5 Dec{{ timeComma }}");
    expect(html.v10).not.toContain("9 Dec{{ timeComma }}");
    expect(html.v10).not.toContain("9 Dec</b>{{ timeComma }}");
    expect(html.v10).not.toContain("{{ bothStart }}");
    expect(html.v10).not.toContain("{{ startTime }} IST");
    expect(html.v10).toContain("&quot;default&quot;:&quot;10:30 AM&quot;");
    expect(html.v10).not.toMatch(/5 Dec<\/b> – /);
  });

  it("/v20 and /v30 landing pages give each day its own time", () => {
    for (const key of ["v20", "v30"] as const) {
      const page = words(html[key]);
      expect(page, key).toContain(`2-day live workshop · ${BOTH}`);
      expect(page, key).toContain(SHORT);
      expect(html[key], key).toContain("<span>Saturday 5 Dec, 10:30 AM IST</span><span>Wednesday 9 Dec, 7:00 PM IST</span>");
      expect(page, key).toContain("Day 1 · Saturday 5 Dec, 10:30 AM IST");
      expect(page, key).toContain("Day 2 · Wednesday 9 Dec, 7:00 PM IST");
      expect(page, key).toContain(`Next batch: ${BOTH}. Booking for this batch closes`);
      expect(page, key).toContain(
        "Day 1 is Saturday 5 Dec; Day 2 is Wednesday 9 Dec. Day 1 starts at 10:30 AM IST and Day 2 at 7:00 PM IST.",
      );
      expect(page, key).not.toContain("Both days start at");
    }
    // The bottom bar is built by each page's own script.
    expect(html.v20).toContain(`: '${SHORT}',`);
    expect(html.v20).not.toContain("(cfg.startTime || 'live online')");
    expect(html.v30).toContain(`:"${SHORT}")`);
    expect(html.v30).not.toContain('.startTime||"live online"');
  });

  it("/v20 and /v30 booking and thank-you pages give each day its own time", () => {
    expect(words(html.v20Checkout)).toContain(`2-day live workshop · ${BOTH} · live online`);
    expect(words(html.v20ThankYou)).toContain(`${BOTH}, about 2 hours on Day 1 and about 3 hours on Day 2, live online.`);
    expect(words(html.v20ThankYou)).toContain("10:30 AM IST · Levels 1 to 3");
    expect(words(html.v20ThankYou)).toContain("7:00 PM IST · Levels 4 to 6");

    expect(words(html.v30Checkout)).toContain(`a 2-day live workshop on ${BOTH}.`);
    expect(words(html.v30Checkout)).toContain(SHORT);
    expect(words(html.v30ThankYou)).toContain(`live online on ${BOTH}. Day 1 runs for about 2 hours and Day 2 for about 3 hours.`);
    expect(words(html.v30ThankYou)).toMatch(/Day 1 Saturday 5 Dec 10:30 AM IST .*Day 2 Wednesday 9 Dec 7:00 PM IST/);
  });

  it("leaves no shared start-time hook on any /v20 or /v30 page, so day 1's time cannot land on day 2", () => {
    for (const key of MPF_PAGES) {
      expect(html[key], key).not.toMatch(TIME_HOOK);
      // The pages still get day 1's time, which keeps their date lines shown.
      expect(html[key], key).toContain('"startTime":"10:30 AM IST"');
      expect(html[key], key).not.toMatch(/5 Dec(?:<\/b>)? – /);
    }
  });

  it("gives each day its own length on /v30, and the lengths reach the calendar entries", () => {
    const page = words(html.v30);
    expect(page).toContain("in two live sessions of about 2 hours and about 3 hours.");
    expect(page).toContain("Day 1 runs for about 2 hours and Day 2 for about 3 hours, with questions");
    expect(page).toContain("2-day live workshop, about 2 hours on Day 1 and about 3 hours on Day 2");
    expect(html.v30).toContain("a 2-day live workshop, about 2 hours on Day 1 and about 3 hours on Day 2, that teaches");
    expect(words(html.v30Checkout)).toContain("2 live sessions, about 2 hours and about 3 hours");

    // Thank-you pages: day 2's own length for its calendar entry.
    expect(html.v20ThankYou).toContain('"sessionMinutes":120,"sessionMinutesDay2":180');
    expect(html.v20ThankYou).toContain("((n == 2 && o.sessionMinutesDay2) || o.sessionMinutes || 120) * 60000");
    expect(html.v30ThankYou).toContain('"durationMinutes":120,"day2DurationMinutes":180');
    expect(html.v30ThankYou).toContain("l2=+e.day2DurationMinutes||l");
    expect(html.v30ThankYou).toContain("6e4*(2==e[0]?l2:l)");
    expect(html.v30ThankYou).toContain("6e4*(2==a?l2:l)");
  });

  it("lets the longer top bar run onto a second line instead of being cut off", () => {
    expect(html.v10).toContain('<div class="abar" style="flex-wrap:wrap;white-space:normal">');
    for (const key of MPF_PAGES) expect(html[key], key).toContain('<div class="bar" style="flex-wrap:wrap;white-space:normal">');
    // On phones the price may then stand on the second line, so the dot before
    // it is shown on wide screens only and no line ends in a dot.
    expect(html.v10).toContain('<span class="al">·</span><span><b>₹2,999</b></span>');
    expect(html.v20).toContain('<span class="bl">·</span><span><b>₹2,999</b></span>');
    expect(html.v30).toContain('<span class="pr bl">·</span><span class="pr"><b>₹2,999</b></span>');

    // A matching batch keeps the one-line bar and its dot.
    const usual = pages(matching);
    expect(usual.v10).toContain('<div class="abar">');
    expect(usual.v10).toContain("<span>·</span><span><b>₹2,999</b></span>");
    expect(usual.v20).toContain("<span>·</span><span><b>₹2,999</b></span>");
    expect(usual.v30).toContain('<span class="pr">·</span><span class="pr"><b>₹2,999</b></span>');
    for (const key of MPF_PAGES) expect(usual[key], key).toContain('<div class="bar">');
  });
});

describe("a batch whose days are a week apart, at the same time", () => {
  const html = pages(gap);

  it("names both dates with 'and', never as a run of days", () => {
    for (const key of ["v10", ...MPF_PAGES] as const) expect(html[key], key).not.toMatch(/5 Dec(?:<\/b>)? – /);
    expect(html.v10).toContain("Sat <b>5 Dec</b> and Sat <b>12 Dec</b>{{ timeComma }}");
    expect(html.v20).toContain('Sat <b>5 Dec</b> and Sat <b>12 Dec</b><span data-if="hasStart">, <span data-val="startTime"></span></span>');
    expect(html.v20).toContain("'Sat 5 Dec and Sat 12 Dec · ' + (cfg.startTime || 'live online')");
    expect(html.v30).toContain('"Sat 5 Dec and Sat 12 Dec"+(window.innerWidth<390');
    expect(words(html.v20Checkout)).toContain("Sat 5 Dec and Sat 12 Dec · live online");
    expect(words(html.v30Checkout)).toContain("Sat 5 Dec and Sat 12 Dec");
  });

  it("keeps the one shared start time, and no longer says 'one weekend'", () => {
    expect(html.v10).toContain("{{ bothStart }}");
    expect(html.v20).toMatch(TIME_HOOK);
    expect(html.v30).toContain('Both days start at <span data-val="startTime"></span>.');
    expect(words(html.v10)).toContain("In 4 hours over two days");
    expect(words(html.v10)).not.toContain("over one weekend");
    expect(html.v10).toContain('<div class="abar">');
  });
});

describe("a batch whose days differ only in length", () => {
  const html = pages(lengths);

  it("gives each day's length and changes nothing else", () => {
    expect(words(html.v10)).toContain("2-day live workshop · Saturday 5 Dec and Sunday 6 Dec{{ timeComma }} · 2 hours and 1 hour 30 minutes");
    expect(words(html.v10)).toContain("In 3 hours 30 minutes over one weekend");
    expect(words(html.v10)).toContain("Saturday 2 hours + Sunday 1 hour 30 minutes, live online");
    expect(words(html.v30)).toContain("about 2 hours on Day 1 and about 1 hour 30 minutes on Day 2");
    expect(words(html.v20ThankYou)).toContain("about 2 hours on Day 1 and about 1 hour 30 minutes on Day 2, live online.");
    // Dates and the shared time are as for any Saturday batch.
    expect(html.v20).toContain("Sat <b>5 Dec</b> – Sun <b>6 Dec</b>");
    expect(html.v20).toMatch(TIME_HOOK);
    expect(html.v30).toContain('Both days start at <span data-val="startTime"></span>.');
  });
});

describe("nothing on sale: the cycle in Batch settings has a day 2 of its own", () => {
  // Day 2 falls four days after day 1 and runs for 3 hours.
  const cycle = {
    fallbackDay1: istToUtc("2026-12-05", "00:00"),
    fallbackDay2: istToUtc("2026-12-09", "00:00"),
    fallbackDay2DurationMinutes: 180,
  };

  it("names both weekdays of the cycle and each day's length", () => {
    const v10 = words(renderLanding(read("mmf-v10.html"), null, { ...v10Config, fallbackPriceRupees: 2999, ...cycle }));
    expect(v10).toContain("Saturday and Wednesday");
    expect(v10).toContain("2 hours and 3 hours");
    expect(v10).toContain("In 5 hours over two days");
    expect(v10).not.toContain("Sunday");

    const data = { batch: null, fallbackPriceRupees: 2999, fallbackDurationMinutes: 120, paidSeats: 0, ...cycle };
    const v20 = words(renderV20Landing(read("mpf-v20.html"), data, common));
    expect(v20).toContain("Wednesday");
    expect(v20).not.toContain("Sunday");
    const v30 = words(renderV30Landing(read("mpf-v30.html"), data, common));
    expect(v30).toContain("about 2 hours on Day 1 and about 3 hours on Day 2");
    expect(v30).not.toContain("Sunday");
  });

  it("without a day 2 in the settings, the pages read as before", () => {
    const data = { batch: null, fallbackPriceRupees: 2999, fallbackDurationMinutes: 120, paidSeats: 0, fallbackDay1: cycle.fallbackDay1 };
    const v30 = words(renderV30Landing(read("mpf-v30.html"), data, common));
    expect(v30).toContain("about 2 hours each day");
    expect(v30).toContain("Sunday");
  });
});

describe("'over one weekend'", () => {
  const page = "In 4 hours over one weekend. On Sunday, the checks run live.";

  it("stays for a Saturday and the Sunday after it, and goes for any other pair of days", () => {
    const saturday = istToUtc("2026-12-05", "10:30");
    expect(fillWeekdays(page, { day1StartAt: saturday, day2StartAt: istToUtc("2026-12-06", "10:30") })).toBe(page);
    // A Saturday and the Sunday of the next week are not one weekend.
    expect(fillWeekdays(page, { day1StartAt: saturday, day2StartAt: istToUtc("2026-12-13", "10:30") })).toBe(
      "In 4 hours over two days. On Sunday, the checks run live.",
    );
    expect(fillWeekdays(page, { day1StartAt: saturday, day2StartAt: istToUtc("2026-12-09", "10:30") })).toBe(
      "In 4 hours over two days. On Wednesday, the checks run live.",
    );
  });
});

describe("/v10 booking page: the black bar reads the same as the landing page's bar", () => {
  const template = read("mmf-v10.html");
  // The landing page itself puts day 1's time where {{ timeComma }} stands.
  const landingBar = (batch: Batch) => {
    const bar = /<div class="abar"[^>]*>(.*?)<\/div>/s.exec(renderLanding(template, batch, v10Config))![1];
    return words(bar.replaceAll("{{ timeComma }}", `, ${formatIstTime(batch.day1StartAt)} IST`));
  };
  const checkoutBar = (batch: Batch) => renderToStaticMarkup(createElement(V10ScheduleBar, { batch }));

  it("for days that differ in time, for days a week apart, and for a usual Saturday batch", () => {
    for (const batch of [differ, gap, matching]) expect(words(checkoutBar(batch))).toBe(landingBar(batch));
    expect(words(checkoutBar(differ))).toContain(`2-day live workshop · ${BOTH}`);
    expect(words(checkoutBar(differ))).toContain(SHORT);
    expect(words(checkoutBar(gap))).toContain("Sat 5 Dec and Sat 12 Dec, 10:30 AM IST");
    expect(words(checkoutBar(matching))).toContain("Sat 5 Dec – Sun 6 Dec, 10:30 AM IST");
    expect(checkoutBar(differ)).not.toContain("undefined");
  });
});

describe("booking and thank-you wording (mmf-copy)", () => {
  const day1 = "Saturday, 5 December 2026";
  const day2 = "Wednesday, 9 December 2026";

  it("states each day in full when the batch's days differ", () => {
    const own = day2DetailsOf({ startTime: "10:30 AM", durationMinutes: 120, day2StartTime: "7:00 PM", day2DurationMinutes: 180, eachDayStated: true });
    expect(own).toEqual({ startTime: "7:00 PM", duration: "3 hours" });
    expect(MMF_COPY.checkout.batchLine(day1, day2, "10:30 AM", "2 hours", own)).toBe(
      "Batch: Saturday, 5 December 2026, 10:30 AM IST (2 hours) and Wednesday, 9 December 2026, 7:00 PM IST (3 hours), live online.",
    );
    expect(MMF_COPY.thankYou.T2(day1, day2, "10:30 AM", "2 hours", own)).toBe(
      "Saturday 5 December 2026, 10:30 AM IST (2 hours) and Wednesday 9 December 2026, 7:00 PM IST (3 hours).",
    );
  });

  it("keeps the usual wording when the days match", () => {
    expect(day2DetailsOf({ startTime: "10:30 AM", durationMinutes: 120, day2StartTime: "10:30 AM", day2DurationMinutes: 120, eachDayStated: false })).toBeNull();
    // A reply without the new fields is a matching batch.
    expect(day2DetailsOf({ startTime: "10:30 AM", durationMinutes: 120 })).toBeNull();
    expect(MMF_COPY.checkout.batchLine(day1, "Sunday, 6 December 2026", "10:30 AM", "2 hours", null)).toBe(
      "Batch: Saturday, 5 December 2026, 10:30 AM IST, Saturday and Sunday, 2 hours each, live online.",
    );
  });
});
