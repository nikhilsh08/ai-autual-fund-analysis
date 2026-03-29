import { CheckCircle, XCircle } from "lucide-react";

export const WhoIsThisFor = () => {
    const forYouIf = [
        "Have deployed (or are looking to deploy) at least ₹1 lakh into active equity mutual funds",
        "Want to verify whether your current funds are actually performing well",
        "Don't have a distributor or advisor — and are managing your portfolio yourself",
        "HAVE an advisor but want to double-check their recommendations with data",
        "Are buying financial products through bank managers (ULIPs, guaranteed return plans, annuity plans, endowment plans)",
        "Want to build a monthly audit habit that takes 15 minutes, not 15 hours",
    ];

    const notForYouIf = [
        "You don't have a mutual fund portfolio and aren't looking to build one",
        "You're looking for stock tips or trading strategies",
        "You want someone to tell you which funds to buy (we teach you to evaluate — we don't recommend)",
        "You're looking for a get-rich-quick scheme",
    ];

    return (
        <section className="py-20 px-6 bg-zinc-50">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 text-center mb-16">
                    Is This Workshop For You?
                </h2>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <h3 className="text-2xl font-bold text-green-700 mb-6">
                            This makes sense if you:
                        </h3>
                        <div className="space-y-4">
                            {forYouIf.map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                                    <p className="text-zinc-700">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <h3 className="text-2xl font-bold text-red-700 mb-6">This is NOT for you if:</h3>
                        <div className="space-y-4">
                            {notForYouIf.map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                                    <p className="text-zinc-700">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg">
                    <p className="text-lg text-zinc-900 font-semibold mb-2">Honest qualifier:</p>
                    <p className="text-zinc-700">
                        If your entire portfolio is in index funds and you're happy with passive investing, you
                        probably don't need this. This workshop is most valuable for people in active equity
                        funds who want to verify whether those funds are actually earning their keep.
                    </p>
                </div>
            </div>
        </section>
    );
};
