import { z } from "zod";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { formatIstDate, istToUtc, istYmd, isValidTimeHm, toIstParts } from "@/lib/ist";
import { computeBatchTimes, isOnSale, nextDay1Dates } from "./schedule";

const ymd = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD");
const hm = z.string().refine(isValidTimeHm, "HH:mm");
const optionalText = z.string().trim().max(500).nullable().optional();

export const batchCreateSchema = z.object({
  courseId: z.string().min(1),
  day1Date: ymd,
  startTimeIst: hm,
  priceRupees: z.number().positive(),
  closeHoursBefore: z.number().min(0),
  durationMinutes: z.number().int().positive().optional(),
  language: optionalText,
  zohoWebinarKeyDay1: optionalText,
  zohoWebinarKeyDay2: optionalText,
  zohoInstanceIdDay1: optionalText,
  zohoInstanceIdDay2: optionalText,
  whatsappGroupLink: optionalText,
  surveyUrl: optionalText,
});

// Only these fields can be edited; status moves through open/close only.
export const batchPatchSchema = z
  .object({
    day1Date: ymd.optional(),
    startTimeIst: hm.optional(),
    closeHoursBefore: z.number().min(0).optional(),
    priceRupees: z.number().positive().optional(),
    durationMinutes: z.number().int().positive().optional(),
    language: optionalText,
    zohoWebinarKeyDay1: optionalText,
    zohoWebinarKeyDay2: optionalText,
    zohoInstanceIdDay1: optionalText,
    zohoInstanceIdDay2: optionalText,
    whatsappGroupLink: optionalText,
    surveyUrl: optionalText,
  })
  .strict();

export const batchSettingsSchema = z.object({
  courseId: z.string().min(1),
  anchorDay1Date: ymd,
  cadenceDays: z.number().int().positive().default(14),
  defaultPriceRupees: z.number().positive(),
  defaultStartTimeIst: hm,
  durationMinutes: z.number().int().positive().default(120),
  defaultLanguage: optionalText,
  closeHoursBefore: z.number().min(0),
  newBatchStatus: z.enum(["DRAFT", "OPEN"]).default("DRAFT"),
  futureBatchCount: z.number().int().min(0).max(12).default(2),
  autoCreate: z.boolean().default(true),
  defaultWhatsappGroupLink: optionalText,
  defaultSurveyUrl: optionalText,
  alertEmails: z.array(z.string().email()).default([]),
});

export function isIstSaturday(dateYmd: string): boolean {
  return toIstParts(istToUtc(dateYmd, "00:00")).weekday === 6;
}

const emptyToNull = (v: string | null | undefined) => (v === undefined ? undefined : v === "" ? null : v);

export async function createBatch(input: z.infer<typeof batchCreateSchema>, createdBy: string) {
  if (!isIstSaturday(input.day1Date)) throw new AdminError("day1Date must be a Saturday (IST)");

  const settings = await dataBasePrisma.batchSettings.findUnique({ where: { courseId: input.courseId } });
  const times = computeBatchTimes({
    day1Date: istToUtc(input.day1Date, "00:00"),
    startTimeIst: input.startTimeIst,
    closeHoursBefore: input.closeHoursBefore,
  });
  const last = await dataBasePrisma.batch.findFirst({
    where: { courseId: input.courseId },
    orderBy: { batchNumber: "desc" },
    select: { batchNumber: true },
  });

  return dataBasePrisma.batch.create({
    data: {
      courseId: input.courseId,
      batchNumber: (last?.batchNumber ?? 0) + 1,
      ...times,
      durationMinutes: input.durationMinutes ?? settings?.durationMinutes ?? 120,
      startTimeIst: input.startTimeIst,
      language: emptyToNull(input.language) ?? settings?.defaultLanguage ?? null,
      priceRupees: input.priceRupees,
      status: "DRAFT",
      zohoWebinarKeyDay1: emptyToNull(input.zohoWebinarKeyDay1) ?? null,
      zohoWebinarKeyDay2: emptyToNull(input.zohoWebinarKeyDay2) ?? null,
      zohoInstanceIdDay1: emptyToNull(input.zohoInstanceIdDay1) ?? null,
      zohoInstanceIdDay2: emptyToNull(input.zohoInstanceIdDay2) ?? null,
      whatsappGroupLink: emptyToNull(input.whatsappGroupLink) ?? settings?.defaultWhatsappGroupLink ?? null,
      surveyUrl: emptyToNull(input.surveyUrl) ?? settings?.defaultSurveyUrl ?? null,
      createdBy,
    },
  });
}

