// The public address a request arrived on, e.g. "https://www.cashflowcrew.in"
// or "https://cashflowcrew-v10.onrender.com". Read from the headers the host's
// proxy sets, so the same build works on any domain without a setting.

const first = (value: string | null) => value?.split(",")[0]?.trim() || null;

export function requestSiteOrigin(req: Request): string | null {
  const host = first(req.headers.get("x-forwarded-host")) ?? first(req.headers.get("host"));
  if (!host) return null;
  const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
  const proto = first(req.headers.get("x-forwarded-proto")) ?? (local ? "http" : "https");
  return `${proto}://${host}`;
}

// For a call made by a page of this site (same-origin fetch): the site's
// address as the buyer's browser sees it. Null for any other caller, so a
// request from elsewhere can never choose where a buyer is sent.
export function sameSiteOrigin(req: Request): string | null {
  const origin = req.headers.get("origin");
  const host = first(req.headers.get("x-forwarded-host")) ?? first(req.headers.get("host"));
  if (!origin || !host) return null;
  try {
    return new URL(origin).host === host ? new URL(origin).origin : null;
  } catch {
    return null;
  }
}
