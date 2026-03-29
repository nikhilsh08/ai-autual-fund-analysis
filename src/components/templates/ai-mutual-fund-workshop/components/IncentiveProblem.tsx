import { WorkshopCTA } from "./WorkshopCTA";
import Image from "next/image";

interface IncentiveProblemProps {
    courseId: string;
    price: number;
}

export const IncentiveProblem: React.FC<IncentiveProblemProps> = ({ courseId, price }) => {
    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-5xl mx-auto">
                {/* Charlie Munger Quote */}
                <div className="text-center mb-12">
                    <blockquote className="text-2xl md:text-3xl font-serif italic text-zinc-700">
                        "Show me the incentive, and I will show you the outcome."
                    </blockquote>
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-zinc-200 shadow-sm">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/5/56/Charlie_Munger_%28cropped%29.jpg"
                                alt="Charlie Munger"
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                        <p className="text-lg text-zinc-600 font-medium">— Charlie Munger</p>
                    </div>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 text-center mb-12">
                    Why Your Bank Manager Might Recommend a ULIP (And How to Check If It's Actually Better)
                </h2>

                <div className="text-lg text-zinc-700 leading-relaxed space-y-6 mb-12">
                    <p>Commission-based advisors get paid differently for different products.</p>
                    <p>
                        This isn't about good vs bad advisors. This is about understanding incentive structures —
                        so you can verify recommendations with facts, not hearsay.
                    </p>
                </div>

                {/* Commission Structure Table */}
                <div className="bg-zinc-50 rounded-2xl p-8 md:p-12 mb-12 overflow-x-auto">
                    <h3 className="text-2xl font-bold text-zinc-900 mb-6">The Commission Structure:</h3>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-zinc-300">
                                <th className="pb-4 text-lg font-bold text-zinc-900">Product</th>
                                <th className="pb-4 text-lg font-bold text-zinc-900">Your Investment</th>
                                <th className="pb-4 text-lg font-bold text-zinc-900">
                                    Distributor Earns (over 10 years)
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-zinc-200">
                                <td className="py-4">Equity Mutual Fund (Regular Plan)</td>
                                <td className="py-4">₹1,00,000 in 1 year</td>
                                <td className="py-4 font-bold text-green-700">₹10,000-15,000</td>
                            </tr>
                            <tr>
                                <td className="py-4">ULIP / Endowment Plan</td>
                                <td className="py-4">₹1,00,000/year</td>
                                <td className="py-4 font-bold text-red-700">₹40,000-70,000</td>
                            </tr>
                        </tbody>
                    </table>

                    <p className="text-lg text-zinc-700 mt-6">
                        <span className="font-bold">The math:</span> A distributor can earn 4-7x more by
                        recommending a ULIP instead of a mutual fund + term insurance.
                    </p>

                    <p className="text-lg font-bold text-zinc-900 mt-4">
                        The question: When someone recommends a ULIP, is it better for YOUR wealth creation, or
                        for the commission structure?
                    </p>
                </div>

                {/* Before vs After */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                        <h4 className="text-xl font-bold text-red-700 mb-4">Before (without tools):</h4>
                        <div className="space-y-2 text-zinc-700">
                            <p>
                                <span className="font-semibold">Bank manager:</span> "This ULIP is perfect for your
                                children's education."
                            </p>
                            <p>
                                <span className="font-semibold">You:</span> "Okay, sounds good."
                            </p>
                            <p className="text-sm italic">(No way to verify.)</p>
                        </div>
                    </div>

                    <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                        <h4 className="text-xl font-bold text-green-700 mb-4">
                            After (with the IRR prompt from this workshop):
                        </h4>
                        <div className="space-y-2 text-zinc-700">
                            <p>
                                <span className="font-semibold">You:</span> "I ran the IRR calculation. This ULIP
                                returns 4.2% annually. Nifty 50 has averaged 12%. Why is this better for me?"
                            </p>
                            <p>
                                <span className="font-semibold">Bank manager:</span> [silence]
                            </p>
                            <p className="font-bold text-green-700">
                                You avoid a ₹50,000 — ₹2,00,000 mistake.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 mb-12">
                    <p className="text-lg text-zinc-900 font-semibold mb-2">The uncomfortable fact:</p>
                    <p className="text-zinc-700">
                        For every 1 new mutual fund investor in India, roughly 5 families are sold low-return
                        insurance plans. Especially people overbuying guaranteed return plans, annuity plans, and
                        endowment plans.
                    </p>
                    <p className="font-bold text-zinc-900 mt-4">
                        You know who you are. Don't be a statistic.
                    </p>
                </div>

                <WorkshopCTA courseId={courseId} price={price} />
            </div>
        </section>
    );
};
