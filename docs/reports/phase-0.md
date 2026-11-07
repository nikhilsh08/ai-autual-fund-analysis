# Phase 0 — Discovery report (read-only)

Master Mutual Funds v10 launch. No code was changed in this phase. Paths are relative to `ai-autual-fund-analysis/src/` unless stated.

## Blockers before Phase 1

1. **Part 3 (Owner decisions) is entirely blank.** D1 and D2 are required before Phase 1 per Part 0; D2–D6 before Phase 2; approved copy (C/K/T/W) before Phase 4. No row in the approved-copy tables is marked Approved.
2. **Branch name.** The brief says `feat/mmf-batches-v10`. The site repo already has related work on `feat/master-mutual-funds-v10` (5 commits removing the countdown timer, crossed-out price, "worth ₹" framing, invented testimonials). This phase's branch `feat/mmf-batches-v10` was created from that branch so the prior fixes are kept.
3. **Zoho behaviour is undocumented** for duplicate registration and attendee-limit overflow (see §5). Needs an empirical test against a sandbox webinar before Phase 2 writes retry logic.

## 1. Findings — confirmed or corrected

| # | Status | Evidence |
|---|---|---|
| N1 | Confirmed | `lib/trainer-central.ts:3-4`; `app/(checkout)/order-status/page.tsx:95,105` links and auto-redirects to `/portal-access-guide`. |
| N2 | **Confirmed, worse** | `app/api/payment/cashfree/verify/route.ts:4-22` has no auth and returns `verifyCashfreePayment()` verbatim. That returns `data: localOrder` from `getOrderStatus` (`server/actions/payment.action.ts:121-130`) which includes `lead: true` — full Lead record (email, phone) to anyone with an order ID. |
| N3 | **Confirmed, live source** | 9 source hits: `app/api/zwitch/initiate/route.ts`, `app/api/zwitch/verify/route.ts`, `hooks/useZwitchPayment.ts`, `server/actions/checkout-action.ts`, `Utils/zwitch-utils.ts`, `zwitch.d.ts`, `app/test/page.tsx`, plus references in `app/(checkout)/checkout/page.tsx` and `app/(shop)/cart/page.tsx`. |
| N4 | **Confirmed, worse** | `app/api/admin/is-admin/route.ts:4-37`: no auth; returns 404 (no user) / 403 (user, not admin) / 200 (admin) — an admin oracle and a user-enumeration oracle. |
| N5 | Confirmed | No `ViewContent` or `InitiateCheckout` anywhere. `AddToCart` only in `store/cart-store.ts:61,113`. |
| N6 | **Confirmed, guaranteed** | `components/analytics/MetaPixel.tsx`: init snippet fires `PageView` (line 36) inside `<Script onLoad={() => setLoaded(true)}>`; `useEffect(..., [pathname, loaded])` (lines 11-15) fires `PageView` again as soon as `loaded` flips. Double PageView on every first load. |
| N7 | Confirmed | `app/layout.tsx:132,134` renders both `<GoogleAnalytics>` and `<GoogleTagManager>`. Whether GTM-KDCKBSHF also holds a GA4 tag is OWNER D7. |
| N8 | Confirmed | No email/WhatsApp sending in the site. |
| N9 | Confirmed | `order-status/page.tsx:105` `<RedirectHandler delaySeconds={10} redirectTo="/portal-access-guide">`, unconditional. |
| N10 | Confirmed | `checkout/page.tsx:19,51,105-128,344,413+` — `getUpsellRecommendations` / `showUpsellCard`. |
| N11 | Confirmed | `prisma/schema.prisma:128` `tcCourseId String @unique` (required). Skip-flag `useBatches` is the right approach. |
| N12 | Confirmed | `prisma/schema.prisma:240` `@@unique([userId, courseId])` on `Purchase`. Per-batch records must live in `BatchRegistration`. |
| N13 | Confirmed by plan constraints | OWNER D4. |
| N14 | **Confirmed, one gap + stale comment** | `middleware.ts` is CORS-only; its matcher `/((?!_next/static|_next/image|favicon.ico).*)` does **not** exclude `/api/uploadthing` although its comment says it does. Admin handler audit below. |
| M1 | **Confirmed, root cause found** | `admin-cashflowcrew/src/_authContext/slice.ts:154-168`: `checkAdminAuth()` returns `loginFailure` immediately if the `authjs.csrf-token` cookie is absent (never calls the server), otherwise sends the CSRF token as `Authorization: Bearer` to `GET /api/admin/verify` — **a route that does not exist** in the site. The call 404s → catch → cookie deleted → `loginFailure("Session expired")`. The NextAuth cookie itself is correctly `sameSite:'none', secure:true` (`server/auth/auth.ts:20,22`). Spec 8.1's `GET /api/admin/session` is a new route. |
| M2 | Confirmed | `admin-cashflowcrew/src/App.tsx:49-101`: every `/admin/*` route is unguarded. |
| H1 | **Confirmed (from supplied support.js)** | `support.js` loads `react@18.3.1`, `react-dom@18.3.1`, `@babel/standalone@7.29.0` from unpkg with SRI. `loadReactUmd()` short-circuits if `window.React && window.ReactDOM` already exist; `ensureBabel()` short-circuits on `window.Babel`. Also: `cdnScriptFor(url)` consults `window.__resources[url]` and uses that string as `src` instead — a supported self-hosting hook. |
| H2 | Confirmed | `index.html`: `./support.js`, `motion.js`, `assets/*.webp`, all relative. |
| H3 | Confirmed exactly | `{price}` ×9, `{class date}` ×4, `{booking close date}` ×1. Props in `<script type="text/x-dc" data-props>`: `seatsLeft` (int, default 50), `startTime`, `language`, `showAnnouncementBar`, `showStickyCta`. |
| H4 | **Confirmed — lives in index.html, not support.js** | `renderVals()` is in the `<script type="text/x-dc" data-dc-script>` block at the end of `index.html`. It computes `seatsText` ("{N} of 50 seats left in this batch."), `barSeats`, `stickyLine`, `lowSeats`/`notLowSeats`. Editable without touching `support.js`. |
| H5 | Confirmed | `index.html`: `<a href="#" data-checkout="1">` in `#admission`. |
| H6 | Confirmed | No `fbq`, `gtag`, `dataLayer` or GTM snippet in `index.html`, `motion.js` or `support.js`. |
| H7 | Cannot verify from repo | `mmf-landing-v10/guides/` is empty (correct per hard rule 5). Guide 5's title fix must be done on the designer's original, outside any repo. |

