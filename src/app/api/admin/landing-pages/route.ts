import { NextResponse } from "next/server";
import { siteConfig } from "@/config/seo";
import { verifyAdmin } from "@/lib/auth-admin";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { getCurrentBatch } from "@/lib/batches/current";
import { LANDING_SOURCES, type LandingSource } from "@/lib/landing/sources";

export const dynamic = "force-dynamic";

const SEATS_PER_BATCH = 50;
const DAY_MS = 24 * 60 * 60 * 1000;

// Browser events each page fires (server-side: Meta CAPI Purchase for all).
const EVENTS = {
    landing: ["PageView", "ViewContent / view_item", "AddToCart / add_to_cart"],
    checkout: ["PageView", "InitiateCheckout / begin_checkout"],
    thankYou: ["PageView", "Purchase / purchase (eventID = order ID)"],
};

type Status = "live" | "no_batch_on_sale" | "course_missing" | "course_unpublished" | "not_sold_in_batches";

// GET /api/admin/landing-pages — one row per workshop landing page (v10,
// v20, v30): whether it is selling, the batch on sale, orders it brought in,
// and which tracking tags are configured. Secrets are reported as set / not
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

    const courseCache = new Map<string, Awaited<ReturnType<typeof loadCourse>>>();
    async function courseFor(slug: string) {
        if (!courseCache.has(slug)) courseCache.set(slug, await loadCourse(slug));
        return courseCache.get(slug)!;
    }

    const pages = [];
    for (const key of keys) {
        const page = LANDING_SOURCES[key];
        const c = await courseFor(page.courseSlug);

        let status: Status = "live";
        if (!c) status = "course_missing";
        else if (!c.course.isPublished) status = "course_unpublished";
        else if (!c.course.useBatches) status = "not_sold_in_batches";
        else if (!c.batch) status = "no_batch_on_sale";

        const rows = allTime.filter((r) => r.landingSource === key);
        const paid = rows.find((r) => r.status === "PAID");
        const recent = last30.find((r) => r.landingSource === key);

        pages.push({
            key,
            name: page.name,
            url: `${siteConfig.url}${page.landing}`,
            paths: { landing: page.landing, checkout: page.checkout, thankYou: page.thankYou },
            status,
            course: c ? { id: c.course.id, title: c.course.title, slug: page.courseSlug } : null,
            // Pages selling the same course share its batches and seats.
            sharesCourseWith: keys.filter((k) => k !== key && LANDING_SOURCES[k].courseSlug === page.courseSlug),
            batchOnSale: c?.batch
                ? {
                      id: c.batch.id,
                      batchNumber: c.batch.batchNumber,
                      day1StartAt: c.batch.day1StartAt,
                      day2StartAt: c.batch.day2StartAt,
                      bookingCloseAt: c.batch.bookingCloseAt,
                      priceRupees: c.batch.priceRupees,
                      paidSeats: c.paidSeats,
                      seatsLeft: Math.max(0, SEATS_PER_BATCH - c.paidSeats),
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

async function loadCourse(slug: string) {
    const course = await dataBasePrisma.course.findUnique({
        where: { slug },
        select: { id: true, title: true, isPublished: true, useBatches: true },
    });
    if (!course) return null;
    const batch = course.useBatches ? await getCurrentBatch(course.id) : null;
    const paidSeats = batch
        ? await dataBasePrisma.orderItem.count({ where: { batchId: batch.id, order: { status: "PAID" } } })
        : 0;
    return { course, batch, paidSeats };
}
