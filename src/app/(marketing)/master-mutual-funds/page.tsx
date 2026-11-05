export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { siteConfig } from "@/config/seo";
import { getCurrentMmfBatch } from "@/lib/mmf-batch";
import MmfPage from "@/components/templates/mmf-v10/MmfPage";

export const metadata: Metadata = {
    title: 'Master Mutual Funds | A live workshop on evaluating mutual funds',
    description: 'Learn a repeatable set of checks for evaluating any mutual fund yourself, taught live by a former Goldman Sachs risk analyst.',
    openGraph: {
        title: "Master Mutual Funds | A live workshop on evaluating mutual funds",
        description: "Learn a repeatable set of checks for evaluating any mutual fund yourself, taught live by a former Goldman Sachs risk analyst.",
        url: `${siteConfig.url}/master-mutual-funds`,
        images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Master Mutual Funds" }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Master Mutual Funds | A live workshop on evaluating mutual funds",
        description: "Learn a repeatable set of checks for evaluating any mutual fund yourself, taught live by a former Goldman Sachs risk analyst.",
        images: [siteConfig.ogImage],
    },
};

export default async function Page() {
    const batch = await getCurrentMmfBatch();

    if (!batch) {
        return (
            <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 24px", textAlign: "center" }}>
                <div>
                    <h1 style={{ fontFamily: "inherit", fontSize: "28px", fontWeight: 700, marginBottom: "12px" }}>
                        The next Master Mutual Funds batch opens soon.
                    </h1>
                    <p style={{ fontSize: "16px", color: "#4B463D" }}>
                        Write to <a href="mailto:support@cashflowcrew.in">support@cashflowcrew.in</a> and we will let you know as soon as booking opens.
                    </p>
                </div>
            </div>
        );
    }

    return <MmfPage batch={batch} />;
}
