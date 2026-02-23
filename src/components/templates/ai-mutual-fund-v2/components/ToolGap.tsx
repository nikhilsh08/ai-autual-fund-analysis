import { V2CTA } from "./V2CTA";

interface ToolGapProps {
    courseId: string;
    price: number;
}

const tiers = [
    {
        label: "ULTRA HNI",
        subtitle: "₹50Cr+ portfolios",
        color: "bg-yellow-50 border-yellow-200",
        labelColor: "text-yellow-800",
        items: [
            "Bloomberg Terminal, ACE Equity access",
            "Direct fund manager calls & dedicated risk analytics team",
            "Cost of tools alone: ₹18–35 lakh/year",
        ],
    },
    {
        label: "HNI",
        subtitle: "₹5–50Cr portfolios",
        color: "bg-blue-50 border-blue-200",
        labelColor: "text-blue-800",
        items: [
            "Fee-only RIA with Morningstar Direct access",
            "Quarterly portfolio reviews with risk-adjusted analysis",
            "Cost: ₹50,000–2,00,000/year",
        ],
    },
    {
        label: "YOU",
        subtitle: "₹5–50L portfolios",
        color: "bg-red-50 border-red-200",
        labelColor: "text-red-800",
        items: [
            "Commission-based advisor OR complete DIY",
            '"Trust my recommendation." No verification tools.',
            "Regular plans costing 0.5–1% more annually",
            "Cost of tools: ₹0 — because nothing affordable existed. Until now.",
        ],
    },
];

export const ToolGap: React.FC<ToolGapProps> = ({ courseId, price }) => {
    return (
        <section className="py-20 px-6 bg-zinc-50">
            <div className="max-w-4xl mx-auto">
                <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">
                    The Tool Gap
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2 leading-tight">
                    Why The Wealthy Get Better Advice
                </h2>
                <p className="text-xl text-zinc-500 mb-10">
                    (And It's Not Because They're Smarter)
                </p>

                <div className="space-y-4 mb-12">
                    {tiers.map((tier) => (
                        <div key={tier.label} className={`border rounded-2xl p-6 ${tier.color}`}>
                            <div className="flex items-center gap-3 mb-3">
                                <span className={`font-extrabold text-lg ${tier.labelColor}`}>
                                    {tier.label}
                                </span>
                                <span className="text-zinc-500 text-sm">{tier.subtitle}</span>
                            </div>
                            <ul className="space-y-2">
                                {tier.items.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-zinc-700 text-sm">
                                        <span className="text-zinc-400 mt-0.5">→</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Conversation comparison */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                        <p className="font-bold text-yellow-800 text-sm mb-3">Ultra-HNI's conversation</p>
                        <div className="space-y-2 text-sm text-zinc-700">
                            <p>
                                <span className="font-semibold">You:</span> "Show me the maximum drawdown for
                                this balanced fund."
                            </p>
                            <p>
                                <span className="font-semibold">Advisor:</span> "It dropped 25% in March 2020.
                                I recommend this alternative — 16% maximum drawdown."
                            </p>
                        </div>
                        <p className="mt-3 text-xs font-bold text-blue-700 bg-blue-50 rounded-lg px-3 py-1 inline-block">
                            Data-driven. Verified. Confident.
                        </p>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                        <p className="font-bold text-red-800 text-sm mb-3">Your conversation</p>
                        <div className="space-y-2 text-sm text-zinc-700">
                            <p>
                                <span className="font-semibold">You:</span> "Is this balanced fund good?"
                            </p>
                            <p>
                                <span className="font-semibold">Advisor:</span> "Yes, it protects downside.
                                Trust me."
                            </p>
                            <p>
                                <span className="font-semibold">You:</span> "Okay."
                            </p>
                        </div>
                        <p className="mt-3 text-xs font-bold text-red-700 bg-red-100 rounded-lg px-3 py-1 inline-block">
                            Trust-based. Unverified. Anxious.
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-lg text-zinc-600 mb-6">
                        You're not making worse decisions because you're less intelligent. You're making{" "}
                        <span className="font-semibold text-zinc-900">unverified decisions</span> because
                        you've never had the tools to check.
                    </p>
                    <V2CTA courseId={courseId} price={price} discountCode="" />
                </div>
            </div>
        </section>
    );
};
