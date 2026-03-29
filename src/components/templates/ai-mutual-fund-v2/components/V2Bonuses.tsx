const bonuses = [
    {
        num: "01",
        title: "Monthly Audit Checklist",
        desc: "A 15-minute routine you can run every month to keep your portfolio verified. No more 3-hour Excel sessions. No more quarterly guilt.",
        value: "₹1,999",
        color: "border-blue-200 bg-blue-50",
        numColor: "text-blue-600",
    },
    {
        num: "02",
        title: "Interpretation Guide",
        desc: "What does 67% overlap actually mean? Is 1.8% expense ratio high? When is 18% return actually bad? The plain-English guide that makes sense of every number.",
        value: "₹999",
        color: "border-indigo-200 bg-indigo-50",
        numColor: "text-indigo-600",
    },
    {
        num: "03",
        title: "Lifetime Prompt Updates",
        desc: "As AI models improve, we update the prompts. You get every update. Forever. No recurring fees.",
        value: "Priceless",
        color: "border-zinc-200 bg-zinc-50",
        numColor: "text-zinc-700",
    },
];

export const V2Bonuses = () => {
    return (
        <section className="py-20 px-6 bg-zinc-950 text-white">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-4">
                        Bonuses
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">What Else You Get</h2>
                    <p className="text-zinc-400">
                        Because the prompts alone aren't enough — you need to know what the numbers mean.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {bonuses.map((b) => (
                        <div key={b.num} className={`border rounded-2xl p-6 ${b.color}`}>
                            <p className={`font-extrabold text-4xl mb-3 ${b.numColor}`}>{b.num}</p>
                            <p className="font-bold text-zinc-900 text-lg mb-3">{b.title}</p>
                            <p className="text-zinc-600 text-sm leading-relaxed mb-5">{b.desc}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-zinc-400 uppercase tracking-wide">Value</span>
                                <span className="font-bold text-zinc-900 line-through opacity-60 text-sm">
                                    {b.value}
                                </span>
                            </div>
                            <p className="text-right text-sm font-bold text-blue-600 mt-1">
                                Included FREE
                            </p>
                        </div>
                    ))}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                    <p className="text-zinc-400 text-sm mb-1">Total bonus value:</p>
                    <p className="text-3xl font-extrabold text-white">
                        ₹2,998+{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 text-xl font-semibold">
                            Included at no extra cost
                        </span>
                    </p>
                </div>
            </div>
        </section>
    );
};
