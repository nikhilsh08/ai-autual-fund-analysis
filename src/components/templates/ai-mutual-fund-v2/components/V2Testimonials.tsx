import { V2CTA } from "./V2CTA";

interface V2TestimonialsProps {
    courseId: string;
    price: number;
}

const testimonials = [
    {
        quote: `I had 4 'diversified' large cap funds. Turns out they had 71% overlap — I was basically paying 4 expense ratios for the same portfolio. Switched to 1 active + 1 index fund. Saving ₹8,000/year in fees and much more in sanity.`,
        name: "Amit S.",
        role: "IT Manager, Bangalore",
        portfolio: "₹18L portfolio",
        initials: "AS",
        color: "bg-blue-600",
    },
    {
        quote: `My bank had been pushing a ULIP for 2 years. I ran the IRR calculation from the workshop — 4.1% return vs 11% from index funds. Avoided a ₹32L mistake over 15 years.`,
        name: "Priya M.",
        role: "Doctor, Delhi",
        portfolio: "₹12L portfolio",
        initials: "PM",
        color: "bg-indigo-600",
    },
    {
        quote: `I always felt guilty about not reviewing my portfolio. Now I spend 15 minutes every month running these prompts. For the first time, I actually know what I own and why.`,
        name: "Karthik R.",
        role: "Operations Head, Chennai",
        portfolio: "₹28L portfolio",
        initials: "KR",
        color: "bg-zinc-700",
    },
];

const stats = [
    { value: "10,000+", label: "working professionals trained" },
    { value: "₹11,000/yr", label: "average discovery in avoidable fees" },
    { value: "<2%", label: "workshop refund rate" },
];

export const V2Testimonials: React.FC<V2TestimonialsProps> = ({ courseId, price }) => {
    return (
        <section className="py-20 px-6 bg-zinc-50">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2 text-center leading-tight">
                    What Working Professionals Discovered About Their Own Money
                </h2>
                <p className="text-center text-zinc-500 text-lg mb-12">
                    These aren't finance experts. They're people with jobs, families, and 30 minutes to spare.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {testimonials.map((t) => (
                        <div key={t.name} className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col">
                            <p className="text-zinc-700 leading-relaxed text-sm flex-1 mb-6">
                                "{t.quote}"
                            </p>
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-10 h-10 rounded-full ${t.color} text-white flex items-center justify-center font-bold text-sm flex-shrink-0`}
                                >
                                    {t.initials}
                                </div>
                                <div>
                                    <p className="font-semibold text-zinc-900 text-sm">{t.name}</p>
                                    <p className="text-zinc-500 text-xs">{t.role}</p>
                                    <p className="text-zinc-400 text-xs">{t.portfolio}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-6 mb-12">
                    {stats.map((s) => (
                        <div key={s.label} className="text-center">
                            <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-1">
                                {s.value}
                            </p>
                            <p className="text-zinc-500 text-sm">{s.label}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <p className="text-zinc-500 text-sm italic mb-6">
                        "Why didn't I know this earlier?" — Most common reaction after the first prompt
                    </p>
                    <V2CTA courseId={courseId} price={price} discountCode="" />
                </div>
            </div>
        </section>
    );
};
