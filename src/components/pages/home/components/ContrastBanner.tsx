'use client';

import FadeIn from './FadeIn';

export default function ContrastBanner() {
  return (
    <section className="bg-ink py-[clamp(40px,5vw,64px)]">
      <div className="max-w-[700px] mx-auto px-5 md:px-7 text-center">
        <FadeIn>
          <p className="text-[clamp(17px,2.2vw,24px)] text-cream/[.65] leading-[1.75] font-light">
            The financial advice industry makes money<br />
            when you <em className="text-cream/30">don't</em> understand things.
          </p>
          <p className="font-serif text-[clamp(20px,3vw,32px)] font-bold text-cream mt-3.5 tracking-tight">
            We make money when you <em className="text-sky italic font-light">do.</em>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
