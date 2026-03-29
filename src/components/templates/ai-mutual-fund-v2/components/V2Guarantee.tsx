import { V2CTA } from "./V2CTA";

interface V2GuaranteeProps {
    courseId: string;
    price: number;
}

export const V2Guarantee: React.FC<V2GuaranteeProps> = ({ courseId, price }) => {
    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-3xl mx-auto text-center">
                <div className="w-20 h-20 rounded-full bg-blue-50 border-4 border-blue-200 flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🛡️</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                    100% Money-Back Guarantee
                </h2>
                <p className="text-zinc-500 text-lg mb-10">
                    If you attend the workshop, follow along, and genuinely feel like you didn't learn
                    anything useful — email us within 7 days. Full refund. No questions asked.
                </p>

                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 mb-10 text-left">
                    <p className="font-bold text-zinc-900 mb-4">Why we can offer this:</p>
                    <p className="text-zinc-700 leading-relaxed mb-4">
                        Because we've taught 10,000+ people. We know the "aha moment" that happens when
                        someone runs these prompts on their own portfolio for the first time. The refund rate
                        on our workshops is{" "}
                        <span className="font-semibold text-blue-600">less than 2%</span> — not because
                        people are afraid to ask, but because the value is obvious once you see it working on
                        YOUR funds.
                    </p>
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <p className="text-sm text-zinc-700">
                            <span className="font-semibold">The only condition:</span> You have to actually
                            attend and try the prompts. If you sign up and don't show up, that's on you. But if
                            you show up, participate, and still feel it wasn't worth ₹
                            {price.toLocaleString("en-IN")} — we'll refund you. No friction.
                        </p>
                    </div>
                </div>

                <V2CTA courseId={courseId} price={price} discountCode="" />
            </div>
        </section>
    );
};
