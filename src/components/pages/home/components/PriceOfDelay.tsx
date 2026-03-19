'use client';

import FadeIn from './FadeIn';
import StatIcon from './StatIcon';

interface StatData {
  pct: string;
  stat: string;
  sub: string;
  src: string;
  href: string;
  color: string;
  iconType: string;
}

interface StatCardProps {
  pct: string;
  stat: string;
  sub: string;
  src: string;
  href: string;
  color: string;
  iconType: string;
}

function StatCard({ pct, stat, sub, src, href, color, iconType }: StatCardProps) {
  return (
    <div
      className="bg-cream/[.04] border border-cream/[.08] rounded-[18px] backdrop-blur-sm h-full flex flex-col"
      style={{ padding: "clamp(20px,3vw,28px)" }}
    >
      <div className="flex items-center gap-3 mb-3.5">
        <div
          className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
          style={{ background: `${color}12` }}
        >
          <StatIcon type={iconType} color={color} />
        </div>
        <span
          className="font-serif font-black tracking-tight leading-none"
          style={{ fontSize: "clamp(28px,4.5vw,42px)", color }}
        >
          {pct}
        </span>
      </div>
      <p
        className="font-medium text-cream/[.85] leading-[1.45] mb-2"
        style={{ fontSize: "clamp(14px,1.6vw,16px)" }}
      >
        {stat}
      </p>
      <p className="text-xs text-cream/[.35] leading-[1.5] mb-3 flex-1">{sub}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] text-cream/30 border-t border-cream/[.06] pt-2.5 inline-flex items-center gap-1"
      >
        Source:{" "}
        <span className="underline underline-offset-2 text-cream/[.45]">{src}</span>
        <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="rgba(248,245,239,.3)" strokeWidth="1.5">
          <path d="M3 9l6-6M4 3h5v5" />
        </svg>
      </a>
    </div>
  );
}

interface PriceOfDelayProps {
  stats: StatData[];
  fullWidthStat: StatData;
}

export default function PriceOfDelay({ stats, fullWidthStat }: PriceOfDelayProps) {
  return (
    <section className="bg-ink overflow-hidden relative" style={{ padding: "clamp(56px,7vw,96px) 0" }}>
      {/* Subtle radial texture */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(91,79,214,.06), transparent 70%), radial-gradient(ellipse at 80% 30%, rgba(30,143,225,.04), transparent 60%)" }} />

      <div className="max-w-[1080px] mx-auto px-5 md:px-7 relative z-[1]">
        {/* Header */}
        <FadeIn>
          <div className="flex items-center justify-center gap-2.5 text-cream/30 text-[11px] tracking-[.14em] uppercase mb-4">
            <span className="inline-block w-[18px] h-px bg-cream/20" />
            the data doesn't lie
          </div>
          <h2
            className="font-serif font-black tracking-tighter leading-[1.08] text-cream text-center max-w-[620px] mx-auto mb-3"
            style={{ fontSize: "clamp(26px,5vw,48px)" }}
          >
            the price of delay<br />
            <em className="text-cream/[.35] font-light italic">is bigger than you think.</em>
          </h2>
          <p
            className="text-center text-cream/[.45] max-w-[520px] mx-auto font-light leading-[1.7] mb-12"
            style={{ fontSize: "clamp(14px,1.6vw,16px)" }}
          >
            Five data points. Five reasons most Indians never build real wealth. Each one is fixable — if you know what to fix.
          </p>
        </FadeIn>

        {/* 2×2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {stats.map((d, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <StatCard {...d} />
            </FadeIn>
          ))}
        </div>

        {/* Full-width 5th stat */}
        <FadeIn delay={0.35}>
          <StatCard {...fullWidthStat} />
        </FadeIn>

        {/* CTA summary */}
        <FadeIn delay={0.45}>
          <div className="text-center" style={{ marginTop: "clamp(36px,5vw,56px)" }}>
            <p
              className="font-serif font-bold italic text-cream tracking-tight leading-[1.45] max-w-[560px] mx-auto mb-2"
              style={{ fontSize: "clamp(16px,2.2vw,22px)" }}
            >
              These aren't just statistics. They're the cost of not learning.
            </p>
            <p
              className="text-cream/40 max-w-[480px] mx-auto leading-[1.65] font-light mb-7"
              style={{ fontSize: "clamp(13px,1.5vw,15px)" }}
            >
              Every one of these gaps — retirement, insurance, emergency funds, goal planning — is covered in our curriculum. The frameworks exist. You just need someone to explain them honestly.
            </p>
            <a
              href="#courses"
              className="inline-flex items-center gap-2 bg-cream/10 text-cream border border-cream/[.15] px-7 py-3.5 rounded-pill text-sm hover:-translate-y-px transition-transform"
            >
              explore the curriculum →
            </a>
            <p className="text-[10px] text-cream/20 mt-3.5">
              for educational purposes only. not investment advice.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
