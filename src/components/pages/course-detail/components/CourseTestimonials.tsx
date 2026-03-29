"use client";

import { Quote } from "lucide-react";

const testimonials = [
    {
        quote: "I've been investing in mutual funds for 5 years but never actually knew how to analyze whether my funds were performing well. The knowledge I gained was worth 10x the price.",
        name: "Jitesh",
        location: "Kolkata",
    },
    {
        quote: "As a complete beginner, I was intimidated by financial jargon. Nikhil breaks everything down so clearly that I started my first SIP within a week.",
        name: "Aayush",
        location: "Delhi",
    },
    {
        quote: "The frameworks taught here helped me realize my 'actively managed' fund was basically an index fund charging 10x the fees. Mind-blowing!",
        name: "Mandeep",
        location: "Bangalore",
    },
    {
        quote: "Finally, someone who explains finance without making it complicated. I feel confident about my money decisions now.",
        name: "Priya",
        location: "Mumbai",
    },
];

export const CourseTestimonials = () => {
    return (
        <section className="py-16 bg-cream-dark overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <h2 className="font-serif font-black text-ink tracking-tighter mb-2 text-center" style={{ fontSize: "clamp(26px,4vw,40px)" }}>
                    What students are saying
                </h2>

                {/* Horizontal Scroll Container */}
                <div className="relative">
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide testimonials-mask">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-[300px] sm:w-[350px] bg-white rounded-2xl p-6 shadow-sm border border-border snap-center"
                            >
                                <Quote className="w-6 h-6 text-accent/30 mb-4" />
                                <p className="text-ink-secondary text-sm leading-relaxed mb-6 italic">
                                    "{testimonial.quote}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-teal flex items-center justify-center text-white font-bold text-sm">
                                        {testimonial.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-ink text-sm">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-xs text-ink-muted">
                                            {testimonial.location}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
