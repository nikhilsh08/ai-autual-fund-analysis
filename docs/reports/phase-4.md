# Phase 4 — Visitor-facing (spec 4, 5, 6, 7, 9)

Visitor-facing text comes only from the brief's drafts, held in `src/lib/mmf-copy.ts`. Two items the brief did not cover are listed under "Needs owner sign-off".

## Files changed

| Area | Files |
|---|---|
| Copy | `src/lib/mmf-copy.ts` — C2–C5, K1–K2, T1–T8 verbatim |
| Tracking (spec 4) | `src/lib/analytics/track.ts` (ViewContent/InitiateCheckout + view_item/begin_checkout via gtag or dataLayer); `src/components/analytics/MetaPixel.tsx` (PageView fires once per page: the init snippet handles the first load, the effect only client-side route changes — N6); `src/app/layout.tsx` (direct GA4 disabled when `NEXT_PUBLIC_GA4_VIA_GTM=true` — N7/D7) |
| Landing (spec 5) | `src/landing/mmf-v10.html` (copy of the handoff with: `renderVals()` without seats, `seatsLeft` prop removed, C1 sentence removed, C4 FAQ sentence, asset paths → `/mmf/…`); `public/mmf/{support.js, motion.js, assets/}`; `public/mmf/vendor/{lenis.min.js, react.production.min.js, react-dom.production.min.js}` (motion.js now loads Lenis from `/mmf/vendor/`); `src/lib/landing/render.ts` (token fill, props, checkout link, head injection, UTM capture, ViewContent, C5 fallback, final token guard); `src/app/(landing)/master-mutual-funds/route.ts` (GET, 60 s cache, DB-error fallback with 30 s cache); old `page.tsx` moved to `src/legacy/master-mutual-funds/page.tsx`; `next.config.ts` (`outputFileTracingIncludes`); `.gitignore` (`handoff/`, PDFs under `src/landing` and `public/mmf`) |
| Checkout (spec 6) | `src/app/(checkout)/checkout/page.tsx` — reads `batchId`, loads the current batch for `useBatches` courses (uses the current one if the requested batch is no longer on sale), price from the batch, K1 line, K2 consent checkbox (unticked), upsell hidden on the batch path (N10), `batchId` + `whatsappOptIn` sent to initiate, InitiateCheckout once, `data-clarity-mask="true"` on the form container |
| Thank-you (spec 7) | `src/components/checkout/WorkshopThankYou.tsx` (T1–T8, join buttons once links exist, polls `/api/orders/[orderId]/booking` every 3 s up to 60 s, WhatsApp group, `.ics` + Google Calendar links, no redirect); `src/app/(checkout)/order-status/page.tsx` renders it for batch orders; `PurchaseEvent` unchanged; `/portal-access-guide` no longer linked from workshop orders |
| Survey (spec 9) | wired in Phase 2 (W4 + `surveyUrl`) |
| Tests | `tests/phase4/landing.test.ts` (7), `tests/phase4/track.test.ts` (3) |

`support.js` was not edited. `motion.js` changed only in the Lenis URL.

## Verified

| Check | Result |
|---|---|
| `npx tsc --noEmit` | pass |
| `npm run build` | pass — `/master-mutual-funds` is now a dynamic route handler |
| `npm test` | 18 files, 81 tests |
| `eslint --quiet` on changed files | pass |

Landing-route tests: rendered output has no `{price}` / `{class date}` / `{booking close date}`; has the checkout link with `batchId`; has the Pixel, GTM, GA4 and Clarity IDs; self-hosted React loads before `support.js`; `window.__resources` is set; none of "of 50 seats left", "limited to 50 attendees", "50 seats per batch", "24 hours before the start", "seatsLeft"; C2/C3/C4 present; props carry the batch start time and language; GTM mode uses `dataLayer`; the no-sale fallback shows C5, drops the checkout button and still fills every token; values are HTML-escaped; a missing `support.js` tag is refused.

## Not verified

- **Browser checks** (Playwright at 320/390/1280 px, Lighthouse mobile, Meta Test Events, GA4 DebugView): no running site with a database was available. These remain for the owner/developer on staging; the landing HTML is deterministic from the template, so the unit tests cover the content rules.
- Whether `support.js` renders correctly with the pre-loaded React build (it checks `window.React && window.ReactDOM` and skips its own CDN load; verified by reading the code, not in a browser).
- Vercel bundling of `src/landing/mmf-v10.html` (`outputFileTracingIncludes` added; confirm on the first preview deploy).
- `/#about` anchor target on the home page (flagged in Phase 0).
- Guide 5 PDF metadata title: the PDFs are not in any repo; the designer's original must be updated outside the repo (spec 5.4).

## Needs owner sign-off

- "to be announced" for the date tokens when nothing is on sale (`MMF_COPY.landing.dateToBeAnnounced`).
- Page `<title>`/description carried over from the old page ("Master Mutual Funds | Invest Smarter" / "…wealth-generating portfolio") — slogan-like under CONTENT-RULES.
- K2 unticked by default.
- `/checkout` coupon preview does not yet pass `batchId` to `validateCoupon`; a batch-scoped code can preview as valid and then be refused by the server with "Coupon not applicable". Cosmetic; one-line follow-up if batch-scoped codes are used.
