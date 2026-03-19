'use client';

import { useState } from 'react';
import FadeIn from './FadeIn';

type FAQItem = [string, string]; // [question, answer]

interface FAQSectionProps {
  faqs: FAQItem[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-card border-t border-border" style={{ padding: "clamp(56px,7vw,96px) 0" }}>
      <div className="max-w-[720px] mx-auto px-5 md:px-7">
        <FadeIn>
          <div className="text-[11px] tracking-[.14em] uppercase text-ink-muted flex items-center gap-2.5 mb-4">
            <span className="w-[18px] h-px bg-ink-muted shrink-0" />
            questions
          </div>
          <h2 className="font-serif font-black tracking-tighter leading-[1.05] text-ink mb-10" style={{ fontSize: "clamp(26px,5vw,52px)" }}>
            stuff people ask.
          </h2>
        </FadeIn>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left p-5 px-6 bg-cream-dark border border-border rounded-2xl hover:border-accent/[.3] transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-serif font-bold text-ink leading-[1.3]">{faq[0]}</h3>
                  <span className="font-serif text-[22px] text-accent shrink-0 transition-transform" style={{
                    transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>
                    ↓
                  </span>
                </div>
                {openIndex === i && (
                  <p className="text-[13px] text-ink-secondary leading-[1.7] mt-3.5 font-light">
                    {faq[1]}
                  </p>
                )}
              </button>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
