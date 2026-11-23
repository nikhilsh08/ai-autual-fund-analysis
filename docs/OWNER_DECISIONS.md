# Owner decisions — defaults used while Part 3 was blank

Every blank answer in Part 3 of the brief was filled with the brief's own recommended default where one exists, or made configurable where it does not. Change any line here and tell the developer; nothing below is hard-coded in visitor-facing text.

| # | Decision | Default used | Where to change |
|---|---|---|---|
| D1 | Ad landing URL | `https://www.cashflowcrew.in/master-mutual-funds` (confirmed) | — |
| D2 | Live sessions tool | Zoho Webinar (confirmed) | — |
| D2 | Zoho data centre | `in` | env `ZW_DC` (`in` or `com`) |
| D2 | Max attendees per webinar | No seat limit on `/v10`, `/v20` or `/v30` (owner, 16 Nov 2026): bookings are never refused for seats and no page counts seats down. `/v20` and `/v30` still print "Only 50 seats per batch" (as `/v10` prints "50 seats per batch"); the sentence "Each batch is limited to 50 attendees" is taken out. Setting a number for a page brings back the countdown and the refusal (`batch_full`) for that page. | `LANDING_SEATS_PER_BATCH` in `src/lib/landing/sources.ts` |
| D2 | Webinars per batch | Two one-time webinars (day 1 key, day 2 key); `instanceId` optional for recurring series | Admin → Batch → Zoho keys |
| D2 | Who creates the webinar | Staff, in Zoho, then paste both keys in admin before opening the batch (the daily job alerts if an OPEN batch lacks keys) | — |
| D2 | Zoho confirmation/reminder emails | `sendMail=true` | env `ZW_SEND_MAIL=false` to turn off |
| D3 | WhatsApp provider | `interakt` adapter is implemented; default runtime is `dry-run` (logs, sends nothing) until `WA_PROVIDER=interakt` and `DRY_RUN=false` are set in production | env `WA_PROVIDER`, `WA_API_KEY`, `WA_TEMPLATE_LANG` |
| D3 | Group model | One WhatsApp group per batch (`Batch.whatsappGroupLink`), with `BatchSettings.defaultWhatsappGroupLink` as fallback | Admin → Batch / Batch settings |
| D3 | Template names | `WA_TPL_CONFIRMATION`, `WA_TPL_REMINDER_24H`, `WA_TPL_REMINDER_1H`, `WA_TPL_SURVEY` (fallback names `mmf_w1`…`mmf_w4`); drafts W1–W4 from the brief, submitted to Meta by the owner | env |
| D4 | Scheduler | `vercel.json` registers only the daily batches job (works on Hobby). The 15-minute messages job must be called by an external scheduler (e.g. cron-job.org) with `Authorization: Bearer $CRON_SECRET` at `GET /api/cron/messages`, or added to `vercel.json` on Pro | `vercel.json`, env `CRON_SECRET` |
| D5 | Batch defaults | Not guessed. The seed script takes them as arguments: `MMF_FIRST_SATURDAY`, `MMF_PRICE`, `MMF_START_TIME`, `MMF_CLOSE_HOURS`, `MMF_ALERT_EMAILS` (+ optional `MMF_LANGUAGE`, `MMF_DURATION_MINUTES`=120, `MMF_FUTURE_BATCHES`=2, `MMF_NEW_BATCH_STATUS`=DRAFT, `MMF_WHATSAPP_GROUP`, `MMF_SURVEY_URL`) | `scripts/seed-mmf-batches.ts`, then Admin → Batch settings |
| D6 | Coupon batch scope | Implemented as optional: `Coupon.applicableBatchIds` empty = all batches. Same person may use a code on two batches (no per-person limit exists today) | Admin → Coupons |
| D7 | GA4 via GTM | Unknown. Direct GA4 stays unless `NEXT_PUBLIC_GA4_VIA_GTM=true` (Phase 4) | env |
| D8 | Clarity masking | Owner setting in Clarity; checkout form gets `data-clarity-mask` regardless (Phase 4) | Clarity dashboard |
| D9 | Payment gateway | Cashfree only (done in Phase 1) | — |
| D10 | Old stack | Untouched. Appendix A risks remain if it is still deployed | — |
| D11 | Survey | `BatchSettings.defaultSurveyUrl` / `Batch.surveyUrl`; `?batch=<n>` is appended automatically | Admin → Batch settings |
| D12 | Certificates | Manual, from the Guest list CSV | — |
| D13 | Date format | "Saturday, 21 November 2026"; "Friday, 20 November 2026, 11:59 PM IST" | `src/lib/ist.ts` |
| D14 | Batch days | Any day of the week (owner, 23 Nov 2026). Day 1 is the date picked in the admin panel; day 2 is the day after. `/v10`, `/v20`, `/v30`, their checkout and thank-you pages name the batch's own two weekdays in place of the designers' "Saturday" / "Sunday" (and "over two days" in place of "over one weekend"); a Saturday batch reads as before. With nothing on sale, the pages name the weekdays of the cycle in Batch settings. | Admin → Batches → Day 1 date; Admin → Batch settings → first day 1 of the cycle. Code: `src/lib/landing/weekdays.ts` |
| D15 | Days and time on the landing pages | Owner, 23 Nov 2026. (1) The top bar of `/v10` and `/v20` gives the same line as `/v30`: "2-day live workshop · Saturday 5 Dec and Sunday 6 Dec, 10:30 AM IST · ₹2,999 · Only 50 seats per batch", without the "Book my seat" button. This puts the price and the seats line back on the `/v10` bar (taken off on 15 Nov 2026). On phones the bar reads "Sat 5 Dec – Sun 6 Dec, 10:30 AM IST · ₹2,999"; the seats line gives way first when the screen is narrow. (2) On all three pages, every place that says when the workshop runs names both days (weekday and date) and the start time: first screen, 2-day path labels, schedule headings, price card, "Next batch" lines, FAQ and the bottom bar. With nothing on sale there is no date or time to give, and those places name the weekdays alone or say "to be announced". (3) The black bar of the `/v10` checkout page gives the same line as the `/v10` landing page's bar, in the same look, filled from the same batch. The other checkout pages and the thank-you pages are unchanged. | The batch (Admin → Batches). Text: `src/landing/mmf-v10.html`, `mpf-v20.html`, `mpf-v30.html`; checkout bar: `src/components/landing/V10ScheduleBar.tsx` |
| Copy | C1–C5, K1–K2, T1–T8 | The brief's drafts, verbatim, from one constants file (Phase 4) | `src/lib/mmf-copy.ts` |

