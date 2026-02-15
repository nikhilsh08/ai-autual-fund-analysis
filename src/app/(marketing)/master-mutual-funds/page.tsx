
import { dataBasePrisma } from "@/lib/dbPrisma";
import MasterMutualFunds from "@/components/templates/master-mutual-funds/MasterMutualFunds";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Master Mutual Funds | Invest Smarter',
    description: 'Learn how to pick the right mutual funds and build a wealth-generating portfolio.',
};

export default async function Page() {
    const course = await dataBasePrisma.course.findUnique({
        where: {
            staticRoute: "master-mutual-funds",
        },
    });

    if (!course) {
        return notFound();
    }

    return <MasterMutualFunds course={course} />;
}
