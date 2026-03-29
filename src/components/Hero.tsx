"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export const Hero = () => {
    const router = useRouter();

    const features = [
        "1 year access",
        "7-Day Refund Policy",
        "Apply the same, deeply-thought, risk management strategies used for billion-dollar portfolios, to break into the next wealth tier"
    ];

    return (
        <section className="pt-32 pb-16 md:pt-24 md:pb-32 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

                    {/* Content Column */}
                    <div className="flex-1 max-w-2xl">
                        <h1 className="font-serif font-black tracking-tighter leading-[1.02] text-ink mb-8 text-[clamp(38px,7.5vw,72px)]">
                            Master Your Money<br />
                            With Confidence.<br />
                            <em className="font-light italic">the smart way to<br />build wealth.</em>
                        </h1>


                        <p className="text-[clamp(16px,1.8vw,18px)] text-ink-secondary mb-8 leading-[1.85] font-light">
                            Institutional-grade investment education, simplified into practical courses for every stage of your financial journey.
                        </p>

                        <div className="bg-cream-dark border border-border rounded-2xl p-6 md:p-8 mb-8">
                            <p className="text-ink-body italic text-lg mb-4">
                                "The Top 1% of Indian households own 70% of the financial assets. I'm bringing the billion-dollar frameworks they use, to the other 99% of India."
                            </p>
                            <p className="text-ink-secondary text-sm">
                                If your net worth is between ₹10L and ₹10Cr, it's time to stop using 'retail' strategies and start using institutional ones.
                            </p>
                        </div>

                        <div className="space-y-3 mb-10">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                    <span className="text-ink-secondary font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="h-12 px-8 text-base"
                                onClick={() => router.push("/courses")}
                            >
                                Explore Courses
                            </Button>
                        </div>
                    </div>

                    {/* Visual Column - Abstract/Modern representation of growth/finance */}
                    <div className="flex-1 w-full relative">
                        <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-cream-dark border border-border">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent-light to-cream-dark" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-card rounded-2xl shadow-xl p-6 border border-border flex flex-col justify-between">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center text-accent font-bold">₹</div>
                                    <div>
                                        <div className="h-2 w-24 bg-cream-dark rounded mb-1"></div>
                                        <div className="h-2 w-16 bg-cream-dark rounded"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-cream-dark rounded"></div>
                                    <div className="h-2 w-full bg-cream-dark rounded"></div>
                                    <div className="h-2 w-2/3 bg-cream-dark rounded"></div>
                                </div>
                                <div className="mt-4 flex items-end gap-2 h-32">
                                    <div className="w-1/5 bg-accent/20 rounded-t-lg h-[40%]"></div>
                                    <div className="w-1/5 bg-accent/40 rounded-t-lg h-[60%]"></div>
                                    <div className="w-1/5 bg-accent/60 rounded-t-lg h-[50%]"></div>
                                    <div className="w-1/5 bg-accent/80 rounded-t-lg h-[80%]"></div>
                                    <div className="w-1/5 bg-accent rounded-t-lg h-[100%] shadow-lg shadow-accent/20"></div>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent/10 blur-3xl rounded-full"></div>
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-teal/10 blur-3xl rounded-full"></div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
