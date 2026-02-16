export const VerificationCapability = () => {
    const comparisons = [
        {
            question: "Are my 4 funds actually diversified?",
            without: "No idea. You assume 4 funds = 4 different portfolios.",
            with: "You discover: 67% overlap. You're paying 4 expense ratios for essentially the same 30 stocks.",
            timeWithout: "∞ (you never check)",
            timeWith: "10 minutes",
        },
        {
            question: "Is my fund's 18% return actually good?",
            without: "Looks great! You're happy.",
            with: "You discover: Nifty did 22%. Your fund took MORE risk for LESS return. A simple index fund would have beaten it.",
            timeWithout: "∞",
            timeWith: "5 minutes",
        },
        {
            question: "Does this fund actually protect during crashes?",
            without: "Advisor says yes. You hope it's true.",
            with: "You discover: During the 2020 crash, this \"balanced\" fund fell MORE than a pure equity fund. It didn't protect anything.",
            timeWithout: "∞",
            timeWith: "5 minutes",
        },
        {
            question: "What is my fund manager actually buying?",
            without: "You see \"Large Cap Fund\" and assume large caps.",
            with: "You discover: 8.4% of your \"large cap\" fund is in small caps and stocks outside the benchmark. Hidden bets you didn't sign up for.",
            timeWithout: "∞",
            timeWith: "5 minutes",
        },
        {
            question: "Is this ULIP better than mutual fund + term insurance?",
            without: "Trust the recommendation.",
            with: "You run the IRR. You see the actual return comparison. You make an informed decision.",
            timeWithout: "∞",
            timeWith: "15 minutes",
        },
    ];

    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 text-center mb-8">
                    What Changes When You Have The Tools
                </h2>
                <p className="text-xl text-zinc-600 text-center mb-16 max-w-3xl mx-auto">
                    This isn't about becoming a finance expert. It's about being able to check what you're told.
                </p>

                <div className="space-y-12">
                    {comparisons.map((comp, index) => (
                        <div key={index} className="bg-zinc-50 rounded-2xl p-8 md:p-10">
                            <h3 className="text-2xl font-bold text-zinc-900 mb-8">
                                QUESTION {index + 1}: "{comp.question}"
                            </h3>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                                    <h4 className="font-bold text-red-700 mb-4">Without Tools</h4>
                                    <p className="text-zinc-700 mb-4">{comp.without}</p>
                                    <p className="text-sm text-zinc-500">Time: {comp.timeWithout}</p>
                                </div>

                                <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                                    <h4 className="font-bold text-green-700 mb-4">With Tools</h4>
                                    <p className="text-zinc-700 mb-4">{comp.with}</p>
                                    <p className="text-sm font-semibold text-green-700">
                                        Time to verify: {comp.timeWith}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8 md:p-12 mt-12 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">The Bottom Line:</h3>
                    <p className="text-xl mb-2">
                        Total time for a complete portfolio audit: <span className="font-bold">~50 minutes</span>
                    </p>
                    <p className="text-lg opacity-90">
                        Time you currently spend: 12-14 hours... or you just don't do it.
                    </p>
                </div>
            </div>
        </section>
    );
};
