const dontDos = [
    {
        label: "No fund recommendations",
        desc: "Recommendations create dependency. Tools create independence. We chose tools.",
    },
    {
        label: "No recurring fees",
        desc: "The prompts don't expire. AI improves automatically. One payment. Lifetime access.",
    },
    {
        label: "No commission partnerships",
        desc: "Zero partnerships with AMCs. Zero conflicts of interest.",
    },
    {
        label: `No "incomplete by design" products`,
        desc: `We could have held back 3 prompts for a "₹2,999 advanced workshop." We didn't.`,
    },
];

export const V2Transparency = () => {
    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3 leading-tight">
                    "Okay, But What's In It For You?"
                </h2>
                <p className="text-zinc-500 text-lg mb-10">
                    Fair question. You've been burned by online courses before. Here's the honest answer.
                </p>

                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 mb-8">
                    <p className="font-bold text-zinc-900 mb-3">First — let's address the real objection:</p>
                    <p className="text-zinc-700 leading-relaxed">
                        You've probably bought 2–3 online courses that are still sitting unopened on your
                        phone. You signed up with enthusiasm, life got busy, and the course became a ₹499
                        guilt trip.
                    </p>
                    <p className="mt-3 font-semibold text-zinc-900 border-l-4 border-blue-600 pl-4">
                        This workshop is different because you do the work DURING the session. You don't leave
                        with a to-do list. You leave with your portfolio already verified. The "homework" is
                        already done before the workshop ends.
                    </p>
                </div>

                <div className="bg-zinc-50 rounded-2xl p-8 mb-8">
                    <p className="font-bold text-zinc-900 mb-6">Our business model:</p>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white border border-blue-100 rounded-xl p-4 text-center">
                            <p className="font-semibold text-zinc-900 text-sm">Workshop</p>
                            <p className="text-zinc-500 text-xs mt-1">
                                "Are my mutual funds actually doing their job?"
                            </p>
                        </div>
                        <div className="bg-white border border-zinc-200 rounded-xl p-4 text-center">
                            <p className="font-semibold text-zinc-900 text-sm">Other Courses</p>
                            <p className="text-zinc-500 text-xs mt-1">
                                "How do I build my entire financial system?"
                            </p>
                        </div>
                    </div>
                    <p className="text-zinc-600 text-sm text-center">
                        You can take one without the other. Neither is incomplete.
                    </p>
                </div>

                <h3 className="font-bold text-zinc-900 mb-4">What we DON'T do:</h3>
                <div className="space-y-3 mb-8">
                    {dontDos.map((item) => (
                        <div key={item.label} className="flex items-start gap-3 bg-zinc-50 rounded-xl p-4">
                            <span className="text-blue-600 font-bold flex-shrink-0 mt-0.5">✓</span>
                            <div>
                                <p className="font-semibold text-zinc-900 text-sm">{item.label}</p>
                                <p className="text-zinc-500 text-sm">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-zinc-900 text-white rounded-2xl p-8 text-center">
                    <p className="font-bold text-lg mb-2">The win-win:</p>
                    <p className="text-zinc-400 leading-relaxed">
                        You get lifetime verification capability. We build a reputation as the most honest
                        financial education company in India. Take the workshop. Never buy anything else from
                        us. You'll still have everything you need.
                    </p>
                </div>
            </div>
        </section>
    );
};
