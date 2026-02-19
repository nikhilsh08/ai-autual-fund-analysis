"use client";

import { Quote } from "lucide-react";

export const Testimonials = () => {
    const testimonials = [
        {
            quote: "I've been investing in mutual funds for 5 years but never actually knew how to analyze whether my funds were performing well. The Sortino ratio framework alone was worth 10x the workshop price.",
            name: "Jitesh",
            role: "Kolkata",
            //    image: "/avatars/jitesh.jpg" // Placeholder for now
        },
        {
            quote: "As a complete beginner, I was intimidated by financial jargon. Nikhil breaks everything down so clearly that I started my first SIP within a week of the workshop.",
            name: "Aayush",
            role: "Delhi",
            //    image: "/avatars/aayush.jpg"
        },
        {
            quote: "The Active Share analysis blew my mind. I found out my 'actively managed' fund was basically an index fund charging 10x the fees.",
            name: "Mandeep",
            role: "Bangalore",
            //    image: "/avatars/mandeep.jpg"
        }
    ];

    return (
        <section className="py-20 bg-zinc-900 text-white relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        From Our Students
                    </h2>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-medium text-zinc-200">10,000+ students and counting!</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-zinc-800/50 backdrop-blur-md border border-zinc-700 p-8 rounded-2xl relative"
                        >
                            <Quote className="w-8 h-8 text-zinc-600 mb-6" />
                            <p className="text-zinc-300 mb-8 leading-relaxed italic">
                                "{testimonial.quote}"
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                    {testimonial.name[0]}
                                </div>
                                <div>
                                    <div className="font-bold text-white">{testimonial.name}</div>
                                    <div className="text-xs text-zinc-400">{testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
