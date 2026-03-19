"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";

const outcomes = [
    "A clear, actionable financial roadmap",
    "Confidence to start investing on your own",
    "Knowledge to analyze any mutual fund",
    "A properly sized emergency fund",
    "Your first SIP set up and running",
];

export const WhatYouWalkAway = () => {
    return (
        <section className="py-16 px-4 sm:px-6 bg-cream">
            <div className="max-w-3xl mx-auto">
                <div className="bg-gradient-to-br from-teal to-teal/80 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-teal/20">
                    <div className="flex items-center gap-2 mb-6">
                        <ArrowRight className="w-5 h-5" />
                        <h2 className="text-xl sm:text-2xl font-bold font-serif">
                            What you walk away with
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {outcomes.map((outcome, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3"
                            >
                                <CheckCircle2 className="w-5 h-5 text-white/90 mt-0.5 shrink-0" />
                                <span className="text-white/95 font-medium">
                                    {outcome}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/20">
                        <p className="text-white/80 text-sm">
                            Plus lifetime access to all course materials and future updates.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
