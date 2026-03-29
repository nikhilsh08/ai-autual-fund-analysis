import { WorkshopCTA } from "./WorkshopCTA";

interface SocialProofProps {
    courseId: string;
    price: number;
}

export const SocialProof: React.FC<SocialProofProps> = ({ courseId, price }) => {
    const testimonials = [
        {
            quote:
                "I had 4 'diversified' large cap funds. Turns out they had 71% overlap — I was basically paying 4 expense ratios for the same portfolio. Switched to 1 active fund + 1 index fund. Saving ₹8,000/year in fees and much more in sanity.",
            name: "Amit S.",
            role: "IT Manager, Bangalore",
            portfolio: "₹18L portfolio",
        },
        {
            quote:
                "My bank had been pushing a ULIP for 2 years. I ran the IRR calculation from the workshop — 4.1% return vs 11% from index funds. Avoided a ₹32L mistake over 15 years.",
            name: "Priya M.",
            role: "Doctor, Delhi",
            portfolio: "₹12L portfolio",
        },
        {
            quote:
                "I always felt guilty about not reviewing my portfolio. Now I spend 15 minutes every month running these prompts. For the first time, I actually know what I own and why.",
            name: "Karthik R.",
            role: "Operations Head, Chennai",
            portfolio: "₹28L portfolio",
        },
    ];

    return (
        <section className="py-20 px-6 bg-zinc-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 text-center mb-16">
                    What Others Discovered
                </h2>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white rounded-2xl p-8 shadow-sm">
                            <p className="text-lg text-zinc-700 mb-6 italic">"{testimonial.quote}"</p>
                            <div className="border-t border-zinc-200 pt-4">
                                <p className="font-bold text-zinc-900">{testimonial.name}</p>
                                <p className="text-sm text-zinc-600">{testimonial.role}</p>
                                <p className="text-sm text-blue-600 font-semibold mt-1">{testimonial.portfolio}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 border border-green-200 mb-12">
                    <h3 className="text-2xl font-bold text-zinc-900 mb-6">Aggregate Stats:</h3>
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div>
                            <p className="text-4xl font-bold text-green-700 mb-2">10,000+</p>
                            <p className="text-zinc-700">investors trained across webinars and workshops</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-green-700 mb-2">₹11,000/year</p>
                            <p className="text-zinc-700">Average discovery in avoidable fees or overlap inefficiency</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-green-700 mb-2">"Why didn't I know this earlier?"</p>
                            <p className="text-zinc-700">Most common reaction</p>
                        </div>
                    </div>
                </div>

                <WorkshopCTA courseId={courseId} price={price} />
            </div>
        </section>
    );
};
