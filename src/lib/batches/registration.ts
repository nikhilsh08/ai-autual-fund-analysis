import { dataBasePrisma } from "@/lib/dbPrisma";
import { registerInZohoWebinar } from "@/lib/zoho-webinar";
import { sendConfirmation } from "./messaging";

// Runs after the payment transaction has committed. Each step records its own
// failure and never throws, so payment confirmation is never blocked.
export async function processBatchRegistrationForOrder(orderDbId: string): Promise<void> {
  const registration = await dataBasePrisma.batchRegistration.findUnique({
    where: { orderId: orderDbId },
    select: { id: true },
  });
  if (!registration) return;

  try {
    await registerInZohoWebinar(registration.id);
  } catch (error) {
    console.error(`[batches] Zoho step failed for order ${orderDbId}`, error);
  }

  try {
    await sendConfirmation(registration.id);
  } catch (error) {
    console.error(`[batches] W1 step failed for order ${orderDbId}`, error);
  }
}
