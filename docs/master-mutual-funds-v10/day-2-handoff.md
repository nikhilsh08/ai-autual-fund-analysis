# Master Mutual Funds v10 — Day 2: bringing the design into the site

The designer's v10 handoff is a single `index.html` written against a small
runtime (`support.js`, a "dc-runtime") that this project does not use in
production. `scripts/convert-mmf-template.mjs` converts that file into a
plain template the website can fill with real data, the same way a
mail-merge letter is filled from a spreadsheet.

## What was done

- The handoff (`index.html`, `motion.js`, `support.js`, `BACKEND.md`,
  `CONTENT-RULES.md`, `README.md`, and the 14 image assets) lives in a
  sibling folder next to this repo, not inside it, per `BACKEND.md`/the
  12-day plan's Day 2 instructions.
- The 14 images were copied into `public/mmf/assets/` and are served at
  `/mmf/assets/<name>`.
- `motion.js` was copied to `public/mmf/motion.js`, with its `lenis` CDN
  `<script src>` repointed at `/mmf/lenis.min.js`, which is vendored locally
  so the page does not depend on unpkg.com at runtime.
- `guides/` (the 5 PDFs) was **not** copied into `public/`, because anything
  under `public/` is downloadable by anyone, and the guides are only shared
  during the live workshop (`BACKEND.md` section 4).
- `support.js` was **not** copied into the project; the website replaces it
  with its own renderer in a later day.

## The converter — `scripts/convert-mmf-template.mjs`

```
node scripts/convert-mmf-template.mjs ../mmf-landing-v10
```

Reads the handoff's `index.html` and writes
`src/components/templates/mmf-v10/template.generated.ts` (**generated —
never edit by hand**; rerun this script instead). It:

1. Pulls the `<style>` block out of `<helmet>` (`MMF_V10_BASE_CSS`) and the
   visible body out of `<x-dc>` (`MMF_V10_BODY_HTML`), dropping the
   dc-runtime's own `<script type="text/x-dc">` logic block.
2. Converts every `style-hover="…"` attribute (14 in the current handoff)
   into a generated class plus a real `:hover` CSS rule
   (`MMF_V10_HOVER_CSS`), since inline styles cannot express `:hover`.
3. Converts every `<sc-if value="{{ expr }}">…</sc-if>` block (8 in the
   current handoff) into `<!--mmf:if expr-->…<!--mmf:endif-->` markers that
   a later renderer shows or hides based on the named value it computes
   (`hasStart`, `hasLang`, `lowSeats`, `notLowSeats`, `showBar`,
   `showStickyCta` — see `BACKEND.md`'s token table).
4. Rewrites `assets/…` and `./assets/…` image paths to `/mmf/assets/…`.
5. Refuses to write the output if a `.pdf` reference, a `guides/` path, or
   any unconverted designer-only tag (`style-hover`, `<sc-if>`, `<x-dc>`,
   `<helmet>`) survives — that is a sign either the handoff changed shape or
   the script needs updating, not something to patch around.

Re-run it whenever the designer sends a new `index.html`: replace the
handoff folder, copy any new images into `public/mmf/assets/`, and rerun the
command above.

## What this does not do yet

`MMF_V10_BODY_HTML` still contains `₹{price}`, `{class date}`,
`{booking close date}` and the `{{ … }}`/`<!--mmf:if-->` markers unresolved.
Filling them with real batch data, and mounting the template as the actual
`/master-mutual-funds` page, is later work (the plan's Day 5 onward) and is
out of scope for Day 2.
