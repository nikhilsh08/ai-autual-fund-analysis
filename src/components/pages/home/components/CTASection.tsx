'use client';

import FadeIn from './FadeIn';

export default function CTASection() {
  return (
    <section className="bg-cream-dark border-t border-border text-center relative overflow-hidden" style={{ padding: "clamp(64px,9vw,108px) 0" }}>
      {/* Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif font-black italic text-ink/[.02] whitespace-nowrap pointer-events-none select-none" style={{ fontSize: "clamp(140px,22vw,220px)" }}>
        cashflow
      </div>

      <div className="max-w-[1080px] mx-auto px-5 md:px-7 relative z-[1]">
        <FadeIn>
          <p className="text-ink-secondary max-w-[540px] mx-auto mb-5 font-light leading-[1.75]" style={{ fontSize: "clamp(17px,2.2vw,24px)" }}>
            The frameworks exist. The tools exist.<br />Someone just needed to explain them honestly.
          </p>
          <h2 className="font-serif font-black tracking-tighter leading-[1.05] text-ink max-w-[600px] mx-auto mb-3.5" style={{ fontSize: "clamp(26px,5vw,52px)" }}>
            that someone is here.
          </h2>
          <p className="font-serif text-sm font-semibold italic text-teal mb-9">
            courses start at ₹399 · full bundle ₹3,999 · 1-year access
          </p>
          <div className="flex flex-col md:flex-row gap-2.5 justify-center items-stretch md:items-center mb-5">
            <a
              href="#courses"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-pill text-[15px] font-medium text-white hover:-translate-y-px transition-transform"
              style={{ background: "linear-gradient(135deg,#5B4FD6,#1E8FE1)" }}
            >
              get the full bundle →
            </a>
            <a
              href="#courses"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-pill text-[15px] font-medium bg-ink text-cream hover:-translate-y-px transition-transform"
            >
              browse individual courses
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
