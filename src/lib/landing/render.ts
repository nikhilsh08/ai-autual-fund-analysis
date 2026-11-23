import {
  addDays,
  formatDuration,
  formatIstDate,
  formatIstDateTime,
  formatIstShortDate,
  formatIstTime,
  istDaysBetween,
} from "@/lib/ist";
import { eachDayOf, fillEachDayV10, type EachDay } from "@/lib/landing/each-day";
import { MMF_V10_CHECKOUT_PATH } from "@/lib/landing/v10";
import { MMF_COPY } from "@/lib/mmf-copy";
import { escapeHtml, landingEventsScript, scriptJson, trackingNoscript, trackingTags } from "@/lib/landing/tracking";
import { batchWeekdays, daysOnPage, fillWeekdays } from "@/lib/landing/weekdays";

export { escapeHtml };

export interface LandingBatch {
  id: string;
  priceRupees: number;
  day1StartAt: Date;
  // Absent: the day after day 1.
  day2StartAt?: Date;
  bookingCloseAt: Date;
  durationMinutes: number;
  // Length of day 2. Absent or null: the same as day 1.
  day2DurationMinutes?: number | null;
  language: string | null;
}

export interface LandingConfig {
  courseId: string;
  canonicalUrl: string;
  title: string;
  description: string;
  ogImage?: string;
  pixelId?: string;
  gtmId?: string;
  gaId?: string;
  ga4ViaGtm: boolean;
  clarityId?: string;
  // Used for the price token when nothing is on sale.
  fallbackPriceRupees: number | null;
  // Length of one session, used for the duration tokens when nothing is on sale.
  fallbackDurationMinutes: number;
  // Day 1 of the next batch on the cycle (Batch settings). Names the two
  // weekdays when nothing is on sale; absent, the page keeps its own words.
  fallbackDay1?: Date | null;
  // Day 2 of that batch and its length, when Batch settings give day 2 its
  // own. Absent: the day after day 1, for the same length.
  fallbackDay2?: Date | null;
  fallbackDay2DurationMinutes?: number | null;
}

export class LandingRenderError extends Error {}

// Tokens in src/landing/mmf-v10.html:
//   {day 1 short date} / {day 2 short date}  "5 Dec" / "6 Dec" ("to be announced" with nothing on sale)
//   {day 1} / {day 2}                        "Saturday 5 Dec" / "Sunday 6 Dec"; the weekday alone with nothing on sale
//   {class date}                             "Saturday, 5 December 2026"
// The start time is the page's own {{ startTime }} value (the startTime prop below).
const TOKEN_RE =
  /\{(price|class date|day 1 short date|day 2 short date|day 1|day 2|booking close date|session duration|total duration)\}/;
const SUPPORT_SCRIPT = '<script src="/mmf/support.js"></script>';

