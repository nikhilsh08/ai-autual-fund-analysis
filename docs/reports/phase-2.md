# Phase 2 — Batches, pricing, Zoho, WhatsApp, jobs (spec 2, 3, 10, 11)

Site backend only; no visitor-facing change. Part 3 was blank, so every default used is recorded in `docs/OWNER_DECISIONS.md`.

## Files changed

| Area | Files |
|---|---|
| Data model | `prisma/schema.prisma` — `Batch`, `BatchSettings`, `BatchRegistration`, `BatchStatus`, `RegistrationState`; `Course.useBatches`, `OrderItem.batchId`, `Order.whatsappOptIn`, `Coupon.applicableBatchIds`; plus `BatchRegistration.zohoAlertedAt` (not in the spec; needed so the 30-minute failure alert fires once). `prisma generate` run; **no `db push` was run** (staging only, by the owner). |
| IST + schedule helpers | `src/lib/ist.ts`, `src/lib/batches/schedule.ts` (`nextDay1Dates`, `computeBatchTimes`, `pickCurrentBatch`, `isOnSale`), `src/lib/batches/current.ts` (`getCurrentBatch`), `src/lib/batches/display.ts` (visitor-safe fields), `src/lib/batches/reminders.ts` (W2/W3/W4 windows) |
| Pricing | `src/lib/pricing.ts` (`applyCoupon`, `couponAppliesTo`, `roundRupees`) — now the single source for both the checkout preview (`validateCoupon`) and the charge (`initiate`) |
| Checkout | `src/app/api/payment/cashfree/initiate/route.ts` — optional `batchId`/`whatsappOptIn` (zod); batch course must be alone; batch must be OPEN and before close (409 `batch_not_on_sale`); line price = `batch.priceRupees`; `OrderItem.batchId`; coupon batch scope; repeat buyers not blocked |
| Post-payment | `src/server/actions/payment.action.ts` — `BatchRegistration` upsert inside the transaction (keyed on `orderId`); TrainerCentral skipped for `useBatches` courses; after commit: Zoho registration then W1, each non-throwing |
| Zoho Webinar | `src/lib/zoho-webinar.ts` — refresh-token OAuth (`ZW_*`, `.in` by default), `POST /api/v2/{org}/register/{key}.json` with the array `registrant` body, `sendMail` + optional `instanceId`, day-1 link persisted before day 2, registrant-list fallback for duplicates, idempotent on `REGISTERED`, short error codes only |
| WhatsApp | `src/lib/whatsapp/` — `provider.ts` interface, `dry-run.ts` (default outside production), `interakt.ts` adapter, `index.ts` (E.164 normalisation, provider selection, template names), `templates.ts` (W1–W4 param order from the brief) |
| Messaging | `src/lib/batches/messaging.ts` (W1 send, idempotent via `msgConfirmationAt`), `src/lib/batches/registration.ts` (post-payment orchestration) |
| Jobs | `src/lib/batches/jobs.ts` — `runBatchesJob` (close, complete, auto-create, alerts) and `runMessagesJob` (Zoho retry with backoff, 30-minute alert, W1/W2/W3/W4 by window), both with injectable deps; `src/lib/alerts.ts`; `src/lib/cron-auth.ts` |
| Endpoints | `GET /api/batches/current?courseId=`, `GET /api/orders/[orderId]/booking`, `GET /api/batches/[id]/ics?order=`, `GET /api/cron/batches`, `GET /api/cron/messages` |
| Scheduler | `vercel.json` — daily batches cron at 00:30 UTC (06:00 IST). Messages job is **not** in `vercel.json` (Hobby allows only daily); see OWNER_DECISIONS D4 |
| Seed | `scripts/seed-mmf-batches.ts` — takes `MMF_*` arguments, validates the Saturday, sets `useBatches`, creates `BatchSettings` and batch 1 as DRAFT; `tsconfig.json` gains `allowImportingTsExtensions` so Node can run it directly |
| Tests | `tests/phase2/*.test.ts` (10 files, 46 tests) |

## Verified

| Check | Result |
|---|---|
| `npx prisma generate` | pass |
| `npx tsc --noEmit` | pass |
| `npm run build` | pass; all five new routes registered as dynamic |
| `npm test` | 15 files, 61 tests pass (Phase 1 + Phase 2) |
| `eslint --quiet` on Phase 2 files | pass (fixed the pre-existing `prefer-const` in `initiate/route.ts`) |

Tests, by spec item (section 11):

- Unit: IST helpers (D13 formats); `nextDay1Dates`; `pickCurrentBatch` boundary at close time; price with batch + coupon (`applyCoupon`, batch scope); phone normalisation; reminder window calculations; ICS output; cron secret.
- Integration (mocked Prisma, Cashfree, Zoho, WhatsApp): `initiate` rejects a closed batch, a missing `batchId`, a batch mixed with bundles, charges the batch price and ignores a client `amount`, records `batchId` + `whatsappOptIn`, applies batch-scoped coupons, does not block a repeat buyer; `verifyCashfreePayment` processed twice → one registration, one Zoho/W1 trigger, no TrainerCentral call for the batch course, TrainerCentral still called for a recorded course; Zoho registration is idempotent, registers both days on `webinar.zoho.in` with the array body, falls back to the registrant list, records short errors; messages job sends W2 once across runs, sends W4 with `?batch=<n>`, skips invalid phones, retries Zoho with backoff, alerts once after 30 minutes; batches job closes, auto-creates without overwriting, alerts when nothing is on sale.

## Not verified

- No database was available: `prisma db push` against staging, the seed script, and `getCurrentBatch` against real data remain to be run by the owner/developer.
- Zoho: duplicate-registration and attendee-limit responses are undocumented; the code handles a missing join link by reading the registrant list, but the real response shape must be checked on a sandbox webinar before go-live.
- Interakt request format is from provider documentation, not exercised against a live account. `DRY_RUN` stays on until `DRY_RUN=false`.
- Alert email delivery (Resend/webhook) was not sent.

## Decisions to confirm (see `docs/OWNER_DECISIONS.md`)

- `futureBatchCount` keeps *N* upcoming batches in total (the one currently on sale counts).
- W1/W2 carry the **Saturday** join link; W3 carries each day's own link. If one webinar should serve both days, set the same key for day 1 and day 2.
- `BatchRegistration.zohoAlertedAt` added to the schema.
- `whatsappOptIn` is stored on both `Order` (from checkout) and `BatchRegistration` (snapshot at payment).

## Open questions

- Zoho org, keys and data centre; WhatsApp provider and templates; scheduler; batch defaults — all still needed from the owner (OWNER_DECISIONS).
- Should the admin be able to trigger `runBatchesJob` manually? (Not in spec; easy to add in Phase 3 if wanted.)
