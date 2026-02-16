export const WorkshopDisclaimer = () => {
    return (
        <section className="py-12 px-6 bg-zinc-100">
            <div className="max-w-5xl mx-auto">
                <h4 className="text-sm font-bold text-zinc-900 mb-4 uppercase tracking-wider">
                    Legal Disclaimer
                </h4>
                <div className="text-xs text-zinc-600 leading-relaxed space-y-2">
                    <p>
                        <span className="font-semibold">Educational Purpose Only:</span> This workshop is for
                        educational purposes only. It teaches analytical frameworks and AI prompt engineering
                        for mutual fund analysis. It does not constitute investment advice, financial planning,
                        or recommendations to buy/sell specific securities.
                    </p>
                    <p>
                        <span className="font-semibold">No Guarantees:</span> Past performance does not
                        guarantee future results. The tools and prompts provided are for verification and
                        analysis — not prediction. Market conditions change. Fund performance varies. Your
                        results may differ.
                    </p>
                    <p>
                        <span className="font-semibold">SEBI Compliance:</span> CashFlowCrew is not a SEBI
                        registered investment advisor. We do not offer portfolio management services, fund
                        recommendations, or personalized financial advice. We teach analytical skills.
                    </p>
                    <p>
                        <span className="font-semibold">Your Responsibility:</span> All investment decisions are
                        your own. Consult a SEBI-registered financial advisor before making investment
                        decisions. We are not liable for any financial losses resulting from decisions made
                        based on workshop content.
                    </p>
                    <p>
                        <span className="font-semibold">AI Limitations:</span> AI models can make errors.
                        Always cross-verify AI outputs with official fund documents. Use the prompts as a
                        starting point for analysis — not as absolute truth.
                    </p>
                    <p>
                        <span className="font-semibold">Refund Policy:</span> 7-day money-back guarantee
                        applies to attendees who participate in the live workshop or watch the full recording.
                        Non-attendance does not qualify for refunds.
                    </p>
                </div>
            </div>
        </section>
    );
};
