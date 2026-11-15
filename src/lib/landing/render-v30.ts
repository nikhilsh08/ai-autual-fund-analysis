// Fills the v30 (Master Personal Finance with AI, designer build v28) page
// files — src/landing/mpf-v30.html, mpf-v30-checkout.html,
// mpf-v30-thank-you.html and mpf-v30-refund-policy.html — with the batch on
// sale, and adds tracking.
//
// Every date, price and amount comes from the batch (admin panel). The
// checkout page only shows the total; /api/payment/cashfree/initiate decides
// the amount charged.
//
// Events: the designer's checkout and thank-you scripts fire Meta
// InitiateCheckout / Purchase (eventID = order ID, matching the Conversions
// API) and push begin_checkout / purchase to the GTM dataLayer themselves.
// This file adds the tags and, when GA4 runs without GTM, the same two events
// through gtag, so nothing is counted twice. If a template changes, keep the
// markers below or rendering throws V30RenderError.

import { formatIstShortDate, formatIstShortDateTime } from "@/lib/ist";
import { MMF_COPY } from "@/lib/mmf-copy";
import {
  SCHEMA_DEFAULT_DURATION_MINUTES,
  fillSessionLength,
  v20StartTime,
  type V20Batch,
  type V20Common,
} from "@/lib/landing/render-v20";
import {
  MPF_V30_CHECKOUT_PATH,
  MPF_V30_CONTENT_NAME,
  MPF_V30_LANDING_PATH,
  MPF_V30_REFUND_PATH,
  MPF_V30_SEATS_PER_BATCH,
  MPF_V30_SOURCE,
  MPF_V30_STATIC,
} from "@/lib/landing/v30";
import {
  escapeHtml,
  landingEventsScript,
  scriptJson,
  trackingNoscript,
  trackingTags,
  type TrackedItem,
  type TrackingConfig,
} from "@/lib/landing/tracking";

export class V30RenderError extends Error {}

export type V30Batch = V20Batch;
export type V30Common = V20Common;

const TOKEN_RE =
  /\{(price|class date|day 2 date|booking close date|class time|course id|batch id|order status|order id|buyer name|buyer email|amount paid|day 1 start iso|day 2 start iso)\}/;
const MPF_MARKER = 'window.MPF=window.MPF||{seatsLeft:50,startTime:"{class time}",language:"English"};';
// The default objects contain "{price}" etc., so match up to their last key.
const CHECKOUT_MARKER_RE = /window\.MPF_CHECKOUT=window\.MPF_CHECKOUT\|\|\{[^<]*?preview:!1\}/;
const ORDER_MARKER_RE = /window\.MPF_ORDER=window\.MPF_ORDER\|\|\{[^<]*?preview:!1\}/;
const CHECKOUT_BUTTON_RE = /<a class="pill" href="\.\/checkout\.html" data-checkout="1">[\s\S]*?<\/a>/;
// "about 2 hours" is replaced with the batch's session length (fillSessionLength).
const DESCRIPTION =
  "Master Personal Finance with AI: a 2-day live workshop, about 2 hours each day, that teaches you to judge an investment yourself. Education only.";

