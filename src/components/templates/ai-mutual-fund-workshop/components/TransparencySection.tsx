import { XCircle } from "lucide-react";

export const TransparencySection = () => {
    const whatWeDontDo = [
        "No fund recommendations — Recommendations create dependency. Tools create independence. We chose tools.",
        "No recurring fees — The prompts don't expire. AI improves automatically. One payment. Lifetime access.",
        "No commission partnerships — Zero partnerships with AMCs. Zero conflicts of interest. When we say \"verify your advisor's recommendation,\" we mean it.",
        'No "incomplete by design" products — We could have taught 3 prompts and saved 3 for a "₹2,999 advanced workshop." We didn\'t.',
    ];

    return (
        <section className="py-20 px-6 bg-zinc-50">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 text-center mb-12">
                    "Okay, But What's In It For You?"
                </h2>

                <div className="text-lg text-zinc-700 leading-relaxed space-y-6 mb-12">
                    <p className="font-semibold">Fair question. You've been burned before. Here's the honest answer.</p>

                    <p>Our business model is simple:</p>

                    <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-600">
                        <p>
                            This workshop teaches you to analyse equity mutual funds using AI. It's complete. You
                            walk away with every prompt, every framework, every tool. You never need to buy
                            anything else from us.
                        </p>
                    </div>

                    <p>
                        We have a separate, more comprehensive course that covers equities, bonds, commodities,
                        expense management, and goal planning. It's a different product for a different need —
                        NOT the "advanced version" of this workshop.
                    </p>

                    <div className="bg-white rounded-xl p-6 border border-zinc-200">
                        <p className="font-bold text-zinc-900 mb-4">Think of it this way:</p>
                        <p className="mb-2">
                            <span className="font-semibold">Workshop</span> = "Are my mutual funds actually good?"
                        </p>
                        <p>
                            <span className="font-semibold">Other Courses</span> = "How do I build my entire
                            financial system?"
                        </p>
                        <p className="mt-4 text-blue-600 font-semibold">
                            You can take one without the other. Neither is a prerequisite. Neither is incomplete
                            without the other.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm mb-12">
                    <h3 className="text-2xl font-bold text-zinc-900 mb-6">What we DON'T do:</h3>
                    <div className="space-y-4">
                        {whatWeDontDo.map((item, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                                <p className="text-zinc-700">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
                    <h3 className="text-2xl font-bold text-zinc-900 mb-4">The win-win:</h3>
                    <p className="text-lg text-zinc-700 mb-4">
                        You get lifetime verification capability. We get to build a reputation as the most
                        honest financial education company in India. Some of you will love this enough to take
                        our full course later. Many won't — and that's genuinely fine.
                    </p>
                    <p className="text-xl font-bold text-green-700">
                        Take the workshop and never buy anything else from us. You'll still have full mutual
                        fund verification capability.
                    </p>
                    <p className="text-lg text-zinc-700 mt-4">We're okay with that. Seriously.</p>
                </div>
            </div>
        </section>
    );
};
