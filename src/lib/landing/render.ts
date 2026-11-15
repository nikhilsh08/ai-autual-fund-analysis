import { formatDuration, formatIstDate, formatIstDateTime, formatIstTime } from "@/lib/ist";
import { MMF_V10_CHECKOUT_PATH } from "@/lib/landing/v10";
import { MMF_COPY } from "@/lib/mmf-copy";
import { escapeHtml, landingEventsScript, trackingNoscript, trackingTags } from "@/lib/landing/tracking";

export { escapeHtml };

export interface LandingBatch {
  id: string;
  priceRupees: number;
  day1StartAt: Date;
  bookingCloseAt: Date;
  durationMinutes: number;
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
}

export class LandingRenderError extends Error {}

const TOKEN_RE = /\{(price|class date|booking close date|session duration|total duration)\}/;
const SESSIONS_PER_BATCH = 2; // Day 1 and Day 2
const SUPPORT_SCRIPT = '<script src="/mmf/support.js"></script>';

const inr = (rupees: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(rupees);

// The data-props JSON lives in an attribute, so it is entity-encoded.
function setPropDefault(html: string, prop: string, value: string): string {
  const re = new RegExp(`(&quot;${prop}&quot;:\\{[^}]*?&quot;default&quot;:&quot;)([^&]*)(&quot;)`);
  if (!re.test(html)) throw new LandingRenderError(`data-props has no "${prop}"`);
  return html.replace(re, `$1${escapeHtml(value)}$3`);
}

function headSnippet(cfg: LandingConfig, priceRupees: number | null): string {
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
  parts.push(
    '<script src="/mmf/vendor/react.production.min.js"></script>',
    '<script src="/mmf/vendor/react-dom.production.min.js"></script>',
    "<script>window.__resources={};</script>",
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

  const sessionMinutes = batch ? batch.durationMinutes : cfg.fallbackDurationMinutes;

  let html = template.replace("<html>", '<html lang="en">');
  html = html
    .replaceAll("{price}", escapeHtml(priceText))
    .replaceAll("{class date}", escapeHtml(classDate))
    .replaceAll("{booking close date}", escapeHtml(closeText))
    .replaceAll("{session duration}", escapeHtml(formatDuration(sessionMinutes)))
    .replaceAll("{total duration}", escapeHtml(formatDuration(sessionMinutes * SESSIONS_PER_BATCH)));

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

  html = html.replace(SUPPORT_SCRIPT, `${headSnippet(cfg, priceRupees)}\n${SUPPORT_SCRIPT}`);
  html = html.replace("<body>", `<body>\n${bodyNoscript(cfg)}`);

  if (TOKEN_RE.test(html)) throw new LandingRenderError("unfilled token in rendered page");
  if (/data-checkout="1"/.test(html) && !batch) throw new LandingRenderError("checkout button rendered without a batch");
  return html;
}
