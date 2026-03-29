const questions = [
    {
        q: `"Are my 4 funds actually diversified?"`,
        without: "No idea. You assume 4 funds = 4 different portfolios. (You never check.)",
        with: "You discover 67% overlap. You're paying 4 expense ratios for essentially the same 30 stocks.",
        time: "10 minutes",
    },
    {
        q: `"Is my fund's 18% return actually good?"`,
        without: "Looks great! You feel happy.",
        with: "Nifty did 22%. Your fund took MORE risk for LESS return. A simple index fund would have beaten it.",
        time: "5 minutes",
    },
    {
        q: `"Does this fund actually protect me during crashes?"`,
        without: "Advisor says yes. You hope it's true.",
        with: `During the 2020 crash, this "balanced" fund fell MORE than a pure equity fund. It protected nothing.`,
        time: "5 minutes",
    },
    {
        q: `"What is my fund manager actually buying?"`,
        without: `You see "Large Cap Fund" and assume large caps.`,
        with: `8.4% of your "large cap" fund is in small caps and stocks outside the benchmark. Hidden bets you never signed up for.`,
        time: "5 minutes",
    },
    {
        q: `"Is this ULIP really better than mutual fund + term insurance?"`,
        without: "Trust the recommendation.",
        with: "You run the IRR. You see the actual return comparison. You make an informed decision.",
        time: "15 minutes",
    },
];

export const WhatChanges = () => {
    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-4xl mx-auto">
                <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">
                    What Changes
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2 leading-tight">
                    Five Questions You Should Be Able to Answer About Your Own Money
                </h2>
                <p className="text-lg text-zinc-500 mb-10">The difference isn't intelligence. It's visibility.</p>

                <div className="space-y-6">
                    {questions.map((item, i) => (
                        <div key={i} className="border border-zinc-200 rounded-2xl overflow-hidden">
                            <div className="bg-zinc-900 text-white px-6 py-4">
                                <p className="font-bold text-lg">{item.q}</p>
                            </div>
                            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
                                <div className="p-5 bg-red-50">
                                    <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-2">
                                        Without your AI verifier
                                    </p>
                                    <p className="text-zinc-700 text-sm">{item.without}</p>
                                </div>
                                <div className="p-5 bg-blue-50">
                                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">
                                        With your AI verifier
                                    </p>
                                    <p className="text-zinc-700 text-sm">{item.with}</p>
                                    <p className="mt-3 text-xs text-zinc-400 font-medium">
                                        Time to find out: {item.time}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 bg-zinc-900 text-white rounded-2xl p-8 text-center">
                    <p className="text-zinc-400 mb-2">The bottom line:</p>
                    <p className="text-xl font-bold">
                        Total time for a complete portfolio audit:{" "}
                        <span className="text-blue-400">~40 minutes.</span>
                    </p>
                    <p className="text-zinc-400 mt-1">
                        Time you currently spend: 12–14 hours… or, more realistically, you just don't do it.
                    </p>
                </div>
            </div>
        </section>
    );
};
