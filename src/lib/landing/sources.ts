// Landing pages that have their own checkout and thank-you pages. The
// checkout sends `landingSource`; createCashfreeOrder carries it in the
// Cashfree return URL as `src`, and /payment/callback uses it to send the
// buyer back to the right pages. Anything else keeps the main-site flow.
export const LANDING_SOURCES = {
  "mmf-v10": {
    name: "Master Mutual Funds (v10)",
    courseSlug: "master-mutual-funds-invest-smarter",
    landing: "/v10",
    checkout: "/v10/checkout",
    thankYou: "/v10/thank-you",
  },
  "mpf-v20": {
    name: "Master Personal Finance with AI (v20)",
    courseSlug: "master-personal-finance-with-ai",
    landing: "/v20",
    checkout: "/v20/checkout",
    thankYou: "/v20/thank-you",
  },
  "mpf-v30": {
    name: "Master Personal Finance with AI (v30)",
    courseSlug: "master-personal-finance-with-ai",
    landing: "/v30",
    checkout: "/v30/checkout",
    thankYou: "/v30/thank-you",
  },
} as const;

export type LandingSource = keyof typeof LANDING_SOURCES;

// The workshop landing page(s) each batch course feeds. Shown in the admin
// panel's Batches and Batch settings screens. v20 and v30 sell the same course.
export const LANDING_PATH_BY_COURSE_SLUG: Record<string, string> = {
  "master-mutual-funds-invest-smarter": "/v10",
  "master-personal-finance-with-ai": "/v20, /v30",
};

export function isLandingSource(value: unknown): value is LandingSource {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(LANDING_SOURCES, value);
}
