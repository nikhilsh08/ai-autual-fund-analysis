const quotes = [
    `"Nikhil, I loved the theory. But when I sat down to actually DO it on my portfolio… I got stuck."`,
    `"I understand the concept of portfolio overlap now. But calculating it myself takes 4 hours and I still get confused."`,
    `"I know what to look for. I just can't figure out if MY fund passes or fails."`,
];

export const OriginStory = () => {
    return (
        <section className="py-20 px-6 bg-gradient-to-b from-zinc-50 to-white">
            <div className="max-w-3xl mx-auto">
                <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">
                    The Origin Story
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-10 leading-tight">
                    How 10,000 Working Professionals Told Me Exactly What Was Missing
                </h2>

                <p className="text-lg text-zinc-700 mb-6">
                    Over the past 6 months, I taught 10,000+ working professionals the fundamentals of
                    equity mutual fund investing through our webinar. The response was overwhelmingly positive
                    — people finally understood what risk-adjusted returns meant, why rolling returns matter,
                    how to actually read a fund factsheet.
                </p>
                <p className="text-lg text-zinc-700 mb-8">
                    But then the same message kept appearing:
                </p>

                <div className="space-y-4 mb-10">
                    {quotes.map((q, i) => (
                        <div key={i} className="bg-white border-l-4 border-blue-600 rounded-r-xl p-5 shadow-sm">
                            <p className="text-zinc-700 italic">{q}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-zinc-900 text-white rounded-2xl p-8 mb-8">
                    <p className="text-zinc-400 mb-4">
                        They understood the <span className="text-white font-bold">WHAT</span>. They couldn't
                        do the <span className="text-white font-bold">HOW</span>.
                    </p>
                    <p className="text-zinc-300 leading-relaxed mb-6">
                        So I spent months combining two things that are rarely found together:
                    </p>
                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <span className="text-blue-400 font-bold text-2xl leading-none">1</span>
                            <div>
                                <p className="font-semibold text-white">Deep personal finance expertise</p>
                                <p className="text-zinc-400 text-sm">
                                    5 years of institutional-grade risk analysis at Goldman Sachs.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <span className="text-blue-400 font-bold text-2xl leading-none">2</span>
                            <div>
                                <p className="font-semibold text-white">AI prompt engineering</p>
                                <p className="text-zinc-400 text-sm">
                                    Crafting context-rich prompts that make AI give you precise, structured
                                    financial analysis — not generic "invest in index funds" responses.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8">
                    <p className="text-xl font-bold text-zinc-900 mb-3">
                        The result: Your own AI-powered mutual fund verifier.
                    </p>
                    <p className="text-zinc-700 mb-4">
                        6 structured prompts that let anyone — regardless of finance background — run the same
                        core checks that institutional analysts run on portfolios worth crores.
                    </p>
                    <p className="text-zinc-600 italic">
                        Think of it as having a sharp, detail-obsessed financial analyst sitting next to you —
                        except it costs ₹999 instead of ₹18 lakh a year, and it's available at 11 PM on a
                        Sunday when you finally have 30 minutes.
                    </p>
                </div>
            </div>
        </section>
    );
};
