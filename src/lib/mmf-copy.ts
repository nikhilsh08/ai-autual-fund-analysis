// Visitor-facing copy for the Master Mutual Funds workshop path. Every string
// is the draft from Part 3 of the brief, verbatim. Change wording here only.
export const MMF_COPY = {
  contentName: "Master Mutual Funds workshop",

  landing: {
    // C2 — announcement bar (replaces "50 seats per batch")
    bar: "Live online, Saturday and Sunday",
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
    // K1 — above the form
    batchLine: (classDate: string, startTime: string) =>
      `Batch: ${classDate}, ${startTime} IST, Saturday and Sunday, 2 hours each, live online.`,
    // K2 — checkbox under phone
    whatsappConsent: "Send booking confirmation and session reminders to this number on WhatsApp.",
  },

  thankYou: {
    T1: "Your seat is booked.",
    T2: (day1: string, day2: string, startTime: string) =>
      `Saturday ${day1} and Sunday ${day2}, ${startTime} IST, 2 hours each.`,
    T3_DAY1: "Join Saturday's session",
    T3_DAY2: "Join Sunday's session",
    T4: "Your join link is being prepared. It will appear here in a few seconds and will also be sent to your email.",
    T5: "Join the batch WhatsApp group",
    T6: "Add both sessions to my calendar",
    T7: "You need a stable internet connection and a computer, tablet or phone with audio.",
    T8: "For help, write to support@cashflowcrew.in with your order ID.",
  },
} as const;

// "Saturday, 21 November 2026" -> "21 November 2026" (T2 already says the weekday)
export const withoutWeekday = (dateText: string) => dateText.replace(/^[A-Za-z]+,\s*/, "");
