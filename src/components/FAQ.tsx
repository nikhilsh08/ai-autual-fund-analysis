"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "What kind of courses does CashFlowCrew offer?",
        answer: "We offer practical, self-paced courses on personal finance and investing — from beginner topics like your first SIP to advanced institutional analysis frameworks. All courses are designed specifically for Indian investors."
    },
    {
        question: "Who teaches the courses?",
        answer: "Our lead instructor is Nikhil Sharma, who spent 4+ years at Goldman Sachs managing risk for ₹65,000 Cr+ in assets. Every course is built on real institutional frameworks, not opinions."
    },
    {
        question: "Are the courses in Hindi or English?",
        answer: "Most courses are available in both Hindi and English. Check individual course pages for language details."
    },
    {
        question: "What is the refund policy?",
        answer: "We offer a 7-day, no-questions-asked refund on all courses. If you're not satisfied, you get a full refund."
    },
    {
        question: "Do I get lifetime access?",
        answer: "Yes. All courses come with lifetime access on a one-time payment. You also get free updates whenever we refresh the course content."
    },
    {
        question: "Are the courses pre-recorded or live?",
        answer: "Our courses are pre-recorded and self-paced — learn anytime, anywhere. We also run periodic live workshops (like our Mutual Funds masterclass) which are separate ticketed events."
    },
    {
        question: "I'm a complete beginner. Where should I start?",
        answer: "Start with our Beginner's Investment Masterclass — it covers everything from emergency funds to your first SIP. From there, move to Equity Mutual Fund Analysis for deeper knowledge."
    },
    {
        question: "Do you offer any free resources?",
        answer: "Yes! Keep an eye on our workshops page — we regularly offer introductory sessions at deeply discounted prices. We're also working on free tools and calculators."
    }
];

export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-zinc-600">
                        Everything you need to know about learning with us.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-zinc-200 rounded-2xl bg-zinc-50/50 overflow-hidden transition-all duration-200"
                        >
                            <button
                                className="w-full flex items-center justify-between p-6 text-left"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <span className="font-semibold text-zinc-900 pr-8">
                                    {faq.question}
                                </span>
                                <span className="shrink-0 text-zinc-400">
                                    {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                                </span>
                            </button>

                            <div
                                className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                    }`}
                            >
                                <div className="overflow-hidden">
                                    <div className="p-6 pt-0 text-zinc-600 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
