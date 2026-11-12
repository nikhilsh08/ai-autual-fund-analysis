import { dataBasePrisma } from "@/lib/dbPrisma";
import { normalizeIndianPhone, sendTemplate, templateName } from "@/lib/whatsapp";
import { w1Params } from "@/lib/whatsapp/templates";

export async function groupLinkFor(batch: { courseId: string; whatsappGroupLink: string | null }) {
  if (batch.whatsappGroupLink) return batch.whatsappGroupLink;
  const settings = await dataBasePrisma.batchSettings.findUnique({
    where: { courseId: batch.courseId },
    select: { defaultWhatsappGroupLink: true },
  });
  return settings?.defaultWhatsappGroupLink ?? null;
}

// W1 — right after payment, once the join link exists. Idempotent via
// msgConfirmationAt; the messages job calls this again for late links.
export async function sendConfirmation(registrationId: string): Promise<boolean> {
  const registration = await dataBasePrisma.batchRegistration.findUnique({
    where: { id: registrationId },
    include: { batch: true },
  });
  if (!registration) return false;
  if (!registration.whatsappOptIn || registration.msgConfirmationAt) return false;
  if (registration.zohoState !== "REGISTERED" || !registration.joinLinkDay1) return false;

  const phone = normalizeIndianPhone(registration.phone);
  if (!phone) {
    await dataBasePrisma.batchRegistration.update({
      where: { id: registrationId },
      data: { msgConfirmationAt: new Date() },
    });
    console.warn(`[whatsapp] registration ${registrationId}: invalid phone, confirmation skipped`);
    return false;
  }

  const result = await sendTemplate({
    phone,
    template: templateName("W1"),
    params: w1Params({
      name: registration.name,
      batch: registration.batch,
      joinLink: registration.joinLinkDay1,
      groupLink: await groupLinkFor(registration.batch),
      orderRef: registration.orderId,
    }),
    idempotencyKey: `w1:${registration.id}`,
  });

  if (!result.ok) {
    console.error(`[whatsapp] W1 failed for registration ${registrationId}: ${result.error}`);
    return false;
  }

  await dataBasePrisma.batchRegistration.update({
    where: { id: registrationId },
    data: { msgConfirmationAt: new Date() },
  });
  return true;
}
