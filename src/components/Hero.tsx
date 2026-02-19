"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export const Hero = () => {
    const router = useRouter();

    const features = [
        "Lifetime Access",
        "7-Day Refund Policy",
        "Apply the same, deeply-thought, risk management strategies used for billion-dollar portfolios, to break into the next wealth tier"
    ];

    return (
        <section className="pt-32 pb-16 md:pt-24 md:pb-32 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

                    {/* Content Column */}
                    <div className="flex-1 max-w-2xl">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 mb-6 leading-[1.1]">
                            Master Your Money With <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Confidence</span>
                        </h1>

                        <p className="text-xl text-zinc-600 mb-8 leading-relaxed">
                            Institutional-grade investment education, simplified into practical courses for every stage of your financial journey.
                        </p>

                        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 md:p-8 mb-8">
                            <p className="text-zinc-700 italic text-lg mb-4">
                                "The Top 1% of Indian households own 70% of the financial assets. I’m bringing the billion-dollar frameworks they use, to the other 99% of India."
                            </p>
                            <p className="text-zinc-600 text-sm">
                                If your net worth is between ₹10L and ₹10Cr, it’s time to stop using 'retail' strategies and start using institutional ones.
                            </p>
                        </div>

                        <div className="space-y-3 mb-10">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-zinc-600 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="h-12 px-8 text-base"
                                onClick={() => router.push('/courses')}
                            >
                                Explore Courses
                            </Button>
                        </div>
                    </div>

                    {/* Visual Column - Abstract/Modern representation of growth/finance */}
                    <div className="flex-1 w-full relative">
                        <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white rounded-2xl shadow-xl p-6 border border-zinc-100 flex flex-col justify-between">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">₹</div>
                                    <div>
                                        <div className="h-2 w-24 bg-zinc-100 rounded mb-1"></div>
                                        <div className="h-2 w-16 bg-zinc-100 rounded"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-zinc-100 rounded"></div>
                                    <div className="h-2 w-full bg-zinc-100 rounded"></div>
                                    <div className="h-2 w-2/3 bg-zinc-100 rounded"></div>
                                </div>
                                <div className="mt-4 flex items-end gap-2 h-32">
                                    <div className="w-1/5 bg-blue-200 rounded-t-lg h-[40%]"></div>
                                    <div className="w-1/5 bg-blue-300 rounded-t-lg h-[60%]"></div>
                                    <div className="w-1/5 bg-blue-400 rounded-t-lg h-[50%]"></div>
                                    <div className="w-1/5 bg-blue-500 rounded-t-lg h-[80%]"></div>
                                    <div className="w-1/5 bg-blue-600 rounded-t-lg h-[100%] shadow-lg shadow-blue-200"></div>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-400/10 blur-3xl rounded-full"></div>
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-400/10 blur-3xl rounded-full"></div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
