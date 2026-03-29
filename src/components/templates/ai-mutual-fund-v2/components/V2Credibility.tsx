const timeline = [
    {
        org: "Goldman Sachs",
        duration: "4+ years",
        desc: "Managed ₹65Bn AUM, risk analysis for flagship hedge funds",
        color: "bg-yellow-500",
    },
    {
        org: "Credy",
        duration: "",
        desc: "Led sales for Y-Combinator backed FinTech",
        color: "bg-blue-500",
    },
    {
        org: "LocoNav",
        duration: "",
        desc: "Ex National Head of Operations & Enterprise Sales",
        color: "bg-indigo-500",
    },
    {
        org: "Entrepreneurship",
        duration: "",
        desc: "Founded LitmusEye, BlueFlowerCo & CashFlowCrew",
        color: "bg-zinc-700",
    },
];

export const V2Credibility = () => {
    return (
        <section className="py-20 px-6 bg-zinc-50">
            <div className="max-w-3xl mx-auto">
                <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">
                    Credibility
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2 leading-tight">
                    Built By Someone Who Did This For A Living
                </h2>
                <p className="text-zinc-500 text-lg mb-10">So You Don't Have To</p>

                <div className="bg-white border border-zinc-200 rounded-2xl p-8 mb-8">
                    <div className="flex items-start gap-6 mb-6">
                        <img
                            src="https://res.cloudinary.com/dq1llsy7f/image/upload/v1738855885/c1gzyxcgfokizkisio3j.jpg"
                            alt="Nikhil Sharma"
                            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                        />
                        <div>
                            <p className="text-xl font-bold text-zinc-900">Nikhil Sharma</p>
                            <p className="text-zinc-500">Founder, CashFlowCrew | Ex-Goldman Sachs</p>
                        </div>
                    </div>
                    <p className="text-zinc-700 leading-relaxed">
                        Nikhil spent 5 years at Goldman Sachs managing risk for mutual fund and hedge fund
                        portfolios worth <span className="font-semibold">₹65B+ in AUM.</span> His job was
                        finding problems in portfolios BEFORE they cost money.
                    </p>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 mb-8">
                    <p className="font-bold text-zinc-900 mb-4">The realisation that started CashFlowCrew:</p>
                    <p className="text-zinc-700 leading-relaxed mb-4">
                        The tools Nikhil used daily — overlap analysis, risk-adjusted metrics, benchmark
                        deviation tracking — weren't secret. The frameworks were publicly documented. The data
                        was freely available.
                    </p>
                    <p className="font-semibold text-zinc-900">
                        The only difference between a retail investor and an institutional analyst?
                    </p>
                    <p className="text-zinc-700 mt-2">
                        The retail investor didn't know which checks to run. Didn't know how to interpret the
                        results. And didn't have 8 hours to figure it out manually.
                    </p>
                </div>

                {/* Timeline */}
                <h3 className="font-bold text-zinc-900 mb-5">Career Timeline:</h3>
                <div className="space-y-4 mb-8">
                    {timeline.map((item) => (
                        <div key={item.org} className="flex items-start gap-4">
                            <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${item.color}`} />
                            <div>
                                <span className="font-semibold text-zinc-900">{item.org}</span>
                                {item.duration && (
                                    <span className="text-zinc-400 text-sm ml-2">({item.duration})</span>
                                )}
                                <p className="text-zinc-600 text-sm">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <blockquote className="bg-zinc-900 text-white rounded-2xl p-6 italic text-center">
                    "My mission is to make sure the average Indian working professional has access to the same
                    verification tools that protect the ultra-wealthy — without needing a finance degree or a
                    ₹18 lakh data subscription."
                </blockquote>
            </div>
        </section>
    );
};
