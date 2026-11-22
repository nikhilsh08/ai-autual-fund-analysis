// Fills the v20 (Master Personal Finance with AI) page files from the
// designer — src/landing/mpf-v20.html, mpf-v20-checkout.html and
// mpf-v20-thank-you.html — with the batch on sale, and adds tracking.
//
// Every date, price and amount comes from the batch (admin panel). The
// checkout page only shows the total; /api/payment/cashfree/initiate decides
// the amount charged. If a template changes, keep the markers listed in
// MARKERS below or rendering throws V20RenderError.

import { formatDuration, formatIstShortDate, formatIstShortDateTime, formatIstTime } from "@/lib/ist";
import { MMF_COPY } from "@/lib/mmf-copy";
import {
  MPF_V20_CHECKOUT_PATH,
  MPF_V20_CONTENT_NAME,
  MPF_V20_LANDING_PATH,
  MPF_V20_SEATS_PER_BATCH,
  MPF_V20_SOURCE,
} from "@/lib/landing/v20";
import { LANDING_PUBLIC_PATH } from "@/lib/landing/sources";
import {
  checkoutEventsScript,
  escapeHtml,
  landingEventsScript,
  purchaseEventScript,
  scriptJson,
  trackingNoscript,
  trackingTags,
  type TrackingConfig,
} from "@/lib/landing/tracking";

export class V20RenderError extends Error {}

export interface V20Batch {
  id: string;
  priceRupees: number;
  day1StartAt: Date;
  day2StartAt: Date;
  bookingCloseAt: Date;
  durationMinutes: number;
  language: string | null;
}

export interface V20Common {
  courseId: string;
  siteUrl: string;
  tracking: TrackingConfig;
}

const TOKEN_RE = /\{(price|class date|day 2 date|booking close date)\}/;
const LANDING_MPF_MARKER =
  'window.MPF = window.MPF || { seatsLeft: 50, startTime: "", language: "", fillingFast: false };';
const PAGE_MPF_MARKER = "window.MPF = window.MPF || {};";
const CHECKOUT_BUTTON_RE = /<a class="pill" href="checkout\.html" data-checkout="1">[\s\S]*?<\/a>/;
const DESCRIPTION =
  "Master Personal Finance with AI: a 2-day live workshop on how to use AI to manage your own money. Education only, not investment advice.";
const GST_PERCENT = 18;

