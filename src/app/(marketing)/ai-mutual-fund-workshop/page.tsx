export const dynamic = 'force-dynamic';

import { dataBasePrisma } from "@/lib/dbPrisma";
import AiMutualFundWorkshop from "@/components/templates/ai-mutual-fund-workshop/AiMutualFundWorkshop";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/seo";

export const metadata = {
    title: "AI Mutual Fund Analysis Workshop | CashFlowCrew",
    description: "Learn to analyse your equity mutual funds using AI in one weekend workshop. Master institutional-grade portfolio analysis without a finance degree.",
    openGraph: {
        title: "AI Mutual Fund Analysis Workshop | CashFlowCrew",
        description: "Learn to analyse your equity mutual funds using AI in one weekend workshop.",
        url: `${siteConfig.url}/ai-mutual-fund-workshop`,
        images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "AI Mutual Fund Analysis Workshop" }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Mutual Fund Analysis Workshop | CashFlowCrew",
        description: "Learn to analyse your equity mutual funds using AI in one weekend workshop.",
        images: [siteConfig.ogImage],
    },
};

export default async function AiMutualFundWorkshopPage() {
    // Fetch course where theme is 'light-guru'
    const course = await dataBasePrisma.course.findFirst({
        where: {
            slug: "are-your-mutual-funds-actually-good",
            isPublished: true,
        },
    });

    if (!course) {
        notFound();
    }

    return <AiMutualFundWorkshop course={course} />;
}
