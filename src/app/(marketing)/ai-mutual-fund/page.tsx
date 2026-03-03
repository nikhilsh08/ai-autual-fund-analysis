export const dynamic = 'force-dynamic';

import { dataBasePrisma } from "@/lib/dbPrisma";
import AiMutualFundV2 from "@/components/templates/ai-mutual-fund-v2/AiMutualFundV2";
import { notFound } from "next/navigation";

export const metadata = {
    title: "AI Mutual Fund Workshop | CashFlowCrew — Know If Your Funds Are Failing You",
    description:
        "Set up your own AI-powered portfolio verifier in one weekend. Built by an ex-Goldman Sachs risk analyst. No finance degree needed. 10,000+ professionals trained.",
};

export default async function AiMutualFundV2Page() {
    const course = await dataBasePrisma.course.findFirst({
        where: {
            theme: "light-guru",
            isPublished: true,
        },
    });

    if (!course) {
        notFound();
    }

    return <AiMutualFundV2 course={course} />;
}
