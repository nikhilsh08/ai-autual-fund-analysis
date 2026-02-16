"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const WorkshopFAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "Do I need a finance background?",
            answer:
                "No. If you can copy-paste text and read a fund factsheet, you can do this. The prompts are designed for working professionals with zero finance training.",
        },
        {
            question: "Which AI tool do I need?",
            answer:
                "ChatGPT (free version works, but Plus recommended for faster responses). We'll show you exactly how to use it during the workshop.",
        },
        {
            question: "What if I can't attend live?",
            answer:
                "You get lifetime access to the recording. But we strongly recommend attending live — the Q&A session is where a lot of clarity happens.",
        },
        {
            question: "Will you recommend which funds to buy?",
            answer:
                "No. This workshop teaches you to VERIFY recommendations — not receive them. We don't do fund recommendations. We teach you to check them yourself.",
        },
        {
            question: "I have a fee-only advisor. Is this still useful?",
            answer:
                "Yes. Even good advisors make mistakes or have blind spots. These tools let you double-check their work. Think of it as a second opinion — but one you can run yourself in 10 minutes.",
        },
        {
            question: "What if I only invest in index funds?",
            answer:
                "Then you probably don't need this. This workshop is most valuable for people in active equity funds who want to verify performance, overlap, and risk metrics.",
        },
        {
            question: "Can I share the prompts with friends/family?",
            answer:
                "Yes. We don't DRM-lock knowledge. If you want to teach your parents or friends, go ahead. We'd rather have more financially literate Indians than enforce artificial scarcity.",
        },
        {
            question: "Is this a one-time payment or subscription?",
            answer:
                "One-time payment. Lifetime access. No recurring fees. The prompts don't expire. AI models improve automatically — and we update the prompts for free.",
        },
    ];

    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 text-center mb-16">
                    Questions You Might Have
                </h2>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-zinc-50 rounded-xl overflow-hidden border border-zinc-200">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-zinc-100 transition-colors"
                            >
                                <span className="font-bold text-lg text-zinc-900">{faq.question}</span>
                                <ChevronDown
                                    className={`w-5 h-5 text-zinc-600 transition-transform ${openIndex === index ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-5 text-zinc-700 leading-relaxed">{faq.answer}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
