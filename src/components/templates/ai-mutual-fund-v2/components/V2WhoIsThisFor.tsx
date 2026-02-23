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

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="border border-emerald-200 rounded-2xl p-8 bg-emerald-50">
                        <p className="font-bold text-emerald-800 text-lg mb-6">
                            This Workshop Makes Sense If You:
                        </p>
                        <ul className="space-y-4">
                            {forItems.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="text-emerald-600 font-bold flex-shrink-0 mt-0.5">✅</span>
                                    <p className="text-zinc-700 text-sm leading-relaxed">{item}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="border border-red-200 rounded-2xl p-8 bg-red-50">
                        <p className="font-bold text-red-800 text-lg mb-6">This is NOT For You If:</p>
                        <ul className="space-y-4">
                            {notForItems.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="text-red-500 font-bold flex-shrink-0 mt-0.5">❌</span>
                                    <p className="text-zinc-700 text-sm leading-relaxed">{item}</p>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 p-4 bg-white rounded-xl border border-red-100">
                            <p className="text-zinc-600 text-xs leading-relaxed">
                                <span className="font-semibold">Honest qualifier:</span> If your entire portfolio
                                is in index funds and you're satisfied with passive investing, you probably don't
                                need this. This workshop is most valuable for people in active equity funds who
                                want to verify whether those funds are actually earning their keep.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
