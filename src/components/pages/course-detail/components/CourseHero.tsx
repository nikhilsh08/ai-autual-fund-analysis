"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users, Clock, BookOpen, Award } from "lucide-react";
import Image from "next/image";

interface CourseHeroProps {
    course: any;
}

export const CourseHero = ({ course }: CourseHeroProps) => {
    const router = useRouter();

    const handleEnroll = () => {
        router.push(`/checkout?courseId=${course.id}`);
    };

    const stats = [
        { icon: Users, label: "100+ students", value: "100+" },
        { icon: Clock, label: course.duration || "~90min", value: course.duration || "~90min" },
        { icon: BookOpen, label: `${course.curriculum?.length || 5} lessons`, value: `${course.curriculum?.length || 5}` },
        { icon: Award, label: "Certificate", value: "Certificate" },
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
                        {course.oneLiner || "Smart goals, Safety nets, simple starts"}
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
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
                            <Image
                                src="https://res.cloudinary.com/dq1llsy7f/image/upload/v1738855885/c1gzyxcgfokizkisio3j.jpg"
                                alt="Nikhil Sharma"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-sm text-ink-secondary">
                            with <span className="font-semibold text-ink">Nikhil</span>
                        </span>
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
