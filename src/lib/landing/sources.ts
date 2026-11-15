// The three workshop landing pages. Each one is linked to its OWN course in
// the admin panel (Masterclasses -> "Workshop landing page"), so each has its
// own batches, dates, price and seats.
//
// The checkout sends `landingSource`; createCashfreeOrder carries it in the
// Cashfree return URL as `src`, and /payment/callback uses it to send the
// buyer back to the right pages. Anything else keeps the main-site flow.
export const LANDING_PAGES = ["v10", "v20", "v30"] as const;
export type LandingPageKey = (typeof LANDING_PAGES)[number];

export const LANDING_SOURCES = {
  "mmf-v10": {
    page: "v10",
    name: "v10 · Master Mutual Funds",
    landing: "/v10",
    checkout: "/v10/checkout",
    thankYou: "/v10/thank-you",
  },
  "mpf-v20": {
    page: "v20",
    name: "v20 · Master Personal Finance with AI",
    landing: "/v20",
    checkout: "/v20/checkout",
    thankYou: "/v20/thank-you",
  },
  "mpf-v30": {
    page: "v30",
    name: "v30 · Master Personal Finance with AI (new design)",
    landing: "/v30",
    checkout: "/v30/checkout",
    thankYou: "/v30/thank-you",
  },
} as const satisfies Record<string, { page: LandingPageKey; name: string; landing: string; checkout: string; thankYou: string }>;

export type LandingSource = keyof typeof LANDING_SOURCES;

// Courses created before Course.landingPage existed. Used only while such a
// course has no landingPage value and no other course is linked to the page.
export const LEGACY_COURSE_SLUG: Partial<Record<LandingPageKey, string>> = {
  v10: "master-mutual-funds-invest-smarter",
  v20: "master-personal-finance-with-ai",
};

export function isLandingSource(value: unknown): value is LandingSource {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(LANDING_SOURCES, value);
}

export function isLandingPageKey(value: unknown): value is LandingPageKey {
  return typeof value === "string" && (LANDING_PAGES as readonly string[]).includes(value);
}

export const landingPath = (page: LandingPageKey) => `/${page}`;
