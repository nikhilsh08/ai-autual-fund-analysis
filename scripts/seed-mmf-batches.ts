// Staging only during development. The owner runs it once in production.
//
//   MMF_FIRST_SATURDAY=2026-11-21 MMF_PRICE=1999 MMF_START_TIME=19:00 \
//   MMF_CLOSE_HOURS=19 MMF_ALERT_EMAILS=ops@example.com \
//   node scripts/seed-mmf-batches.ts
//
// Optional: MMF_COURSE_SLUG (default master-mutual-funds-invest-smarter),
// MMF_LANGUAGE, MMF_DURATION_MINUTES (120), MMF_FUTURE_BATCHES (2),
// MMF_NEW_BATCH_STATUS (DRAFT|OPEN), MMF_WHATSAPP_GROUP, MMF_SURVEY_URL.
import { PrismaClient } from "@prisma/client";
import { istToUtc, isValidTimeHm } from "../src/lib/ist.ts";
import { computeBatchTimes, nextDay1Dates } from "../src/lib/batches/schedule.ts";

const env = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (value === undefined || value === "") throw new Error(`Missing ${key}`);
  return value;
};

async function main() {
  const prisma = new PrismaClient();
  const slug = env("MMF_COURSE_SLUG", "master-mutual-funds-invest-smarter");
  const firstSaturday = env("MMF_FIRST_SATURDAY");
  const price = Number(env("MMF_PRICE"));
  const startTime = env("MMF_START_TIME");
  const closeHours = Number(env("MMF_CLOSE_HOURS"));
  const alertEmails = env("MMF_ALERT_EMAILS").split(",").map((s) => s.trim()).filter(Boolean);
  const durationMinutes = Number(process.env.MMF_DURATION_MINUTES ?? 120);
  const futureBatchCount = Number(process.env.MMF_FUTURE_BATCHES ?? 2);
  const newBatchStatus = (process.env.MMF_NEW_BATCH_STATUS ?? "DRAFT") as "DRAFT" | "OPEN";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(firstSaturday)) throw new Error("MMF_FIRST_SATURDAY must be YYYY-MM-DD");
  if (!isValidTimeHm(startTime)) throw new Error("MMF_START_TIME must be HH:mm (IST)");
  if (!(price > 0)) throw new Error("MMF_PRICE must be a positive number of rupees");
  if (!(closeHours >= 0)) throw new Error("MMF_CLOSE_HOURS must be >= 0");

  const anchor = istToUtc(firstSaturday, "00:00");
  const anchorIstWeekday = new Date(anchor.getTime() + 330 * 60_000).getUTCDay();
  if (anchorIstWeekday !== 6) throw new Error(`${firstSaturday} is not a Saturday in IST`);

  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) throw new Error(`Course with slug ${slug} not found`);

  await prisma.course.update({ where: { id: course.id }, data: { useBatches: true } });
  console.log(`Course ${course.id} (${course.title}): useBatches = true`);

  const settings = await prisma.batchSettings.upsert({
    where: { courseId: course.id },
    update: {},
    create: {
      courseId: course.id,
      anchorDay1Date: anchor,
      cadenceDays: 14,
      defaultPriceRupees: price,
      defaultStartTimeIst: startTime,
      durationMinutes,
      defaultLanguage: process.env.MMF_LANGUAGE || null,
      closeHoursBefore: closeHours,
      newBatchStatus,
      futureBatchCount,
      autoCreate: true,
      defaultWhatsappGroupLink: process.env.MMF_WHATSAPP_GROUP || null,
      defaultSurveyUrl: process.env.MMF_SURVEY_URL || null,
      alertEmails,
    },
  });
  console.log(`BatchSettings ${settings.id} ready (anchor ${firstSaturday}, ₹${price}, ${startTime} IST)`);

  const existing = await prisma.batch.count({ where: { courseId: course.id } });
  if (existing > 0) {
    console.log(`${existing} batch(es) already exist; not creating a first batch.`);
  } else {
    const [day1Date] = nextDay1Dates(anchor, 14, new Date(), 1);
    const times = computeBatchTimes({ day1Date, startTimeIst: startTime, closeHoursBefore: closeHours });
    const batch = await prisma.batch.create({
      data: {
        courseId: course.id,
        batchNumber: 1,
        ...times,
        durationMinutes,
        startTimeIst: startTime,
        language: process.env.MMF_LANGUAGE || null,
        priceRupees: price,
        status: "DRAFT",
        whatsappGroupLink: process.env.MMF_WHATSAPP_GROUP || null,
        surveyUrl: process.env.MMF_SURVEY_URL || null,
        createdBy: "seed",
      },
    });
    console.log(`Batch 1 created as DRAFT: ${batch.id}, day 1 ${times.day1StartAt.toISOString()}`);
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
