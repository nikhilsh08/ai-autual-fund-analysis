import { V2CTA } from "./V2CTA";

interface OfferSectionProps {
    courseId: string;
    price: number;
}

const checks = [
    {
        title: `The "Am I Actually Diversified?" Check`,
        desc: `Reveals whether your 4–5 "different" funds are secretly the same 30 stocks.`,
    },
    {
        title: `The "Bang For Your Buck" Check`,
        desc: `Reveals whether your fund's returns are actually good for the risk it's taking.`,
    },
    {
        title: `The "Crash Protection" Check`,
        desc: `Reveals whether your fund actually protects during crashes — or just claims to.`,
    },
    {
        title: `The "Hidden Bets" Check`,
        desc: `Reveals stocks your fund manager is buying that aren't even in the benchmark.`,
    },
    {
        title: `The "Where's The Money Going?" Check`,
        desc: `Reveals which sectors your fund is overweight/underweight vs its benchmark.`,
    },
    {
        title: `The "ULIP Truth" Check`,
        desc: `Reveals the actual return of any ULIP/endowment plan vs mutual fund + term insurance.`,
    },
];

const gets = [
    "Live workshop with Nikhil + Q&A on your specific portfolio",
    "Equity Mutual Fund Analysis — the foundations",
    "6 AI prompts — lifetime access (they get better as AI improves)",
    "Your portfolio verified during the session",
    "Interpretation frameworks (so the numbers actually mean something to you)",
    "Monthly audit routine — 15 minutes/month to stay on top of everything",
];

const doesntGet = [
    `Fund recommendations ("buy this, sell that")`,
    "Stock tips",
    "Trading strategies",
    "Get-rich-quick schemes",
];

export const OfferSection: React.FC<OfferSectionProps> = ({ courseId, price }) => {
    return (
        <section className="py-20 px-6 bg-gradient-to-b from-zinc-900 to-zinc-950 text-white">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-14">
                    <p className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-4">
                        The Offer
                    </p>
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                        One Weekend. Your Own AI-Powered Financial Verifier.{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            Set Up For Life.
                        </span>
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        No finance background required. No Excel skills needed. If you can copy-paste text,
                        you can do this.
                    </p>
                </div>

                {/* What happens */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-10">
                    <h3 className="text-xl font-bold mb-4">What Happens:</h3>
                    <p className="text-zinc-300 mb-4">
                        You don't just watch. You follow along — on YOUR portfolio, with YOUR funds. You do
                        the work DURING the session. You leave with answers about your actual money — not
                        homework for "someday."
                    </p>
                    <p className="font-semibold text-white">By the end of the workshop, you'll have:</p>
                    <ul className="mt-3 space-y-2">
                        {[
                            "Verified your own mutual funds against institutional-grade checks",
                            "Caught problems you didn't know existed",
                            "Set up a monthly audit system that takes 15 minutes, not 15 hours",
                        ].map((item) => (
                            <li key={item} className="flex items-start gap-3 text-zinc-300">
                                <span className="text-blue-400 font-bold mt-0.5">✓</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 6 Checks */}
                <h3 className="text-2xl font-bold mb-6 text-center">The 6 Checks Your AI Verifier Will Run:</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-12">
                    {checks.map((c, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <div className="flex items-start gap-3">
                                <span className="font-extrabold text-blue-400 text-lg leading-none">{i + 1}</span>
                                <div>
                                    <p className="font-semibold text-white mb-1">{c.title}</p>
                                    <p className="text-zinc-400 text-sm">{c.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Gets / Doesn't get */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
                        <p className="font-bold text-blue-400 mb-4">What You GET ✅</p>
                        <ul className="space-y-2">
                            {gets.map((item) => (
                                <li key={item} className="flex items-start gap-2 text-zinc-300 text-sm">
                                    <span className="text-blue-400 mt-0.5">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                        <p className="font-bold text-red-400 mb-4">What You DON'T GET ❌</p>
                        <ul className="space-y-2">
                            {doesntGet.map((item) => (
                                <li key={item} className="flex items-start gap-2 text-zinc-400 text-sm">
                                    <span className="text-red-400 mt-0.5">✗</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p className="mt-4 text-zinc-400 text-xs italic">
                            This is verification capability, not investment advice.
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <V2CTA courseId={courseId} price={price} discountCode="" />
                </div>
            </div>
        </section>
    );
};
