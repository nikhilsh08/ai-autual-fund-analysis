import { ShieldCheck, BarChart3, Clock, Shuffle, Video, Globe2 } from "lucide-react";

export const WhyCashFlowCrew = () => {
    const values = [
        {
            icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
            title: "Goldman Sachs Frameworks",
            description: "The same analysis techniques used to manage ₹65,000 Crore+ in assets — now simplified for individual investors."
        },
        {
            icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
            title: "Practical, Not Theoretical",
            description: "Every course includes Excel sheets, AI tools, checklists, and step-by-step workflows you can use the same day."
        },
        {
            icon: <Clock className="w-6 h-6 text-blue-600" />,
            title: "Lifetime Access",
            description: "Learn at your own pace. Revisit any course, anytime — with one-time payment and no recurring fees."
        },
        {
            icon: <Shuffle className="w-6 h-6 text-blue-600" />,
            title: "Free Upgrades",
            description: "Markets change. Our courses do too. Get free updates whenever we refresh content with the latest data and strategies."
        },
        {
            icon: <Video className="w-6 h-6 text-blue-600" />,
            title: "Live Q&A Sessions",
            description: "Join periodic live sessions with Nikhil for deep-dives & Q&A sessions"
        },
        {
            icon: <Globe2 className="w-6 h-6 text-blue-600" />,
            title: "Built for Indian Investors",
            description: "Indian tax rules, INR-denominated strategies — everything is built for the Indian context."
        }
    ];

    return (
        <section className="py-20 bg-zinc-50 border-y border-zinc-200">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">
                        Why Learn With CashFlowCrew?
                    </h2>
                    <p className="text-zinc-600 max-w-2xl mx-auto">
                        We bridge the gap between institutional strategies and individual investors.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {values.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-2xl border border-zinc-200 hover:shadow-lg transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-3">
                                {item.title}
                            </h3>
                            <p className="text-zinc-600 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
