'use client';

import FadeIn from './FadeIn';

interface Testimonial {
  name: string;
  role: string;
  text: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="bg-card border-t border-border" style={{ padding: "clamp(56px,7vw,96px) 0" }}>
      <div className="max-w-[1080px] mx-auto px-5 md:px-7">
        <FadeIn>
          <div className="text-[11px] tracking-[.14em] uppercase text-ink-muted flex items-center gap-2.5 mb-4">
            <span className="w-[18px] h-px bg-ink-muted shrink-0" />
            10,000+ students
          </div>
          <h2 className="font-serif font-black tracking-tighter leading-[1.05] text-ink mb-10" style={{ fontSize: "clamp(26px,5vw,52px)" }}>
            don't take my word for it.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="bg-cream border border-border rounded-[18px] p-6 px-[22px] h-full flex flex-col">
                <div className="text-[13px] text-gold tracking-[2px] mb-3.5">★★★★★</div>
                <p className="font-serif text-[15px] italic text-ink-body leading-[1.7] mb-5 flex-1">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-xs font-bold text-cream bg-accent font-serif">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-serif font-bold text-[13px] text-ink">{t.name}</div>
                    <div className="text-[11px] text-ink-muted">{t.role}</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
