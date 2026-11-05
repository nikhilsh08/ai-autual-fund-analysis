# Master Mutual Funds v10 — Day 4: buttons, tracking and motion

## Done on Day 3A already

- The single checkout button (`data-checkout="1"`) and the tracking events
  (`ViewContent`/`view_item` on load, `InitiateCheckout`/`begin_checkout` on
  click) are wired in `MmfClient.tsx`. Nothing new needed here.
- `/mmf/motion.js` is mounted once per page load from `MmfClient.tsx`.

## Code change on this branch

`src/app/(checkout)/checkout/page.tsx` — hides the upsell recommendation on
a Master Mutual Funds checkout, per `CONTENT-RULES.md` ("no links to other
courses and no follow-on paid offer"):

- `setBuyNowItem(...)` now also carries `batchGroup` from the fetched
  course.
- `fetchUpsells()` returns immediately when `buyNowItem?.batchGroup ===
  "mmf"`, before it ever calls `getUpsellRecommendations`. `buyNowItem` was
  already in that effect's dependency array, so no change needed there.
- A normal course checkout is unaffected — `batchGroup` is `undefined` for
  every other course, so the early return never fires.

## Already wired in the codebase (no code needed — configuration only)

Checked, not changed:

- `src/components/analytics/MicrosoftClarity.tsx` already renders nothing
  when `clarityId` is empty and loads the Clarity tag when it's set, exactly
  the shape Day 4 asks for. `layout.tsx` already passes
  `process.env.NEXT_PUBLIC_CLARITY_ID!` to it.
- `src/lib/meta-capi.ts` already reads `META_CAPI_ACCESS_TOKEN` and
  `NEXT_PUBLIC_META_PIXEL_ID`, and already skips (with a log line) instead
  of throwing when either is unset.
- `NEXT_PUBLIC_GTM_ID` and `NEXT_PUBLIC_GA_ID` are already read by
  `GoogleTagManager.tsx` / `GoogleAnalytics.tsx` in the root layout.

So checklist items 1–3 (Meta Conversions API, GA4/Tag Manager, Clarity) are
entirely about filling in Vercel environment variables and dashboard
settings that already exist for the site, not new code:

- [ ] Create a Meta Conversions API access token for pixel
      `1982781202535546` in Meta Events Manager; set
      `META_CAPI_ACCESS_TOKEN` in Vercel (Production + Preview).
- [ ] Open the `GTM-KDCKBSHF` container and pause any Google tag using the
      same GA4 ID, or any Meta Pixel tag, so page views and purchases are
      not counted twice; republish the container.
- [ ] Confirm `NEXT_PUBLIC_GA_ID` in Vercel matches the GA4 property the
      team reads.
- [ ] Copy the Clarity project ID into `NEXT_PUBLIC_CLARITY_ID`; set a
      masking mode that hides typed text; ask Nikhil to add a session
      -recording sentence to the privacy policy.
- [ ] After a real test purchase (Day 5B), confirm in Meta Events Manager
      that `Purchase` shows both "Browser" and "Server" and is marked
      deduplicated (it already shares `orderId` as the event ID on both
      sides — see `PurchaseEvent.tsx` and `meta-capi.ts`).

None of this is possible to do from this environment (no Meta/GTM/GA4/
Clarity dashboard or Vercel access here).

## Left for a browser and real devices (manual QA)

- Meta Pixel Helper / Tag Assistant: confirm `PageView`+`ViewContent` on
  load and `InitiateCheckout`+`begin_checkout` on the price-section button
  only, and that every event's payload carries only price, currency and the
  workshop title — never a fund name, amount or portfolio detail.
- Animation checks: sections fade in once, "Your 2-day path" stays pinned,
  mouse/trackpad scrolling is smooth on a laptop; scrolling is native (not
  smoothed) on a real phone; "Reduce motion" turns every animation off.
