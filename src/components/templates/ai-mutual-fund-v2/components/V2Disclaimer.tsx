export const V2Disclaimer = () => {
    const items = [
        {
            title: "Educational Purpose Only",
            desc: "This workshop teaches analytical frameworks and AI prompt engineering for mutual fund analysis. It does not constitute investment advice, financial planning, or recommendations to buy/sell specific securities.",
        },
        {
            title: "No Guarantees",
            desc: "Past performance does not guarantee future results. The tools and prompts are for verification and analysis — not prediction.",
        },
        {
            title: "SEBI Compliance",
            desc: "CashFlowCrew is not a SEBI registered investment advisor. We do not offer portfolio management services, fund recommendations, or personalized financial advice. We teach analytical skills.",
        },
        {
            title: "Your Responsibility",
            desc: "All investment decisions are your own. Consult a SEBI-registered financial advisor before making investment decisions.",
        },
        {
            title: "AI Limitations",
            desc: "AI models can make errors. Always cross-verify AI outputs with official fund documents.",
        },
        {
            title: "Refund Policy",
            desc: "7-day money-back guarantee applies to attendees who participate in the live workshop or watch the full recording.",
        },
    ];

    return (
        <footer className="py-14 px-6 bg-white border-t border-zinc-100">
            <div className="max-w-3xl mx-auto">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest text-center mb-6">
                    Legal Disclaimer
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                    {items.map((item) => (
                        <div key={item.title} className="bg-zinc-50 rounded-xl p-4">
                            <p className="font-semibold text-zinc-600 text-xs mb-1">{item.title}</p>
                            <p className="text-zinc-400 text-xs leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
                <p className="text-center text-zinc-300 text-xs mt-8">
                    © {new Date().getFullYear()} CashFlowCrew. All rights reserved.
                </p>
            </div>
        </footer>
    );
};
