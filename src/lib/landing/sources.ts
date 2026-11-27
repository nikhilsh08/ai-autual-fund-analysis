// The three workshop landing pages. Each one is linked to its OWN course in
// the admin panel (Masterclasses -> "Workshop landing page"), so each has its
// own batches, dates, price and seats.
//
// The checkout sends `landingSource`; createCashfreeOrder carries it in the
// Cashfree return URL as `src`, and /payment/callback uses it to send the
// buyer back to the right pages. Anything else keeps the main-site flow.
export const LANDING_PAGES = ["v10", "v20", "v30"] as const;
export type LandingPageKey = (typeof LANDING_PAGES)[number];

// The address each page is advertised on. It shows the same page as /v10,
// /v20 or /v30: next.config.ts serves it, and every page under it, from that
// route without changing the address in the browser. So
// /personalfinance/checkout is the /v10/checkout page, and a buyer stays on
// the advertised address from the first click to the thank-you page. The
// /v10, /v20 and /v30 addresses keep working, but no button, link or redirect
// of these pages points to them.
//
// To move a page to another address, change it here; nothing else needs
// editing. Keep each address a single path segment that no other page uses.
export const LANDING_PUBLIC_PATH: Record<LandingPageKey, string> = {
  v10: "/personalfinance",
  v20: "/personalfinance1",
  v30: "/personalfinance2",
};

// The addresses a buyer sees for a page: the page itself, its booking page
// and its thank-you page.
const buyerPaths = (page: LandingPageKey) => ({
  landing: LANDING_PUBLIC_PATH[page],
  checkout: `${LANDING_PUBLIC_PATH[page]}/checkout`,
  thankYou: `${LANDING_PUBLIC_PATH[page]}/thank-you`,
});

export const LANDING_SOURCES = {
  "mmf-v10": {
    page: "v10",
    name: "v10 · Master Mutual Funds",
    ...buyerPaths("v10"),
  },
  "mpf-v20": {
    page: "v20",
    name: "v20 · Master Personal Finance with AI",
    ...buyerPaths("v20"),
  },
  "mpf-v30": {
    page: "v30",
    name: "v30 · Master Personal Finance with AI (new design)",
    ...buyerPaths("v30"),
  },
} as const satisfies Record<string, { page: LandingPageKey; name: string; landing: string; checkout: string; thankYou: string }>;

export type LandingSource = keyof typeof LANDING_SOURCES;

// Courses created before Course.landingPage existed. Used only while such a
// course has no landingPage value and no other course is linked to the page.
export const LEGACY_COURSE_SLUG: Partial<Record<LandingPageKey, string>> = {
  v10: "master-mutual-funds-invest-smarter",
  v20: "master-personal-finance-with-ai",
};

// Paid bookings a batch may take, per page; null = no limit. No page has a
// limit (owner decision, 16 Nov 2026): bookings are never refused for seats
// and no page counts seats down. Putting a number here for a page makes its
// checkout stop at that many paid bookings and its seat line count down. The
// /v20 and /v30 wording says 50, so any other number needs their templates
// changed too.
export const LANDING_SEATS_PER_BATCH: Record<LandingPageKey, number | null> = {
  v10: null,
  v20: null,
  v30: null,
};

export function isLandingSource(value: unknown): value is LandingSource {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(LANDING_SOURCES, value);
}

export function isLandingPageKey(value: unknown): value is LandingPageKey {
  return typeof value === "string" && (LANDING_PAGES as readonly string[]).includes(value);
}

// The route a page is built from (src/app/(landing)/v10, ...). The admin
// panel names the pages by it; buyers see LANDING_PUBLIC_PATH.
export const landingPath = (page: LandingPageKey) => `/${page}`;
