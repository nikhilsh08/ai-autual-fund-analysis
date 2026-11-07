import { readFileSync } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { siteConfig } from "@/config/seo";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { getCurrentBatch } from "@/lib/batches/current";
import { renderLanding, type LandingConfig } from "@/lib/landing/render";

export const dynamic = "force-dynamic";

const SLUG = "master-mutual-funds-invest-smarter";
const TEMPLATE_PATH = path.join(process.cwd(), "src", "landing", "mmf-v10.html");

let templateCache: string | null = null;
const loadTemplate = () => (templateCache ??= readFileSync(TEMPLATE_PATH, "utf8"));

// Title/description carried over from the previous page; wording to be
// reviewed against CONTENT-RULES (see OWNER_DECISIONS).
const TITLE = "Master Mutual Funds | Invest Smarter";
const DESCRIPTION = "Learn how to pick the right mutual funds and build a wealth-generating portfolio.";

function config(courseId: string, fallbackPriceRupees: number | null): LandingConfig {
    return {
        courseId,
        canonicalUrl: `${siteConfig.url}/master-mutual-funds`,
        title: TITLE,
        description: DESCRIPTION,
        ogImage: siteConfig.ogImage,
        pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
        gtmId: process.env.NEXT_PUBLIC_GTM_ID,
        gaId: process.env.NEXT_PUBLIC_GA_ID,
        ga4ViaGtm: process.env.NEXT_PUBLIC_GA4_VIA_GTM === "true",
        clarityId: process.env.NEXT_PUBLIC_CLARITY_ID,
        fallbackPriceRupees,
    };
}

const htmlResponse = (html: string, cacheControl: string) =>
    new NextResponse(html, {
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": cacheControl },
    });

export async function GET() {
    const template = loadTemplate();
    let courseId = "";
    let fallbackPrice: number | null = null;

    try {
        const course = await dataBasePrisma.course.findUnique({
            where: { slug: SLUG },
            select: { id: true, price: true, isPublished: true, useBatches: true },
        });
        if (!course || !course.isPublished) {
            return new NextResponse("Not found", { status: 404 });
        }
        courseId = course.id;
        fallbackPrice = course.price;

        const batch = course.useBatches ? await getCurrentBatch(course.id) : null;
        if (!batch) {
            const settings = await dataBasePrisma.batchSettings.findUnique({
                where: { courseId: course.id },
                select: { defaultPriceRupees: true },
            });
            fallbackPrice = settings?.defaultPriceRupees ?? course.price;
        }

        const html = renderLanding(template, batch, config(course.id, fallbackPrice));
        return htmlResponse(html, "public, s-maxage=60, stale-while-revalidate=300");
    } catch (error) {
        console.error("[landing] render failed, serving fallback", error);
        try {
            const html = renderLanding(template, null, config(courseId, fallbackPrice));
            return htmlResponse(html, "public, s-maxage=30");
        } catch (fallbackError) {
            console.error("[landing] fallback render failed", fallbackError);
            return new NextResponse("Temporarily unavailable", {
                status: 503,
                headers: { "Cache-Control": "no-store" },
            });
        }
    }
}
