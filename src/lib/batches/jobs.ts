import { dataBasePrisma } from "@/lib/dbPrisma";
import { sendAlert } from "@/lib/alerts";
import { addDays, addMinutes, formatIstDate } from "@/lib/ist";
import { registerInZohoWebinar } from "@/lib/zoho-webinar";
import { normalizeIndianPhone, sendTemplate, templateName } from "@/lib/whatsapp";
import { surveyUrlForBatch, w2Params, w3Params, w4Params } from "@/lib/whatsapp/templates";
import { groupLinkFor, sendConfirmation } from "./messaging";
import { reminderDue } from "./reminders";
import { computeBatchTimes, day2EndAt, isOnSale, nextDay1Dates } from "./schedule";

type Prisma = typeof dataBasePrisma;

export interface JobDeps {
  prisma: Prisma;
  now: Date;
  sendAlert: typeof sendAlert;
  registerInZoho: typeof registerInZohoWebinar;
  sendTemplate: typeof sendTemplate;
  sendConfirmation: typeof sendConfirmation;
}

const defaultDeps = (): JobDeps => ({
  prisma: dataBasePrisma,
  now: new Date(),
  sendAlert,
  registerInZoho: registerInZohoWebinar,
  sendTemplate,
  sendConfirmation,
});

export interface BatchesJobReport {
  closed: number;
  completed: number;
  created: number;
  alerts: string[];
}

// Daily. Tidies statuses, creates future batches, raises alerts. Sales never
// depend on this job: what is on sale is computed at request time.
export async function runBatchesJob(overrides: Partial<JobDeps> = {}): Promise<BatchesJobReport> {
  const deps = { ...defaultDeps(), ...overrides };
  const { prisma, now } = deps;
  const report: BatchesJobReport = { closed: 0, completed: 0, created: 0, alerts: [] };

  const closedResult = await prisma.batch.updateMany({
    where: { status: "OPEN", bookingCloseAt: { lte: now } },
    data: { status: "CLOSED" },
  });
  report.closed = closedResult.count;

  const notCompleted = await prisma.batch.findMany({
    where: { status: { in: ["OPEN", "CLOSED"] } },
  });
  for (const batch of notCompleted) {
    if (day2EndAt(batch).getTime() <= now.getTime()) {
      await prisma.batch.update({ where: { id: batch.id }, data: { status: "COMPLETED" } });
      report.completed += 1;
    }
  }

  const allSettings = await prisma.batchSettings.findMany();
  for (const settings of allSettings) {
    const existing = await prisma.batch.findMany({
      where: { courseId: settings.courseId },
      orderBy: { batchNumber: "desc" },
    });
    let nextNumber = (existing[0]?.batchNumber ?? 0) + 1;

    if (settings.autoCreate) {
      const day1Dates = nextDay1Dates(settings.anchorDay1Date, settings.cadenceDays, now, settings.futureBatchCount);
      for (const day1Date of day1Dates) {
        const times = computeBatchTimes({
          day1Date,
          startTimeIst: settings.defaultStartTimeIst,
          closeHoursBefore: settings.closeHoursBefore,
        });
        const already = existing.find((b) => b.day1StartAt.getTime() === times.day1StartAt.getTime());
        if (already) continue;
        await prisma.batch.create({
          data: {
            courseId: settings.courseId,
            batchNumber: nextNumber,
            day1StartAt: times.day1StartAt,
            day2StartAt: times.day2StartAt,
            bookingCloseAt: times.bookingCloseAt,
            durationMinutes: settings.durationMinutes,
            startTimeIst: settings.defaultStartTimeIst,
            language: settings.defaultLanguage,
            priceRupees: settings.defaultPriceRupees,
            status: settings.newBatchStatus,
            whatsappGroupLink: settings.defaultWhatsappGroupLink,
            surveyUrl: settings.defaultSurveyUrl,
            createdBy: "auto",
          },
        });
        nextNumber += 1;
        report.created += 1;
      }
    }

    const current = await prisma.batch.findMany({ where: { courseId: settings.courseId } });
    const onSale = current.filter((b) => isOnSale(b, now));
    if (onSale.length === 0) {
      report.alerts.push(`Nothing is on sale for course ${settings.courseId}.`);
    }
    for (const batch of current) {
      const label = `Batch ${batch.batchNumber} (${formatIstDate(batch.day1StartAt)})`;
      const closeSoon = batch.bookingCloseAt.getTime() - now.getTime() <= 3 * 86_400_000;
      if (batch.status === "DRAFT" && closeSoon && batch.bookingCloseAt.getTime() > now.getTime()) {
        report.alerts.push(`${label} is still DRAFT and closes within 3 days.`);
      }
      if (batch.status === "OPEN") {
        if (!batch.zohoWebinarKeyDay1 || !batch.zohoWebinarKeyDay2) {
          report.alerts.push(`${label} is OPEN without both Zoho webinar keys.`);
        }
        if (!batch.whatsappGroupLink && !settings.defaultWhatsappGroupLink) {
          report.alerts.push(`${label} is OPEN without a WhatsApp group link.`);
        }
      }
    }

    if (report.alerts.length > 0) {
      await deps.sendAlert("Master Mutual Funds batches need attention", report.alerts.join("\n"), settings.alertEmails);
    }
  }

  return report;
}

export interface MessagesJobReport {
  zohoRetried: number;
  zohoAlerted: number;
  w1: number;
  w2: number;
  w3: number;
  w4: number;
  skippedInvalidPhone: number;
}

const ZOHO_MAX_ATTEMPTS = 5;
const ZOHO_ALERT_AFTER_MINUTES = 30;

