'use client';

import FadeIn from './FadeIn';

interface ProofStat {
  value: string;
  label: string;
}

interface HeroSectionProps {
  proofStats: ProofStat[];
}

export default function HeroSection({ proofStats }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-[clamp(80px,12vw,140px)] pb-[clamp(48px,6vw,72px)] [&_h1]:font-serif [&_h2]:font-serif [&_h3]:font-serif [&_h1]:tracking-tight [&_h2]:tracking-tight [&_h3]:tracking-tight">
      <div className="max-w-[1080px] mx-auto px-5 md:px-7 relative z-[1]">
        {/* Headline */}
        <FadeIn>
          <h1 className="font-serif font-black tracking-tightest leading-[1.04] text-ink max-w-[760px] mx-auto md:mx-0 text-center md:text-left mb-7 text-[clamp(34px,6.2vw,62px)]">
            you will make mistakes<br />
            with money.<br />
            <em className="font-light italic">the question is whether<br />you survive them.</em>
          </h1>
        </FadeIn>

        {/* Sub-copy */}
        <FadeIn delay={0.1}>
          <div className="max-w-[580px] mx-auto md:mx-0 text-[clamp(16px,1.8vw,18px)] text-ink-secondary leading-[1.85] font-light text-center md:text-left mb-9">
            <p className="mb-[18px]">Here's something nobody in the personal finance space will say out loud.</p>
            <p className="mb-[18px]">The difference between people who build wealth and people who don't isn't intelligence. It isn't access. It isn't even income.</p>
            <p className="mb-[18px]"><strong className="font-medium text-ink">It's risk management.</strong></p>
            <p className="mb-[18px]">The person who avoids the three big mistakes will always beat the person chasing the ten big wins. Over 5 years. Over 20 years. Every single time.</p>
            <p>Nobody taught you that. I'm going to.</p>
          </div>
        </FadeIn>

        {/* Proof strip */}
        <FadeIn delay={0.2}>
          <p className="text-[13px] text-ink-muted text-center md:text-left mb-4">
            built by a risk analyst. 5 years in institutional finance. ₹60,000 Cr+ managed.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 pt-7 border-t border-border text-center mb-8">
            {proofStats.map(({ value, label }, i) => (
              <div
                key={i}
                className="md:px-5 md:border-r md:border-border md:last:border-r-0"
              >
                <div className="font-serif text-[26px] font-bold text-ink tracking-tighter">{value}</div>
                <div className="text-[10px] text-ink-muted tracking-[.06em] uppercase mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* CTA buttons */}
        <FadeIn delay={0.25}>
          <div className="flex flex-col md:flex-row gap-2.5 flex-wrap justify-center md:justify-start mb-10">
            <a
              href="#courses"
              className="inline-flex items-center justify-center md:justify-start gap-2 px-7 py-3.5 rounded-pill text-[15px] font-medium bg-ink text-cream hover:-translate-y-px transition-transform"
            >
              see what's inside →
            </a>
            <a
              href="#founder"
              className="inline-flex items-center justify-center md:justify-start gap-2 px-7 py-3.5 rounded-pill text-[15px] font-medium bg-transparent text-ink-secondary border-[1.5px] border-border hover:-translate-y-px transition-transform"
            >
              read my story
            </a>
          </div>
        </FadeIn>
      </div>

      {/* Background ₹ watermark */}
      <div className="absolute -top-5 -right-10 font-serif text-[clamp(160px,26vw,300px)] font-black italic text-ink/[.02] leading-none pointer-events-none select-none">
        ₹
      </div>
    </section>
  );
}
