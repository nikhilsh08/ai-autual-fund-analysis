const stories = [
    {
        title: "Rahul's story",
        text: `Had 4 "diversified" large cap funds — all holding the same 30 stocks. He was paying 4 expense ratios for essentially one portfolio. By the time he caught it — 3 years later — the unnecessary fees had cost him over ₹35,000. Not devastating. But completely avoidable.`,
        color: "border-orange-300 bg-orange-50",
    },
    {
        title: "Your neighbour's parents",
        text: `Sold a ULIP in 2015 by their bank. They put in ₹1,50,000/year for 7 years. When they finally checked the IRR, the actual return was 3.8%. An index fund over the same period returned 13.4%. The gap? Over ₹8 lakh in lost wealth creation. They found out in 2022. Seven years too late.`,
        color: "border-red-300 bg-red-50",
    },
];

export const UrgencySection = () => {
    return (
        <section className="py-20 px-6 bg-zinc-950 text-white">
            <div className="max-w-3xl mx-auto">
                <p className="text-amber-400 font-bold uppercase tracking-widest text-sm mb-4">
                    The Cost of Waiting
                </p>
                <h2 className="text-3xl md:text-4xl font-bold mb-10 leading-tight">
                    The Cost of "I'll Look At It Next Quarter"
                </h2>

                <div className="space-y-6 mb-12">
                    {stories.map((s) => (
                        <div key={s.title} className={`border-l-4 rounded-r-2xl p-6 ${s.color}`}>
                            <p className="font-bold text-zinc-900 mb-2">{s.title}</p>
                            <p className="text-zinc-700 leading-relaxed">{s.text}</p>
                        </div>
                    ))}
                </div>

                <div className="space-y-5 text-zinc-300 text-lg leading-relaxed">
                    <p>
                        <span className="text-white font-bold">You?</span> Every quarter you don't verify
                        your portfolio, you're not just "postponing." You're{" "}
                        <span className="text-amber-400 font-semibold">
                            compounding ignorance alongside your money.
                        </span>
                    </p>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <p className="text-white font-semibold mb-2">The good news:</p>
                        <p>
                            The same AI that's changing every other industry can now be the tool that protects
                            your family's wealth. It's only getting better with time. And this workshop teaches
                            you how to use it — this weekend, not "someday."
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
