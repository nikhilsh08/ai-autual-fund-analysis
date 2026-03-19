export const dynamic = 'force-dynamic';
import { CourseCatalog } from "@/components/CourseCatalog";
import { Metadata } from "next";
import { getCoursesAction } from "@/server/actions/get-courses";

export const metadata: Metadata = {
    title: "All Courses | CashFlowCrew",
    description: "Browse our complete catalog of institutional-grade finance courses.",
};

export default async function AllCoursesPage() {
    const rawCourses = await getCoursesAction();
    // Safely map complex category objects to string names for the CourseCatalog
    const courses = rawCourses.map(c => ({
        ...c,
        category: typeof c.category === 'object' && c.category ? c.category.name : c.category
    })) as any[];

    // Extract unique categories
    const categories = Array.from(new Set(courses.map(c => c.category).filter(Boolean)));

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
            <CourseCatalog courses={courses} categories={categories} />
        </>
    );
}
