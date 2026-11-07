// The site has no email service of its own (N8). Alerts go to Resend when
// RESEND_API_KEY + ALERT_FROM_EMAIL are set, else to ALERT_WEBHOOK_URL, else
// to the server log. Never include personal data in alert bodies.
export async function sendAlert(subject: string, body: string, recipients: string[]): Promise<void> {
  const to = recipients.filter(Boolean);
  if (to.length === 0) {
    console.error(`[alert] ${subject} — no alert recipients configured\n${body}`);
    return;
  }

  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.ALERT_FROM_EMAIL;
  if (resendKey && from) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, subject, text: body }),
      });
      if (!res.ok) console.error(`[alert] Resend responded ${res.status}`);
      return;
    } catch (error) {
      console.error("[alert] Resend request failed", error);
    }
  }

  const webhook = process.env.ALERT_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body, to }),
      });
      return;
    } catch (error) {
      console.error("[alert] webhook request failed", error);
    }
  }

  console.error(`[alert] ${subject}\n${body}`);
}