## Alerts

The site has no email service. `sendAlert()` uses Resend if `RESEND_API_KEY` and `ALERT_FROM_EMAIL` are set, else POSTs to `ALERT_WEBHOOK_URL`, else logs to the server console.

## Environment variables added

`CRON_SECRET`, `ZW_CLIENT_ID`, `ZW_CLIENT_SECRET`, `ZW_REFRESH_TOKEN`, `ZW_ORG_ID`, `ZW_DC`, `ZW_SEND_MAIL`, `WA_PROVIDER`, `WA_API_KEY`, `WA_TEMPLATE_LANG`, `WA_TPL_CONFIRMATION`, `WA_TPL_REMINDER_24H`, `WA_TPL_REMINDER_1H`, `WA_TPL_SURVEY`, `DRY_RUN`, `RESEND_API_KEY`, `ALERT_FROM_EMAIL`, `ALERT_WEBHOOK_URL`.

`DRY_RUN` defaults to true outside production. Set `DRY_RUN=false` explicitly in the production project.

## Phase 4 copy that needs sign-off (not in the brief's tables)

| Where | Text used | Why |
|---|---|---|
| Landing page, when nothing is on sale, in place of `{class date}` and `{booking close date}` | "to be announced" | The brief says to still fill every token in the C5 state but gives no wording. |
| Landing page `<title>` / meta description | "Master Mutual Funds \| Invest Smarter" / "Learn how to pick the right mutual funds and build a wealth-generating portfolio." | Carried over from the previous page as the spec allows, but "Invest Smarter" and "wealth-generating" read as slogans under CONTENT-RULES. Replace if you want. |
| K2 checkbox | unticked by default | The brief asks "ticked by default? yes/no"; unticked is the safer consent default. |
| Workshop thank-you page (`/v10/thank-you`), payment pending state | "Confirming your payment…" / "Your payment was received. We are confirming your booking, which takes a few seconds. Please keep this page open." / "Refresh status" / "Write to support" | The brief covers only the paid state (T1–T8); the v10 page also shows the pending and failed states in the same design. |
| Workshop thank-you page, payment failed state | "Payment not completed" / "The payment did not go through and you have not been charged. You can try again from the workshop page." / "Back to the workshop page" | Same as above. |
