'use client';

import { useMemo, useState } from 'react';
import FadeIn from './FadeIn';

interface FounderLetterProps {
  photoUrl: string;
}

export default function FounderLetter({ photoUrl }: FounderLetterProps) {
  const fallbackPhoto = '/founder-placeholder.svg';
  const initialPhoto = useMemo(() => photoUrl || fallbackPhoto, [photoUrl]);
  const [imageSrc, setImageSrc] = useState(initialPhoto);

  return (
    <section
      id="founder"
      className="bg-card border-b border-border"
      style={{ padding: "clamp(56px,7vw,96px) 0" }}
    >
      <div className="max-w-[1080px] mx-auto px-5 md:px-7">
        {/* Avatar + name */}
        <FadeIn>
          <div className="flex items-center gap-6 mb-10 flex-wrap">
            <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-[3px] border-accent-light shadow-[0_0_0_1px_#5B4FD6] shrink-0">
              <img
                src={imageSrc}
                alt="Nikhil Sharma"
                className="w-full h-full object-cover"
                onError={() => setImageSrc(fallbackPhoto)}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="font-serif text-[22px] font-bold text-ink mb-[3px]">Nikhil Sharma</div>
              <div className="text-[13px] text-ink-muted">founder, CashFlowCrew · ex–Goldman Sachs</div>
            </div>
          </div>
        </FadeIn>

        {/* Letter body */}
        <FadeIn delay={0.1}>
          <div className="max-w-[700px] text-base text-ink-body leading-[1.95] font-light">
            <p className="mb-5">Here's what happened.</p>

            <p className="mb-5">
              I spent five years in institutional finance — the kind where every assumption gets
              interrogated before a single rupee moves. And the one thing I learned, above everything
              else, is this:
            </p>

            <p className="mb-5">
              <strong className="font-medium text-ink">The best investors aren't the best stock pickers.</strong>
              <br />
              <strong className="font-medium text-ink">They're the best risk managers.</strong>
            </p>

            <p className="mb-5">
              They don't try to predict the market. They build portfolios that survive the market —
              whatever it does. They don't chase the big win. They avoid the big mistake. And over 10
              years, 20 years, that's what makes all the difference.
            </p>

            <p className="mb-5">
              But the people I actually care about — my friends, my batchmates, the person earning ₹12
              lakhs working 10-hour days — they never got that lesson. They got a bank RM pushing the
              latest NFO. A WhatsApp uncle forwarding six-month-old tips. YouTube videos by people
              who've never managed real money.
            </p>

            <p className="mb-5">
              That's not fair.<br />
              And it bothered me enough to do something about it.
            </p>

            {/* Pull-quote block */}
            <div className="my-8 py-6 px-7 bg-accent-light rounded-2xl border-l-4 border-accent">
              <p
                className="font-serif font-bold italic text-accent tracking-tight leading-[1.35]"
                style={{ fontSize: "clamp(16px,2.2vw,22px)" }}
              >
                "This is my first attempt. Very raw. Very unstructured. But very real — and I believe it
                will propel you on a journey of understanding that changes how you see your money forever."
              </p>
            </div>

            <p className="mb-5">
              I'm not building a course platform. I'm building a way of thinking. Every topic. Every
              asset class. Explained the way I'd explain it to you if we were sitting in a café and you
              asked me — <em className="italic font-light">am I doing this right?</em>
            </p>

            <p className="mb-5">
              We're already using AI in our teaching — wherever it makes sense. Not as a gimmick. As a
              tool that helps you analyse your own portfolio, understand your own numbers, in minutes
              instead of hours. And as AI gets better with time, so will our courses. But the concepts
              come first. Always. The right frameworks don't change with the technology — the technology
              just makes them easier to use.
            </p>

            <p className="mb-5">
              Everything updates every few weeks. Because the world moves fast, and what worked last
              quarter might not work next quarter. Your access is permanent. The content is alive.
            </p>

            <p className="mb-5">
              One thing I want to be upfront about. We don't tell you what to buy. We don't tell you
              what to sell. That's by design. The moment we start giving advice, we stop being honest.
              What we give you is the lens. What you do with it is your call.
            </p>

            <p className="mb-5">सुनो सबकी, करो अपनी — but first, understand the why.</p>

            <p className="mb-5">
              <strong className="font-medium text-ink">
                I'm building this with you. Not just for you.
              </strong>{" "}
              Your feedback shapes every update. I read every single response personally.
            </p>

            <p>— Nikhil</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
