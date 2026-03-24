"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users, Clock, Type, Award,Rocket } from "lucide-react";
import Image from "next/image";

interface CourseHeroProps {
    course: any;
}

export const CourseHero = ({ course }: CourseHeroProps) => {
    const router = useRouter();

    const instructor = course?.instructor ?? {};
    const instructorName =
        instructor?.name ||
        course?.instructorName ||
        course?.trainerName ||
        "Nikhil Sharma";
    const instructorImage =
        instructor?.image ||
        instructor?.avatar ||
        course?.instructorImage ||
        "https://res.cloudinary.com/dq1llsy7f/image/upload/v1738855885/c1gzyxcgfokizkisio3j.jpg";
    const instructorHeadline =
        instructor?.headline ||
        instructor?.role ||
        course?.instructorRole ||
        "ex-Goldman Sachs";
    const instructorExperience =
        instructor?.experience ||
        course?.instructorExperience ||
        "Risk Analyst · 5 yrs · ₹60,000 Cr+";
    const instructorAum =
        instructor?.aum ||
        course?.instructorAum;

    const instructorMeta = [
        instructorHeadline,
        instructorExperience,
        instructorAum,
    ].filter(Boolean).join(" · ");

    const handleEnroll = () => {
        router.push(`/checkout?courseId=${course.id}`);
    };

    const stats = [
        { icon: Users, label: "100+ students", value: "100+" },
        {icon: Type, label: `${course.type.charAt(0) + course.type.slice(1).toLowerCase()} lessons`, value: `${course.type} lessons` },
        { icon: Award, label: " AI tools included", value: "AI tools included" },
        { icon: Rocket, label: "Fast-track learning", value: "Fast-track learning" },
    ];

    return (
        <section className="pt-24 pb-16 bg-cream relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal/5 rounded-full blur-3xl" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center">
                    {/* Course Title */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif text-ink mb-4 leading-tight">
                        {course.title}
                    </h1>

                    {/* Subtitle / One-liner */}
                    <p className="text-lg sm:text-xl text-ink-secondary mb-8 max-w-2xl mx-auto">
                        {course.subtitle || "Smart goals, Safety nets, simple starts"}
                    </p>

                    {/* Stats Row */}
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 text-ink-secondary"
                            >
                                <stat.icon className="w-4 h-4 text-ink-muted" />
                                <span className="text-sm font-medium">{stat.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Instructor Mini Badge */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative w-full max-w-135 rounded-2xl border border-border bg-cream-dark/60 py-4 pl-20 pr-5 sm:pl-24 text-left overflow-hidden">
                            <div className="absolute left-4 top-1/2 h-14 w-14 -translate-y-1/2 overflow-hidden rounded-full border-2 border-indigo-100 bg-white">
                                <Image
                                    src={instructorImage}
                                    alt={instructorName}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <p className="font-serif font-black text-ink tracking-tighter mb-2" style={{ fontSize: "clamp(26px,4vw,40px)" }}>
                                {instructorName}
                            </p>
                            {instructorMeta && (
                                <p className="mt-1 text-sm text-ink-muted whitespace-normal wrap-break-word leading-relaxed">
                                    {instructorMeta}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                        onClick={handleEnroll}
                        size="lg"
                        className="bg-ink hover:bg-ink-body text-white rounded-full px-8 py-6 text-base font-semibold shadow-lg shadow-ink/20 transition-all hover:-translate-y-0.5"
                    >
                        Enroll for only ₹{course.price?.toLocaleString("en-IN") || "499"}
                    </Button>

                    {/* Trust Badge */}
                    <p className="mt-4 text-sm text-ink-muted">
                        7-day money-back guarantee
                    </p>
                </div>
            </div>
        </section>
    );
};
