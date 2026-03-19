'use client';

import FadeIn from "./FadeIn";

export default function PersonalisedHelp() {
  return (
    <section className="bg-cream-dark border-t border-border" style={{ padding: "clamp(48px,6vw,72px) 0" }}>
      <div className="max-w-[720px] mx-auto px-5 md:px-7">
        <FadeIn>
          <div className="text-[11px] tracking-[.14em] uppercase text-ink-muted flex items-center justify-center gap-2.5 mb-4">
            <span className="w-[18px] h-px bg-ink-muted shrink-0" />
            need personalised help?
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Group session */}
            <div className="p-7 px-6 bg-card rounded-2xl border border-border text-center">
              <span className="text-[28px] block mb-3">👥</span>
              <h4 className="font-serif text-base font-bold text-ink mb-2">Group doubt-clearing</h4>
              <p className="text-[13px] text-ink-secondary leading-[1.6] mb-2.5">
                Live group session included with every course. Ask anything about the content. Session
                dates notified over email.
              </p>
              <span className="text-xs font-semibold text-success">included free ✓</span>
            </div>

            {/* 1:1 mentoring */}
            <div className="p-7 px-6 bg-card rounded-2xl border border-border text-center">
              <span className="text-[28px] block mb-3">📞</span>
              <h4 className="font-serif text-base font-bold text-ink mb-2">1-to-1 mentoring session</h4>
              <p className="text-[13px] text-ink-secondary leading-[1.6] mb-3">
                45 min with Nikhil. Understand your financial concepts better. Clarify your thinking on
                asset allocation, risk, and strategy. Educational guidance — not investment advice.
              </p>
              <div className="font-serif text-[26px] font-black text-ink mb-3">₹1,999</div>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-pill text-[13px] font-medium bg-ink text-cream max-w-[200px] mx-auto hover:-translate-y-px transition-transform"
              >
                book a session →
              </a>
              <p className="text-[10px] text-ink-muted mt-2">
                this is an educational mentoring session, not investment advisory
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
