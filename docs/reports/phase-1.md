# Phase 1 — Safety fixes (spec 3.8, 8.3)

No visitor-facing change except one footer string (see "Needs owner sign-off"). Paths are relative to each repo root.

## Files changed

### ai-autual-fund-analysis

| Change | File | Finding |
|---|---|---|
| Response narrowed to `{ success, status }` | `src/app/api/payment/cashfree/verify/route.ts` | N2 |
| Deleted | `src/app/api/zwitch/initiate/route.ts`, `src/app/api/zwitch/verify/route.ts`, `src/hooks/useZwitchPayment.ts`, `src/server/actions/checkout-action.ts`, `src/Utils/zwitch-utils.ts`, `zwitch.d.ts`, `src/app/test/page.tsx` | N3 |
| Zwitch import, hook and dead `if (zwitchPayment)` branch removed; `let` → `const` on `checkOutOptions` | `src/app/(checkout)/checkout/page.tsx` | N3 |
| "Secure checkout powered by Zwitch" → "… powered by Cashfree" | `src/app/(shop)/cart/page.tsx` | N3 |
| `zwitch.d.ts` removed from `include` | `tsconfig.json` | N3 |
| Zwitch references removed from the tree listing and API notes | `README.md` | N3 |
| Deleted (committed lint dump that mentioned Zwitch) | `lint_output_utf8.txt` | N3 |
| Constant response for every email; 10 requests/min per IP, 429 with `Retry-After` | `src/app/api/admin/is-admin/route.ts` | N4 |
| New in-memory limiter | `src/lib/rate-limit.ts` | N4 |
| New: `GET /api/admin/session` → `verifyAdmin()`; 401 or `{ user }`; `Cache-Control: no-store` | `src/app/api/admin/session/route.ts` | M1 |
| Matcher comment corrected (it never excluded `/api/uploadthing`); matcher unchanged | `src/middleware.ts` | N14 |
| vitest added; `npm test` script | `package.json`, `package-lock.json`, `vitest.config.ts` | tests |
| Tests | `tests/phase1/*.test.ts` | all |

### admin-cashflowcrew

| Change | File | Finding |
|---|---|---|
| `checkAdminAuth` calls `GET /api/admin/session` with the NextAuth cookie (`withCredentials`); no CSRF-cookie gating, no `Authorization: Bearer`, no `localStorage`. `loginAdmin` drops the `is-admin` pre-check and confirms the admin role via the session endpoint after `/api/auth/login`. New `authChecked` state flag. `AppDispatch` typed as `ThunkDispatch` (was `any`). | `src/_authContext/slice.ts` | M1 |
| New route guard: holding state until the session check resolves, `<Navigate to="/">` when not authenticated | `src/components/RequireAdmin.tsx` | M2 |
| Every `/admin/*` route wrapped in `RequireAdmin`; session check runs once at app level; axios 401 interceptor logs out and redirects to `/` (login and session calls excluded) | `src/App.tsx` | M1, M2 |
| vitest + jsdom + Testing Library; `npm test` script | `package.json`, `package-lock.json`, `vitest.config.ts` | tests |
| Tests | `src/__tests__/auth-slice.test.ts`, `src/__tests__/RequireAdmin.test.tsx` | M1, M2 |

## What was verified and how

| Check | Site | Admin |
|---|---|---|
| `npx tsc --noEmit` / `tsc -b` | pass (after `next build` regenerated `.next/types`, which still referenced the deleted routes) | pass |
| `npm run build` | pass | pass |
| `npm run lint` | 7 errors, 73 warnings — all pre-existing, none in files added here (list below) | 49 errors, 7 warnings — all pre-existing; the Phase 1 files lint clean (`eslint --quiet` on them exits 0) |
| `npm test` | 5 files, 10 tests pass | 2 files, 8 tests pass |

Tests prove each fix:

