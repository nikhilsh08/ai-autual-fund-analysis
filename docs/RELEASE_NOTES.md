# Master Mutual Funds v10 — release notes for the owner

Everything below is what has to happen outside the code before the workshop can be sold in batches. Defaults chosen while Part 3 was blank are in `docs/OWNER_DECISIONS.md`; phase reports are in `docs/reports/`.

## 1. Pull requests (merge in this order)

**ai-autual-fund-analysis** (stacked; each targets the previous one):
1. #10 Phase 0 — discovery report
2. #11 Phase 1 — safety fixes (verify leak, Zwitch removal, is-admin, admin session route)
3. #12 Phase 2 — batches, Zoho Webinar, WhatsApp, jobs
4. #13 Phase 3 — batch admin API
5. #14 Phase 4 — landing route, tracking, workshop checkout and thank-you
6. Phase 5 — release notes (this document)

**admin-cashflowcrew**:
1. #2 Phase 1 — session restore + route guard
2. #3 Phase 3 — Batches, Batch settings, Guest list screens

Deploy the **site first**, then the admin panel (the panel calls `/api/admin/session` and the batch endpoints).

## 2. Environment variables to add (Vercel → site project)

| Variable | Purpose |
|---|---|
| `CRON_SECRET` | Bearer secret for `/api/cron/batches` and `/api/cron/messages`. Vercel Cron sends it automatically. |
| `ZW_CLIENT_ID`, `ZW_CLIENT_SECRET`, `ZW_REFRESH_TOKEN`, `ZW_ORG_ID` | Zoho Webinar API client (refresh-token flow, scopes `ZohoWebinar.webinar.CREATE` and `ZohoWebinar.webinar.READ`). |
| `ZW_DC` | `in` (default) or `com`. |
| `ZW_SEND_MAIL` | `true` (default) lets Zoho send its own confirmation/reminder emails. |
| `WA_PROVIDER` | `interakt` (adapter implemented) or `dry-run`. |
| `WA_API_KEY` | Provider API key. |
| `WA_TEMPLATE_LANG` | Template language code, default `en`. |
| `WA_TPL_CONFIRMATION`, `WA_TPL_REMINDER_24H`, `WA_TPL_REMINDER_1H`, `WA_TPL_SURVEY` | Meta-approved template names for W1–W4. |
| `DRY_RUN` | **Set `false` in production.** Anywhere else it defaults to true and WhatsApp messages are logged, not sent. |
| `RESEND_API_KEY` + `ALERT_FROM_EMAIL`, or `ALERT_WEBHOOK_URL` | Where the jobs send alerts (nothing on sale, draft closing soon, Zoho failing). Without either, alerts go to the server log only. |
| `NEXT_PUBLIC_GA4_VIA_GTM` | `true` only if the GTM container `GTM-KDCKBSHF` already contains a GA4 tag; this stops the site loading GA4 a second time. |

Existing Cashfree, Meta, GA, GTM, Clarity and TrainerCentral variables are unchanged. Use Cashfree SANDBOX keys and a test Zoho webinar on staging.

## 3. Database (MongoDB)

There are no migrations; schema changes go live with `npx prisma db push`.

1. Staging first: `npx prisma db push`, then run the seed script (section 5) and test end to end.
2. Production, by the owner, immediately before deploying the site: `npx prisma db push` against the production `DATABASE_URL`.

New models: `Batch`, `BatchSettings`, `BatchRegistration`. New optional fields on `Course`, `OrderItem`, `Order`, `Coupon` — nothing existing changes shape.

## 4. Zoho Webinar

1. Create an API client in the Zoho developer console for the **India** data centre; generate a refresh token with the webinar read + create scopes. Put the four `ZW_*` values in Vercel.
2. Before each batch is opened, create **two** webinars in Zoho (Saturday session, Sunday session) and paste both webinar keys into Admin → Batches → Edit. (One recurring webinar with instance ids is also supported; fill the instance id fields.)
3. On each **Sunday** webinar, set Zoho's post-webinar redirect and follow-up email to the survey URL for that batch (`<survey URL>?batch=<n>`, shown in Admin → Batches).
4. Test once on a sandbox webinar: register the same email twice and fill a tiny-capacity webinar, and compare the responses with `src/lib/zoho-webinar.ts` (`extractJoinLink`). Zoho does not document either case.

