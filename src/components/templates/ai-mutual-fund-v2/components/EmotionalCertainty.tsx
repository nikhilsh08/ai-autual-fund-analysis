export const EmotionalCertainty = () => {
    const knowings = [
        "Knowing your funds are actually diversified.",
        "Knowing your returns justify the risk you're taking.",
        "Knowing your advisor's recommendation checks out — or doesn't.",
        "Knowing that ULIP isn't silently eroding your children's education fund.",
    ];

    return (
        <section className="py-20 px-6 bg-gradient-to-b from-zinc-50 to-white">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-8 leading-tight">
                    You Deserve To Stop Worrying About Your Money
                </h2>

                <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                    The goal isn't to become a finance expert. The goal is to stop carrying the low-grade
                    anxiety of not knowing if your money is okay.
                </p>

                <div className="space-y-3 mb-10 text-left">
                    {[
                        `That weight you feel when someone mentions "portfolio review" at a dinner.`,
                        `That guilt when your spouse asks "should we check our investments?" and you say "yeah, next weekend."`,
                        `That nagging feeling at 2 AM that maybe your advisor is optimising for their commission, not your retirement.`,
                    ].map((text, i) => (
                        <div key={i} className="flex items-start gap-3 bg-zinc-50 rounded-xl p-4">
                            <span className="text-zinc-300 text-lg mt-0.5">💭</span>
                            <p className="text-zinc-600 text-sm leading-relaxed">{text}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-zinc-900 text-white rounded-2xl p-8 mb-8">
                    <p className="text-2xl font-bold mb-6">
                        Real financial peace isn't ignorance.{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            It's knowing.
                        </span>
                    </p>
                    <div className="space-y-3 text-left">
                        {knowings.map((text, i) => (
                            <p key={i} className="flex items-start gap-3 text-zinc-300">
                                <span className="text-blue-400 font-bold flex-shrink-0">✓</span>
                                {text}
                            </p>
                        ))}
                    </div>
                </div>

                <p className="text-zinc-500 mb-2">That's what this workshop gives you.</p>
                <p className="text-xl font-bold text-zinc-900 mb-6">
                    Clarity you can verify — every single month, in 15 minutes, for the rest of your
                    investing life.
                </p>
                <p className="text-zinc-500 leading-relaxed">
                    The kind of clarity that lets you sleep well, focus on your career, spend weekends with
                    your family — because you KNOW your money is where it should be.
                </p>
            </div>
        </section>
    );
};
