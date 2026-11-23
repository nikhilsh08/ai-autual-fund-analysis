// A batch can start on any day of the week (Admin → Batches → Day 1 date).
// The designers' page files say "Saturday" and "Sunday" in fixed words. Every
// workshop page must name the batch's own two days instead, and a Saturday
// batch must read exactly as it did before.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { istToUtc, istYmd } from "@/lib/ist";
import { nextCycleDay1 } from "@/lib/batches/schedule";
import { renderLanding, type LandingConfig } from "@/lib/landing/render";
import { renderV20Checkout, renderV20Landing, renderV20ThankYou } from "@/lib/landing/render-v20";
import { renderV30Checkout, renderV30Landing, renderV30ThankYou } from "@/lib/landing/render-v30";
import { batchWeekdays, fillWeekdays } from "@/lib/landing/weekdays";
import { MMF_COPY, weekdayOf } from "@/lib/mmf-copy";

const read = (file: string) => readFileSync(fileURLToPath(new URL(`../../src/landing/${file}`, import.meta.url)), "utf8");
const motionJs = readFileSync(fileURLToPath(new URL("../../public/mmf/motion.js", import.meta.url)), "utf8");

const PAGE_FILES = [
  "mmf-v10.html",
  "mpf-v20.html",
  "mpf-v20-checkout.html",
  "mpf-v20-thank-you.html",
  "mpf-v30.html",
  "mpf-v30-checkout.html",
  "mpf-v30-thank-you.html",
];

const batchOn = (day1: string, day2: string) => ({
  id: "b1",
  priceRupees: 2999,
  day1StartAt: istToUtc(day1, "19:00"),
  day2StartAt: istToUtc(day2, "19:00"),
  bookingCloseAt: istToUtc(day1, "07:00"),
  durationMinutes: 120,
  language: "English",
});
// 25 November 2026 is a Wednesday; 21 November 2026 is a Saturday.
const midweek = batchOn("2026-11-25", "2026-11-26");
const weekend = batchOn("2026-11-21", "2026-11-22");

const common = { courseId: "c1", siteUrl: "https://www.cashflowcrew.in", tracking: { ga4ViaGtm: false } };
const hooks = { initiateUrl: "/i", couponUrl: "/c", cashfreeMode: "sandbox" as const };
const tyHooks = { verifyUrl: "/v", bookingUrl: "/b" };
const order = {
  state: "paid" as const,
  orderId: "O1",
  name: "Asha",
  email: "asha@example.com",
  amountRupees: 2999,
  joinDay1: null,
  joinDay2: null,
  whatsappGroup: null,
};
const v10Config: LandingConfig = {
  courseId: "c1",
  canonicalUrl: "https://www.cashflowcrew.in/personalfinance",
  title: "t",
  description: "d",
  ga4ViaGtm: false,
  fallbackPriceRupees: 1999,
  fallbackDurationMinutes: 120,
};

