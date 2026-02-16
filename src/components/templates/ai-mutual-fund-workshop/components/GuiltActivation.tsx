import { WorkshopCTA } from "./WorkshopCTA";
import { CheckSquare } from "lucide-react";

interface GuiltActivationProps {
    courseId: string;
    price: number;
}

export const GuiltActivation: React.FC<GuiltActivationProps> = ({ courseId, price }) => {
    const checklist = [
        "You've Googled \"best mutual funds\" at least 5 times — got 47 different lists. Still confused which one to trust.",
        "Your advisor said \"don't worry about expense ratios\" — But you saw 1.8% mentioned somewhere and wondered if that's high.",
        "You have 4-5 funds because \"diversification\" — but you've never actually checked if they own the same stocks.",
        "You planned to review your portfolio quarterly — it's been 18 months since you properly looked at it.",
        "Part of your portfolio is in ULIPs or endowment plans — because your bank manager said \"it's for your children,\" and how can you say no to that?",
        "Your fund fell 22% during a market crash — you had no framework to decide if that was normal or if your fund specifically failed.",
    ];

    return (
        <section className="py-20 px-6 bg-zinc-50">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 text-center mb-12">
                    You've Been Meaning to Check This. But You Never Actually Did.
                </h2>

                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm mb-12">
                    <h3 className="text-2xl font-bold text-zinc-900 mb-6">
                        The Checklist: Do any of these sound familiar?
                    </h3>
                    <div className="space-y-4">
                        {checklist.map((item, index) => (
                            <div key={index} className="flex gap-4 items-start">
                                <CheckSquare className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                <p className="text-lg text-zinc-700">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 md:p-12 mb-12">
                    <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-6">
                        The Uncomfortable Truth:
                    </h3>
                    <p className="text-lg text-zinc-700 mb-6">
                        Here's what actually happens when you try to do this yourself:
                    </p>

                    <div className="bg-white rounded-xl p-6 space-y-3 text-zinc-700 mb-6">
                        <p className="font-bold text-zinc-900">SCENARIO: You want to check if your funds overlap.</p>
                        <p><span className="font-semibold">Step 1:</span> Download factsheet for Fund A</p>
                        <p><span className="font-semibold">Step 2:</span> Find the "Top 10 Holdings" section</p>
                        <p><span className="font-semibold">Step 3:</span> Copy stock names to Excel — "Reliance Industries Ltd." vs "Reliance Ind" vs "RELIANCE" — which one matches?</p>
                        <p><span className="font-semibold">Step 4:</span> Download factsheets for Funds B, C, D, E → 2 hours gone</p>
                        <p><span className="font-semibold">Step 5:</span> Try to compare → Names don't match, you're manually checking each one</p>
                        <p><span className="font-semibold">Step 6:</span> Give up at 3 hours → Still don't know the actual overlap percentage</p>
                        <p><span className="font-semibold">Step 7:</span> Feel guilty for the next 6 months</p>
                        <p><span className="font-semibold">Step 8:</span> Repeat this cycle every quarter</p>
                    </div>

                    <div className="space-y-4 text-lg text-zinc-700">
                        <p className="font-bold text-zinc-900">
                            The reason you haven't done this isn't because you don't care about your money.
                        </p>
                        <p>
                            It's because the effort required vs the time you have makes it functionally impossible.
                        </p>
                        <p>
                            If you work 10-12 hours a day, have 2-3 hours of free time on weekends, and want to
                            spend that time with family — not in Excel hell — then portfolio analysis gets
                            postponed. Forever.
                        </p>
                        <p className="font-bold text-red-700">
                            And that postponement costs you. Not because you made a bad decision. But because you
                            never had the tools to make an informed decision in the first place.
                        </p>
                    </div>
                </div>

                <WorkshopCTA courseId={courseId} price={price} />
            </div>
        </section>
    );
};
