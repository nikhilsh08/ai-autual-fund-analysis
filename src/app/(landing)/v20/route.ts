import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { renderV20Landing } from "@/lib/landing/render-v20";
import {
    getV20BatchOnSale,
    getPageCourse,
    htmlResponse,
    isDevPreview,
    loadV20Template,
    paidSeats,
    previewBatchFor,
    v20Common,
} from "@/lib/landing/v20-data";

export const dynamic = "force-dynamic";

// GET /v20 — Master Personal Finance with AI. Sells the course linked to it
// in the admin panel (Masterclasses → "Workshop landing page: /v20"). Price,
// dates, start time and language come from the batch on sale (Admin →
// Batches); the seat line from paid bookings. Development only: /v20?preview=1.
export async function GET(req: Request) {
    const template = loadV20Template("mpf-v20.html");

    if (isDevPreview(new URL(req.url).searchParams.get("preview"))) {
        // Every value from the admin panel (see previewBatchFor).
        const p = await previewBatchFor("v20");
        const html = renderV20Landing(
            template,
            {
                batch: p.batch,
                fallbackPriceRupees: p.fallbackPriceRupees,
                fallbackDurationMinutes: p.fallbackDurationMinutes,
                paidSeats: p.batch && p.batch.id !== "preview" ? await paidSeats(p.batch.id) : 0,
            },
            v20Common(p.courseId ?? "preview"),
        );
        return htmlResponse(html, "no-store");
    }

    let courseId = "";
    let fallbackPrice: number | null = null;
    let fallbackDuration: number | null = null;

    try {
        const course = await getPageCourse("v20");
        if (!course || !course.isPublished) return new NextResponse("Not found", { status: 404 });
        courseId = course.id;
        fallbackPrice = course.price;

        const batch = await getV20BatchOnSale(course);
        if (!batch) {
            const settings = await dataBasePrisma.batchSettings.findUnique({
                where: { courseId: course.id },
                select: { defaultPriceRupees: true, durationMinutes: true },
            });
            fallbackPrice = settings?.defaultPriceRupees ?? course.price;
            fallbackDuration = settings?.durationMinutes ?? null;
        }

        const html = renderV20Landing(
            template,
            {
                batch,
                fallbackPriceRupees: fallbackPrice,
                fallbackDurationMinutes: fallbackDuration,
                paidSeats: batch ? await paidSeats(batch.id) : 0,
            },
            v20Common(course.id),
        );
        // An admin change can take about a minute to show.
        return htmlResponse(html, "public, s-maxage=60, stale-while-revalidate=300");
    } catch (error) {
        console.error("[landing:v20] render failed, serving fallback", error);
        try {
            const html = renderV20Landing(
                template,
                { batch: null, fallbackPriceRupees: fallbackPrice, fallbackDurationMinutes: fallbackDuration, paidSeats: 0 },
                v20Common(courseId),
            );
            // Served after an error: never cache it, so the real page returns at once.
            return htmlResponse(html, "no-store");
        } catch (fallbackError) {
            console.error("[landing:v20] fallback render failed", fallbackError);
            return new NextResponse("Temporarily unavailable", { status: 503, headers: { "Cache-Control": "no-store" } });
        }
    }
}
