import { CheckCircle, XCircle } from "lucide-react";

export const WorkshopDetails = () => {
    const tools = [
        {
            number: 1,
            title: 'The "Am I Actually Diversified?" Analysis',
            description: "Reveals whether your 4-5 \"different\" funds are secretly the same 30 stocks.",
        },
        {
            number: 2,
            title: 'The "Bang For Your Buck" Calculator',
            description:
                "Reveals whether your fund's returns are actually good for the risk it's taking (risk-adjusted return analysis).",
        },
        {
            number: 3,
            title: 'The "Crash Protection" Verifier',
            description: "Reveals whether your fund actually protects downside — or just claims to.",
        },
        {
            number: 4,
            title: 'The "Hidden Bets" Detector',
            description:
                "Reveals which stocks your fund manager is buying that aren't even in the benchmark.",
        },
        {
            number: 5,
            title: 'The "Where\'s The Money Going?" Mapper',
            description:
                "Reveals which sectors your fund is overweight/underweight compared to benchmark.",
        },
        {
            number: 6,
            title: 'The "ULIP Truth" Calculator',
            description:
                "Reveals the actual IRR of any ULIP/endowment plan vs mutual fund + term insurance.",
        },
    ];

    const whatYouGet = [
        "Workshop with Nikhil with live Q&A",
        "Equity Mutual Fund — Analysis Basics",
        "6 copy-paste AI prompts (Lifetime access)",
        "Your portfolio analysed (during session)",
        "Interpretation frameworks",
        "Monthly audit routine (15 min/month)",
    ];

    const whatYouDontGet = [
        'Fund recommendations ("buy this, sell that")',
        "Stock tips",
        "Trading strategies",
        "Get-rich-quick schemes",
    ];

    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-4">
                        One Weekend. 6 Verification Tools. Lifetime Capability.
                    </h2>
                    <p className="text-xl text-zinc-600 max-w-4xl mx-auto">
                        A workshop where you learn to run institutional-grade equity mutual fund analysis using
                        AI. No finance background required. No Excel skills needed. If you can copy-paste text,
                        you can do this.
                    </p>
                </div>

                <div className="bg-blue-50 rounded-2xl p-8 md:p-12 mb-12">
                    <h3 className="text-2xl font-bold text-zinc-900 mb-6">What Happens:</h3>
                    <p className="text-lg text-zinc-700 mb-4">
                        You don't just watch. You follow along — on YOUR portfolio, with YOUR funds.
                    </p>
                    <p className="text-lg font-semibold text-blue-700">
                        By the end of the workshop, you'll have:
                    </p>
                    <ul className="list-disc list-inside text-lg text-zinc-700 space-y-2 mt-4 ml-4">
                        <li>Analysed your own mutual funds</li>
                        <li>Identified problems you didn't know existed</li>
                        <li>Built a verification system you can run monthly</li>
                    </ul>
                </div>

                <div className="mb-12">
                    <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-8 text-center">
                        The 6 Tools You'll Master:
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {tools.map((tool) => (
                            <div key={tool.number} className="bg-zinc-50 rounded-xl p-6 border border-zinc-200">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                                        {tool.number}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-zinc-900 mb-2">{tool.title}</h4>
                                        <p className="text-zinc-700">{tool.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-green-50 rounded-2xl p-8 border-2 border-green-200">
                        <h3 className="text-2xl font-bold text-green-700 mb-6">What You GET ✅</h3>
                        <div className="space-y-3">
                            {whatYouGet.map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-zinc-700">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-200">
                        <h3 className="text-2xl font-bold text-red-700 mb-6">What You DON'T GET ❌</h3>
                        <div className="space-y-3">
                            {whatYouDontGet.map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-zinc-700">{item}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-zinc-700 mt-6 font-semibold">
                            This is verification capability, not investment advice. You'll learn to CHECK
                            recommendations — not receive them.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
