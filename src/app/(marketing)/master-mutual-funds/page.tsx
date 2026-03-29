export const dynamic = 'force-dynamic';

import { dataBasePrisma } from "@/lib/dbPrisma";
import MasterMutualFunds from "@/components/templates/master-mutual-funds/MasterMutualFunds";
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import { siteConfig } from "@/config/seo";

export const metadata: Metadata = {
    title: 'Master Mutual Funds | Invest Smarter',
    description: 'Learn how to pick the right mutual funds and build a wealth-generating portfolio.',
    openGraph: {
        title: "Master Mutual Funds | Invest Smarter",
        description: "Learn how to pick the right mutual funds and build a wealth-generating portfolio.",
        url: `${siteConfig.url}/master-mutual-funds`,
        images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Master Mutual Funds" }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Master Mutual Funds | Invest Smarter",
        description: "Learn how to pick the right mutual funds and build a wealth-generating portfolio.",
        images: [siteConfig.ogImage],
    },
};

export default async function Page() {
    const course = await dataBasePrisma.course.findFirst({
        where: {
            slug: "master-mutual-funds-invest-smarter",
            isPublished: true,
        },
    });

    if (!course) {
        return notFound();
    }

    return <MasterMutualFunds course={course} />;
}