- **N2** `tests/phase1/verify-route.test.ts` — with `verifyCashfreePayment` mocked to return a Lead (email, phone), the response body is exactly `{ success, status }`; 400 on failure; 400 without `orderId`.
- **N3** `tests/phase1/no-zwitch.test.ts` — walks the repo (excluding `node_modules`, `.git`, `.next`, `docs`) and asserts no file matches `/zwitch/i`. Passes.
- **N4** `tests/phase1/is-admin-route.test.ts` — identical status and body for an admin, a non-admin and an unknown email; 429 with `Retry-After` on the 11th request from one IP within a minute; a different IP is unaffected.
- **N14** `tests/phase1/admin-routes-auth.test.ts` — every `src/app/api/admin/**/route.ts` (26 files) contains `verifyAdmin(` or `auth()` + an `ADMIN` role check; only `is-admin/route.ts` is on the public allowlist.
- **M1** `src/__tests__/auth-slice.test.ts` — `checkAdminAuth` hits `/api/admin/session` with `withCredentials: true`, dispatches `loginSuccess` on 200 and a silent `loginFailure("")` on 401; `loginAdmin` fails with "This account does not have admin access." when login succeeds but the session endpoint returns 401; bad credentials surface the login endpoint's error.
- **M2** `src/__tests__/RequireAdmin.test.tsx` — holding state before the check, redirect to `/` when unauthenticated, children rendered when authenticated.
- **M1 session route** `tests/phase1/session-route.test.ts` — 401 without an admin; `{ user }` shape with no password-like fields and `Cache-Control: no-store`.

## Pre-existing lint errors left untouched (site)

`drop-index.js:1` (`require()` import), `src/app/api/payment/cashfree/initiate/route.ts:28` (`prefer-const`), `src/app/payment/callback/page.tsx:19`, `src/components/NotifyModal.tsx:24`, `src/hooks/use-store.ts:11` (setState in effect), `src/components/templates/master-mutual-funds/components/PaymentIframe.tsx:20` (use before declare). None are on the workshop path changed in this phase; `PaymentIframe.tsx` belongs to the old template that Phase 4 replaces.

## What could not be verified

- Cross-site cookie behaviour from the admin domain in a browser (needs the deployed admin origin in `ADMIN_PANNEL_URL` / the middleware allowlist and a real NextAuth session). The cookie attributes (`sameSite: 'none', secure: true`) were confirmed correct in Phase 0; the unit tests cover the client logic.
- Rate limiting across multiple serverless instances: the limiter is per instance by design (best effort). An edge limiter would be needed for a hard guarantee.
- Logout does not end the NextAuth session server-side (unchanged from before: the old code removed a CSRF cookie, which never ended the session either). Clearing the `authjs.session-token` cookie requires a sign-out call through NextAuth; recommended as a follow-up, not part of this phase.

## Needs owner sign-off

- `src/app/(shop)/cart/page.tsx`: "Secure checkout powered by Zwitch" → "Secure checkout powered by Cashfree". This is visitor-facing text on the cart page (not the workshop path). The old sentence was false once Zwitch was removed, and spec 3.8 requires zero `zwitch` references. If you prefer "Secure checkout" with no vendor name, say so.
- `lint_output_utf8.txt` was deleted (a committed ESLint dump). It is recoverable from git history.
- `package-lock.json` in both repos carries pre-existing uncommitted dependency bumps from an earlier `npm install` (site: ~1.7k lines; admin: 35 `"peer": true` removals). Adding vitest rewrote the lockfile, so those bumps are now part of this commit. Review the lockfile diff if that matters.

## Open questions

- `docs/reports/*.md` mention "Zwitch" when describing its removal; the no-zwitch test excludes `docs/`. Confirm that is acceptable for the definition of done.
- Should `AdminLayout.tsx:21` and `Dashboard.tsx:50,371` drop their now-dead `localStorage.removeItem('authjs.csrf-token')` lines? Harmless today; left for a smaller diff.
- D2–D6 are still blank and block Phase 2 (Zoho data centre, attendee limit, who creates webinars, `sendMail`; WhatsApp provider; scheduler; batch defaults; coupon scope).
