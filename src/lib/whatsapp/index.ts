import { dryRunProvider } from "./dry-run";
import { interaktProvider } from "./interakt";
import type { SendResult, SendTemplateInput, WhatsAppProvider } from "./provider";

export type { SendResult, SendTemplateInput, WhatsAppProvider } from "./provider";

// Indian numbers to E.164. Returns null when the number cannot be a valid
// mobile number; callers skip and record instead of sending.
export function normalizeIndianPhone(raw: string): string | null {
  const digits = (raw || "").replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]/.test(digits)) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91") && /^[6-9]/.test(digits.slice(2))) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith("0") && /^[6-9]/.test(digits.slice(1))) return `+91${digits.slice(1)}`;
  if (raw.trim().startsWith("+") && digits.length >= 11 && digits.length <= 15) return `+${digits}`;
  return null;
}

export function isDryRun(): boolean {
  if (process.env.DRY_RUN === "true") return true;
  if (process.env.DRY_RUN === "false") return false;
  return process.env.NODE_ENV !== "production";
}

export function getProvider(): WhatsAppProvider {
  if (isDryRun()) return dryRunProvider;
  switch ((process.env.WA_PROVIDER || "").toLowerCase()) {
    case "interakt":
      return interaktProvider;
    case "":
    case "dry-run":
      return dryRunProvider;
    default:
      throw new Error(`Unknown WA_PROVIDER: ${process.env.WA_PROVIDER}`);
  }
}

export const TEMPLATE_ENV = {
  W1: "WA_TPL_CONFIRMATION",
  W2: "WA_TPL_REMINDER_24H",
  W3: "WA_TPL_REMINDER_1H",
  W4: "WA_TPL_SURVEY",
} as const;

export type TemplateKey = keyof typeof TEMPLATE_ENV;

export function templateName(key: TemplateKey): string {
  return process.env[TEMPLATE_ENV[key]] || `mmf_${key.toLowerCase()}`;
}

export async function sendTemplate(input: SendTemplateInput): Promise<SendResult> {
  return getProvider().sendTemplate(input);
}
