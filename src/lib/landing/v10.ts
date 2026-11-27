import { LANDING_PUBLIC_PATH } from "@/lib/landing/sources";

// Shared by the v10 landing route, its checkout page and its thank-you page.
// These are the addresses a buyer sees (under /personalfinance); the pages
// themselves are in src/app/(landing)/v10.
export const MMF_V10_LANDING_PATH = LANDING_PUBLIC_PATH.v10;
export const MMF_V10_CHECKOUT_PATH = `${MMF_V10_LANDING_PATH}/checkout`;
export const MMF_V10_THANK_YOU_PATH = `${MMF_V10_LANDING_PATH}/thank-you`;
// Sent with the order so the payment callback returns the buyer to the v10
// thank-you page (see createCashfreeOrder and payment/callback).
export const MMF_V10_SOURCE = "mmf-v10";