## 5. Seed command (staging, then once in production)

```
MMF_FIRST_SATURDAY=2026-11-21 MMF_PRICE=1999 MMF_START_TIME=19:00 MMF_CLOSE_HOURS=19 \
MMF_ALERT_EMAILS=ops@cashflowcrew.in node scripts/seed-mmf-batches.ts
```

Optional: `MMF_LANGUAGE`, `MMF_DURATION_MINUTES` (120), `MMF_FUTURE_BATCHES` (2), `MMF_NEW_BATCH_STATUS` (`DRAFT`), `MMF_WHATSAPP_GROUP`, `MMF_SURVEY_URL`, `MMF_COURSE_SLUG`. The script sets `useBatches = true` on the course, creates Batch settings and batch 1 as a draft. Everything can be changed later in Admin → Batch settings.

## 6. WhatsApp

1. Confirm the provider (Interakt is implemented; another provider needs one adapter file in `src/lib/whatsapp/`).
2. Submit the four templates to Meta, in this parameter order:
   - W1: name, Saturday date, Sunday date, start time, join link, group link, order ID
   - W2: name, Saturday date, start time, join link
   - W3: name, session start time, join link
   - W4: name, survey link
3. Create the batch WhatsApp group and paste its link in Admin → Batches → Edit (or set a default group in Batch settings).
4. Set `WA_*` and `DRY_RUN=false` in production.

## 7. Scheduler

- **Daily batches job** (`GET /api/cron/batches`, 06:00 IST) is registered in `vercel.json` and runs on any Vercel plan.
- **Messages job** (`GET /api/cron/messages`) must run about every 15 minutes:
  - Vercel Pro: add `{ "path": "/api/cron/messages", "schedule": "*/15 * * * *" }` to `vercel.json`.
  - Vercel Hobby: use cron-job.org (or similar) to call `https://www.cashflowcrew.in/api/cron/messages` every 15 minutes with header `Authorization: Bearer <CRON_SECRET>`.

## 8. Opening the first batch

1. Admin → Batch settings: confirm the defaults.
2. Admin → Batches: Edit batch 1 → add both Zoho keys and the WhatsApp group link → **Open**.
3. Visit `/master-mutual-funds`: the price, Saturday date and booking close time come from the batch; "Book my seat" links to `/checkout?courseId=…&batchId=…`.

## 9. Deploy order

1. `prisma db push` on production (owner).
2. Deploy the site (merge the site PRs; Vercel builds).
3. Deploy the admin panel.
4. Run the seed script against production once.
5. Open the first batch in admin.

## 10. Rollback (Vercel)

- Site: Vercel → Deployments → previous production deployment → **Promote to Production**. The old landing page code is kept in `src/legacy/`; the new Prisma fields are optional, so an older build runs against the new database.
- Admin: same, in the admin project.
- Nothing is deleted from the database by these changes.

## 11. Manual QA (staging, before go-live)

- Cashfree sandbox purchase of the workshop; order shows PAID; `BatchRegistration` row created; TrainerCentral not called; Zoho test webinar shows the registrant; join buttons appear on the thank-you page within 60 seconds.
- Buy a recorded course: TrainerCentral enrolment still happens, old thank-you flow unchanged.
- Meta Events Manager → Test events: exactly one PageView, one ViewContent, one InitiateCheckout, one Purchase (deduplicated with the server event).
- GA4 DebugView: `view_item`, `begin_checkout`, `purchase` once each.
- `DRY_RUN=false` with the WhatsApp test number: W1 arrives after payment.
- Admin: refresh any admin page — session survives; Guest list CSV downloads; Retry Zoho works on a failed row.
- Landing page at 320 px, 390 px and 1280 px: no `{` tokens, no seat text, Lighthouse mobile score recorded.
- Footer links return 200; confirm `/#about` scrolls to a section.

## 12. Still open

See `docs/OWNER_DECISIONS.md` and the "Needs owner sign-off" sections of `docs/reports/phase-2.md` to `phase-4.md`: Zoho and WhatsApp accounts, batch defaults, copy items, old-stack shutdown (D10), certificates (D12), guide 5 PDF title (outside the repo).
