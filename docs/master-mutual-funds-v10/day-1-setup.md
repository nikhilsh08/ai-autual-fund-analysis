# Master Mutual Funds v10 — Day 1: getting in the door

Tracks progress against the 12-day project plan. This day is mostly access and
environment verification, not code — see `day-2-...md` onward for the actual
build work.

## Environment check (this machine)

- Node: `v25.8.2` (plan requires 20+) — OK
- npm: `11.6.0` — OK
- `npx prisma generate` — runs cleanly against `prisma/schema.prisma` with no
  database connection required, confirming the schema compiles before Day 3's
  changes.
- `admin-cashflowcrew` (the separate admin-panel repo) is not checked out
  alongside this repo in this environment, so it could not be verified here.
  Needed before Day 4.

## Access to confirm (external systems, outside this repo)

- [ ] Git access to `admin-cashflowcrew`
- [ ] Both `.env` files (this site + admin panel)
- [ ] Vercel access, both projects
- [ ] Admin panel login with an ADMIN role
- [ ] Cashfree test mode credentials
- [ ] TrainerCentral access
- [ ] MongoDB Atlas, test database

## Questions for Nikhil (answers needed by end of Day 3 — blocks Day 4)

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

Questions 1, 2, 4 and 7 block the admin-panel work on Day 4.

## Guide 5 PDF fix (ask the designer, needed by Day 10)

`Small-Changes-That-Reduce-Your-Costs-and-Taxes.pdf` was renamed, but the
title embedded inside the PDF still reads "Quick Hacks to Improve Portfolio
Returns". The guides are flattened/image-based, so this can only be fixed in
the original design file and re-exported — not patched in this repo.

## Scope note

The `master-mutual-funds` page already in this repo
(`src/components/templates/master-mutual-funds/`) is the hand-built
predecessor design. The v10 handoff (a single `index.html` with its own
`support.js`/`motion.js`, converted via a build script into a template) is a
separate, newer design that Day 2 onward brings in under `public/mmf/` and
`src/components/templates/mmf-v10/`. It replaces the existing page on Day 5
of the plan; until then both can coexist in the codebase.
