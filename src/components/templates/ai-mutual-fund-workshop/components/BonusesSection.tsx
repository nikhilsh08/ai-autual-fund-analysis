import { Gift } from "lucide-react";

export const BonusesSection = () => {
    const bonuses = [
        {
            title: "Monthly Audit Checklist",
            description:
                "A 15-minute routine you can run every month to keep your portfolio on track. No more 3-hour Excel sessions.",
            value: "₹1,999",
        },
        {
            title: "Interpretation Guide",
            description:
                "What does 67% overlap mean? Is 1.8% expense ratio high? When is 18% return actually bad? The guide that makes sense of the numbers.",
            value: "₹999",
        },
        {
            title: "Lifetime Prompt Updates",
            description:
                "As AI models improve, we update the prompts. You get every update. Forever. No recurring fees.",
            value: "Priceless",
        },
    ];

    return (
        <section className="py-20 px-6 bg-zinc-50">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <Gift className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-4">
                        What Else You Get
                    </h2>
                    <p className="text-xl text-zinc-600">
                        (Because the prompts alone aren't enough — you need to know how to use them.)
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {bonuses.map((bonus, index) => (
                        <div key={index} className="bg-white rounded-2xl p-8 shadow-sm">
                            <div className="text-sm text-blue-600 font-bold mb-2">BONUS #{index + 1}</div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-4">{bonus.title}</h3>
                            <p className="text-zinc-700 mb-6">{bonus.description}</p>
                            <div className="text-sm text-zinc-500">Value: {bonus.value}</div>
                        </div>
                    ))}
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mt-12 border border-green-200 text-center">
                    <p className="text-xl font-bold text-zinc-900 mb-2">Total Value: ₹2,998+</p>
                    <p className="text-lg text-zinc-700">Included at no extra cost.</p>
                </div>
            </div>
        </section>
    );
};