const inr = (rupees: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(rupees);

function must(html: string, marker: string, what: string): void {
  if (!html.includes(marker)) throw new V20RenderError(`template is missing ${what}`);
}

// Same start time on both days, e.g. "10:00 AM IST".
export const v20StartTime = (batch: V20Batch) => `${formatIstTime(batch.day1StartAt)} IST`;

// The sentence in the /v20 and /v30 price cards that promises a seat limit.
// Shown only when the page has one.
const SEAT_LIMIT_SENTENCE = "Each batch is limited to 50 attendees, so that questions can be answered live.";

// The seat number given to the page's script, and the page text to go with it.
// No limit (the default): the page's own default number, so it shows its fixed
// line and never counts down, and the seat-limit sentence is taken out. With
// a limit: seats left, so the page counts down once 15 or fewer remain.
export function applySeatLimit(
  html: string,
  hasBatch: boolean,
  seatLimit: number | null | undefined,
  paidSeats: number,
): { html: string; seatsLeft: number } {
  if (seatLimit == null) return { html: html.replace(SEAT_LIMIT_SENTENCE, ""), seatsLeft: MPF_V20_SEATS_PER_BATCH };
  return { html, seatsLeft: hasBatch ? Math.max(0, seatLimit - paidSeats) : seatLimit };
}

// Mirrors `durationMinutes @default(120)` in prisma/schema.prisma. Used only
// when neither a batch nor the batch settings give a session length.
export const SCHEMA_DEFAULT_DURATION_MINUTES = 120;

// The designer's copy says "about 2 hours" (each day). The length comes from
// the batch (Admin → Batches → duration), so a 90-minute batch reads
// "about 1 hour 30 minutes".
export function fillSessionLength(html: string, minutes: number): string {
  return html.replace(/about 2 hours/g, `about ${escapeHtml(formatDuration(minutes))}`);
}

function fillTokens(html: string, batch: V20Batch | null, priceRupees: number | null): string {
  const tba = MMF_COPY.landing.dateToBeAnnounced;
  return html
    .replaceAll("{price}", escapeHtml(priceRupees === null ? "" : inr(priceRupees)))
    .replaceAll("{class date}", escapeHtml(batch ? formatIstShortDate(batch.day1StartAt) : tba))
    .replaceAll("{day 2 date}", escapeHtml(batch ? formatIstShortDate(batch.day2StartAt) : tba))
    .replaceAll("{booking close date}", escapeHtml(batch ? formatIstShortDateTime(batch.bookingCloseAt) : tba));
}

// Relative links in the designer's files -> the routes and public folder here.
function rewritePaths(html: string): string {
  return html
    .replaceAll('src="./assets/', 'src="/mpf/assets/')
    .replaceAll('src="./lenis.min.js"', 'src="/mpf/lenis.min.js"')
    .replaceAll('href="checkout.html"', `href="${MPF_V20_CHECKOUT_PATH}"`)
    .replaceAll('href="index.html#seat"', `href="${MPF_V20_LANDING_PATH}#seat"`)
    .replaceAll('href="index.html"', `href="${MPF_V20_LANDING_PATH}"`);
}

function headExtras(common: V20Common, path: string, indexable: boolean): string[] {
  const url = `${common.siteUrl}${path}`;
  const parts = [
    `<meta name="description" content="${escapeHtml(DESCRIPTION)}">`,
    `<link rel="canonical" href="${escapeHtml(url)}">`,
  ];
  if (indexable) {
    parts.push(
      `<meta property="og:title" content="Master Personal Finance with AI — 2-day live workshop">`,
      `<meta property="og:description" content="${escapeHtml(DESCRIPTION)}">`,
      `<meta property="og:url" content="${escapeHtml(url)}">`,
      `<meta property="og:type" content="website">`,
    );
  }
  return parts;
}

function finish(html: string, head: string[], common: V20Common): string {
  must(html, "</head>", "</head>");
  must(html, "<body>", "<body>");
  let out = html.replace("</head>", `${head.join("\n")}\n</head>`);
  out = out.replace("<body>", `<body>\n${trackingNoscript(common.tracking)}`);
  if (TOKEN_RE.test(out)) throw new V20RenderError("unfilled token in rendered page");
  return out;
}

// ---------------------------------------------------------------- landing

export interface V20LandingData {
  batch: V20Batch | null;
  // Used for the price when nothing is on sale (batch settings, then course price).
  fallbackPriceRupees: number | null;
  // Paid bookings for the batch on sale.
  paidSeats: number;
  // Paid bookings this page's batches may take (sources.ts); null or absent
  // = no limit.
  seatLimit?: number | null;
  // Session length when nothing is on sale (batch settings).
  fallbackDurationMinutes?: number | null;
}

export function renderV20Landing(template: string, data: V20LandingData, common: V20Common): string {
  must(template, LANDING_MPF_MARKER, "the window.MPF defaults line");
  must(template, 'href="checkout.html" data-checkout="1"', "the price-card checkout button");

  const { batch } = data;
  const priceRupees = batch ? batch.priceRupees : data.fallbackPriceRupees;
  const seats = applySeatLimit(template, !!batch, data.seatLimit, data.paidSeats);
  const seatsLeft = seats.seatsLeft;

  let html = seats.html.replace(
    LANDING_MPF_MARKER,
    `window.MPF = ${scriptJson({
      seatsLeft,
      startTime: batch ? v20StartTime(batch) : "",
      language: batch?.language ?? "",
      // "Filling fast" stays off until it is driven by real booking pace.
      fillingFast: false,
    })};`,
  );

  if (!batch) {
    html = html.replace(
      CHECKOUT_BUTTON_RE,
      `<p class="fine" style="margin-top:20px;text-align:center">${escapeHtml(MMF_COPY.landing.nothingOnSale)}</p>`,
    );
  }

  html = rewritePaths(fillTokens(html, batch, priceRupees));
  html = fillSessionLength(html, batch?.durationMinutes ?? data.fallbackDurationMinutes ?? SCHEMA_DEFAULT_DURATION_MINUTES);

  const head = [
    // Canonical and og:url name the address the page is advertised on.
    ...headExtras(common, LANDING_PUBLIC_PATH.v20, true),
    ...trackingTags(common.tracking),
    landingEventsScript(common.tracking, {
      contentIds: [common.courseId],
      contentName: MPF_V20_CONTENT_NAME,
      value: priceRupees ?? 0,
      currency: "INR",
    }),
  ];
  const out = finish(html, head, common);
  if (!batch && /data-checkout="1"/.test(out)) throw new V20RenderError("checkout button rendered without a batch");
  return out;
}

// ---------------------------------------------------------------- checkout

export interface V20CheckoutHooks {
  initiateUrl: string;
  couponUrl: string;
  // "production" or "sandbox"; must match the server's Cashfree environment.
  cashfreeMode: "production" | "sandbox";
  // Development preview: payment and coupon are switched off.
  preview?: boolean;
}

// window.MPF for checkout.html: the values its script reads plus the
// onCoupon / onPay hooks (see the comment at the top of that script).
function checkoutConfigScript(batch: V20Batch, common: V20Common, hooks: V20CheckoutHooks): string {
  const cfg = {
    courseId: common.courseId,
    batchId: batch.id,
    startTime: v20StartTime(batch),
    gstPercent: GST_PERCENT,
    initiateUrl: hooks.initiateUrl,
    couponUrl: hooks.couponUrl,
    cashfreeMode: hooks.cashfreeMode,
    source: MPF_V20_SOURCE,
    closedMessage: MMF_COPY.landing.nothingOnSale,
    fullMessage: `This batch is full. ${MMF_COPY.landing.nothingOnSale}`,
  };
  if (hooks.preview) return `window.MPF = ${scriptJson({ startTime: cfg.startTime, gstPercent: cfg.gstPercent })};`;

  return `window.MPF = (function () {
  var c = ${scriptJson(cfg)};
  var GENERIC = 'We could not start the payment. Please try again.';
  var UTM = [['utm_source','utmSource'],['utm_medium','utmMedium'],['utm_campaign','utmCampaign'],['utm_term','utmTerm'],['utm_content','utmContent']];
  // UTMs from this URL first, then the ones the landing page stored.
  function utms() {
    var p = new URLSearchParams(location.search), o = {};
    UTM.forEach(function (k) { var v = p.get(k[0]); if (!v) { try { v = sessionStorage.getItem(k[0]); } catch (e) {} } if (v) o[k[1]] = v; });
    return o;
  }
  function loadCashfree() {
    return new Promise(function (resolve, reject) {
      if (window.Cashfree) return resolve(window.Cashfree);
      var s = document.createElement('script');
      s.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      s.onload = function () { window.Cashfree ? resolve(window.Cashfree) : reject(new Error('Cashfree SDK missing')); };
      s.onerror = function () { reject(new Error('Cashfree SDK failed to load')); };
      document.head.appendChild(s);
    });
  }
  // The initiate route answers with short error codes for the batch rules.
  function payError(code) {
    if (code === 'batch_full') return c.fullMessage;
    if (code === 'batch_not_on_sale' || code === 'batch_required') return c.closedMessage;
    if (typeof code === 'string' && /coupon|minimum order/i.test(code)) return code + '.';
    return GENERIC;
  }
  return {
    startTime: c.startTime,
    gstPercent: c.gstPercent,
    onCoupon: function (code, priceRupees) {
      return fetch(c.couponUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code, courseIds: [c.courseId], amount: priceRupees, batchId: c.batchId })
      }).then(function (r) { return r.json(); }).then(function (d) {
        return d && d.success && d.data
          ? { ok: true, code: d.data.code, discountRupees: d.data.discountAmount }
          : { ok: false, message: (d && d.error) || 'This code is not valid.' };
      });
    },
    onPay: function (f) {
      return fetch(c.initiateUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.name, email: f.email, phone: f.phone, courseIds: [c.courseId],
          couponCode: f.couponCode || undefined, batchId: c.batchId, whatsappOptIn: !!f.whatsappOptIn,
          landingSource: c.source, utmParams: utms()
        })
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (d) {
          var sid = d && d.paymentSession && d.paymentSession.payment_session_id;
          if (!r.ok || !d.success || !sid) throw payError(d && d.error);
          // Full-page redirect to Cashfree. It returns to /payment/callback,
          // which verifies the payment and forwards to /v20/thank-you.
          return loadCashfree().then(function (Cashfree) {
            return Cashfree({ mode: c.cashfreeMode }).checkout({ paymentSessionId: sid, redirectTarget: '_self' });
          }).then(function (res) { if (res && res.error) throw (res.error.message || GENERIC); });
        });
      }, function () { throw 'We could not start the payment. Please check your connection and try again.'; });
    }
  };
})();`;
}

export function renderV20Checkout(template: string, batch: V20Batch, common: V20Common, hooks: V20CheckoutHooks): string {
  must(template, PAGE_MPF_MARKER, "the window.MPF line");
  must(template, '<form class="card" id="coform"', "the checkout form");

  let html = template.replace(PAGE_MPF_MARKER, checkoutConfigScript(batch, common, hooks));
  // Clarity must not record what buyers type (OWNER_DECISIONS D8).
  html = html.replace('<form class="card" id="coform"', '<form class="card" id="coform" data-clarity-mask="true"');
  html = fillSessionLength(rewritePaths(fillTokens(html, batch, batch.priceRupees)), batch.durationMinutes);

  const head = [...headExtras(common, MPF_V20_CHECKOUT_PATH, false)];
  if (!hooks.preview) {
    head.push(
      ...trackingTags(common.tracking),
      checkoutEventsScript(
        common.tracking,
        { contentIds: [common.courseId], contentName: MPF_V20_CONTENT_NAME, value: batch.priceRupees, currency: "INR" },
        `ic_v20_${batch.id}`,
      ),
    );
  }
  return finish(html, head, common);
}

// ---------------------------------------------------------------- thank-you

export type V20OrderState = "paid" | "verifying" | "failed";

export interface V20Order {
  state: V20OrderState;
  orderId: string;
  name: string;
  email: string;
  amountRupees: number;
  joinDay1: string | null;
  joinDay2: string | null;
  whatsappGroup: string | null;
}

export interface V20ThankYouHooks {
  verifyUrl: string;
  // GET, returns joinLinkDay1 / joinLinkDay2 / whatsappGroupLink.
  bookingUrl: string;
  preview?: boolean;
}

export function renderV20ThankYou(
  template: string,
  batch: V20Batch,
  order: V20Order,
  common: V20Common,
  hooks: V20ThankYouHooks,
): string {
  must(template, PAGE_MPF_MARKER, "the window.MPF line");
  must(template, "</body>", "</body>");

  const mpf = {
    startTime: v20StartTime(batch),
    order: {
      state: order.state,
      orderId: order.orderId,
      name: order.name,
      email: order.email,
      amountRupees: order.amountRupees,
      joinDay1: order.joinDay1 ?? "",
      joinDay2: order.joinDay2 ?? "",
      whatsappGroup: order.whatsappGroup ?? "",
      day1StartISO: batch.day1StartAt.toISOString(),
      day2StartISO: batch.day2StartAt.toISOString(),
      sessionMinutes: batch.durationMinutes,
    },
  };
  const refresh = { orderId: order.orderId, verifyUrl: hooks.verifyUrl, bookingUrl: hooks.bookingUrl, state: order.state };

  let html = template.replace(
    PAGE_MPF_MARKER,
    `window.MPF = ${scriptJson(mpf)};
// "Refresh status": ask the server to re-check the payment with Cashfree, then reload.
window.MPF.onRefresh = function () {
  var o = window.MPF.order;
  fetch(${scriptJson(hooks.verifyUrl)}, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: o.orderId }) })
    .catch(function () {}).then(function () { location.reload(); });
};`,
  );

  // After the page script: re-check a pending payment (every 6 s, up to 10
  // times per order), and fill in the join links once they exist.
  const live = hooks.preview
    ? ""
    : `<script>
(function () {
  var r = ${scriptJson(refresh)};
  if (r.state === 'verifying') {
    var key = 'v20_verify_' + r.orderId, n = 0;
    try { n = Number(sessionStorage.getItem(key) || 0); } catch (e) {}
    if (n < 10) setTimeout(function () {
      try { sessionStorage.setItem(key, String(n + 1)); } catch (e) {}
      if (window.MPF && window.MPF.onRefresh) window.MPF.onRefresh(); else location.reload();
    }, 6000);
    return;
  }
  if (r.state !== 'paid') return;
  var o = (window.MPF && window.MPF.order) || {};
  if (o.joinDay1 && o.joinDay2 && o.whatsappGroup) return;
  var tries = 0;
  function setLink(name, url) {
    if (!url) return;
    document.querySelectorAll('[data-link="' + name + '"]').forEach(function (a) {
      a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.removeAttribute('aria-disabled'); a.style.opacity = '';
    });
  }
  (function poll() {
    tries++;
    fetch(r.bookingUrl, { cache: 'no-store' }).then(function (res) { return res.json(); }).then(function (b) {
      setLink('day1', b.joinLinkDay1); setLink('day2', b.joinLinkDay2); setLink('whatsapp', b.whatsappGroupLink);
      if (b.joinLinkDay1 && b.joinLinkDay2) {
        document.querySelectorAll('[data-pending]').forEach(function (e) { e.style.display = 'none'; });
        return;
      }
      if (tries < 20) setTimeout(poll, 3000);
    }).catch(function () { if (tries < 20) setTimeout(poll, 3000); });
  })();
})();
</script>`;
  if (live) html = html.replace(/<\/body>(?![\s\S]*<\/body>)/, `${live}\n</body>`);

  html = fillSessionLength(rewritePaths(fillTokens(html, batch, null)), batch.durationMinutes);

  const head = [`<meta name="referrer" content="same-origin">`];
  if (!hooks.preview) {
    head.push(...trackingTags(common.tracking));
    if (order.state === "paid") {
      head.push(
        purchaseEventScript(common.tracking, {
          orderId: order.orderId,
          contentIds: [common.courseId],
          contentName: MPF_V20_CONTENT_NAME,
          value: order.amountRupees,
          currency: "INR",
        }),
      );
    }
  }
  // Name, email and order ID are on screen: keep the whole page out of Clarity
  // recordings (the v20 template has no <main> to mask on its own).
  return finish(html, head, common).replace("<body>", '<body data-clarity-mask="true">');
}
