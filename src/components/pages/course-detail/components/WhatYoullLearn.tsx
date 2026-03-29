"use client";

import { CheckCircle2 } from "lucide-react";

interface WhatYoullLearnProps {
    curriculum?: string[];
}

const defaultLearnings = [
    "Build an emergency fund that actually protects you",
    "Understand the 6 essential financial ratios",
    "Create smart, achievable financial goals",
    "Start your first SIP with confidence",
    "Build a solid financial foundation",
];

export const WhatYoullLearn = ({ curriculum }: WhatYoullLearnProps) => {
    const learnings = curriculum?.slice(0, 5) || defaultLearnings;

    return (
        <section className="py-16 px-4 sm:px-6 bg-cream">
            <div className="max-w-3xl mx-auto">
                <h2 className="font-serif font-black text-ink tracking-tighter mb-2 text-center" style={{ fontSize: "clamp(26px,4vw,40px)" }}>
                    What you'll learn
                </h2>

                <div className="bg-ink rounded-3xl p-6 sm:p-8 shadow-xl">
                    <div className="grid gap-4">
                        {learnings.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm"
                            >
                                <CheckCircle2 className="w-5 h-5 text-teal mt-0.5 shrink-0" />
                                <span className="text-white/90 font-medium text-sm sm:text-base">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