### Admin API handler audit (`app/api/admin/**`, 26 route files)

| Routes | Auth |
|---|---|
| all-users-transaction, blogs, blogs/[id], coupons/all, dashboard-stats, get-all-users, masterclass/* (6), notifications/[courseId], payment-analytics, registration-trends, session-analytics, users-with-all-transactions, users | `verifyAdmin()` (`lib/auth-admin.ts:4-24`, re-checks DB role) |
| bundles, bundles/[bundleId], category, cloudinary, coupons, coupons/[couponId], images, orders, orders/[id] | `auth()` + inline `session?.user?.role !== "ADMIN"` |
| **is-admin** | **none** (N4) |

`GET /api/admin/session` and `GET /api/admin/verify` do not exist.

### Additional findings not in the brief

- **`BACKEND.md` is stale.** It specifies the old 50-seat model (`seatsLeft`, "Checkout must stop at 50", "{N} of 50 seats left"). Part 2 rule 8 and Part 3 "no seat limit" supersede it. Treat as historical context only.
- **`support.js` was missing from the handoff folder** when discovery started (only `motion.js` was present). The owner supplied it in chat; it has been saved to `mmf-landing-v10/support.js`. Nothing in the handoff should be edited there — it is source material.
- **`support.js` re-fetches the page.** `boot()` does `fetch(location.href)` when `window.__resources` is unset, so every landing-page load makes a second request to the route handler. The route handler can set `window.__resources = {}` in an inline script before `support.js` to suppress this, or rely on the `s-maxage=60` cache. Decide in Phase 4.
- **`support.js` uses `new Function(...)`** (`evalDcLogic`, x-import loader). If the site ever adds a CSP, it needs `'unsafe-eval'` on this route. No CSP exists today.
- **Google Fonts** are loaded via `<link>` in the `<helmet>` block of `index.html` (fonts.googleapis.com) — an external request not listed in H1.
- `/#about`: `src/components/footer.tsx` links it, but no `id="about"` element was found on the home page. Returns 200 but may not scroll. Needs a live check.
- `app/api/uploadthing` is matched by the CORS middleware despite the comment saying otherwise (harmless today, but the comment is wrong).

## 2. Purchase flow today (workshop)

`app/(marketing)/master-mutual-funds/page.tsx` (confirmed **page.tsx** — a `route.ts` cannot share the segment, so Phase 4 must move it out) → "Enroll" → `app/(checkout)/checkout/page.tsx` → `POST /api/payment/cashfree/initiate` (`app/api/payment/cashfree/initiate/route.ts`, server computes price, creates Order/OrderItem/Lead) → Cashfree modal (`redirectTarget: "_modal"`) → `app/payment/callback/page.tsx` → `/order-status?order_id=` → `PurchaseEvent` (Pixel + GA4, eventID = orderId) → 10 s redirect to `/portal-access-guide` (TrainerCentral sign-up: invite email → form + password + captcha → OTP → ₹0 checkout).

Server: `POST /api/payment/cashfree/webhook` (HMAC check) → `verifyCashfreePayment()` (`server/actions/payment.action.ts`): transaction marks Order PAID, Lead → User, upserts Purchase, logs PaymentTransaction; then TrainerCentral enrol, Meta CAPI Purchase, coupon `usedCount`.

Pages before payment: 2 + modal. Pages after: 1, then a 5-step second sign-up. Repeat purchase of the same course is blocked structurally by N12, not by an explicit check in `initiate`.

## 3. API route inventory (`app/api/`)

| Route | Methods | Auth |
|---|---|---|
| auth/[...nextauth] | * | NextAuth |
| auth/login, auth/register | POST | none (login/registration) |
| blogs, courses | GET | none (public, intentional) |
| payment/cashfree/initiate | POST | none (public checkout; server decides price) |
| payment/cashfree/verify | POST | **none — N2** |
| payment/cashfree/webhook | POST | Cashfree `x-webhook-signature` HMAC |
| uploadthing | * | UploadThing-managed |
| zwitch/initiate, zwitch/verify | POST | **none — N3, remove** |
| admin/** | various | see §1 table |

## 4. Technical checks

- **Bundling the HTML template on Vercel:** reading `src/landing/mmf-v10.html` with `fs` at request time requires `outputFileTracingIncludes` in `next.config.ts` for the route handler; verify in Phase 4 with a production build (`next build` + inspect `.next/server/app/(landing)/master-mutual-funds/route.js.nft.json`).
- **Self-hosting React/ReactDOM/Babel (spec 5.3):** two supported paths — (a) preload `/mmf/vendor/react.production.min.js` and `react-dom.production.min.js` as plain `<script>` tags before `support.js` so `window.React`/`window.ReactDOM` exist; or (b) set `window.__resources = { "<unpkg url>": "/mmf/vendor/<file>" }` for all three. Babel is only loaded lazily by `x-import`, which this page does not use, so (a) is sufficient. Neither requires editing `support.js`.
- **Lenis:** `motion.js` loads `https://unpkg.com/lenis@1.1.13/dist/lenis.min.js` only for fine-pointer devices. Spec 5.1 says change only that URL to `/mmf/vendor/lenis.min.js`.
- **Admin session cookie:** cookie attributes are correct; the fix is client gating + a new `GET /api/admin/session` route (spec 8.1/8.3).
- **Footer URLs:** route segments for `/contact-us`, `/privacy-policy`, `/terms-conditions`, `/refund-policy`, `/delivery-policy` exist under `app/(marketing)/`. `/#about` anchor target not found — live check needed.

## 5. Zoho Webinar API

From the official API reference:

- **Register:** `POST https://webinar.zoho.com/api/v2/{zsoid}/register/{webinarKey}.json?instanceId=&sendMail=` with scope `ZohoWebinar.webinar.CREATE`. **Correction to spec 3.4:** the body is `{"registrant": [{ "email", "firstName", "lastName" }]}` — an array under `registrant`, not a flat object. Response: array of registrants each with `joinLink` and `email`, plus `successCount` / `failedCount` / `totalCount` / `registeredCount`.
- **List registrants:** `GET https://webinar.zoho.com/api/v2/{zsoid}/registration/{webinarKey}` with scope `ZohoWebinar.webinar.READ`; returns `registrants[]` with `joinLink`, `email`, `approvalStatus`. No `instanceId` param is documented on this endpoint (docs are inconsistent with the register endpoint).
- **India data centre:** not documented explicitly on the pages reachable. The codebase's TrainerCentral client uses `accounts.zoho.in` + `trainercentral.zoho.in`, and sample join links are on `meeting.zoho.in`, so `webinar.zoho.in` is the expected base — **confirm against the owner's org before Phase 2** (OWNER D2).
- **Duplicate registration and attendee-limit behaviour: undocumented.** `failedCount` in the register response is the likely signal, but what counts as a failure (duplicate email? limit reached?) is not stated. Test both cases on a sandbox webinar and record the exact responses before writing `zoho-webinar.ts` retry logic.
- **Two-day batch mapping — recommendation:** keep spec section 2's schema (`zohoWebinarKeyDay1/Day2` required for OPEN batches, `zohoInstanceIdDay1/Day2` optional). Default to **two independent one-time webinars per batch** with `instanceId = null`. Use `instanceId` only if the owner already runs a long-lived recurring series. Reason: one-time webinars are the simplest to create per 14-day cycle and avoid the undocumented recurring-instance edge cases.

## 6. Handoff folder (`mmf-landing-v10/`)

Present: `index.html`, `motion.js`, `support.js` (added from owner's paste), `assets/` (14 WebP/PNG), `BACKEND.md`, `CONTENT-RULES.md`, `README.md`. `guides/` is empty. The folder is not a clean git checkout (git status walks the user profile) — treat it as plain source material and never run git commands inside it.

## 7. What was not verified

- Live HTTP 200 checks of footer URLs (no running server in this phase).
- Whether GTM-KDCKBSHF contains a GA4 tag (OWNER D7).
- Clarity masking level (OWNER D8).
- Zoho `.in` base URL, duplicate-registration response, attendee-limit response (needs sandbox).
- Vercel plan (OWNER D4).
- Whether `admin-collabroot` / `cashflowcrew-backend` / `CashFlowCrew` are still deployed (OWNER D10). A separate fix on `cashflowcrew-backend` (registration dedup scoped to `{email, Event}`) was made earlier today on request and is not part of this brief's branch.

## 8. Open questions for the owner

- D1, D2 (and its five sub-questions), D3–D13 — all blank.
- Approved copy C1–C5, K1–K2, T1–T8, W1–W4 — none marked.
- Keep `feat/mmf-batches-v10` based on `feat/master-mutual-funds-v10` (current), or rebase onto `main`?
- May Phase 1 also remove `app/test/page.tsx` (it only exists to exercise Zwitch)?
