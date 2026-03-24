"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, Users, Clock, BookOpen, Infinity } from "lucide-react";

interface CoursePricingProps {
    courseId: string;
    price: number;
    originalPrice?: number | null;
    duration?: string;
}

const features = [
    "Full course access",
    "AI prompts & analysis templates",
    "Group doubt-clearing session",
    "1 year of course updates",
    "₹9,000 in bonus guides & templates",
];

export const CoursePricing = ({ courseId, price, originalPrice, duration }: CoursePricingProps) => {
    const router = useRouter();

    const handleEnroll = () => {
        router.push(`/checkout?courseId=${courseId}`);
    };

    const stats = [
        { icon: Users, label: "100+ enrolled", value: "100+" },
        { icon: Clock, label: duration || "~90 min", value: duration || "~90 min" },
        { icon: BookOpen, label: "5 modules", value: "5" },
        { icon: Infinity, label: "Lifetime", value: "Forever" },
    ];

    const discount = originalPrice && originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    return (
        <section className="py-16 px-4 sm:px-6 bg-cream">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <p className="text-accent font-bold uppercase tracking-widest text-sm mb-2">
                        Pricing
                    </p>
                    <h2 className="font-serif font-black text-ink tracking-tighter mb-2" style={{ fontSize: "clamp(26px,4vw,40px)" }}>
                        Invest in your financial future
                    </h2>
                    <p className="text-ink-secondary">
                        One payment, lifetime access
                    </p>
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-10">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <stat.icon className="w-5 h-5 text-ink-muted mb-2" />
                            <span className="text-sm text-ink-secondary">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Pricing Card */}
                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-border relative overflow-hidden">
                        {/* Discount Badge */}
                        {discount > 0 && (
                            <div className="absolute top-4 right-4 bg-teal text-white text-xs font-bold px-3 py-1 rounded-full">
                                {discount}% OFF
                            </div>
                        )}

                        {/* Price */}
                        <div className="text-center mb-6">
                            {originalPrice && originalPrice > price && (
                                <p className="text-ink-muted text-lg line-through mb-1">
                                    ₹{originalPrice.toLocaleString("en-IN")}
                                </p>
                            )}
                            <p className="text-5xl sm:text-6xl font-bold text-ink">
                                ₹{price.toLocaleString("en-IN")}
                            </p>
                            <p className="text-ink-secondary mt-2">
                                One-time payment
                            </p>
                        </div>

                        {/* Features */}
                        <div className="space-y-3 mb-8">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <Check className="w-4 h-4 text-teal shrink-0" />
                                    <span className="text-ink-secondary text-sm">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <Button
                            onClick={handleEnroll}
                            className="w-full bg-ink hover:bg-ink-body text-white rounded-full py-6 text-base font-semibold"
                        >
                            Enroll Now
                        </Button>

                        {/* Trust */}
                        <p className="text-center text-xs text-ink-muted mt-4">
                            7-day money-back guarantee
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
