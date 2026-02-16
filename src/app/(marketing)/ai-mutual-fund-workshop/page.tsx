import { dataBasePrisma } from "@/lib/dbPrisma";
import AiMutualFundWorkshop from "@/components/templates/ai-mutual-fund-workshop/AiMutualFundWorkshop";
import { notFound } from "next/navigation";

export const metadata = {
    title: "AI Mutual Fund Analysis Workshop | CashFlowCrew",
    description: "Learn to analyse your equity mutual funds using AI in one weekend workshop. Master institutional-grade portfolio analysis without a finance degree.",
};

export default async function AiMutualFundWorkshopPage() {
    // Fetch course where theme is 'light-guru'
    const course = await dataBasePrisma.course.findFirst({
        where: {
            theme: "light-guru",
            isPublished: true,
        },
    });

    if (!course) {
        notFound();
    }

    return <AiMutualFundWorkshop course={course} />;
}
