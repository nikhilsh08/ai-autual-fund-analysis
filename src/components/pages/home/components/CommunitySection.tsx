'use client';

import React from 'react';
import FadeIn from './FadeIn';

interface Perk {
  emoji: string;
  text: string;
}

interface CommunitySectionProps {
  perks: Perk[];
  bundlePrice: number;
}

export default function CommunitySection({ perks, bundlePrice }: CommunitySectionProps) {
  return (
    <section className="border-t border-border" style={{ padding: "clamp(56px,7vw,96px) 0" }}>
      <div className="max-w-[1080px] mx-auto px-5 md:px-7">
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            {/* Left copy */}
            <div className="text-center md:text-left">
              <div className="text-[11px] tracking-[.14em] uppercase text-ink-muted flex items-center justify-center md:justify-start gap-2.5 mb-4">
                <span className="w-[18px] h-px bg-ink-muted shrink-0" />
                the ongoing edge
              </div>
              <h2 className="font-serif font-black tracking-tighter leading-[1.05] text-ink mb-4" style={{ fontSize: "clamp(26px,5vw,52px)" }}>
                The courses are the foundation.<br />
                <em className="font-light italic">The community is the edge.</em>
              </h2>
              <p className="text-[15px] text-ink-secondary leading-[1.75] font-light mb-3">
                Every two weeks, you get a fresh update on every asset class — what's changed, what matters,
                what's noise. Not the newspaper version cluttered with undeclared product ads.
              </p>
              <p className="text-[15px] text-ink-body leading-[1.75]">
                <strong className="font-medium">
                  The version you'd get if a risk analyst was your friend and called you every two weeks.
                </strong>
              </p>
            </div>

            {/* Right card */}
            <div className="bg-cream-dark border border-border rounded-2xl p-6 px-[22px]">
              <div className="flex items-center justify-center md:justify-start gap-2.5 mb-6 pb-4 border-b border-border text-center md:text-left">
                <span className="text-[22px]">🔒</span>
                <div>
                  <div className="font-serif font-bold text-sm text-ink">Bundle members only</div>
                  <div className="text-[11px] text-ink-muted">1-year membership</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {perks.map((perk) => (
                  <div key={perk.text} className="flex gap-3 items-start justify-center md:justify-start text-left">
                    <span className="text-[18px] shrink-0">{perk.emoji}</span>
                    <p className="text-[13px] text-ink leading-[1.6]">{perk.text}</p>
                  </div>
                ))}
              </div>

              <a
                href="#bundle"
                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-pill text-sm font-medium text-white hover:-translate-y-px transition-transform"
                style={{ background: "linear-gradient(135deg,#5B4FD6,#1E8FE1)" }}
              >
                get the bundle — ₹{bundlePrice.toLocaleString('en-IN')} →
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
