const forItems = [
    "Have invested (or plan to invest) at least ₹1 lakh in active equity mutual funds",
    "Want to verify whether your current funds are actually doing their job",
    "Don't have an advisor — and are managing your portfolio yourself on Groww, Kuvera, Coin, etc.",
    "HAVE an advisor — but want to double-check their recommendations with actual data",
    "Have been sold financial products through bank managers — ULIPs, guaranteed return plans, endowment plans",
    "Want a monthly check-in habit that takes 15 minutes, not an entire weekend",
];

const notForItems = [
    "You don't have a mutual fund portfolio and aren't looking to build one",
    "You're looking for stock tips or trading strategies",
    "You want someone to tell you which funds to buy (we teach you to verify — we don't recommend)",
    "You're looking for a get-rich-quick scheme",
];

export const V2WhoIsThisFor = () => {
    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-12 text-center leading-tight">
                    Is This For You?
                </h2>

                <div className="grid md:grid-cols-2 gap-8 items-stretch">
                    {/* FOR card */}
                    <div className="flex flex-col rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                        <div className="h-1.5 w-full bg-emerald-500" />
                        <div className="flex flex-col flex-1 p-8 bg-white">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 text-lg font-bold flex-shrink-0">
                                    ✓
                                </span>
                                <p className="font-bold text-zinc-900 text-lg leading-snug">
                                    This Workshop Makes Sense If You:
                                </p>
                            </div>
                            <ul className="space-y-4 flex-1">
                                {forItems.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="inline-block mt-1 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold flex-shrink-0 text-center leading-5">
                                            ✓
                                        </span>
                                        <p className="text-zinc-600 text-sm leading-relaxed">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* NOT FOR card */}
                    <div className="flex flex-col rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                        <div className="h-1.5 w-full bg-rose-500" />
                        <div className="flex flex-col flex-1 p-8 bg-white">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-rose-100 text-rose-600 text-lg font-bold flex-shrink-0">
                                    ✕
                                </span>
                                <p className="font-bold text-zinc-900 text-lg leading-snug">
                                    This is NOT For You If:
                                </p>
                            </div>
                            <ul className="space-y-4 flex-1">
                                {notForItems.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="inline-block mt-1 w-5 h-5 rounded-full bg-rose-100 text-rose-500 text-xs font-bold flex-shrink-0 text-center leading-5">
                                            ✕
                                        </span>
                                        <p className="text-zinc-600 text-sm leading-relaxed">{item}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                                <p className="text-zinc-500 text-xs leading-relaxed">
                                    <span className="font-semibold text-zinc-700">Honest qualifier:</span> If your entire portfolio
                                    is in index funds and you're satisfied with passive investing, you probably don't
                                    need this. This workshop is most valuable for people in active equity funds who
                                    want to verify whether those funds are actually earning their keep.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
