import { User, Briefcase, TrendingUp, Cpu, Users, GraduationCap } from "lucide-react";

export const WhoIsThisFor = () => {
    const segments = [
        {
            icon: <User className="w-6 h-6 text-indigo-600" />,
            title: "First-Time Investors",
            description: "You've saved money but don't know where to start investing it."
        },
        {
            icon: <Briefcase className="w-6 h-6 text-indigo-600" />,
            title: "Working Professionals",
            description: "You earn well but suspect your money could be working harder."
        },
        {
            icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
            title: "SIP Investors Who Want More",
            description: "You're already investing via SIPs but have no idea if your funds are actually good."
        },
        {
            icon: <Cpu className="w-6 h-6 text-indigo-600" />,
            title: "DIY Investors",
            description: "You manage your own portfolio and want institutional-grade analysis frameworks."
        },
        {
            icon: <Users className="w-6 h-6 text-indigo-600" />,
            title: "Parents & Family Breadwinners",
            description: "Your financial decisions affect more than just you — make them with confidence."
        },
        {
            icon: <GraduationCap className="w-6 h-6 text-indigo-600" />,
            title: "Aspiring Financial Analysts",
            description: "You want to understand finance at a professional level, whether for your career or your portfolio."
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">
                        Who Is CashFlowCrew For?
                    </h2>
                    <p className="text-zinc-600 max-w-2xl mx-auto">
                        Our frameworks are designed for those who want to take control of their financial destiny.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {segments.map((segment, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-4 p-6 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors duration-300"
                        >
                            <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0 shadow-sm">
                                {segment.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900 mb-2">
                                    {segment.title}
                                </h3>
                                <p className="text-zinc-600 text-sm leading-relaxed">
                                    {segment.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
