import { readFileSync } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { siteConfig } from "@/config/seo";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { getCurrentBatch } from "@/lib/batches/current";
import { renderLanding, type LandingConfig } from "@/lib/landing/render";
import { getLandingCourse } from "@/lib/landing/course-link";
import { LANDING_PUBLIC_PATH } from "@/lib/landing/sources";
import { isDevPreview, previewBatchFor } from "@/lib/landing/v20-data";

export const dynamic = "force-dynamic";

// The course linked to /v10 in the admin panel (Masterclasses → "Workshop landing page").
const PAGE = "v10" as const;
const TEMPLATE_PATH = path.join(process.cwd(), "src", "landing", "mmf-v10.html");

let templateCache: string | null = null;
const loadTemplate = () => (templateCache ??= readFileSync(TEMPLATE_PATH, "utf8"));

// Title/description carried over from the previous page; wording to be
// reviewed against CONTENT-RULES (see OWNER_DECISIONS).
const TITLE = "Master Mutual Funds | Invest Smarter";
const DESCRIPTION = "Learn how to pick the right mutual funds and build a wealth-generating portfolio.";

// Mirrors `durationMinutes @default(120)` in prisma/schema.prisma. Only used
// when neither a batch nor the batch settings can be read.
const SCHEMA_DEFAULT_DURATION_MINUTES = 120;

function config(courseId: string, fallbackPriceRupees: number | null, fallbackDurationMinutes: number): LandingConfig {
    return {
        courseId,
        // The address the page is advertised on (lib/landing/sources.ts).
        canonicalUrl: `${siteConfig.url}${LANDING_PUBLIC_PATH[PAGE]}`,
        title: TITLE,
        description: DESCRIPTION,
        ogImage: siteConfig.ogImage,
        pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
        gtmId: process.env.NEXT_PUBLIC_GTM_ID,
        gaId: process.env.NEXT_PUBLIC_GA_ID,
        ga4ViaGtm: process.env.NEXT_PUBLIC_GA4_VIA_GTM === "true",
        clarityId: process.env.NEXT_PUBLIC_CLARITY_ID,
        fallbackPriceRupees,
        fallbackDurationMinutes,
    };
}

const htmlResponse = (html: string, cacheControl: string) =>
    new NextResponse(html, {
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": cacheControl },
    });

export async function GET(req: Request) {
    const template = loadTemplate();

    // Development only: /v10?preview=1. Every value from the admin panel
    // (previewBatchFor: batch on sale, next batch, or Batch settings).
    if (isDevPreview(new URL(req.url).searchParams.get("preview"))) {
        const p = await previewBatchFor(PAGE);
        const html = renderLanding(
            template,
            p.batch,
            config(p.courseId ?? "preview", p.fallbackPriceRupees, p.fallbackDurationMinutes ?? SCHEMA_DEFAULT_DURATION_MINUTES),
        );
        return htmlResponse(html, "no-store");
    }

    let courseId = "";
    let fallbackPrice: number | null = null;
    let fallbackDuration = SCHEMA_DEFAULT_DURATION_MINUTES;

    try {
        const course = await getLandingCourse(PAGE);
        if (!course || !course.isPublished) {
            return new NextResponse("Not found", { status: 404 });
        }
        courseId = course.id;
        fallbackPrice = course.price;

        const batch = course.useBatches ? await getCurrentBatch(course.id) : null;
        if (!batch) {
            const settings = await dataBasePrisma.batchSettings.findUnique({
                where: { courseId: course.id },
                select: { defaultPriceRupees: true, durationMinutes: true },
            });
            fallbackPrice = settings?.defaultPriceRupees ?? course.price;
            fallbackDuration = settings?.durationMinutes ?? fallbackDuration;
        }

        const html = renderLanding(template, batch, config(course.id, fallbackPrice, fallbackDuration));
        return htmlResponse(html, "public, s-maxage=60, stale-while-revalidate=300");
    } catch (error) {
        console.error("[landing] render failed, serving fallback", error);
        try {
            const html = renderLanding(template, null, config(courseId, fallbackPrice, fallbackDuration));
            // Served after an error: never cache it, so the real page returns at once.
            return htmlResponse(html, "no-store");
        } catch (fallbackError) {
            console.error("[landing] fallback render failed", fallbackError);
            return new NextResponse("Temporarily unavailable", {
                status: 503,
                headers: { "Cache-Control": "no-store" },
            });
        }
    }
}
