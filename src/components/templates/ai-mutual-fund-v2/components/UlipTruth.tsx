import { V2CTA } from "./V2CTA";

interface UlipTruthProps {
    courseId: string;
    price: number;
}

export const UlipTruth: React.FC<UlipTruthProps> = ({ courseId, price }) => {
    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-3xl mx-auto">
                <p className="text-red-500 font-bold uppercase tracking-widest text-sm mb-4">
                    The ULIP Truth
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3 leading-tight">
                    Why Your Bank Manager Might Recommend a ULIP
                </h2>
                <p className="text-lg text-zinc-500 mb-10">
                    And How To Check If It's Actually Right For You
                </p>

                <p className="text-zinc-700 mb-8">
                    This isn't about good vs bad advisors. This is about understanding incentive structures —
                    so you can verify recommendations with numbers, not trust.
                </p>

                {/* Commission table */}
                <div className="overflow-x-auto mb-10">
                    <table className="w-full text-sm border-collapse rounded-xl overflow-hidden">
                        <thead>
                            <tr className="bg-zinc-900 text-white">
                                <th className="text-left p-4">Product</th>
                                <th className="text-left p-4">Your Investment</th>
                                <th className="text-left p-4">Distributor Earns (10 yrs)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-emerald-50 border-b border-zinc-100">
                                <td className="p-4 font-medium text-zinc-900">
                                    Equity Mutual Fund (Regular Plan)
                                </td>
                                <td className="p-4 text-zinc-700">₹1,00,000 in 1 year</td>
                                <td className="p-4 font-semibold text-emerald-700">₹10,000–15,000</td>
                            </tr>
                            <tr className="bg-red-50 border-b border-zinc-100">
                                <td className="p-4 font-medium text-zinc-900">ULIP / Endowment Plan</td>
                                <td className="p-4 text-zinc-700">₹1,00,000/year</td>
                                <td className="p-4 font-semibold text-red-700">₹40,000–70,000</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10">
                    <p className="font-semibold text-zinc-900">
                        The math: A distributor earns 4–7x more by recommending a ULIP instead of a mutual
                        fund + term insurance.
                    </p>
                </div>

                {/* Before & After */}
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                        <p className="font-bold text-red-700 text-sm mb-4">Before this workshop</p>
                        <div className="space-y-2 text-sm text-zinc-700">
                            <p>
                                <span className="font-semibold">Bank manager:</span> "This ULIP is perfect for
                                your children's education."
                            </p>
                            <p>
                                <span className="font-semibold">You:</span> "Okay, sounds good."
                            </p>
                            <p className="text-red-500 italic">(No way to check.)</p>
                        </div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                        <p className="font-bold text-emerald-700 text-sm mb-4">After this workshop</p>
                        <div className="space-y-2 text-sm text-zinc-700">
                            <p>
                                <span className="font-semibold">You:</span> "I ran the IRR calculation. This
                                ULIP returns 4.2% annually. Nifty 50 has averaged 12%. Why is this better for
                                me?"
                            </p>
                            <p>
                                <span className="font-semibold">Bank manager:</span> [silence]
                            </p>
                            <p className="text-emerald-600 font-semibold">
                                You avoid a ₹50,000–₹2,00,000 mistake.
                            </p>
                        </div>
                    </div>
                </div>

                <blockquote className="border-l-4 border-zinc-300 pl-6 text-zinc-500 italic text-lg mb-8">
                    "Show me the incentive, and I will show you the outcome." — Charlie Munger
                </blockquote>

                <div className="text-center">
                    <V2CTA courseId={courseId} price={price} discountCode="" />
                </div>
            </div>
        </section>
    );
};
