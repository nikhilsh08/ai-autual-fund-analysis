export interface SendTemplateInput {
  // E.164, e.g. +919876543210
  phone: string;
  template: string;
  params: string[];
  idempotencyKey: string;
}

export interface SendResult {
  ok: boolean;
  providerMessageId?: string;
  error?: string;
}

export interface WhatsAppProvider {
  readonly name: string;
  sendTemplate(input: SendTemplateInput): Promise<SendResult>;
}
