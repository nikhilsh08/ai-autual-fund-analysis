"use client";

import { Shield, CheckCircle2 } from "lucide-react";

const guaranteePoints = [
    "We've taught 10,000+ students",
    "Less than 2% refund rate",
    "No questions asked for 7 days",
];

export const CourseGuarantee = () => {
    return (
        <section className="py-16 px-4 sm:px-6 bg-cream">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-border shadow-sm">
                    <div className="flex flex-col items-center text-center">
                        {/* Shield Icon */}
                        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                            <Shield className="w-8 h-8 text-accent" />
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-ink mb-4">
                            100% Money-Back Guarantee
                        </h2>

                        <p className="text-ink-secondary mb-8 max-w-lg">
                            If you go through the course and genuinely feel like you didn't learn anything useful — email us within 7 days. Full refund. No questions asked.
                        </p>

                        {/* Guarantee Points */}
                        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                            {guaranteePoints.map((point, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 text-sm text-ink-secondary"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-teal" />
                                    {point}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
