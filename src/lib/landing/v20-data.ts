import { readFileSync } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { siteConfig } from "@/config/seo";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { getCurrentBatch } from "@/lib/batches/current";
import { computeBatchTimes, nextDay1Dates } from "@/lib/batches/schedule";
import { groupLinkFor } from "@/lib/batches/messaging";
import { trackingConfigFromEnv } from "@/lib/landing/tracking";
import { getLandingCourse, landingPageOfCourse, seatLimitForPage } from "@/lib/landing/course-link";
import type { LandingPageKey } from "@/lib/landing/sources";
import type { V20Batch, V20Common } from "@/lib/landing/render-v20";

// The v20 and v30 page files are read once per server process. After editing
// one, restart the dev server or the old copy keeps being served.
export type MpfTemplateFile =
  | "mpf-v20.html"
  | "mpf-v20-checkout.html"
  | "mpf-v20-thank-you.html"
  | "mpf-v30.html"
  | "mpf-v30-checkout.html"
  | "mpf-v30-thank-you.html"
  | "mpf-v30-refund-policy.html";
const templates = new Map<string, string>();
export function loadV20Template(file: MpfTemplateFile): string {
  let t = templates.get(file);
  if (t === undefined) {
    t = readFileSync(path.join(process.cwd(), "src", "landing", file), "utf8");
    templates.set(file, t);
  }
  return t;
}

export const v20Common = (courseId: string): V20Common => ({
  courseId,
  siteUrl: siteConfig.url,
  tracking: trackingConfigFromEnv(),
});

// Must match the server's Cashfree environment (payment.action.ts), or the
// payment window rejects the session.
export { cashfreeMode } from "@/lib/cashfree-env";

export const isDevPreview = (value: string | null) => value === "1" && process.env.NODE_ENV !== "production";

export const htmlResponse = (html: string, cacheControl: string) =>
  new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": cacheControl } });

// Sends the visitor to another page of this site, given as a path. A path
// cannot name the wrong host. Behind a host's proxy (Render) req.url is the
// app's internal address (https://localhost:10000/...), so a full address
// built from it sends the visitor to a page that does not exist.
export const redirectTo = (path: string) =>
  new NextResponse(null, { status: 307, headers: { Location: path, "Cache-Control": "no-store" } });

// The course linked to a landing page in the admin panel (Masterclasses ->
// "Workshop landing page"). Each page has its own course and batches.
export const getPageCourse = (page: LandingPageKey) => getLandingCourse(page);

export function toV20Batch(b: {
  id: string;
  priceRupees: number;
  day1StartAt: Date;
  day2StartAt: Date;
  bookingCloseAt: Date;
  durationMinutes: number;
  language: string | null;
}): V20Batch {
  return {
    id: b.id,
    priceRupees: b.priceRupees,
    day1StartAt: b.day1StartAt,
    day2StartAt: b.day2StartAt,
    bookingCloseAt: b.bookingCloseAt,
    durationMinutes: b.durationMinutes,
    language: b.language,
  };
}

// The batch a /v20 or /v30 visitor can book right now. A batch that has sold
// all its seats is not on sale: the page then shows "Booking for the next
// batch opens soon" and the checkout sends the buyer back to it.
export async function getV20BatchOnSale(course: {
  id: string;
  useBatches: boolean;
  slug?: string | null;
  landingPage?: string | null;
}): Promise<V20Batch | null> {
  if (!course.useBatches) return null;
  const batch = await getCurrentBatch(course.id);
  if (!batch) return null;
  const seatLimit = seatLimitForPage(await landingPageOfCourse(course));
  if (seatLimit !== null && (await paidSeats(batch.id)) >= seatLimit) return null;
  return toV20Batch(batch);
}

export type ThankYouState = "paid" | "verifying" | "failed";

