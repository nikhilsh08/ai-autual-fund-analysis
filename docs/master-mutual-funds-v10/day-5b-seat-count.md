# Master Mutual Funds v10 — Day 5B: counting every paid seat

## Code change

`src/server/actions/payment.action.ts`, inside `verifyCashfreePayment`'s
`TRANSACTION STEP 5` loop over `localOrder.items`: right after the existing
`tx.purchase.upsert(...)` call and before the enrollment-task queueing,
increments `seatsSold` on the course when `batchGroup === "mmf"`, guarded by
`seatsSold: { lt: max }` in the same `updateMany` call. That guard is why
this is safe under a race: the increment and the "is there still room"
check happen as one database operation, so two people paying for the last
seat at the same instant cannot both succeed — the second `updateMany`
matches zero rows (`counted.count === 0`), which is logged (`[MMF] Batch …
was full when order … was paid`) rather than silently dropped, so support
knows to refund or move that buyer.

`localOrder.items` already includes the full `course` relation
(`include: { course: true }`, confirmed by reading the query a few lines
above), so `item.course.batchGroup`/`maxSeats`/`seatsSold` are properly
typed — no `any` needed, and `npx tsc --noEmit` is clean.

For any course that isn't a Master Mutual Funds batch, this block does
nothing: `item.course?.batchGroup === "mmf"` is false and `seatsSold` is
never touched. The existing idempotency guard a few lines above (`if
(localOrder.status === "PAID") { … skip }`) already prevents this whole
transaction — and so this increment — from running twice for the same
order, which is what stops Cashfree's webhook and the buyer's browser
redirect from counting the same payment as two seats.

## Refund steps (operational, not code)

Per the plan, there is no refund button yet. Documenting it here so it
lives with the rest of this feature's operational notes:

1. Refund the payment in the Cashfree dashboard.
2. In Atlas, open that batch's `Course` document and reduce `seatsSold`
   by 1.
3. Log the order ID, date and reason.

This is the only case where anyone touches `seatsSold` by hand, and only
because a real booking was cancelled — consistent with the rule that the
seat count otherwise only ever changes via this payment code. A proper
Refund button in the admin panel is a good follow-up task, not part of
this day.

## What ran here vs. what needs the test database

- `npx tsc --noEmit` — clean.
- The actual seat-count table (buy at 48 → 49 and the right seat copy;
  retrying the same webhook doesn't double-count; a cancelled payment adds
  nothing; buying the 50th seat moves the page to the next batch; the
  TrainerCentral enrolment fires) needs the test database, Cashfree test
  mode, and a running TrainerCentral integration — none available in this
  environment.
