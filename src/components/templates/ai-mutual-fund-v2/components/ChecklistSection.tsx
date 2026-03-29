import { V2CTA } from "./V2CTA";

interface ChecklistSectionProps {
    courseId: string;
    price: number;
}

const items = [
    `You've Googled "best mutual funds" at least 5 times — got 47 different lists. Still no clarity on which to trust.`,
    `Your advisor said "don't worry about expense ratios" — but you saw 1.8% mentioned somewhere and a voice in your head said "that sounds high."`,
    `You have 4–5 funds because "diversification" — but you've never actually checked if they all own the same Reliance, HDFC, and Infosys.`,
    `You planned to review your portfolio quarterly. It's been 18 months since you properly looked at it.`,
    `Part of your money is in ULIPs or endowment plans — because your bank manager said "it's for your children's future," and how do you say no to that?`,
    `Your fund fell 22% during a market crash — and you had no framework to know if that was normal or if your fund specifically failed you.`,
    `Your cousin/colleague talks confidently about their portfolio at family gatherings and you smile and nod while quietly feeling like you're behind.`,
];

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({ courseId, price }) => {
    return (
        <section className="py-20 px-6 bg-zinc-950 text-white">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
                    The Things You've Been Meaning To Check{" "}
                    <span className="text-zinc-400">(But Never Actually Did)</span>
                </h2>
                <p className="text-zinc-400 text-lg mb-10">Be honest. How many of these are you?</p>

                <div className="space-y-4 mb-12">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors"
                        >
                            <span className="text-xl mt-0.5 text-zinc-500">☐</span>
                            <p className="text-zinc-300 leading-relaxed">{item}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8 text-center">
                    <p className="text-xl font-bold text-blue-400 mb-6">
                        If even 2 of these hit close to home — this workshop exists for you.
                    </p>
                    <V2CTA courseId={courseId} price={price} discountCode="" />
                </div>
            </div>
        </section>
    );
};
