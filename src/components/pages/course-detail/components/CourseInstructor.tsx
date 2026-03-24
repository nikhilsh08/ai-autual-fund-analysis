"use client";

import Image from "next/image";
import { BadgeCheck, Briefcase, Building2 } from "lucide-react";

const credentials = [
    { icon: Building2, label: "Ex-Goldman Sachs", highlight: true },
    { icon: Briefcase, label: "5+ years in Risk Analysis" },
    { icon: BadgeCheck, label: "3x Founder" },
];

const timeline = [
    {
        org: "Goldman Sachs",
        duration: "4+ years",
        desc: "Managed risk for ₹65,000 Cr+ AUM",
        color: "bg-gold",
    },
    {
        org: "Y-Combinator Backed FinTech",
        desc: "Led enterprise sales",
        color: "bg-accent",
    },
    {
        org: "Sequoia Capital Startup",
        desc: "National Head of Operations",
        color: "bg-teal",
    },
    {
        org: "CashFlowCrew",
        desc: "Co-Founder",
        color: "bg-ink",
    },
];

export const CourseInstructor = () => {
    return (
        <section className="py-16 px-4 sm:px-6 bg-cream-dark">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="font-serif font-black text-ink tracking-tighter mb-2 text-center" style={{ fontSize: "clamp(26px,4vw,40px)" }}>
                        Meet your instructor
                    </h2>
                    <p className="text-ink-secondary">
                        Learn from someone who did this for a living
                    </p>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-border">
                    <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
                        {/* Image */}
                        <div className="flex-shrink-0">
                            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden">
                                <Image
                                    src="https://res.cloudinary.com/dq1llsy7f/image/upload/v1738855885/c1gzyxcgfokizkisio3j.jpg"
                                    alt="Nikhil Sharma"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <h3 className="font-serif font-black text-ink tracking-tighter mb-2 text-3xl" >
                                Nikhil Sharma
                            </h3>
                            <p className="text-ink-secondary mb-4">
                                Co-Founder, CashFlowCrew
                            </p>

                            {/* Credentials */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                                {credentials.map((cred, index) => (
                                    <div
                                        key={index}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                                            cred.highlight
                                                ? "bg-gold/10 text-gold border border-gold/20"
                                                : "bg-cream-dark text-ink-secondary"
                                        }`}
                                    >
                                        <cred.icon className="w-3.5 h-3.5" />
                                        {cred.label}
                                    </div>
                                ))}
                            </div>

                            {/* Bio */}
                            <div className="space-y-4 text-ink-secondary text-sm sm:text-base leading-relaxed">
                                <p>
                                    Nikhil spent 5+ years at Goldman Sachs managing risk for mutual fund and hedge fund portfolios worth over ₹65,000 Crore. His job was finding problems in portfolios BEFORE they cost money.
                                </p>
                                <p>
                                    The tools he used daily — overlap analysis, risk-adjusted metrics, benchmark deviation tracking — weren't secret. The frameworks were publicly documented. His mission is to make these same tools accessible to every Indian investor.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="mt-8 pt-8 border-t border-border">
                        <h4 className="font-semibold text-ink mb-4 text-sm uppercase tracking-wider">
                            Career Timeline
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {timeline.map((item, index) => (
                                <div key={index} className="flex flex-col gap-2">
                                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                    <div>
                                        <div className="font-semibold text-ink text-sm">
                                            {item.org}
                                        </div>
                                        {item.duration && (
                                            <div className="text-xs text-ink-muted">
                                                {item.duration}
                                            </div>
                                        )}
                                        <div className="text-xs text-ink-secondary mt-1">
                                            {item.desc}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