export async function patchBatch(id: string, input: z.infer<typeof batchPatchSchema>) {
  const batch = await dataBasePrisma.batch.findUnique({ where: { id } });
  if (!batch) throw new AdminError("Batch not found", 404);

  const data: Record<string, unknown> = {};
  for (const key of [
    "priceRupees", "durationMinutes", "language", "zohoWebinarKeyDay1", "zohoWebinarKeyDay2",
    "zohoInstanceIdDay1", "zohoInstanceIdDay2", "whatsappGroupLink", "surveyUrl",
  ] as const) {
    if (input[key] !== undefined) data[key] = typeof input[key] === "string" ? emptyToNull(input[key] as string) : input[key];
  }

  const timingChanged = input.day1Date !== undefined || input.startTimeIst !== undefined || input.closeHoursBefore !== undefined;
  if (timingChanged) {
    const day1Date = input.day1Date ?? istYmd(batch.day1StartAt);
    if (!isIstSaturday(day1Date)) throw new AdminError("day1Date must be a Saturday (IST)");
    const startTimeIst = input.startTimeIst ?? batch.startTimeIst;
    const currentCloseHours = (batch.day1StartAt.getTime() - batch.bookingCloseAt.getTime()) / 3_600_000;
    const closeHoursBefore = input.closeHoursBefore ?? currentCloseHours;
    Object.assign(data, computeBatchTimes({ day1Date: istToUtc(day1Date, "00:00"), startTimeIst, closeHoursBefore }), { startTimeIst });
  }

  return dataBasePrisma.batch.update({ where: { id }, data });
}

export async function openBatch(id: string, now: Date = new Date()) {
  const batch = await dataBasePrisma.batch.findUnique({ where: { id } });
  if (!batch) throw new AdminError("Batch not found", 404);
  const settings = await dataBasePrisma.batchSettings.findUnique({ where: { courseId: batch.courseId } });

  const problems: string[] = [];
  if (!(batch.priceRupees > 0)) problems.push("price must be greater than 0");
  if (!batch.zohoWebinarKeyDay1 || !batch.zohoWebinarKeyDay2) problems.push("both Zoho webinar keys are required");
  if (!batch.whatsappGroupLink && !settings?.defaultWhatsappGroupLink) problems.push("a WhatsApp group link is required");
  if (batch.bookingCloseAt.getTime() <= now.getTime()) problems.push("booking close time has already passed");
  if (batch.status === "COMPLETED") problems.push("a completed batch cannot be reopened");
  if (problems.length > 0) throw new AdminError(`Cannot open: ${problems.join("; ")}`);

  return dataBasePrisma.batch.update({ where: { id }, data: { status: "OPEN" } });
}

export async function closeBatch(id: string) {
  const batch = await dataBasePrisma.batch.findUnique({ where: { id } });
  if (!batch) throw new AdminError("Batch not found", 404);
  if (batch.status !== "OPEN") throw new AdminError("Only an OPEN batch can be closed");
  return dataBasePrisma.batch.update({ where: { id }, data: { status: "CLOSED" } });
}

export async function listBatches(courseId: string | null, now: Date = new Date()) {
  const batches = await dataBasePrisma.batch.findMany({
    where: courseId ? { courseId } : undefined,
    orderBy: { day1StartAt: "desc" },
  });
  if (batches.length === 0) return [];

  const ids = batches.map((b) => b.id);
  const [paidItems, registrations, settings] = await Promise.all([
    dataBasePrisma.orderItem.findMany({
      where: { batchId: { in: ids }, order: { status: "PAID" } },
      select: { batchId: true },
    }),
    dataBasePrisma.batchRegistration.findMany({
      where: { batchId: { in: ids } },
      select: { batchId: true, zohoState: true },
    }),
    dataBasePrisma.batchSettings.findMany({ select: { courseId: true, defaultWhatsappGroupLink: true } }),
  ]);

  const booked = new Map<string, number>();
  for (const item of paidItems) if (item.batchId) booked.set(item.batchId, (booked.get(item.batchId) ?? 0) + 1);
  const zoho = new Map<string, { pending: number; failed: number }>();
  for (const r of registrations) {
    const entry = zoho.get(r.batchId) ?? { pending: 0, failed: 0 };
    if (r.zohoState === "PENDING") entry.pending += 1;
    if (r.zohoState === "FAILED") entry.failed += 1;
    zoho.set(r.batchId, entry);
  }
  const defaultGroup = new Map(settings.map((s) => [s.courseId, s.defaultWhatsappGroupLink]));

  return batches.map((b) => ({
    ...b,
    day1Text: formatIstDate(b.day1StartAt),
    bookedCount: booked.get(b.id) ?? 0,
    isOnSaleNow: isOnSale(b, now),
    zohoReady: Boolean(b.zohoWebinarKeyDay1 && b.zohoWebinarKeyDay2),
    whatsappReady: Boolean(b.whatsappGroupLink || defaultGroup.get(b.courseId)),
    zohoPending: zoho.get(b.id)?.pending ?? 0,
    zohoFailed: zoho.get(b.id)?.failed ?? 0,
  }));
}

export interface GuestRow {
  registrationId: string;
  name: string;
  email: string;
  phone: string;
  paidAmount: number | null;
  coupon: string | null;
  orderId: string | null;
  paidAt: Date | null;
  zohoState: string;
  zohoLastError: string | null;
  joinLinkPresent: boolean;
  whatsappOptIn: boolean;
  msgConfirmationAt: Date | null;
  msgReminder24hAt: Date | null;
  msgReminderDay1At: Date | null;
  msgReminderDay2At: Date | null;
  msgSurveyAt: Date | null;
}