const inr = (rupees: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(rupees);

// The data-props JSON lives in an attribute, so it is entity-encoded.
function setPropDefault(html: string, prop: string, value: string): string {
  const re = new RegExp(`(&quot;${prop}&quot;:\\{[^}]*?&quot;default&quot;:&quot;)([^&]*)(&quot;)`);
  if (!re.test(html)) throw new LandingRenderError(`data-props has no "${prop}"`);
  return html.replace(re, `$1${escapeHtml(value)}$3`);
}

// dayLabels: the two days as the 2-day path names them ("Saturday 5 Dec", "Sunday 6 Dec").
function headSnippet(cfg: LandingConfig, priceRupees: number | null, dayLabels: [string, string]): string {
  const parts: string[] = [
    `<title>${escapeHtml(cfg.title)}</title>`,
    `<meta name="description" content="${escapeHtml(cfg.description)}">`,
    `<link rel="canonical" href="${escapeHtml(cfg.canonicalUrl)}">`,
    `<meta property="og:title" content="${escapeHtml(cfg.title)}">`,
    `<meta property="og:description" content="${escapeHtml(cfg.description)}">`,
    `<meta property="og:url" content="${escapeHtml(cfg.canonicalUrl)}">`,
    `<meta property="og:type" content="website">`,
  ];
  if (cfg.ogImage) {
    parts.push(
      `<meta property="og:image" content="${escapeHtml(cfg.ogImage)}">`,
      `<meta name="twitter:card" content="summary_large_image">`,
    );
  }

  // support.js reuses window.React / window.ReactDOM when they exist and
  // skips its own page re-fetch when window.__resources is set (spec 5.3).
  // motion.js reads window.MMF_DAYS for the "Day 1 · …" label of the 2-day path.
  parts.push(
    '<script src="/mmf/vendor/react.production.min.js"></script>',
    '<script src="/mmf/vendor/react-dom.production.min.js"></script>',
    `<script>window.__resources={};window.MMF_DAYS=${scriptJson(dayLabels)};</script>`,
  );

  // Pixel, GTM, GA4, Clarity, then UTM capture, ViewContent and AddToCart.
  // InitiateCheckout fires on the checkout page.
  parts.push(...trackingTags(cfg));
  parts.push(
    landingEventsScript(cfg, {
      contentIds: [cfg.courseId],
      contentName: MMF_COPY.contentName,
      value: priceRupees ?? 0,
      currency: "INR",
    }),
  );

  return parts.join("\n");
}

const bodyNoscript = (cfg: LandingConfig): string => trackingNoscript(cfg);

export function renderLanding(template: string, batch: LandingBatch | null, cfg: LandingConfig): string {
  if (!template.includes(SUPPORT_SCRIPT)) throw new LandingRenderError("template is missing the support.js tag");

  const priceRupees = batch ? batch.priceRupees : cfg.fallbackPriceRupees;
  const priceText = priceRupees === null ? "" : inr(priceRupees);
  const classDate = batch ? formatIstDate(batch.day1StartAt) : MMF_COPY.landing.dateToBeAnnounced;
  const closeText = batch ? formatIstDateTime(batch.bookingCloseAt) : MMF_COPY.landing.dateToBeAnnounced;

  // The two weekdays: the batch on sale, else the cycle in Batch settings.
  const days = daysOnPage(batch, cfg.fallbackDay1, cfg.fallbackDay2);
  const [weekday1, weekday2] = batchWeekdays(days);
  // Each day's own start time and length (Admin → Batches). With nothing on
  // sale there is no time to give, only the cycle's days and lengths.
  const each: EachDay = batch
    ? eachDayOf({ ...batch, day2StartAt: batch.day2StartAt ?? addDays(batch.day1StartAt, 1) })
    : {
        times: null,
        inARow: !cfg.fallbackDay1 || !cfg.fallbackDay2 || istDaysBetween(cfg.fallbackDay1, cfg.fallbackDay2) === 1,
        minutes: [cfg.fallbackDurationMinutes, cfg.fallbackDay2DurationMinutes ?? cfg.fallbackDurationMinutes],
      };
  const [sessionMinutes, day2SessionMinutes] = each.minutes;

  // Both days of the batch. With nothing on sale there is no date to give:
  // the short-date tokens read "to be announced" and the day tokens name the
  // weekday alone.
  const day1Short = batch ? formatIstShortDate(batch.day1StartAt) : MMF_COPY.landing.dateToBeAnnounced;
  const day2Short = batch
    ? formatIstShortDate(batch.day2StartAt ?? addDays(batch.day1StartAt, 1))
    : MMF_COPY.landing.dateToBeAnnounced;
  const dayLabels: [string, string] = batch ? [`${weekday1} ${day1Short}`, `${weekday2} ${day2Short}`] : [weekday1, weekday2];

  // Each day's own details first, on the page file's own words; then the weekdays.
  let html = fillWeekdays(fillEachDayV10(template, each), days).replace("<html>", '<html lang="en">');
  html = html
    .replaceAll("{price}", escapeHtml(priceText))
    .replaceAll("{day 1 short date}", escapeHtml(day1Short))
    .replaceAll("{day 2 short date}", escapeHtml(day2Short))
    .replaceAll("{day 1}", escapeHtml(dayLabels[0]))
    .replaceAll("{day 2}", escapeHtml(dayLabels[1]))
    .replaceAll("{class date}", escapeHtml(classDate))
    .replaceAll("{booking close date}", escapeHtml(closeText))
    .replaceAll("{session duration}", escapeHtml(formatDuration(sessionMinutes)))
    .replaceAll("{total duration}", escapeHtml(formatDuration(sessionMinutes + day2SessionMinutes)));

  html = setPropDefault(html, "startTime", batch ? formatIstTime(batch.day1StartAt) : "");
  html = setPropDefault(html, "language", batch?.language ?? "");

  if (batch) {
    // The v10 checkout page looks up the course and the batch on sale itself.
    const href = MMF_V10_CHECKOUT_PATH;
    html = html.replace('href="#" data-checkout="1"', `href="${href}" data-checkout="1"`);
  } else {
    html = html.replace(/<a href="#" data-checkout="1"[^>]*>[\s\S]*?<\/a>/, "");
    html = html.replace(
      /(<p[^>]*data-batch-line="1"[^>]*>)[\s\S]*?(<\/p>)/,
      `$1${escapeHtml(MMF_COPY.landing.nothingOnSale)}$2`,
    );
  }

  html = html.replace(SUPPORT_SCRIPT, `${headSnippet(cfg, priceRupees, dayLabels)}\n${SUPPORT_SCRIPT}`);
  html = html.replace("<body>", `<body>\n${bodyNoscript(cfg)}`);

  if (TOKEN_RE.test(html)) throw new LandingRenderError("unfilled token in rendered page");
  if (/data-checkout="1"/.test(html) && !batch) throw new LandingRenderError("checkout button rendered without a batch");
  return html;
}