// The order behind a thank-you page (v20 and v30). "missing" when there is no
// such order; "not-batch" for a course order, which keeps the main site's
// /order-status page. READ-ONLY: the Cashfree webhook and /payment/callback
// process the payment.
export async function loadThankYouOrder(orderId: string) {
  const order = await dataBasePrisma.order.findUnique({
    where: { orderId },
    select: {
      id: true,
      orderId: true,
      status: true,
      totalAmount: true,
      guestEmail: true,
      user: { select: { name: true, email: true } },
      lead: { select: { name: true } },
      items: { select: { courseId: true, batchId: true, batch: true } },
    },
  });
  if (!order) return { kind: "missing" as const };

  const batchItem = order.items.find((item) => item.batchId && item.batch);
  if (!batchItem?.batch) return { kind: "not-batch" as const };

  const state: ThankYouState = order.status === "PAID" ? "paid" : order.status === "PENDING" ? "verifying" : "failed";
  const registration =
    state === "paid"
      ? await dataBasePrisma.batchRegistration.findUnique({
          where: { orderId: order.id },
          select: { joinLinkDay1: true, joinLinkDay2: true },
        })
      : null;

  return {
    kind: "batch" as const,
    state,
    batch: batchItem.batch,
    courseId: batchItem.courseId ?? batchItem.batch.courseId,
    orderId: order.orderId ?? orderId,
    name: order.lead?.name || order.user?.name || "",
    email: order.guestEmail || order.user?.email || "",
    amountRupees: order.totalAmount,
    joinDay1: registration?.joinLinkDay1 ?? null,
    joinDay2: registration?.joinLinkDay2 ?? null,
    whatsappGroup: state === "paid" ? await groupLinkFor(batchItem.batch) : null,
  };
}

// Paid bookings for a batch: one per paid order line on that batch.
export function paidSeats(batchId: string): Promise<number> {
  return dataBasePrisma.orderItem.count({ where: { batchId, order: { status: "PAID" } } });
}

// Development preview (?preview=1), read only. Every value comes from the
// admin panel, in this order:
//   1. the batch on sale (Batches, status OPEN),
//   2. the next upcoming batch, even a DRAFT (Batches),
//   3. the next Saturday on the cycle in Batch settings, with its default
//      start time, duration, booking close, price and language.
// With none of these, batch is null and the page shows its "booking opens
// soon" state with the course price, exactly as the live page would.
export interface PreviewData {
  courseId: string | null;
  batch: V20Batch | null;
  fallbackPriceRupees: number | null;
  fallbackDurationMinutes: number | null;
}

export async function previewBatchFor(page: LandingPageKey, now: Date = new Date()): Promise<PreviewData> {
  const course = await getLandingCourse(page);
  if (!course) return { courseId: null, batch: null, fallbackPriceRupees: null, fallbackDurationMinutes: null };

  const onSale = await getCurrentBatch(course.id, now);
  const upcoming =
    onSale ??
    (await dataBasePrisma.batch.findFirst({
      where: { courseId: course.id, status: { in: ["OPEN", "DRAFT"] }, day1StartAt: { gt: now } },
      orderBy: { day1StartAt: "asc" },
    }));
  const settings = await dataBasePrisma.batchSettings.findUnique({ where: { courseId: course.id } });
  const fallback = {
    courseId: course.id,
    fallbackPriceRupees: settings?.defaultPriceRupees ?? course.price,
    fallbackDurationMinutes: settings?.durationMinutes ?? null,
  };
  if (upcoming) return { ...fallback, batch: toV20Batch(upcoming) };

  if (settings) {
    const [day1Date] = nextDay1Dates(settings.anchorDay1Date, settings.cadenceDays, now, 1);
    const times = computeBatchTimes({
      day1Date,
      startTimeIst: settings.defaultStartTimeIst,
      closeHoursBefore: settings.closeHoursBefore,
    });
    return {
      ...fallback,
      batch: {
        id: "preview",
        priceRupees: settings.defaultPriceRupees,
        ...times,
        durationMinutes: settings.durationMinutes,
        language: settings.defaultLanguage ?? null,
      },
    };
  }
  return { ...fallback, batch: null };
}