export async function listGuests(batchId: string, filters: { search?: string | null; state?: string | null }) {
  const registrations = await dataBasePrisma.batchRegistration.findMany({
    where: { batchId, ...(filters.state ? { zohoState: filters.state as "PENDING" | "REGISTERED" | "FAILED" } : {}) },
    orderBy: { createdAt: "asc" },
  });
  const orderIds = registrations.map((r) => r.orderId);
  const orders = await dataBasePrisma.order.findMany({
    where: { id: { in: orderIds } },
    select: {
      id: true,
      orderId: true,
      totalAmount: true,
      couponId: true,
      createdAt: true,
      paymentTransaction: { select: { createdAt: true } },
    },
  });
  const couponIds = [...new Set(orders.map((o) => o.couponId).filter((c): c is string => Boolean(c)))];
  const coupons = couponIds.length
    ? await dataBasePrisma.coupon.findMany({ where: { id: { in: couponIds } }, select: { id: true, code: true } })
    : [];
  const orderById = new Map(orders.map((o) => [o.id, o]));
  const couponById = new Map(coupons.map((c) => [c.id, c.code]));

  const needle = filters.search?.trim().toLowerCase();
  const rows: GuestRow[] = registrations
    .map((r) => {
      const order = orderById.get(r.orderId);
      return {
        registrationId: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        paidAmount: order?.totalAmount ?? null,
        coupon: order?.couponId ? (couponById.get(order.couponId) ?? null) : null,
        orderId: order?.orderId ?? null,
        paidAt: order?.paymentTransaction?.createdAt ?? order?.createdAt ?? null,
        zohoState: r.zohoState,
        zohoLastError: r.zohoLastError,
        joinLinkPresent: Boolean(r.joinLinkDay1 && r.joinLinkDay2),
        whatsappOptIn: r.whatsappOptIn,
        msgConfirmationAt: r.msgConfirmationAt,
        msgReminder24hAt: r.msgReminder24hAt,
        msgReminderDay1At: r.msgReminderDay1At,
        msgReminderDay2At: r.msgReminderDay2At,
        msgSurveyAt: r.msgSurveyAt,
      };
    })
    .filter((row) =>
      !needle ||
      [row.name, row.email, row.phone, row.orderId ?? ""].some((v) => v.toLowerCase().includes(needle)),
    );

  const totals = {
    booked: rows.length,
    pending: rows.filter((r) => r.zohoState === "PENDING").length,
    failed: rows.filter((r) => r.zohoState === "FAILED").length,
    revenueRupees: rows.reduce((sum, r) => sum + (r.paidAmount ?? 0), 0),
  };
  return { rows, totals };
}

export const GUEST_CSV_HEADER = [
  "Name", "Email", "Phone", "Paid amount (INR)", "Coupon", "Order ID", "Paid at", "Zoho state",
  "Join link", "WhatsApp opt-in", "Confirmation sent", "24h reminder", "Day 1 reminder", "Day 2 reminder", "Survey sent",
];

export function guestCsvRow(row: GuestRow): unknown[] {
  return [
    row.name, row.email, row.phone, row.paidAmount, row.coupon, row.orderId, row.paidAt, row.zohoState,
    row.joinLinkPresent ? "yes" : "no", row.whatsappOptIn ? "yes" : "no",
    row.msgConfirmationAt, row.msgReminder24hAt, row.msgReminderDay1At, row.msgReminderDay2At, row.msgSurveyAt,
  ];
}

export async function upsertBatchSettings(input: z.infer<typeof batchSettingsSchema>) {
  if (!isIstSaturday(input.anchorDay1Date)) throw new AdminError("anchorDay1Date must be a Saturday (IST)");
  const data = {
    anchorDay1Date: istToUtc(input.anchorDay1Date, "00:00"),
    cadenceDays: input.cadenceDays,
    defaultPriceRupees: input.defaultPriceRupees,
    defaultStartTimeIst: input.defaultStartTimeIst,
    durationMinutes: input.durationMinutes,
    defaultLanguage: emptyToNull(input.defaultLanguage) ?? null,
    closeHoursBefore: input.closeHoursBefore,
    newBatchStatus: input.newBatchStatus,
    futureBatchCount: input.futureBatchCount,
    autoCreate: input.autoCreate,
    defaultWhatsappGroupLink: emptyToNull(input.defaultWhatsappGroupLink) ?? null,
    defaultSurveyUrl: emptyToNull(input.defaultSurveyUrl) ?? null,
    alertEmails: input.alertEmails,
  };
  return dataBasePrisma.batchSettings.upsert({
    where: { courseId: input.courseId },
    update: data,
    create: { courseId: input.courseId, ...data },
  });
}

export function settingsPreview(settings: { anchorDay1Date: Date; cadenceDays: number }, now: Date = new Date()) {
  return nextDay1Dates(settings.anchorDay1Date, settings.cadenceDays, now, 3).map((d) => ({
    date: istYmd(d),
    text: formatIstDate(d),
  }));
}

export class AdminError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}
