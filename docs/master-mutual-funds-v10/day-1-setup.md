# Master Mutual Funds v10 — Day 1A: getting in the door

Tracks progress against the **"CashFlowCrew: 12-day plan for the website-live
checklist and MFRI"** (the plan that supersedes the earlier 12-day workshop-page-only
plan). Day numbers below follow that plan: most days split into part A and
part B. This day is mostly access and environment verification, not code —
see `day-1-handoff.md` onward for the actual build work.

## Environment check (this machine)

- Node: `v25.8.2` (plan requires 20+) — OK
- npm: `11.6.0` — OK
- `npx prisma generate` — runs cleanly against `prisma/schema.prisma` with no
  database connection required, confirming the schema compiles before Day 2A's
  changes.
- `admin-cashflowcrew` is a sibling checkout on this machine (see Day 2B) and
  was used directly, so "both projects run" is confirmed for this
  environment.

## Access to confirm (external systems, outside this repo)

- [ ] Both `.env` files (this site + admin panel)
- [ ] Vercel access, both projects
- [ ] Admin panel login with an ADMIN login
- [ ] Cashfree test mode credentials
- [ ] TrainerCentral access
- [ ] MongoDB Atlas, test database

## Accounts to open today (some take days to approve — item numbers are the
website-live checklist)

- [ ] Meta Events Manager, with permission to create a Conversions API access
      token (checklist item 1, needed Day 4)
- [ ] Google Tag Manager container `GTM-KDCKBSHF` and the GA4 property, with
      edit access (item 2, needed Day 4)
- [ ] Microsoft Clarity project (item 3, needed Day 4)
- [ ] Cashfree dashboard, test and production (item 4, production keys
      needed Day 5B/9B)
- [ ] Zoho ZeptoMail, with the cashflowcrew.in domain added — SPF/DKIM DNS
      checks can take a day or two (item 8, needed Day 7A)
- [ ] One WhatsApp provider (Interakt, AiSensy, Gupshup or WATI) — approval
      of the business and templates can take several days (item 8, needed
      Day 7B)
- [ ] Zoho Forms or Google Forms, for the post-workshop survey (item 10,
      needed Day 9A)

### WhatsApp templates to submit today

Submit these four for approval now, since WhatsApp approval can take
several days. Wording is finalised on Day 7B and must be approved by Nikhil
first, since the content rules apply to messages too:

- `mmf_booking_confirmed`
- `mmf_starts_tomorrow`
- `mmf_starts_in_1h`
- `mmf_feedback`

## Questions for Nikhil (answers needed by end of Day 2 — blocks Day 2B)

1. What is the seat price, including GST?
2. When does booking close for each batch (e.g. "Friday 8 PM IST")?
3. Should the page show a start time and language? If yes, what?
4. Does every batch get its own TrainerCentral course or session ID?
5. Who sends the session link 24 hours before: TrainerCentral automatically,
   or the team?
6. Who issues certificates, and how?
7. Which admin panel does the team use: `admin-cashflowcrew` or
   `admin.collabroot.com`?
8. Should checkout hide the "recommended extra course" for this workshop?
9. The FAQ title "Is it live, or a recording?" mentions recordings, which
   `CONTENT-RULES.md` says the page must not do — keep it or change it?
10. Can fund data used in live sessions be confirmed at least 30 days old
    (SEBI rule for education-only providers)?

Questions 1, 2, 4 and 7 block the admin-panel work on Day 2B.

Needed for later stages (not blocking yet):

11. Which WhatsApp provider and business phone number should messages come
    from? (Day 7B)
12. Should the certificate be sent only after the attendee fills in the
    survey? (Day 9A)
13. What exactly is MFRI, what files will be uploaded and how often, and who
    may see them — anyone with an account, or only workshop buyers? (Day 11A)
14. Which videos will be uploaded? The workshop page is sold as live and
    says nothing about recordings, so should recordings be shared at all,
    and with whom? (Day 12B)

## Guide 5 PDF fix (ask the designer, needed by Day 6B)

`Small-Changes-That-Reduce-Your-Costs-and-Taxes.pdf` was renamed, but the
title embedded inside the PDF still reads "Quick Hacks to Improve Portfolio
Returns". The guides are flattened/image-based, so this can only be fixed in
the original design file and re-exported — not patched in this repo.

## Scope note

The `master-mutual-funds` page already in this repo
(`src/components/templates/master-mutual-funds/`) is the hand-built
predecessor design. The v10 handoff (a single `index.html` with its own
`support.js`/`motion.js`, converted via a build script into a template) is a
separate, newer design that Day 1B onward brings in under `public/mmf/` and
`src/components/templates/mmf-v10/`. It replaces the existing page on Day 3A
of the plan; until then both can coexist in the codebase.