const visibleText = (html: string) =>
  html.replace(/<(script|style)[\s\S]*?<\/\1>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

// Nothing of the designers' fixed days may be left anywhere in the page,
// scripts included (the sticky bar's line is built in a script).
function expectNoFixedDays(html: string) {
  expect(html).not.toMatch(/\b(Saturday|Sunday)\b/);
  expect(html).not.toMatch(/\b(Sat|Sun) (<b>)?\d/);
  expect(visibleText(html)).not.toMatch(/\bweekend\b/);
}

// Every inline script must still parse after the words are replaced.
function expectScriptsParse(html: string) {
  const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  expect(scripts.length).toBeGreaterThan(0);
  for (const s of scripts) expect(() => new Function(s)).not.toThrow();
}

describe("fillWeekdays", () => {
  it("leaves every page file exactly as written for a Saturday batch, and when there is no date", () => {
    for (const file of PAGE_FILES) {
      const template = read(file);
      expect(fillWeekdays(template, weekend), file).toBe(template);
      expect(fillWeekdays(template, null), file).toBe(template);
    }
  });

  it("names the batch's own two days, long and short", () => {
    const line = "Saturday {class date} and Sunday {day 2 date} · Sat <b>{class date}</b> – Sun {day 2 date} · over one weekend · Saturday's session";
    expect(fillWeekdays(line, midweek)).toBe(
      "Wednesday {class date} and Thursday {day 2 date} · Wed <b>{class date}</b> – Thu {day 2 date} · over two days · Wednesday's session",
    );
  });

  it("does not replace a word twice when the batch starts on a Sunday or a Friday", () => {
    const line = "Saturday then Sunday. Sat {class date} – Sun {day 2 date}";
    expect(fillWeekdays(line, batchOn("2026-11-22", "2026-11-23"))).toBe("Sunday then Monday. Sun {class date} – Mon {day 2 date}");
    expect(fillWeekdays(line, batchOn("2026-11-27", "2026-11-28"))).toBe("Friday then Saturday. Fri {class date} – Sat {day 2 date}");
  });

  it("takes day 2 as the day after day 1 when only day 1 is known, by the IST calendar", () => {
    expect(batchWeekdays({ day1StartAt: istToUtc("2026-11-25", "19:00") })).toEqual(["Wednesday", "Thursday"]);
    // 00:30 IST on Wednesday is still Tuesday in UTC.
    expect(batchWeekdays({ day1StartAt: istToUtc("2026-11-25", "00:30") })).toEqual(["Wednesday", "Thursday"]);
    expect(batchWeekdays(null)).toEqual(["Saturday", "Sunday"]);
  });
});

describe("v10 page with a batch that starts on a Wednesday", () => {
  const template = read("mmf-v10.html");

  it("names Wednesday and Thursday everywhere", () => {
    const html = renderLanding(template, midweek, v10Config);
    const text = visibleText(html);
    expectNoFixedDays(html);
    // ({{ timeComma }} is the start time, filled in by the page itself.)
    expect(text).toContain("Wednesday 25 Nov and Thursday 26 Nov{{ timeComma }} · 2 hours each");
    expect(html).toContain("Wednesday <b>25 Nov</b> and Thursday <b>26 Nov</b>{{ timeComma }}");
    expect(html).toContain("Wed <b>25 Nov</b> – Thu <b>26 Nov</b>{{ timeComma }}");
    expect(text).toContain("In 4 hours over two days");
    expect(text).toContain("Day 1 · Wednesday 25 Nov");
    expect(text).toContain("Day 2 · Thursday 26 Nov");
    expect(text).toContain("Wednesday 25 Nov covers Levels 1 to 3. Thursday 26 Nov covers Levels 4 to 6");
    expect(text).toContain("Wednesday 2 hours + Thursday 2 hours, live online");
    // The label the 2-day path rewrites while scrolling (public/mmf/motion.js).
    expect(html).toContain('window.MMF_DAYS=["Wednesday 25 Nov","Thursday 26 Nov"]');
  });

  it("still reads Saturday, Sunday and 'one weekend' for a Saturday batch", () => {
    const html = renderLanding(template, weekend, v10Config);
    const text = visibleText(html);
    expect(text).toContain("Saturday 21 Nov and Sunday 22 Nov{{ timeComma }} · 2 hours each");
    expect(text).toContain("In 4 hours over one weekend");
    expect(html).toContain('window.MMF_DAYS=["Saturday 21 Nov","Sunday 22 Nov"]');
  });

  it("with nothing on sale, names the days of the cycle in Batch settings", () => {
    const html = renderLanding(template, null, { ...v10Config, fallbackDay1: istToUtc("2026-12-02", "00:00") });
    expectNoFixedDays(html);
    expect(visibleText(html)).toContain("Wednesday and Thursday{{ timeComma }} · 2 hours each");
    expect(html).toContain('window.MMF_DAYS=["Wednesday","Thursday"]');
    // Without Batch settings the page keeps the words it was written with.
    expect(visibleText(renderLanding(template, null, v10Config))).toContain("Saturday and Sunday{{ timeComma }} · 2 hours each");
  });

  it("motion.js takes the two days from the page, not from fixed words", () => {
    expect(motionJs).toContain("window.MMF_DAYS");
    expect(motionJs).not.toContain("'Day 1 · Saturday'");
    expect(motionJs).not.toContain("'Day 2 · Sunday'");
  });
});

describe("v20 pages with a batch that starts on a Wednesday", () => {
  it("landing", () => {
    const html = renderV20Landing(read("mpf-v20.html"), { batch: midweek, fallbackPriceRupees: null, paidSeats: 0 }, common);
    expectNoFixedDays(html);
    expectScriptsParse(html);
    expect(html).toContain("Wednesday <b>25 Nov</b> and Thursday <b>26 Nov</b>");
    expect(html).toContain("Wed <b>25 Nov</b> – Thu <b>26 Nov</b>");
    expect(html).toContain("Day 1 · Wednesday");
    expect(html).toContain("Day 1 is Wednesday 25 Nov; Day 2 is Thursday 26 Nov.");
  });

  it("landing with nothing on sale names the days of the cycle in Batch settings", () => {
    const data = { batch: null, fallbackPriceRupees: 2499, paidSeats: 0 };
    const html = renderV20Landing(read("mpf-v20.html"), { ...data, fallbackDay1: istToUtc("2026-12-02", "00:00") }, common);
    expectNoFixedDays(html);
    expect(html).toContain("Wednesday <b>to be announced</b> and Thursday <b>to be announced</b>");
    expect(renderV20Landing(read("mpf-v20.html"), data, common)).toContain("Saturday <b>to be announced</b> and Sunday <b>to be announced</b>");
  });

  it("checkout", () => {
    const html = renderV20Checkout(read("mpf-v20-checkout.html"), midweek, common, hooks);
    expectNoFixedDays(html);
    expectScriptsParse(html);
    expect(html).toContain("Book your seat for Wednesday 25 Nov and Thursday 26 Nov.");
  });

  it("thank-you", () => {
    const html = renderV20ThankYou(read("mpf-v20-thank-you.html"), midweek, order, common, tyHooks);
    expectNoFixedDays(html);
    expectScriptsParse(html);
    expect(html).toContain("Join Wednesday's session");
    expect(html).toContain("Join Thursday's session");
    expect(html).toContain("Before Wednesday");
  });

  it("thank-you never rewrites the buyer's own name", () => {
    const html = renderV20ThankYou(read("mpf-v20-thank-you.html"), midweek, { ...order, name: "Sunday Okafor" }, common, tyHooks);
    expect(html).toContain('"name":"Sunday Okafor"');
  });
});

describe("v30 pages with a batch that starts on a Wednesday", () => {
  it("landing", () => {
    const html = renderV30Landing(read("mpf-v30.html"), { batch: midweek, fallbackPriceRupees: null, paidSeats: 0 }, common);
    expectNoFixedDays(html);
    expectScriptsParse(html);
    expect(html).toContain("Day 1 is Wednesday 25 Nov; Day 2 is Thursday 26 Nov.");
    expect(html).toContain("Day 1 · Wednesday");
    expect(html).toContain("Wed 25 Nov – Thu 26 Nov");
  });

  it("landing with nothing on sale names the days of the cycle in Batch settings", () => {
    const html = renderV30Landing(
      read("mpf-v30.html"),
      { batch: null, fallbackPriceRupees: 2499, paidSeats: 0, fallbackDay1: istToUtc("2026-12-02", "00:00") },
      common,
    );
    expectNoFixedDays(html);
    expect(html).toContain("Day 1 · Wednesday");
  });

  it("checkout", () => {
    const html = renderV30Checkout(read("mpf-v30-checkout.html"), midweek, common, hooks);
    expectNoFixedDays(html);
    expectScriptsParse(html);
    expect(html).toContain("Wed 25 Nov – Thu 26 Nov");
    expect(html).toContain("a 2-day live workshop on Wednesday 25 Nov and Thursday 26 Nov");
  });

  it("thank-you", () => {
    const html = renderV30ThankYou(read("mpf-v30-thank-you.html"), midweek, order, common, tyHooks);
    expectNoFixedDays(html);
    expectScriptsParse(html);
    expect(html).toContain("Join Wednesday's session");
    expect(html).toContain("Join Thursday's session");
  });

  it("thank-you never rewrites the buyer's own name", () => {
    const html = renderV30ThankYou(read("mpf-v30-thank-you.html"), midweek, { ...order, name: "Sunday Okafor" }, common, tyHooks);
    expect(html).toContain('"name":"Sunday Okafor"');
  });
});

describe("checkout and thank-you wording (mmf-copy)", () => {
  it("reads as the brief wrote it for a Saturday batch", () => {
    expect(MMF_COPY.thankYou.T2("Saturday, 21 November 2026", "Sunday, 22 November 2026", "7:00 PM", "2 hours")).toBe(
      "Saturday 21 November 2026 and Sunday 22 November 2026, 7:00 PM IST, 2 hours each.",
    );
    expect(MMF_COPY.checkout.batchLine("Saturday, 21 November 2026", "Sunday, 22 November 2026", "7:00 PM", "2 hours")).toBe(
      "Batch: Saturday, 21 November 2026, 7:00 PM IST, Saturday and Sunday, 2 hours each, live online.",
    );
    expect(MMF_COPY.thankYou.T3(weekdayOf("Saturday, 21 November 2026"))).toBe("Join Saturday's session");
  });

  it("names the batch's own days for a Wednesday batch", () => {
    expect(MMF_COPY.thankYou.T2("Wednesday, 25 November 2026", "Thursday, 26 November 2026", "7:00 PM", "2 hours")).toBe(
      "Wednesday 25 November 2026 and Thursday 26 November 2026, 7:00 PM IST, 2 hours each.",
    );
    expect(MMF_COPY.checkout.batchLine("Wednesday, 25 November 2026", "Thursday, 26 November 2026", "7:00 PM", "2 hours")).toBe(
      "Batch: Wednesday, 25 November 2026, 7:00 PM IST, Wednesday and Thursday, 2 hours each, live online.",
    );
    expect(MMF_COPY.thankYou.T3(weekdayOf("Thursday, 26 November 2026"))).toBe("Join Thursday's session");
  });
});

describe("nextCycleDay1", () => {
  it("gives day 1 of the next batch on a weekday cycle", () => {
    const settings = { anchorDay1Date: istToUtc("2026-11-25", "00:00"), cadenceDays: 7 };
    expect(istYmd(nextCycleDay1(settings, istToUtc("2026-12-01", "10:00"))!)).toBe("2026-12-02");
    expect(istYmd(nextCycleDay1(settings, istToUtc("2026-11-25", "23:00"))!)).toBe("2026-11-25");
  });

  it("is null without usable Batch settings", () => {
    expect(nextCycleDay1(null)).toBeNull();
    expect(nextCycleDay1({})).toBeNull();
    expect(nextCycleDay1({ anchorDay1Date: istToUtc("2026-11-25", "00:00"), cadenceDays: 0 })).toBeNull();
  });
});
