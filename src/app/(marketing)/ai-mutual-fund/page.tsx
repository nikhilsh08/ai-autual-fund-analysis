export const dynamic = 'force-dynamic';

import { dataBasePrisma } from "@/lib/dbPrisma";
import AiMutualFundV2 from "@/components/templates/ai-mutual-fund-v2/AiMutualFundV2";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/seo";

export const metadata = {
    title: "AI Mutual Fund Workshop | CashFlowCrew — Know If Your Funds Are Failing You",
    description:
        "Set up your own AI-powered portfolio verifier in one weekend. Built by an ex-Goldman Sachs risk analyst. No finance degree needed. 10,000+ professionals trained.",
    openGraph: {
        title: "AI Mutual Fund Workshop | CashFlowCrew",
        description: "Set up your own AI-powered portfolio verifier in one weekend.",
        url: `${siteConfig.url}/ai-mutual-fund`,
        images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "AI Mutual Fund Workshop" }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Mutual Fund Workshop | CashFlowCrew",
        description: "Set up your own AI-powered portfolio verifier in one weekend.",
        images: [siteConfig.ogImage],
    },
};

export default async function AiMutualFundV2Page() {
    const course = await dataBasePrisma.course.findFirst({
        where: {
            slug: "ai-mutual-fund-workshop",
            isPublished: true,
        },
    });

    if (!course) {
        notFound();
    }

    return <AiMutualFundV2 course={course} />;
}