// Every ~15 minutes. Every step is idempotent through the msg*At fields and
// zohoState, so overlapping or repeated runs cannot double-send.
export async function runMessagesJob(overrides: Partial<JobDeps> = {}): Promise<MessagesJobReport> {
  const deps = { ...defaultDeps(), ...overrides };
  const { prisma, now } = deps;
  const report: MessagesJobReport = { zohoRetried: 0, zohoAlerted: 0, w1: 0, w2: 0, w3: 0, w4: 0, skippedInvalidPhone: 0 };

  // 1. Zoho retries with backoff by attempt count (5 min × attempts).
  const pending = await prisma.batchRegistration.findMany({
    where: { zohoState: { in: ["PENDING", "FAILED"] }, zohoAttempts: { lt: ZOHO_MAX_ATTEMPTS } },
    include: { batch: true },
  });
  for (const registration of pending) {
    const nextAllowed = addMinutes(registration.updatedAt, 5 * registration.zohoAttempts);
    if (registration.zohoAttempts > 0 && nextAllowed.getTime() > now.getTime()) continue;
    await deps.registerInZoho(registration.id);
    report.zohoRetried += 1;
  }

  // 2. Alert once when a registration has been failing for 30 minutes.
  const failingSince = addMinutes(now, -ZOHO_ALERT_AFTER_MINUTES);
  const stuck = await prisma.batchRegistration.findMany({
    where: { zohoState: { not: "REGISTERED" }, zohoAlertedAt: null, createdAt: { lte: failingSince } },
    include: { batch: { select: { courseId: true, batchNumber: true } } },
  });
  for (const registration of stuck) {
    const settings = await prisma.batchSettings.findUnique({ where: { courseId: registration.batch.courseId } });
    await deps.sendAlert(
      "Zoho registration still failing",
      `Order ${registration.orderId} (batch ${registration.batch.batchNumber}) has not been registered in Zoho Webinar for ${ZOHO_ALERT_AFTER_MINUTES} minutes. Last error: ${registration.zohoLastError ?? "none"}.`,
      settings?.alertEmails ?? [],
    );
    await prisma.batchRegistration.update({ where: { id: registration.id }, data: { zohoAlertedAt: now } });
    report.zohoAlerted += 1;
  }

  // 3. W1 for registrations whose link arrived after payment.
  const needConfirmation = await prisma.batchRegistration.findMany({
    where: { zohoState: "REGISTERED", whatsappOptIn: true, msgConfirmationAt: null },
    select: { id: true },
  });
  for (const registration of needConfirmation) {
    if (await deps.sendConfirmation(registration.id)) report.w1 += 1;
  }

  // 4. Reminders and survey, by window.
  const active = await prisma.batch.findMany({
    where: { status: { in: ["OPEN", "CLOSED"] }, day2StartAt: { gte: addDays(now, -2) } },
  });
  for (const batch of active) {
    const due = {
      W2: reminderDue("W2", batch, now),
      W3_DAY1: reminderDue("W3_DAY1", batch, now),
      W3_DAY2: reminderDue("W3_DAY2", batch, now),
      W4: reminderDue("W4", batch, now),
    };
    if (!due.W2 && !due.W3_DAY1 && !due.W3_DAY2 && !due.W4) continue;

    const registrations = await prisma.batchRegistration.findMany({
      where: { batchId: batch.id, whatsappOptIn: true, zohoState: "REGISTERED" },
    });

    let surveyBase = batch.surveyUrl;
    if (!surveyBase) {
      const settings = await prisma.batchSettings.findUnique({ where: { courseId: batch.courseId } });
      surveyBase = settings?.defaultSurveyUrl ?? null;
    }
    void groupLinkFor;

    for (const registration of registrations) {
      const phone = normalizeIndianPhone(registration.phone);
      if (!phone) {
        report.skippedInvalidPhone += 1;
        continue;
      }

      const send = async (
        field: "msgReminder24hAt" | "msgReminderDay1At" | "msgReminderDay2At" | "msgSurveyAt",
        template: "W2" | "W3" | "W4",
        params: string[],
        counter: "w2" | "w3" | "w4",
      ) => {
        if (registration[field]) return;
        const result = await deps.sendTemplate({
          phone,
          template: templateName(template),
          params,
          idempotencyKey: `${field}:${registration.id}`,
        });
        if (!result.ok) {
          console.error(`[whatsapp] ${template} failed for registration ${registration.id}: ${result.error}`);
          return;
        }
        await prisma.batchRegistration.update({ where: { id: registration.id }, data: { [field]: now } });
        report[counter] += 1;
      };

      if (due.W2 && registration.joinLinkDay1) {
        await send("msgReminder24hAt", "W2", w2Params({ name: registration.name, batch, joinLink: registration.joinLinkDay1 }), "w2");
      }
      if (due.W3_DAY1 && registration.joinLinkDay1) {
        await send("msgReminderDay1At", "W3", w3Params({ name: registration.name, sessionStartAt: batch.day1StartAt, joinLink: registration.joinLinkDay1 }), "w3");
      }
      if (due.W3_DAY2 && registration.joinLinkDay2) {
        await send("msgReminderDay2At", "W3", w3Params({ name: registration.name, sessionStartAt: batch.day2StartAt, joinLink: registration.joinLinkDay2 }), "w3");
      }
      if (due.W4 && surveyBase) {
        await send("msgSurveyAt", "W4", w4Params({ name: registration.name, surveyUrl: surveyUrlForBatch(surveyBase, batch.batchNumber) }), "w4");
      }
    }
  }

  return report;
}
