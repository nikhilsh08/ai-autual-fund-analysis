// Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` automatically when
// the env var is set; an external scheduler must send the same header.
export function isCronAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization") || "";
  return header === `Bearer ${secret}`;
}
