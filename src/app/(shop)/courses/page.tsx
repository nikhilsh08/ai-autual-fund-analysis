export const dynamic = 'force-dynamic';
import { Metadata } from "next";
import { getHomePageCoursesAction } from "@/server/actions/home-courses";
import { getActiveBundleForHomepage } from "@/server/actions/bundle.action";
import CoursesSectionServer from "@/components/pages/home/CoursesSectionServer";

export const metadata: Metadata = {
    title: "All Courses | CashFlowCrew",
    description: "Browse our complete catalog of institutional-grade finance courses.",
};

export default async function AllCoursesPage() {
    const courses = await getHomePageCoursesAction();
    const bundleResult = await getActiveBundleForHomepage();
    const bundle = bundleResult.success ? bundleResult.data : null;

    return (
        <>
            <div className="pt-24 pb-8 bg-cream-dark border-b border-border">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="font-serif font-black tracking-tighter leading-[1.02] text-ink text-[clamp(32px,5vw,48px)] mb-4">All Courses</h1>
                    <p className="text-ink-secondary text-[clamp(16px,1.8vw,18px)] font-light max-w-2xl mx-auto">
                        Comprehensive training for every step of your wealth creation journey.
                    </p>
                </div>
            </div>
            <CoursesSectionServer 
                courses={courses} 
                bundle={bundle ? {
                    fullPrice: bundle.originalPrice || 0,
                    price: bundle.price,
                    savings: (bundle.originalPrice || 0) - bundle.price,
                    savingsPercent: bundle.originalPrice ? Math.round(((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100) : 0,
                    features: bundle.features || [],
                    id: bundle.id,
                    name: bundle.name,
                    courseIds: bundle.courseIds,
                } : undefined}
            />
        </>
    );
}
