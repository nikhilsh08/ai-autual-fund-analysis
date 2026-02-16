import { WorkshopCTA } from "./WorkshopCTA";

interface InformationAsymmetryProps {
    courseId: string;
    price: number;
}

export const InformationAsymmetry: React.FC<InformationAsymmetryProps> = ({ courseId, price }) => {
    return (
        <section className="py-20 px-6 bg-zinc-50">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 text-center mb-12">
                    Why Ultra-HNIs Get Better Advice (It's Not What You Think)
                </h2>

                <div className="text-lg text-zinc-700 leading-relaxed space-y-6 mb-12">
                    <p>
                        You might think the ultra-wealthy get better investment advice because they have smarter
                        advisors.
                    </p>
                    <p className="font-bold text-zinc-900 text-xl">That's not it.</p>
                    <p>
                        They get better advice because they have access to better tools. And those tools reveal
                        things that change decisions.
                    </p>
                </div>

                {/* The Pyramid */}
                <div className="space-y-6 mb-12">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-8 border-2 border-purple-300">
                        <h3 className="text-xl font-bold text-zinc-900 mb-2">
                            ULTRA HNI (₹50Cr+ portfolios)
                        </h3>
                        <p className="text-zinc-700 mb-2">
                            → RIA with institutional database access (Bloomberg, ACE Equity)
                        </p>
                        <p className="text-zinc-700 mb-2">
                            → Direct fund manager calls, dedicated risk analytics team
                        </p>
                        <p className="font-bold text-red-700">Cost: ₹18-35 lakh/year in tools alone</p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-8 border-2 border-blue-300">
                        <h3 className="text-xl font-bold text-zinc-900 mb-2">HNI (₹5-50Cr portfolios)</h3>
                        <p className="text-zinc-700 mb-2">
                            → Mutual Fund Distributors/Fee-only RIA with Morningstar Direct access
                        </p>
                        <p className="text-zinc-700 mb-2">
                            → Quarterly portfolio reviews, risk-adjusted analysis
                        </p>
                        <p className="font-bold text-orange-700">Cost: ₹50,000-2,00,000/year</p>
                    </div>

                    <div className="bg-gradient-to-r from-zinc-100 to-gray-100 rounded-xl p-8 border-2 border-zinc-300">
                        <h3 className="text-xl font-bold text-zinc-900 mb-2">YOU (₹5-50L portfolios)</h3>
                        <p className="text-zinc-700 mb-2">
                            → Commission-based advisor OR complete DIY
                        </p>
                        <p className="text-zinc-700 mb-2">
                            → "Trust the recommendation." No verification tools.
                        </p>
                        <p className="text-zinc-700 mb-2">
                            → Regular plans costing 0.5-1% more annually
                        </p>
                        <p className="font-bold text-green-700">
                            Cost of tools: Functionally ₹0 — because nothing affordable exists
                        </p>
                    </div>
                </div>

                {/* The Gap in Action */}
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm mb-12">
                    <h3 className="text-2xl font-bold text-zinc-900 mb-8">The Gap in Action:</h3>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="font-bold text-lg text-green-700">Ultra-HNI conversation:</h4>
                            <div className="bg-green-50 rounded-lg p-4 space-y-2 text-sm">
                                <p className="font-semibold">"Show me the maximum downside for this balanced fund"</p>
                                <p>
                                    → Advisor: "It dropped to 25% during March 2020, indicating poor crash protection.
                                    I recommend this alternative fund with a 16% maximum drawdown."
                                </p>
                                <p className="font-bold text-green-700">
                                    → Decision: Data-driven. Verified. Confident.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-lg text-red-700">Your conversation:</h4>
                            <div className="bg-red-50 rounded-lg p-4 space-y-2 text-sm">
                                <p className="font-semibold">"Is this balanced fund good?"</p>
                                <p>→ Advisor: "Yes, it protects downside during crashes. Trust me."</p>
                                <p>→ You: "Okay."</p>
                                <p className="font-bold text-red-700">
                                    → Decision: Trust-based. Unverified. Anxious.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-lg text-zinc-700 leading-relaxed space-y-6 mb-12">
                    <p className="text-xl font-bold text-zinc-900">
                        You're not making worse decisions because you're less smart. You're making unverified
                        decisions because you don't have the tools.
                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6">
                        <p className="text-xl font-semibold text-zinc-900">
                            "But I don't have ₹1 lakh for expensive data tools. So what am I supposed to do?"
                        </p>
                    </div>

                    <p className="text-2xl font-bold text-blue-600">
                        That's exactly why these AI prompts exist.
                    </p>
                </div>

                <WorkshopCTA courseId={courseId} price={price} />
            </div>
        </section>
    );
};
