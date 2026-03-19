import { User, Briefcase, TrendingUp, Cpu, Users, GraduationCap } from "lucide-react";

export const WhoIsThisFor = () => {
    const segments = [
        {
            icon: <User className="w-6 h-6 text-accent" />,
            title: "First-Time Investors",
            description: "You've saved money but don't know where to start investing it."
        },
        {
            icon: <Briefcase className="w-6 h-6 text-accent" />,
            title: "Working Professionals",
            description: "You earn well but suspect your money could be working harder."
        },
        {
            icon: <TrendingUp className="w-6 h-6 text-accent" />,
            title: "SIP Investors Who Want More",
            description: "You're already investing via SIPs but have no idea if your funds are actually good."
        },
        {
            icon: <Cpu className="w-6 h-6 text-accent" />,
            title: "DIY Investors",
            description: "You manage your own portfolio and want institutional-grade analysis frameworks."
        },
        {
            icon: <Users className="w-6 h-6 text-accent" />,
            title: "Parents & Family Breadwinners",
            description: "Your financial decisions affect more than just you — make them with confidence."
        },
        {
            icon: <GraduationCap className="w-6 h-6 text-accent" />,
            title: "Aspiring Financial Analysts",
            description: "You want to understand finance at a professional level, whether for your career or your portfolio."
        }
    ];

    return (
        <section className="py-20 bg-card">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-serif text-ink mb-6">
                        Who Is CashFlowCrew For?
                    </h2>
                    <p className="text-ink-secondary max-w-2xl mx-auto">
                        Our frameworks are designed for those who want to take control of their financial destiny.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {segments.map((segment, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center p-6 rounded-2xl bg-cream-dark border border-border hover:border-accent/30 hover:bg-accent-light/30 transition-colors duration-300"
                        >
                            <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-sm mb-4">
                                {segment.icon}
                            </div>
                            <h3 className="text-lg font-bold text-ink mb-2">
                                {segment.title}
                            </h3>
                            <p className="text-ink-secondary text-sm leading-relaxed">
                                {segment.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
