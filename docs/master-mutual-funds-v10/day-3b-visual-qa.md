# Master Mutual Funds v10 — Day 3B: making it look exactly right

This day is almost entirely manual QA against a running preview (two browser
tabs side by side, DevTools device emulation, a real preview link for
Nikhil) — none of which this environment can do (no browser, no Vercel
deploy, no `DATABASE_URL`). What follows is everything that *could* be
checked without those: the parts of the plan's Day 3A/3B acceptance list
that are properties of the rendered HTML string itself, verified by calling
`renderMmfBody()` against mock batches.

## What was verified (rendered-HTML checks)

Using the same compiled `render.ts` from Day 3A against three mock batches
(low seats, not-low seats with `startTime`/`language` set, and a third for
content checks):

- No `{` survives in the output (BACKEND.md's own launch check), for all
  three mock batches.
- `₹{price}` resolves in exactly 9 places.
- `{class date}` → `"Saturday, 12 December 2026"`; `{booking close date}` →
  `"11 December, 8:00 pm IST"` — both in Indian time, matching the plan's
  examples exactly.
- Seat copy: at 10 left, `"10 of 50 seats left in this batch."` appears (and
  the "limited to 50 attendees" copy does not); at 20 left, the reverse.
- `startTime`/`language`: hidden (and their `<!--mmf:if-->` blocks fully
  removed, not just visually hidden) when empty; shown when set.
- The first FAQ item's `open="{{ true }}"` resolves to a plain `open`
  boolean attribute, so it is open on load.
- 19 images carry `loading="lazy"` (matches BACKEND.md's "19 of 23 images
  lazy" note from the designer).
- Exactly one `data-checkout="1"` button exists — the price-section button
  `MmfClient.tsx` wires to checkout; every other "Book my seat" link is a
  plain `#admission` anchor.
- No `.pdf` or `guides/` substring anywhere in the rendered output.
- The 5 guide cards appear in the committed order and with the committed
  titles (Starter Guide, Strategies, Audit Checklist, Free Tools, Small
  Changes).
- Every static footer link resolves to the address `BACKEND.md` section 8
  specifies: About Us → `/#about`, Contact Us, Privacy, Terms, Refund
  (both the price-section link and the footer link), Delivery, Collabroot,
  and the `support@cashflowcrew.in` mailto.
- $65B / $65 billion appear in US dollars; no `₹65` variant appears anywhere.
- 600+ attendees and the 76% SPIVA figure are present as pinned.

## One content finding for Nikhil, not a code fix

`CONTENT-RULES.md` says "Education only, not investment advice" must stay in
four places: hero, price section, first FAQ, footer disclaimer. Checking the
rendered text, the **literal** phrase only appears twice — in the hero
("Education only. This workshop does not give investment advice or
recommend any fund.") and the footer ("Education only, not investment
advice."). The price section ("This is an educational workshop. It teaches
you how to research mutual funds. It does not recommend any fund.") and the
first FAQ answer ("This is an educational workshop... no fund is
recommended. For personal investment advice, please consult a
SEBI-registered investment adviser.") carry the same no-advice meaning in
different wording, not the boilerplate phrase repeated.

This reads like a deliberate editorial choice (varied phrasing over
copy-pasting one sentence four times) and the compliance *intent* is present
in all four places either way — but developers must not rewrite the page's
copy (`CONTENT-RULES.md`), so this is flagged for Nikhil/the designer to
confirm the phrasing satisfies the rule as intended, rather than silently
"fixed" here.

## Left for a human with a browser and the preview link

- Side-by-side comparison against the designer's `index.html` section by
  section (announcement bar, hero, 2-day path, live check, instructor,
  testimonials, guides, price, FAQ, footer).
- 375px / 320px DevTools check: nothing scrolls sideways, buttons fit, text
  isn't cut off. Any fix goes into `MmfPage.tsx`'s `ROOT_CSS` constant,
  scoped under `#mmf-root` — never into `template.generated.ts`.
- Images-load-on-scroll check in the Network tab.
- Clicking every footer link and confirming `/`, `/courses` and `/cart`
  still render with the site's normal header/footer (unaffected by this
  route's `layout.tsx` change).
- `git push` and share the Vercel preview link with Nikhil (needs Vercel
  access to this repo, and the Preview environment's `DATABASE_URL`/Cashfree
  keys pointed at test, which this environment doesn't have either).
