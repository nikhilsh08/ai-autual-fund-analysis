"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "Is this course suitable for complete beginners?",
        answer: "Absolutely! This course is designed specifically for beginners. We start from the basics and build up your knowledge step by step. No prior financial knowledge is required."
    },
    {
        question: "How long do I have access to the course?",
        answer: "You get lifetime access. Once you enroll, you can access the course materials forever, including all future updates at no extra cost."
    },
    {
        question: "What if I'm not satisfied with the course?",
        answer: "We offer a 7-day money-back guarantee. If you're not satisfied with the course for any reason, just email us within 7 days and we'll refund your full payment - no questions asked."
    },
    {
        question: "Can I access the course on mobile?",
        answer: "Yes! The course is fully responsive and works on all devices - desktop, tablet, and mobile. Learn at your own pace, wherever you are."
    },
    {
        question: "Is the course in Hindi or English?",
        answer: "The course is primarily in English with Hindi explanations where helpful. Our goal is to make complex financial concepts easy to understand regardless of your language preference."
    },
    {
        question: "Will I get a certificate?",
        answer: "Yes, upon completing the course you'll receive a certificate of completion that you can add to your LinkedIn profile or resume."
    },
];

export const CourseFAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-16 px-4 sm:px-6 bg-cream">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold font-serif text-ink mb-2">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-ink-secondary">
                        Got questions? We've got answers.
                    </p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white border border-border rounded-2xl overflow-hidden"
                        >
                            <button
                                className="w-full flex items-center justify-between p-5 text-left hover:bg-cream-dark/50 transition-colors"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <span className="font-medium text-ink pr-4">
                                    {faq.question}
                                </span>
                                <span className="shrink-0 text-ink-muted">
                                    {openIndex === index ? (
                                        <Minus size={18} />
                                    ) : (
                                        <Plus size={18} />
                                    )}
                                </span>
                            </button>

                            <div
                                className={`grid transition-all duration-300 ease-in-out ${
                                    openIndex === index
                                        ? "grid-rows-[1fr] opacity-100"
                                        : "grid-rows-[0fr] opacity-0"
                                }`}
                            >
                                <div className="overflow-hidden">
                                    <div className="px-5 pb-5 text-ink-secondary text-sm leading-relaxed">
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