const inr = (rupees: number, decimals = 0) =>
  new Intl.NumberFormat("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(rupees);

function must(ok: boolean, what: string): void {
  if (!ok) throw new V30RenderError(`template is missing ${what}`);
}

function fillTokens(html: string, batch: V30Batch | null, priceRupees: number | null): string {
  const tba = MMF_COPY.landing.dateToBeAnnounced;
  return html
    .replaceAll("{price}", escapeHtml(priceRupees === null ? "" : inr(priceRupees)))
    .replaceAll("{class date}", escapeHtml(batch ? formatIstShortDate(batch.day1StartAt) : tba))
    .replaceAll("{day 2 date}", escapeHtml(batch ? formatIstShortDate(batch.day2StartAt) : tba))
    .replaceAll("{booking close date}", escapeHtml(batch ? formatIstShortDateTime(batch.bookingCloseAt) : tba));
}

// Relative links in the designer's files -> the routes and public/mpf30 here.
function rewritePaths(html: string): string {
  return html
    .replaceAll("./assets/", `${MPF_V30_STATIC}/assets/`)
    .replaceAll("./fonts/", `${MPF_V30_STATIC}/fonts/`)
    .replaceAll('"./lenis.min.js"', `"${MPF_V30_STATIC}/lenis.min.js"`)
    .replaceAll('"./checkout.html"', `"${MPF_V30_CHECKOUT_PATH}"`)
    .replaceAll('"./refund-policy.html"', `"${MPF_V30_REFUND_PATH}"`)
    .replaceAll('"./index.html#seat"', `"${MPF_V30_LANDING_PATH}#seat"`)
    .replaceAll('"./index.html"', `"${MPF_V30_LANDING_PATH}"`);
}

// window.MPF on the checkout and thank-you pages: only the start time is read.
const startTimeOnly = (batch: V30Batch | null) =>
  `window.MPF=${scriptJson({ seatsLeft: MPF_V30_SEATS_PER_BATCH, startTime: batch ? v20StartTime(batch) : "", language: batch?.language ?? "" })};`;

function canonical(common: V30Common, path: string): string {
  return `<link rel="canonical" href="${escapeHtml(`${common.siteUrl}${path}`)}">`;
}

// GA4 without GTM: gtag directly. With GTM the page's own dataLayer push is
// enough, and without GA4 there is nothing to send.
function ga4Direct(cfg: TrackingConfig, eventName: string, payload: Record<string, unknown>, onceKey: string, storage: "sessionStorage" | "localStorage"): string {
  if (!cfg.gaId || cfg.ga4ViaGtm) return "";
  return `<script>
(function(){var k=${scriptJson(onceKey)};try{if(${storage}.getItem(k))return;${storage}.setItem(k,'1');}catch(e){}
if(typeof gtag==='function'){gtag('event',${scriptJson(eventName)},${scriptJson(payload)});}})();
</script>`;
}

const gaItems = (item: TrackedItem) =>
  item.contentIds.map((id) => ({ item_id: id, item_name: item.contentName, price: item.value }));

function finish(html: string, head: string[], common: V30Common, tracked = true): string {
  must(html.includes("</head>"), "</head>");
  must(html.includes("<body>"), "<body>");
  let out = html.replace("</head>", `${head.filter(Boolean).join("\n")}\n</head>`);
  if (tracked) out = out.replace("<body>", `<body>\n${trackingNoscript(common.tracking)}`);
  if (TOKEN_RE.test(out)) throw new V30RenderError("unfilled token in rendered page");
  return out;
}

// ---------------------------------------------------------------- landing

export interface V30LandingData {
  batch: V30Batch | null;
  // Used for the price when nothing is on sale (batch settings, then course price).
  fallbackPriceRupees: number | null;
  // Paid bookings for the batch on sale (shared with /v20: same batches).
  paidSeats: number;
  // Session length when nothing is on sale (batch settings).
  fallbackDurationMinutes?: number | null;
}

export function renderV30Landing(template: string, data: V30LandingData, common: V30Common): string {
  must(template.includes(MPF_MARKER), "the window.MPF defaults line");
  must(CHECKOUT_BUTTON_RE.test(template), "the price-card checkout button");

  const { batch } = data;
  const priceRupees = batch ? batch.priceRupees : data.fallbackPriceRupees;
  const seatsLeft = batch ? Math.max(0, MPF_V30_SEATS_PER_BATCH - data.paidSeats) : MPF_V30_SEATS_PER_BATCH;

  let html = template.replace(
    MPF_MARKER,
    `window.MPF=${scriptJson({ seatsLeft, startTime: batch ? v20StartTime(batch) : "", language: batch?.language ?? "" })};`,
  );

  if (!batch) {
    html = html.replace(
      CHECKOUT_BUTTON_RE,
      `<p class="fine" style="margin-top:0;text-align:center">${escapeHtml(MMF_COPY.landing.nothingOnSale)}</p>`,
    );
  }

  const minutes = batch?.durationMinutes ?? data.fallbackDurationMinutes ?? SCHEMA_DEFAULT_DURATION_MINUTES;
  html = fillSessionLength(rewritePaths(fillTokens(html, batch, priceRupees)), minutes);

  const url = `${common.siteUrl}${MPF_V30_LANDING_PATH}`;
  const head = [
    canonical(common, MPF_V30_LANDING_PATH),
    `<meta property="og:title" content="Master Personal Finance with AI — 2-day live workshop">`,
    `<meta property="og:description" content="${fillSessionLength(escapeHtml(DESCRIPTION), minutes)}">`,
    `<meta property="og:url" content="${escapeHtml(url)}">`,
    `<meta property="og:type" content="website">`,
    ...trackingTags(common.tracking),
    landingEventsScript(common.tracking, {
      contentIds: [common.courseId],
      contentName: MPF_V30_CONTENT_NAME,
      value: priceRupees ?? 0,
      currency: "INR",
    }),
  ];
  const out = finish(html, head, common);
  // (The page's UTM script also mentions a[data-checkout="1"]; look for the tag.)
  if (!batch && /data-checkout="1">/.test(out)) throw new V30RenderError("checkout button rendered without a batch");
  return out;
}

// ---------------------------------------------------------------- checkout

export interface V30CheckoutHooks {
  initiateUrl: string;
  couponUrl: string;
  // "production" or "sandbox"; must match the server's Cashfree environment.
  cashfreeMode: "production" | "sandbox";
  // Development preview: payment and coupon are switched off by the page.
  preview?: boolean;
}

export function renderV30Checkout(template: string, batch: V30Batch, common: V30Common, hooks: V30CheckoutHooks): string {
  must(template.includes(MPF_MARKER), "the window.MPF line");
  must(CHECKOUT_MARKER_RE.test(template), "the window.MPF_CHECKOUT line");
  must(template.includes('<form class="card" id="coform"'), "the checkout form");

  const cfg = {
    price: `₹${inr(batch.priceRupees)}`,
    courseId: common.courseId,
    batchId: batch.id,
    initiateUrl: hooks.initiateUrl,
    couponUrl: hooks.couponUrl,
    cashfreeMode: hooks.cashfreeMode,
    landingSource: MPF_V30_SOURCE,
    preview: !!hooks.preview,
  };
  let html = template
    .replace(MPF_MARKER, startTimeOnly(batch))
    .replace(CHECKOUT_MARKER_RE, `window.MPF_CHECKOUT=${scriptJson(cfg)}`);
  // Clarity must not record what buyers type (OWNER_DECISIONS D8).
  if (!html.includes('id="coform" method="post" action="javascript:void(0)" novalidate data-clarity-mask="true"')) {
    html = html.replace('<form class="card" id="coform"', '<form class="card" id="coform" data-clarity-mask="true"');
  }
  html = fillSessionLength(rewritePaths(fillTokens(html, batch, batch.priceRupees)), batch.durationMinutes);

  const item: TrackedItem = { contentIds: [common.courseId], contentName: MPF_V30_CONTENT_NAME, value: batch.priceRupees, currency: "INR" };
  const head = [canonical(common, MPF_V30_CHECKOUT_PATH)];
  if (!hooks.preview) {
    head.push(
      ...trackingTags(common.tracking),
      ga4Direct(
        common.tracking,
        "begin_checkout",
        { currency: "INR", value: batch.priceRupees, items: gaItems(item) },
        `ga_ic_v30_${batch.id}`,
        "sessionStorage",
      ),
    );
  }
  return finish(html, head, common, !hooks.preview);
}

// ---------------------------------------------------------------- thank-you

export type V30OrderState = "paid" | "verifying" | "failed";

export interface V30Order {
  state: V30OrderState;
  orderId: string;
  name: string;
  email: string;
  amountRupees: number;
  joinDay1: string | null;
  joinDay2: string | null;
  whatsappGroup: string | null;
}

export interface V30ThankYouHooks {
  verifyUrl: string;
  // GET, returns joinLinkDay1 / joinLinkDay2 / whatsappGroupLink.
  bookingUrl: string;
  preview?: boolean;
}

export function renderV30ThankYou(
  template: string,
  batch: V30Batch,
  order: V30Order,
  common: V30Common,
  hooks: V30ThankYouHooks,
): string {
  must(template.includes(MPF_MARKER), "the window.MPF line");
  must(ORDER_MARKER_RE.test(template), "the window.MPF_ORDER line");
  must(template.includes("<main>"), "<main>");

  const mpfOrder = {
    // The page's names for the states.
    status: order.state === "verifying" ? "pending" : order.state,
    orderId: order.orderId,
    name: order.name,
    email: order.email,
    amount: `₹${inr(order.amountRupees, 2)}`,
    day1Start: batch.day1StartAt.toISOString(),
    day2Start: batch.day2StartAt.toISOString(),
    durationMinutes: batch.durationMinutes,
    joinDay1: order.joinDay1 ?? "",
    joinDay2: order.joinDay2 ?? "",
    whatsappGroup: order.whatsappGroup ?? "",
    preview: !!hooks.preview,
  };

  let html = template
    .replace(MPF_MARKER, startTimeOnly(batch))
    .replace(ORDER_MARKER_RE, `window.MPF_ORDER=${scriptJson(mpfOrder)}`)
    // Name, email and order ID are on screen: keep them out of Clarity.
    .replace("<main>", '<main data-clarity-mask="true">');
  html = fillSessionLength(rewritePaths(fillTokens(html, batch, null)), batch.durationMinutes);

  const head = [`<meta name="referrer" content="same-origin">`];
  if (!hooks.preview) {
    head.push(...trackingTags(common.tracking));
    if (order.state === "paid") {
      const item: TrackedItem = { contentIds: [common.courseId], contentName: MPF_V30_CONTENT_NAME, value: order.amountRupees, currency: "INR" };
      head.push(
        ga4Direct(
          common.tracking,
          "purchase",
          { transaction_id: order.orderId, currency: "INR", value: order.amountRupees, items: gaItems(item) },
          `ga_purchase_${order.orderId}`,
          "localStorage",
        ),
      );
    }
    head.push(liveScript(order, hooks));
  }
  return finish(html, head, common, !hooks.preview);
}

// Pending: ask the server to re-check the payment with Cashfree on every load
// (the page itself reloads every 6 s, up to 10 times). Paid without join
// links yet: poll the booking for up to a minute and reload once when both
// links exist, so the join buttons appear.
function liveScript(order: V30Order, hooks: V30ThankYouHooks): string {
  const r = {
    state: order.state,
    orderId: order.orderId,
    verifyUrl: hooks.verifyUrl,
    bookingUrl: hooks.bookingUrl,
    hasLinks: !!(order.joinDay1 && order.joinDay2),
  };
  return `<script>
(function(){var r=${scriptJson(r)};
if(r.state==='verifying'){fetch(r.verifyUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId:r.orderId})}).catch(function(){});return;}
if(r.state!=='paid'||r.hasLinks)return;
var key='mpf30_links_'+r.orderId;try{if(sessionStorage.getItem(key))return;}catch(e){}
var tries=0;(function poll(){tries++;
fetch(r.bookingUrl,{cache:'no-store'}).then(function(res){return res.json();}).then(function(b){
if(b&&b.joinLinkDay1&&b.joinLinkDay2){try{sessionStorage.setItem(key,'1');}catch(e){}location.reload();return;}
if(tries<20)setTimeout(poll,3000);}).catch(function(){if(tries<20)setTimeout(poll,3000);});})();
})();
</script>`;
}

// ---------------------------------------------------------------- refund policy

export function renderV30RefundPolicy(template: string, common: V30Common): string {
  const html = rewritePaths(template);
  return finish(html, [canonical(common, MPF_V30_REFUND_PATH), ...trackingTags(common.tracking)], common);
}
