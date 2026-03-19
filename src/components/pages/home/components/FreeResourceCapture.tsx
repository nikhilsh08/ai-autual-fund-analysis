'use client';

import FadeIn from './FadeIn';

export default function FreeResourceCapture() {
  return (
    <section className="bg-card border-t border-border" style={{ padding: "clamp(40px,5vw,56px) 0" }}>
      <div className="max-w-[560px] mx-auto px-5 md:px-7 text-center">
        <FadeIn>
          <div className="p-8 px-7 bg-cream-dark rounded-[20px] border border-border">
            <div className="text-[32px] mb-3">📋</div>
            <h3 className="font-serif text-xl font-black text-ink mb-2">
              Get 3 free investment checklists
            </h3>
            <p className="text-sm text-ink-secondary leading-[1.65] font-light mb-5">
              The same checklists our 10,000+ students use. Portfolio audit. Monthly expense tracker.
              Asset allocation calculator. Free. No spam.
            </p>
            <div className="flex gap-2.5 max-w-[400px] mx-auto flex-wrap justify-center">
              <input
                type="email"
                placeholder="your email address"
                className="flex-1 min-w-[200px] px-[18px] py-[13px] border-[1.5px] border-border rounded-pill text-sm font-sans bg-card outline-none text-ink placeholder:text-ink-muted focus:border-accent transition-colors"
              />
              <button className="inline-flex items-center gap-2 px-6 py-[13px] rounded-pill text-sm font-medium bg-ink text-cream hover:-translate-y-px transition-transform cursor-pointer">
                send me the checklists →
              </button>
            </div>
            <p className="text-[10px] text-ink-muted mt-2.5">
              we'll email you the PDF. no spam. unsubscribe anytime.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
