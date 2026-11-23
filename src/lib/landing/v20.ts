import { LANDING_PUBLIC_PATH } from "@/lib/landing/sources";

// Shared by the v20 landing route (Master Personal Finance with AI), its
// checkout route and its thank-you route. The course is the one linked to
// /v20 in the admin panel (lib/landing/course-link.ts).
// These are the addresses a buyer sees (under /personalfinance1); the pages
// themselves are in src/app/(landing)/v20.
export const MPF_V20_LANDING_PATH = LANDING_PUBLIC_PATH.v20;
export const MPF_V20_CHECKOUT_PATH = `${MPF_V20_LANDING_PATH}/checkout`;
export const MPF_V20_THANK_YOU_PATH = `${MPF_V20_LANDING_PATH}/thank-you`;
// Sent with the order so the payment callback returns the buyer to the v20
// thank-you page (see createCashfreeOrder and payment/callback).
export const MPF_V20_SOURCE = "mpf-v20";
export const MPF_V20_CONTENT_NAME = "Master Personal Finance with AI workshop";
// The number in the page's own seat line ("Only 50 seats per batch"). It is
// wording only: bookings are not capped and the line does not count down
// unless LANDING_SEATS_PER_BATCH (sources.ts) sets a limit for the page.
export const MPF_V20_SEATS_PER_BATCH = 50;
