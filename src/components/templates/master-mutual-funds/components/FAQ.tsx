import React from "react";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";

interface FAQProps {
  startDate?: Date | null;
}

export const FAQ: React.FC<FAQProps> = ({ startDate }) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const dateStr = startDate ? new Date(startDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }) : "the scheduled date";

  const startTimeStr = startDate ? new Date(startDate).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }) : "11:30 AM";

  // Assuming 4 hours duration
  const endTimeStr = startDate ? new Date(new Date(startDate).getTime() + 4 * 60 * 60 * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }) : "03:30 PM";

  const faqs = [
    {
      question: "Is this webinar suitable for complete beginners?",
      answer: "Absolutely! The webinar is designed to cater to all levels, from complete beginners to intermediate investors. We start with the basics and gradually move to more advanced concepts.",
    },
    {
      question: "How is this different from free content available online?",
      answer: "While free content is valuable, this webinar provides structured, comprehensive knowledge with practical insights from industry experience. You'll learn proven strategies and get exclusive tools that aren't available elsewhere.",
    },
    {
      question: "Will there be any support after the webinar?",
      answer: "Yes, you'll get access to all the bonus materials and tools.",
    },
    {
      question: "Is there a recording of this webinar?",
      answer: "No recording of the webinar will be provided. This is a live webinar.",
    },
    {
      question: "What if I'm not satisfied with the webinar?",
      answer: "We offer a 7-day, no-questions-asked money-back guarantee. If you're not satisfied with the webinar content, you can request a full refund within 7 days of purchase.",
    },
    {
      question: "Is this a live webinar or pre-recorded?",
      answer: `This is a live interactive webinar scheduled for ${dateStr}, from ${startTimeStr} to ${endTimeStr} IST. You'll be able to ask questions in real-time and interact with the instructor and other participants.`,
    },
    {
      question: "What if I miss the webinar due to an emergency?",
      answer: "In case you miss the webinar due to an emergency, please write to us at support@cashflowcrew.in and our team will assist you further.",
    },
    {
      question: "Will I receive any certificate after completing the webinar?",
      answer: "Yes, all participants who attend the live session or complete the recorded webinar will receive a certificate of completion from CashFlowCrew, which you can add to your professional profile.",
    },
    {
      question: "What technical requirements do I need to join the webinar?",
      answer: "You'll need a stable internet connection, a computer, tablet, or smartphone with audio capability. We'll send you the webinar link and instructions 24 hours before the session starts.",
    },
    {
      question: "How current is the mutual fund data and strategies taught?",
      answer: "All content is updated with the latest market conditions, regulatory changes, and fund performance data. Our strategies are based on current SEBI guidelines and real-time market analysis as of 2025.",
    },
    {
      question: "Can I ask questions during the live webinar?",
      answer: "Absolutely! We encourage live interaction. There will be dedicated Q&A segments throughout the 2.5-hour session, and you can submit questions via chat that will be addressed in real-time.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md bg-white"
          >
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="text-lg font-semibold text-gray-900 pr-4">
                {faq.question}
              </span>
              <div className="flex-shrink-0 transition-transform duration-300">
                {openIndex === index ? (
                  <Minus className="w-5 h-5 text-blue-600" />
                ) : (
                  <Plus className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
            >
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <p className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-lg text-gray-600 mb-4">Still have questions?</p>
        <Link
          href="/contact-us"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};
