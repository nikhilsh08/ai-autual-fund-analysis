// Shared by the v20 landing route (Master Personal Finance with AI), its
// checkout route and its thank-you route.
export const MPF_V20_COURSE_SLUG = "master-personal-finance-with-ai";
export const MPF_V20_LANDING_PATH = "/v20";
export const MPF_V20_CHECKOUT_PATH = "/v20/checkout";
export const MPF_V20_THANK_YOU_PATH = "/v20/thank-you";
// Sent with the order so the payment callback returns the buyer to the v20
// thank-you page (see createCashfreeOrder and payment/callback).
export const MPF_V20_SOURCE = "mpf-v20";
export const MPF_V20_CONTENT_NAME = "Master Personal Finance with AI workshop";
// The page says "Only 50 seats per batch" and counts down from 50 once 15 or
// fewer are left. The count comes from paid bookings; checkout does not stop
// at 50 (same as v10, see OWNER_DECISIONS D2).
export const MPF_V20_SEATS_PER_BATCH = 50;
