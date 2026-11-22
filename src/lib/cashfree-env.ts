// Which Cashfree environment this deployment uses. The server (order
// creation) and the browser (payment window) must agree, or Cashfree rejects
// the payment session, so both read it from here.
//
// NEXT_PUBLIC_CASHFREE_ENVIRONMENT="PRODUCTION" in any letter case means live
// payments. Anything else, including unset, means sandbox: a typo can never
// switch a test deployment to live money.
export const isCashfreeProduction = (): boolean =>
  (process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT ?? "").trim().toUpperCase() === "PRODUCTION";

export const cashfreeMode = (): "production" | "sandbox" => (isCashfreeProduction() ? "production" : "sandbox");
