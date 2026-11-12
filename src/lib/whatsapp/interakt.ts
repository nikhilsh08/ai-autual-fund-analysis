import axios from "axios";
import type { SendResult, SendTemplateInput, WhatsAppProvider } from "./provider";

// Interakt template send. Swap this file for another provider's adapter if
// OWNER D3 picks a different one; the rest of the code only uses the
// WhatsAppProvider interface.
const ENDPOINT = "https://api.interakt.ai/v1/public/message/";

export const interaktProvider: WhatsAppProvider = {
  name: "interakt",
  async sendTemplate(input: SendTemplateInput): Promise<SendResult> {
    const apiKey = process.env.WA_API_KEY;
    if (!apiKey) return { ok: false, error: "WA_API_KEY missing" };

    const countryCode = input.phone.startsWith("+91") ? "+91" : input.phone.slice(0, 3);
    const phoneNumber = input.phone.slice(countryCode.length);

    try {
      const response = await axios.post(
        ENDPOINT,
        {
          countryCode,
          phoneNumber,
          callbackData: input.idempotencyKey,
          type: "Template",
          template: {
            name: input.template,
            languageCode: process.env.WA_TEMPLATE_LANG || "en",
            bodyValues: input.params,
          },
        },
        { headers: { Authorization: `Basic ${apiKey}`, "Content-Type": "application/json" } },
      );
      return { ok: true, providerMessageId: String(response.data?.id ?? "") };
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      return { ok: false, error: `interakt_http_${status ?? "err"}` };
    }
  },
};
