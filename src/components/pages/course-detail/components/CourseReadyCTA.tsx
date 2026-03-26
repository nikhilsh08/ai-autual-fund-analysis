"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CourseReadyCTAProps {
    courseId: string;
    price: number;
}

export const CourseReadyCTA = ({ courseId, price }: CourseReadyCTAProps) => {
    const router = useRouter();

    const handleEnroll = () => {
        router.push(`/checkout?courseId=${courseId}`);
    };

    return (
        <section className="py-20 px-4 sm:px-6 bg-ink relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal/20 rounded-full blur-3xl" />

            <div className="max-w-2xl mx-auto text-center relative z-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white mb-6">
                    Ready?
                </h2>

                <p className="text-white/80 text-lg mb-10 max-w-lg mx-auto">
                    Take the first step towards mastering your finances. Join thousands of students who have transformed their financial future.
                </p>

                <Button
                    onClick={handleEnroll}
                    size="lg"
                    className="bg-white hover:bg-cream text-ink rounded-full px-10 py-6 text-base font-semibold shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 group"
                >
                    Enroll for ₹{price?.toLocaleString("en-IN") || "499"}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                <p className="mt-6 text-white/60 text-sm">
                    7-day money-back guarantee
                </p>
            </div>
        </section>
    );
};
