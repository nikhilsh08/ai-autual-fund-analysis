// Shared by the v30 routes. v30 is a second page for the same course as v20
// (Master Personal Finance with AI): it sells the same batches, so both pages
// show the same dates, price and seat count. Only the design and the routes
// differ; landingSource "mpf-v30" brings v30 buyers back to the v30 pages.
export { MPF_V20_COURSE_SLUG as MPF_V30_COURSE_SLUG, MPF_V20_SEATS_PER_BATCH as MPF_V30_SEATS_PER_BATCH } from "@/lib/landing/v20";
export const MPF_V30_LANDING_PATH = "/v30";
export const MPF_V30_CHECKOUT_PATH = "/v30/checkout";
export const MPF_V30_THANK_YOU_PATH = "/v30/thank-you";
export const MPF_V30_REFUND_PATH = "/v30/refund-policy";
export const MPF_V30_SOURCE = "mpf-v30";
export const MPF_V30_CONTENT_NAME = "Master Personal Finance with AI workshop";
// Images, fonts and lenis.min.js from the designer's folder live here.
export const MPF_V30_STATIC = "/mpf30";
