// Shared by the v30 routes. v30 has its own course in the admin panel
// (Masterclasses -> "Workshop landing page: /v30"), so its batches, dates,
// price and seats are separate from v20's. landingSource "mpf-v30" brings
// v30 buyers back to the v30 pages.
import { LANDING_PUBLIC_PATH } from "@/lib/landing/sources";

export { MPF_V20_SEATS_PER_BATCH as MPF_V30_SEATS_PER_BATCH } from "@/lib/landing/v20";
// The addresses a buyer sees (under /personalfinance2); the pages themselves
// are in src/app/(landing)/v30.
export const MPF_V30_LANDING_PATH = LANDING_PUBLIC_PATH.v30;
export const MPF_V30_CHECKOUT_PATH = `${MPF_V30_LANDING_PATH}/checkout`;
export const MPF_V30_THANK_YOU_PATH = `${MPF_V30_LANDING_PATH}/thank-you`;
export const MPF_V30_REFUND_PATH = `${MPF_V30_LANDING_PATH}/refund-policy`;
export const MPF_V30_SOURCE = "mpf-v30";
export const MPF_V30_CONTENT_NAME = "Master Personal Finance with AI workshop";
// Images, fonts and lenis.min.js from the designer's folder live here.
export const MPF_V30_STATIC = "/mpf30";
