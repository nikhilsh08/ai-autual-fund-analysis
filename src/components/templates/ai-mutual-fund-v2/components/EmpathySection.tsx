export const EmpathySection = () => {
    const profiles = [
        { age: "27", desc: "three years into your first SIP." },
        { age: "47", desc: "wondering if you've already lost too much time." },
    ];

    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4 leading-tight">
                    No Matter Where You Are — You've Earned The Right To Know Where Your Money Stands
                </h2>

                <div className="flex flex-wrap gap-3 mb-8">
                    {profiles.map((p) => (
                        <span
                            key={p.age}
                            className="bg-blue-50 text-blue-700 border border-blue-100 text-sm rounded-full px-4 py-2"
                        >
                            {p.age} — {p.desc}
                        </span>
                    ))}
                </div>

                <div className="space-y-5 text-lg text-zinc-700 leading-relaxed">
                    <p>
                        You might have ₹3 lakh in mutual funds. Or ₹50 lakh. You might have an advisor you
                        like. Or you might be doing this completely alone on Groww and Kuvera.
                    </p>
                    <p className="text-xl font-semibold text-zinc-900">It doesn't matter.</p>
                    <p>
                        What matters is this: your money deserves the same attention you give your work. And
                        you've known that for a while. You just haven't had a way to give it that attention —
                        without becoming a part-time portfolio analyst.
                    </p>

                    <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-200 space-y-3">
                        <p className="text-zinc-500 font-medium">You're NOT:</p>
                        <p className="flex gap-3 items-center text-zinc-700">
                            <span className="text-blue-600 font-bold">✓</span> Bad with money
                        </p>
                        <p className="flex gap-3 items-center text-zinc-700">
                            <span className="text-blue-600 font-bold">✓</span> Lazy
                        </p>
                        <p className="flex gap-3 items-center text-zinc-700">
                            <span className="text-blue-600 font-bold">✓</span> "Not smart enough"
                        </p>
                    </div>

                    <p>
                        You're a working professional with 2–3 hours of free time on weekends, a family that
                        wants to see you, and zero interest in spending Saturday morning fighting with Excel.
                    </p>
                    <p className="font-semibold text-zinc-900 text-xl border-l-4 border-blue-600 pl-4">
                        Your job was never to become a financial analyst. Your job is to make sure your money
                        is working — and then get back to your life. That's exactly what this workshop sets up
                        for you.
                    </p>
                </div>
            </div>
        </section>
    );
};
