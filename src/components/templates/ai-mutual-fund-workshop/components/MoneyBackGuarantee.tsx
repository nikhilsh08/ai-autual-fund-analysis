import { WorkshopCTA } from "./WorkshopCTA";
import { Shield } from "lucide-react";

interface MoneyBackGuaranteeProps {
    courseId: string;
    price: number;
}

export const MoneyBackGuarantee: React.FC<MoneyBackGuaranteeProps> = ({ courseId, price }) => {
    return (
        <section className="py-20 px-6 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <Shield className="w-20 h-20 text-green-600 mx-auto mb-6" />
                    <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-6">
                        100% Money-Back Guarantee
                    </h2>
                    <p className="text-xl text-zinc-700 max-w-2xl mx-auto">
                        If you attend the workshop, follow along, and genuinely feel like you didn't learn
                        anything useful — email us within 7 days. We'll refund you. No questions asked.
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm mb-12">
                    <h3 className="text-2xl font-bold text-zinc-900 mb-6">Why we can offer this:</h3>
                    <div className="text-lg text-zinc-700 leading-relaxed space-y-4">
                        <p>
                            Because we've taught 10,000+ people. We know what works. We know the feedback. We know
                            the "aha moments" that happen when someone runs these prompts on their own portfolio
                            for the first time.
                        </p>
                        <p>
                            The refund rate on our workshops is less than 2%. Not because people are afraid to ask
                            — but because the value is undeniable once you see it work on YOUR funds.
                        </p>
                        <p className="font-bold text-green-700">
                            We're not worried about refunds. We're confident in what we've built.
                        </p>
                    </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg mb-12">
                    <p className="text-lg text-zinc-900 font-semibold mb-2">The only condition:</p>
                    <p className="text-zinc-700">
                        You have to actually attend the workshop and try the prompts. If you sign up and don't
                        show up, that's on you. But if you show up, participate, and still feel like it wasn't
                        worth it — we'll refund you.
                    </p>
                </div>

                <WorkshopCTA courseId={courseId} price={price} />
            </div>
        </section>
    );
};
