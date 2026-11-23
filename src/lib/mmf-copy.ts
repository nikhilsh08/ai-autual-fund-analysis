// Visitor-facing copy for the Master Mutual Funds workshop path. Every string
// is the draft from Part 3 of the brief, verbatim. Change wording here only.
//
// The brief's drafts say "Saturday" and "Sunday". A batch can start on any
// day of the week (owner, 23 Nov 2026), so those two words are taken from the
// batch's own dates; for a Saturday batch the text reads as the brief wrote it.

// "Saturday, 21 November 2026" -> "Saturday"
export const weekdayOf = (dateText: string) => dateText.split(",")[0].trim();

// "Saturday, 21 November 2026" -> "Saturday 21 November 2026"
const spokenDate = (dateText: string) => dateText.replace(",", "");

export const MMF_COPY = {
  contentName: "Master Mutual Funds workshop",

  landing: {
    // C2 — announcement bar. Landing page (owner, 23 Nov 2026): the whole
    // booking line, as on /v30 — both days with their dates, the start time,
    // the price and "Only 50 seats per batch", with no button. Its text is in
    // src/landing/mmf-v10.html. The checkout page's bar gives the same line
    // (owner, 23 Nov 2026): src/components/landing/V10ScheduleBar.tsx.
    // C3 — mobile sticky bar (replaces "{N} of 50 seats left")
    sticky: "2-day live workshop + 5 guides",
    // C4 — FAQ, device question
    faqJoinLink:
      "Your personal join link is shown on the confirmation page after payment and is sent to your email and WhatsApp.",
    // C5 — price section when nothing is on sale
    nothingOnSale: "Booking for the next batch opens soon. For the date, write to support@cashflowcrew.in.",
    // Used for the {class date} / {booking close date} tokens when nothing is on sale.
    // Not in the brief's tables — needs owner sign-off (see OWNER_DECISIONS).
    dateToBeAnnounced: "to be announced",
  },

  checkout: {
    // K1 — above the form. The two weekdays are the batch's own (a batch can
    // start on any day); both dates arrive as "Saturday, 21 November 2026".
    batchLine: (day1Date: string, day2Date: string, startTime: string, duration: string) =>
      `Batch: ${day1Date}, ${startTime} IST, ${weekdayOf(day1Date)} and ${weekdayOf(day2Date)}, ${duration} each, live online.`,
    // K2 — checkbox under phone
    whatsappConsent: "Send booking confirmation and session reminders to this number on WhatsApp.",
  },

  thankYou: {
    T1: "Your seat is booked.",
    // Both dates arrive as "Saturday, 21 November 2026" and are shown as
    // "Saturday 21 November 2026", so the weekday is always the batch's own.
    T2: (day1Date: string, day2Date: string, startTime: string, duration: string) =>
      `${spokenDate(day1Date)} and ${spokenDate(day2Date)}, ${startTime} IST, ${duration} each.`,
    // "Join Saturday's session" — the weekday of that session (weekdayOf).
    T3: (weekday: string) => `Join ${weekday}'s session`,
    T4: "Your join link is being prepared. It will appear here in a few seconds and will also be sent to your email.",
    T5: "Join the batch WhatsApp group",
    T6: "Add both sessions to my calendar",
    T7: "You need a stable internet connection and a computer, tablet or phone with audio.",
    T8: "For help, write to support@cashflowcrew.in with your order ID.",
    // Payment pending / failed states of the v10 thank-you page. Not in the
    // brief's tables — needs owner sign-off (see OWNER_DECISIONS).
    pendingTitle: "Confirming your payment…",
    pendingBody:
      "Your payment was received. We are confirming your booking, which takes a few seconds. Please keep this page open.",
    refresh: "Refresh status",
    contactSupport: "Write to support",
    failedTitle: "Payment not completed",
    failedBody: "The payment did not go through and you have not been charged. You can try again from the workshop page.",
    backToWorkshop: "Back to the workshop page",
  },
} as const;

// "Saturday, 21 November 2026" -> "21 November 2026" (shown beside a line that already says the weekday)
export const withoutWeekday = (dateText: string) => dateText.replace(/^[A-Za-z]+,\s*/, "");
