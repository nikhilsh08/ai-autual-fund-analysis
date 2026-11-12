import type { SendResult, SendTemplateInput, WhatsAppProvider } from "./provider";

// Logs instead of sending. Phone numbers are masked; template params may
// contain names, so only their count is logged.
export const dryRunProvider: WhatsAppProvider = {
  name: "dry-run",
  async sendTemplate(input: SendTemplateInput): Promise<SendResult> {
    const masked = input.phone.replace(/\d(?=\d{4})/g, "*");
    console.log(
      `[whatsapp:dry-run] ${input.template} -> ${masked} (${input.params.length} params, key ${input.idempotencyKey})`,
    );
    return { ok: true, providerMessageId: `dry-run:${input.idempotencyKey}` };
  },
};
