export const BackstorySection = () => {
    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 text-center mb-12">
                    How 10,000 People Told Me What Was Missing
                </h2>

                <div className="text-lg md:text-xl text-zinc-700 leading-relaxed space-y-6">
                    <p className="font-semibold text-zinc-900">Here's how this workshop came to be.</p>

                    <p>
                        Over the past 6 months, I taught 10,000+ working professionals the fundamentals of
                        equity mutual fund investing through my webinar. The feedback was overwhelmingly
                        positive — people finally understood what Sortino ratios meant, why rolling returns
                        matter more than absolute returns, how to read a fund factsheet.
                    </p>

                    <p className="font-bold text-zinc-900">But then the same feedback kept appearing:</p>

                    <div className="bg-blue-50 border-l-4 border-blue-600 p-6 space-y-3 italic">
                        <p>"Nikhil, I loved the theory. But when I sat down to actually DO it on my portfolio... I got stuck."</p>
                        <p>"I understand the concept of portfolio overlap now. But calculating it myself takes 4 hours and I still get confused."</p>
                        <p>"I know what risk-adjusted returns means. But I can't figure out if MY fund's risk-adjusted return is higher than other funds in its category."</p>
                    </div>

                    <p>
                        They understood the <span className="font-bold">WHAT</span>. They couldn't do the{" "}
                        <span className="font-bold">HOW</span>.
                    </p>

                    <p>
                        And honestly? I couldn't blame them. The mathematical concepts are straightforward — but
                        implementing them manually requires time, Excel skills, and data access that most working
                        professionals don't have.
                    </p>

                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 pt-4">
                        Then AI changed everything.
                    </p>

                    <p>
                        I spent months combining two things that are rarely found together:{" "}
                        <span className="font-semibold">deep personal finance expertise</span> (from 5 years of
                        institutional-grade risk analysis at Goldman Sachs) and{" "}
                        <span className="font-semibold">AI prompt engineering</span> (crafting context-rich
                        prompts that make AI give you precise, actionable financial analysis — not generic
                        responses).
                    </p>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
                        <p className="text-xl font-bold text-zinc-900 mb-4">The result:</p>
                        <p className="text-lg">
                            6 copy-paste prompts that let anyone — regardless of finance background — run the same
                            portfolio analysis that institutional investors pay lakhs for.
                        </p>
                    </div>

                    <p className="font-semibold">
                        No finance degree needed. No Excel manipulation. You paste a prompt, feed it your fund
                        data, and get institutional-grade analysis in minutes.
                    </p>

                    <p className="text-xl font-bold text-blue-600">
                        This workshop teaches you exactly how to use them — on YOUR portfolio, live, with me
                        walking you through every step.
                    </p>
                </div>
            </div>
        </section>
    );
};
