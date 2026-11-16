import { NextResponse } from "next/server";
import { siteConfig } from "@/config/seo";
import { verifyAdmin } from "@/lib/auth-admin";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { getCurrentBatch } from "@/lib/batches/current";
import { getLandingCourse } from "@/lib/landing/course-link";
import { LANDING_SEATS_PER_BATCH, LANDING_SOURCES, type LandingPageKey, type LandingSource } from "@/lib/landing/sources";

export const dynamic = "force-dynamic";

const DAY_MS = 24 * 60 * 60 * 1000;

// Browser events each page fires (server-side: Meta CAPI Purchase for all).
const EVENTS = {
    landing: ["PageView", "ViewContent / view_item", "AddToCart / add_to_cart"],
    checkout: ["PageView", "InitiateCheckout / begin_checkout"],
    thankYou: ["PageView", "Purchase / purchase (eventID = order ID)"],
};

type Status = "live" | "batch_full" | "no_batch_on_sale" | "course_missing" | "course_unpublished" | "not_sold_in_batches";

// GET /api/admin/landing-pages — one row per workshop landing page (v10,
// v20, v30): the course linked to it (each page has its own), whether it is
// selling, the batch on sale, orders it brought in, and which tracking tags
// are configured. Secrets are reported as set / not
// set only.
export async function GET(req: Request) {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ message: "Access denied" }, { status: 403 });

    const keys = Object.keys(LANDING_SOURCES) as LandingSource[];
    const since30 = new Date(Date.now() - 30 * DAY_MS);

    const [allTime, last30] = await Promise.all([
        dataBasePrisma.order.groupBy({
            by: ["landingSource", "status"],
            where: { landingSource: { in: keys } },
            _count: { _all: true },
            _sum: { totalAmount: true },
        }),
        dataBasePrisma.order.groupBy({
            by: ["landingSource"],
            where: { landingSource: { in: keys }, status: "PAID", createdAt: { gte: since30 } },
            _count: { _all: true },
            _sum: { totalAmount: true },
        }),
    ]);

    const loaded = new Map<LandingSource, Awaited<ReturnType<typeof loadCourse>>>();
    for (const key of keys) loaded.set(key, await loadCourse(LANDING_SOURCES[key].page));

    const pages = [];
    for (const key of keys) {
        const page = LANDING_SOURCES[key];
        const c = loaded.get(key) ?? null;

        let status: Status = "live";
        if (!c) status = "course_missing";
        else if (!c.course.isPublished) status = "course_unpublished";
        else if (!c.course.useBatches) status = "not_sold_in_batches";
        else if (!c.batch) status = "no_batch_on_sale";

        // /v20 and /v30 stop at 50 paid seats per batch; /v10 has no limit (null).
        const seatLimit = LANDING_SEATS_PER_BATCH[page.page];
        const seatsLeft = c?.batch && seatLimit !== null ? Math.max(0, seatLimit - c.paidSeats) : null;
        if (status === "live" && seatsLeft === 0) status = "batch_full";

        const rows = allTime.filter((r) => r.landingSource === key);
        const paid = rows.find((r) => r.status === "PAID");
        const recent = last30.find((r) => r.landingSource === key);

        pages.push({
            key,
            name: page.name,
            url: `${siteConfig.url}${page.landing}`,
            paths: { landing: page.landing, checkout: page.checkout, thankYou: page.thankYou },
            status,
            page: page.page,
            course: c ? { id: c.course.id, title: c.course.title, slug: c.course.slug } : null,
            // Each page has its own course, so this is normally empty.
            sharesCourseWith: c ? keys.filter((k) => k !== key && loaded.get(k)?.course.id === c.course.id) : [],
            batchOnSale: c?.batch
                ? {
                      id: c.batch.id,
                      batchNumber: c.batch.batchNumber,
                      day1StartAt: c.batch.day1StartAt,
                      day2StartAt: c.batch.day2StartAt,
                      bookingCloseAt: c.batch.bookingCloseAt,
                      priceRupees: c.batch.priceRupees,
                      paidSeats: c.paidSeats,
                      seatLimit,
                      seatsLeft,
                  }
                : null,
            orders: {
                paid: paid?._count._all ?? 0,
                revenueRupees: paid?._sum.totalAmount ?? 0,
                pending: rows.find((r) => r.status === "PENDING")?._count._all ?? 0,
                failed: rows.filter((r) => r.status !== "PAID" && r.status !== "PENDING").reduce((n, r) => n + r._count._all, 0),
                paidLast30Days: recent?._count._all ?? 0,
                revenueLast30DaysRupees: recent?._sum.totalAmount ?? 0,
            },
        });
    }

    const env = process.env;
    return NextResponse.json({
        success: true,
        pages,
        // Same tags on every page; they come from the site's environment.
        tracking: {
            metaPixelId: env.NEXT_PUBLIC_META_PIXEL_ID || null,
            metaCapi: !!(env.NEXT_PUBLIC_META_PIXEL_ID && env.META_CAPI_ACCESS_TOKEN),
            metaCapiTestMode: !!env.META_CAPI_TEST_EVENT_CODE,
            ga4Id: env.NEXT_PUBLIC_GA_ID || null,
            ga4ViaGtm: env.NEXT_PUBLIC_GA4_VIA_GTM === "true",
            gtmId: env.NEXT_PUBLIC_GTM_ID || null,
            clarityId: env.NEXT_PUBLIC_CLARITY_ID || null,
            events: EVENTS,
        },
        // Orders record their landing page from 15 Nov 2026; older ones are not counted.
        ordersCountedSince: "2026-11-15",
    });
}

async function loadCourse(page: LandingPageKey) {
    const course = await getLandingCourse(page);
    if (!course) return null;
    const batch = course.useBatches ? await getCurrentBatch(course.id) : null;
    const paidSeats = batch
        ? await dataBasePrisma.orderItem.count({ where: { batchId: batch.id, order: { status: "PAID" } } })
        : 0;
    return { course, batch, paidSeats };
}
