# Phase 3 — Admin (spec 8.1, 8.2)

Admin API on the site and three new screens in `admin-cashflowcrew`. No visitor-facing change.

## Files changed — site

| File | Purpose |
|---|---|
| `src/lib/batches/admin.ts` | zod schemas (`batchCreateSchema`, `batchPatchSchema` strict whitelist, `batchSettingsSchema`), `createBatch`, `patchBatch` (recomputes day 1/2 and close when timing fields change), `openBatch` (price > 0, both Zoho keys, WhatsApp link or default, close in the future), `closeBatch`, `listBatches` (`bookedCount` from PAID order items, `isOnSaleNow`, Zoho/WhatsApp readiness, pending/failed counts), `listGuests` + totals, `upsertBatchSettings`, `settingsPreview` (next 3 Saturdays) |
| `src/lib/batches/csv.ts` | RFC 4180 escaping plus formula-injection guard |
| `src/app/api/admin/batches/route.ts` | GET list, POST create (always DRAFT) |
| `src/app/api/admin/batches/[id]/route.ts` | PATCH whitelisted fields |
| `src/app/api/admin/batches/[id]/open/route.ts`, `close/route.ts` | status transitions |
| `src/app/api/admin/batches/[id]/guests/route.ts` | JSON with totals, or `?format=csv` → `batch-<n>-guests.csv` |
| `src/app/api/admin/registrations/[id]/retry-zoho/route.ts` | manual Zoho retry + W1 attempt; never returns join links |
| `src/app/api/admin/batch-settings/route.ts` | GET (settings + courses with `useBatches`) / PUT |
| `src/server/actions/coupon.action.ts` | `createCoupon` accepts `applicableBatchIds` |
| `tests/phase3/admin-batches.test.ts` | 10 tests |

Every handler calls `verifyAdmin()` first; the Phase 1 audit test (`tests/phase1/admin-routes-auth.test.ts`) now covers 33 handlers.

## Files changed — admin-cashflowcrew

| File | Purpose |
|---|---|
| `src/components/BatchesManagement.tsx` | Batches table: number, Saturday, booking close (IST), start, language, price, booked, status + on-sale badge, Zoho/WhatsApp readiness; New / Edit dialog, Open, Close, Guests. No seats field, no countdown. |
| `src/components/GuestList.tsx` | Search, Zoho-state filter, totals (booked, pending, failed, revenue), message-status columns, Retry Zoho, Download CSV |
| `src/components/BatchSettingsPage.tsx` | All `BatchSettings` fields; preview of the next 3 Saturdays after load/save |
| `src/components/CouponsManagement.tsx` | Optional batch scope (empty = all batches) in the form and list |
| `src/components/AdminSidebar.tsx` | "Batches" and "Batch settings" entries |
| `src/App.tsx` | Routes `/admin/batches`, `/admin/batches/:id/guests`, `/admin/batch-settings`, all inside `RequireAdmin` |
| `src/lib/istFormat.ts` | IST display helpers (`Intl` with `Asia/Kolkata`) |
| `vitest.config.ts` | `@` alias (was only in `vite.config.ts`) |
| `src/__tests__/BatchesManagement.test.tsx` | renders the list with readiness and no seat text |

## Verified

| Check | Site | Admin |
|---|---|---|
| Type-check | pass | pass (`tsc -b`) |
| Build | pass — 7 new admin routes registered | pass |
| Tests | 16 files, 71 tests | 3 files, 9 tests |
| Lint (changed files) | pass | pass; 6 pre-existing errors remain in untouched lines of `AdminSidebar.tsx` (36, 38, 353, 492) and `CouponsManagement.tsx` (92, 187) |

Tests prove: non-admins get 403 on every handler; create computes times and batch number and refuses non-Saturdays; open refuses without keys/link and accepts with the default group link; PATCH rejects non-whitelisted fields and recomputes times; list exposes `bookedCount` and readiness without any seat field; CSV is escaped (quotes, commas, formula prefix) and named `batch-<n>-guests.csv`; search/state filters and totals; CSV helpers.

## Not verified

- Screens were not exercised in a browser against a running site (no database available). The RTL test covers list rendering only; the dialog, open/close and CSV download paths are untested in the DOM.
- CSV download relies on a top-level navigation to the site domain carrying the `SameSite=None` session cookie; confirm on the deployed admin origin.

## Decisions to confirm

- `PATCH` recomputes `bookingCloseAt` from `closeHoursBefore` (or keeps the current hours-before gap) when the Saturday or start time changes.
- Reopening a CLOSED batch is allowed if its booking close time is still in the future; COMPLETED batches cannot be reopened.
- Manual "Retry Zoho" also attempts W1 immediately after a successful registration.
