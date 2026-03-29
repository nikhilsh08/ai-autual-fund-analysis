import { V2CTA } from "./V2CTA";

interface V2PricingProps {
    courseId: string;
    price: number;
    originalPrice?: number | null;
    startDate?: Date | null | undefined;
    duration?: string | null;
    type?: string | null;
}

const formatDate = (date: Date | null | undefined) => {
    if (!date) return "March 5, 2026";
    return new Date(date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export const V2Pricing: React.FC<V2PricingProps> = ({ courseId, price, originalPrice, startDate, duration, type }) => {
    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-xl mx-auto text-center">
                <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-6">Pricing</p>

                {/* Price display */}
                <div className="mb-4">
                    {originalPrice && originalPrice > price && (
                        <p className="text-zinc-400 text-lg line-through mb-1">
                            ₹{originalPrice.toLocaleString("en-IN")}
                        </p>
                    )}
                    <p className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        ₹{price.toLocaleString("en-IN")}
                    </p>
                    <p className="text-2xl text-zinc-500 font-medium mt-1">Once. Forever.</p>
                </div>

                <p className="text-zinc-500 mb-10">
                    If this workshop helps you avoid even one poor fund decision, it pays for itself many
                    times over.
                </p>

                {/* Math breakdown */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 mb-8 text-left">
                    <p className="font-bold text-zinc-900 mb-5">The Math:</p>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-600">Cost of workshop</span>
                            <span className="font-semibold text-zinc-900">
                                ₹{price.toLocaleString("en-IN")}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-600">Average fee savings discovered</span>
                            <span className="font-semibold text-blue-700">₹11,000/year</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-600">One avoided ULIP mistake</span>
                            <span className="font-semibold text-blue-700">₹50,000–2,00,000</span>
                        </div>
                        <hr className="border-zinc-200" />
                        <p className="font-bold text-blue-600 text-center pt-1">
                            Break-even point: One insight. One avoided mistake. One verified decision.
                        </p>
                    </div>
                </div>

                {/* Workshop details */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 mb-10 text-left">
                    <p className="font-bold text-zinc-900 mb-5">Workshop Details:</p>
                    <div className="space-y-3">
                        {[
                            { label: "Date", value: formatDate(startDate) },
                            { label: "Duration", value: duration || "Full Day Workshop" },
                            { label: "Format", value: type === "HYBRID" ? "Live + Recorded" : type === "LIVE" ? "Live" : type === "RECORDED" ? "Recorded" : "Live + Recording (lifetime access)" },
                        ].map((item) => (
                            <div key={item.label} className="flex justify-between">
                                <span className="text-zinc-500">{item.label}</span>
                                <span className="font-semibold text-zinc-900">{item.value}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-zinc-400 mt-4 text-center">
                        Limited slots — applications close when filled.
                    </p>
                </div>

                <V2CTA
                    courseId={courseId}
                    price={price}
                    originalPrice={originalPrice}
                    discountCode=""
                />
            </div>
        </section>
    );
};
