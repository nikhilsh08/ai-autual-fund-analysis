# Phase 5 — Final verification and release notes

Release notes for the owner: `docs/RELEASE_NOTES.md`. Defaults used for blank owner decisions: `docs/OWNER_DECISIONS.md`.

## Section 11 checks, re-run on the final branch

| Check | Site (`ai-autual-fund-analysis`) | Admin (`admin-cashflowcrew`) |
|---|---|---|
| Type-check | `tsc --noEmit` pass | `tsc -b` pass |
| Build | `next build` pass (`/master-mutual-funds` route handler, 12 new API routes) | `vite build` pass |
| Tests | 18 files, 81 tests pass | 3 files, 9 tests pass |
| Lint | 0 errors in files added or changed by this work; 5 pre-existing errors remain in untouched files (`drop-index.js`, `src/app/payment/callback/page.tsx`, `src/components/NotifyModal.tsx`, `src/components/templates/master-mutual-funds/components/PaymentIframe.tsx`, `src/hooks/use-store.ts`); `public/mmf/**` (vendored runtime) is now ignored | 0 errors in changed files; 6 pre-existing errors in untouched lines |
| `zwitch` search | nothing outside `docs/` and the guard test | — |
| Admin-role audit | all 36 `/api/admin/**` handlers call `verifyAdmin()` or `auth()` + role check; only `is-admin` is intentionally public (constant response, rate limited) | — |

## Definition of done (spec 13)

| Item | Status |
|---|---|
| Builds, lint and type checks pass in both repos | Builds and type checks pass; lint passes for all changed files (pre-existing errors listed above and in each phase report) |
| Section 11 tests pass | Unit and integration tests pass. Landing-route content tests pass. Playwright, Lighthouse, Meta Test Events, GA4 DebugView and the Cashfree sandbox run need a staging deploy with a database — listed in `RELEASE_NOTES.md` §11 |
| No public endpoint exposes personal data or links before payment | `verify` returns `{success,status}`; `booking` returns links only when PAID and never email/phone; `ics` includes links only for a PAID order of that batch; `batches/current` returns display fields only |
| No endpoint trusts a client amount | `initiate` computes the price from `Course.price` or `Batch.priceRupees`; batch orders must be alone; tests prove a client `amount` is ignored |
| Cashfree is the only payment code path | repo search for `zwitch` returns nothing in code; checkout calls only `/api/payment/cashfree/initiate` |
| Workshop buyers never see TrainerCentral sign-up | `useBatches` courses skip enrolment; workshop thank-you view has no portal link; join links come from Zoho Webinar |
| Other products unchanged | recorded courses/bundles still enrol in TrainerCentral (tested); non-batch thank-you flow and redirect unchanged; cart/checkout for non-batch items unchanged except the removed Zwitch branch |
| Phase reports in `docs/reports/` | phase-0 … phase-5 |

## Launch Plan checklist items that remain manual

- One PageView, ViewContent, InitiateCheckout, one deduplicated Purchase in Meta Test Events.
- Zoho registrant appears on the test webinar; W1 in dry run then with a real test number.
- No TrainerCentral call for the workshop; recorded course still enrols.
- `prisma db push` on staging and production; seed script; open the first batch in admin.

## Everything still needed from the owner

Listed in `docs/OWNER_DECISIONS.md` (accounts, batch defaults, copy sign-off, scheduler, old-stack decision) and in the "Needs owner sign-off" sections of `docs/reports/phase-1.md`, `phase-2.md` and `phase-4.md`.
