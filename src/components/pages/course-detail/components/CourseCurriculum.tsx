"use client";

import { Target, Wallet, TrendingUp, Shield, Calculator, Lightbulb } from "lucide-react";

interface CourseCurriculumProps {
    curriculum?: string[];
    duration?: string;
}

const defaultModules = [
    { title: "Setting Smart Financial Goals", icon: Target, duration: "15 min" },
    { title: "Building Your Emergency Fund", icon: Wallet, duration: "20 min" },
    { title: "Understanding the 6 Key Ratios", icon: Calculator, duration: "25 min" },
    { title: "Risk Assessment Fundamentals", icon: Shield, duration: "15 min" },
    { title: "Starting Your First SIP", icon: TrendingUp, duration: "15 min" },
];

const iconMap = [Target, Wallet, Calculator, Shield, TrendingUp, Lightbulb];

export const CourseCurriculum = ({ curriculum, duration }: CourseCurriculumProps) => {
    const modules = curriculum?.map((item, index) => ({
        title: item,
        icon: iconMap[index % iconMap.length],
        duration: "~15 min",
    })) || defaultModules;

    return (
        <section className="py-16 px-4 sm:px-6 bg-cream" id="how-it-works">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold font-serif text-ink mb-2">
                        What you'll master in {duration || "~90 min"}
                    </h2>
                    <p className="text-ink-secondary">
                        A structured curriculum designed for busy professionals
                    </p>
                </div>

                <div className="space-y-4">
                    {modules.map((module, index) => {
                        const Icon = module.icon;
                        return (
                            <div
                                key={index}
                                className="flex items-center gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-border hover:shadow-md transition-shadow"
                            >
                                {/* Number Badge */}
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-accent" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-ink text-sm sm:text-base">
                                        {module.title}
                                    </h3>
                                </div>

                                {/* Duration */}
                                <span className="text-xs text-ink-muted font-medium px-3 py-1 bg-cream-dark rounded-full whitespace-nowrap">
                                    {module.duration}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
