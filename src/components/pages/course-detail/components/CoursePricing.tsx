"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Check, Users, Clock, BookOpen, Infinity, Star } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { BUNDLE } from "@/Utils/siteData";

interface CoursePricingProps {
    courseId: string;
    price: number;
    originalPrice?: number | null;
    duration?: string;
    bundle: any;
}

const courseFeatures = [
    "Full course access",
    "AI prompts & analysis templates",
    "Group doubt-clearing session",
    "1 year of course updates",
    "₹9,000 in bonus guides & templates",
];

const bundleFeatures = [
    "All 12 courses included",
    "Biweekly video updates",
    "Biweekly written analysis",
    "Live sessions access",
    "Community membership",
    "1-year of content updates",
];

export const CoursePricing = ({ courseId, price, originalPrice, duration, bundle }: CoursePricingProps) => {
    const router = useRouter();
    const { data: session } = useSession();
    const { addBundle, hasConflictingCourses } = useCartStore();
    console.log(bundle)

    const handleEnroll = () => {
<<<<<<< HEAD
       router.push('/bundle');
=======
        router.push(`/checkout?courseId=${courseId}`);
>>>>>>> 5da359ff0f39f34542ac2b2fa89c5c7b08ed8b32
    };

    const handleBuyBundle = async () => {
        const hasConflicts = hasConflictingCourses([]);

        if (hasConflicts) {
            const confirmed = window.confirm(
                "Some courses in your cart are included in this bundle. Adding the bundle will replace them with better savings. Continue?"
            );
            if (!confirmed) return;
        }

<<<<<<< HEAD
        // await addBundle(
        //     {
        //         id: bundle.id,
        //         title: bundle.name,
        //         price: bundle.price,
        //         type: "bundle",
        //         courseIds: bundle.courseIds,
        //     },
        //     !!session
        // );

        router.push("/bundle/12-courses-every-major-topic");
=======
        await addBundle(
            {
                id: bundle.id,
                title: bundle.name,
                price: bundle.price,
                type: "bundle",
                courseIds: bundle.courseIds,
            },
            !!session
        );

        router.push("/checkout?bundle=complete");
>>>>>>> 5da359ff0f39f34542ac2b2fa89c5c7b08ed8b32
    };

    const stats = [
        { icon: Users, label: "100+ enrolled", value: "100+" },
        { icon: Clock, label: duration || "~90 min", value: duration || "~90 min" },
        { icon: BookOpen, label: "5 modules", value: "5" },
    ];

    const discount = originalPrice && originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    return (
        <section  className="py-16 px-4 sm:px-6 bg-cream">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <p className="text-accent font-bold uppercase tracking-widest text-sm mb-2 ">
                        Pricing
                    </p>
                    <h2 className="font-serif font-black text-ink tracking-tighter mb-2" style={{ fontSize: "clamp(26px,4vw,40px)" }}>
                        Invest in your financial future
                    </h2>
                    <p className="text-ink-secondary">
                        Choose the option that works best for you
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

                {/* Pricing Cards - Two Column */}
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {/* Individual Course Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-border relative overflow-hidden">
                        {/* Discount Badge */}
                        {discount > 0 && (
                            <div className="absolute top-4 right-4 bg-teal text-white text-xs font-bold px-3 py-1 rounded-full">
                                {discount}% OFF
                            </div>
                        )}

                        <div className="text-center mb-2">
                            <span className="text-sm font-medium text-ink-secondary uppercase tracking-wider">
                                This Course Only
                            </span>
                        </div>

                        {/* Price */}
                        <div className="text-center mb-6">
                            {originalPrice && originalPrice > price && (
                                <p className="text-ink-muted text-lg line-through mb-1">
                                    ₹{originalPrice.toLocaleString("en-IN")}
                                </p>
                            )}
                            <p className="text-5xl font-bold text-ink font-serif">
                                ₹{price.toLocaleString("en-IN")}
                            </p>
                            <p className="text-ink-secondary mt-2 text-sm">
                                One-time payment
                            </p>
                        </div>

                        {/* Features */}
                        <div className="space-y-3 mb-8">
                            {courseFeatures.map((feature, index) => (
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

                    {/* Bundle Card */}
                    <div className="bg-ink rounded-3xl p-8 shadow-xl relative overflow-hidden">
                        {/* Decorative glow */}
                        <div
                            className="absolute -top-[60px] -right-[60px] w-[220px] h-[220px] rounded-full pointer-events-none"
                            style={{ background: 'radial-gradient(circle,rgba(91,79,214,.3),transparent 70%)' }}
                        />

                        {/* Best Value Badge */}
                        <div className="flex justify-center mb-4">
                            <div className="inline-flex items-center gap-1 bg-success text-white text-[10px] font-bold tracking-[.1em] uppercase px-3.5 py-1 rounded-full">
                                <Star className="w-3 h-3 fill-current" />
                                Best Value — Save ₹{BUNDLE.savings.toLocaleString("en-IN")}
                            </div>
                        </div>

                        <div className="text-center mb-2 relative z-10">
                            <span className="text-sm font-medium text-cream/70 uppercase tracking-wider">
                                Complete Bundle
                            </span>
                        </div>

                        {/* Price */}
                        <div className="text-center mb-6 relative z-10">
                            <p className="text-cream/40 text-lg line-through mb-1">
                                ₹{bundle.originalPrice.toLocaleString("en-IN")}
                            </p>
                            <p className="text-5xl font-bold text-cream font-serif">
                                ₹{bundle.price.toLocaleString("en-IN")}
                            </p>
                            <p className="text-cream/60 mt-2 text-sm">
                                One-time payment · 1-year membership
                            </p>
                        </div>

                        {/* Features */}
                        <div className="space-y-3 mb-8 relative z-10">
                            {bundleFeatures.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <Check className="w-4 h-4 text-success shrink-0" />
                                    <span className="text-cream/80 text-sm">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <button
                            onClick={handleBuyBundle}
                            className="w-full flex items-center justify-center px-7 py-4 rounded-full text-[15px] font-semibold text-white hover:-translate-y-px transition-transform cursor-pointer relative z-10"
                            style={{ background: 'linear-gradient(135deg,#5B4FD6,#1E8FE1)' }}
                        >
                            Get Everything — ₹{BUNDLE.price.toLocaleString("en-IN")} →
                        </button>

                        {/* Trust */}
                        <p className="text-center text-xs text-cream/40 mt-4 relative z-10">
                            100% money-back guarantee on your first course
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
