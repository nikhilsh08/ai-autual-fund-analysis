const steps = [
    "Download factsheet for Fund A.",
    `Find the "Top 10 Holdings" section.`,
    `Copy stock names to Excel — "Reliance Industries Ltd." vs "Reliance Ind" vs "RELIANCE" — which one matches?`,
    "Repeat for Funds B, C, D, E. Two hours gone.",
    "Try to compare. Names don't match. You're manually cross-checking each one.",
    "Give up at 3 hours. Still don't know the actual overlap percentage.",
    "Feel guilty for the next 6 months.",
    "Promise yourself you'll do it next quarter. You won't.",
];

export const UncomfortableTruth = () => {
    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2 leading-tight">
                    It's Not That You Don't Care About Your Money.
                </h2>
                <p className="text-xl text-red-500 font-semibold mb-10">
                    It's That Checking It Is Unreasonably Hard.
                </p>

                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 mb-10">
                    <p className="text-zinc-500 text-sm font-semibold uppercase tracking-wider mb-5">
                        SCENARIO: You want to check if your funds overlap.
                    </p>
                    <div className="space-y-3">
                        {steps.map((step, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <span
                                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i < 5
                                            ? "bg-zinc-200 text-zinc-600"
                                            : "bg-red-100 text-red-600"
                                        }`}
                                >
                                    {i + 1}
                                </span>
                                <p
                                    className={`leading-relaxed pt-1 ${i >= 5 ? "text-red-700 font-medium" : "text-zinc-700"
                                        }`}
                                >
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-5 text-lg text-zinc-700 leading-relaxed">
                    <p>
                        The reason your portfolio goes unchecked isn't because you don't care. It's because
                        the effort required makes it{" "}
                        <span className="font-semibold text-zinc-900">
                            functionally impossible for someone who works 10–12 hours a day.
                        </span>
                    </p>
                    <p className="font-semibold text-zinc-900">And that's exactly where AI changes the game.</p>
                    <div className="space-y-2 pl-4 border-l-4 border-zinc-200 text-zinc-500">
                        <p>✗ Not by giving you stock tips.</p>
                        <p>✗ Not by predicting markets.</p>
                    </div>
                    <p className="text-xl font-bold text-blue-600 border-l-4 border-blue-600 pl-4">
                        ✓ By compressing hours of manual verification into minutes.
                    </p>
                    <p>
                        This workshop doesn't make you work harder on your portfolio. It finally makes{" "}
                        <span className="font-semibold">the work small enough to actually do.</span>
                    </p>
                </div>
            </div>
        </section>
    );
};
