'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/cart-store';
import FadeIn from './FadeIn';

export interface BundleCardProps {
  bundle: {
    id?: string;
    name?: string;
    fullPrice: number;
    price: number;
    savings: number;
    savingsPercent: number;
    features: string[];
    courseIds?: string[];
  };
}

export default function BundleCard({ bundle }: BundleCardProps) {
  const { fullPrice, price, savings, savingsPercent, features, id, name, courseIds } = bundle;
  const router = useRouter();
  const { data: session } = useSession();
  const { addBundle, hasConflictingCourses } = useCartStore();

  const handleBuyBundle = async () => {
    // If we have bundle data from database
    if (id && courseIds) {
      const hasConflicts = hasConflictingCourses(courseIds);

      if (hasConflicts) {
        const confirmed = window.confirm(
          "Some courses in your cart are included in this bundle. Adding the bundle will replace them with better savings. Continue?"
        );
        if (!confirmed) return;
      }

      // await addBundle(
      //   {
      //     id,
      //     title: name || 'Complete Finance Masterclass',
      //     price,
      //     type: 'bundle',
      //     courseIds,
      //   },
      //   !!session
      // );

      router.push('/bundle');
    } else {
      // Fallback: Navigate to checkout with a flag (for static bundle)
      router.push('/checkout?bundle=complete');
    }
  };

  return (
    <FadeIn>
      <div id='bundle' className="bg-ink rounded-[20px] relative overflow-hidden text-center mb-8" style={{ padding: 'clamp(28px,4vw,44px)' }}>
        {/* Decorative glow */}
        <div className="absolute -top-[60px] -right-[60px] w-[220px] h-[220px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(91,79,214,.3),transparent 70%)' }} />

        <div className="relative z-[1]">
          {/* Best value badge */}
          <div className="inline-flex bg-success text-white text-[10px] font-bold tracking-[.1em] uppercase px-3.5 py-1 rounded-pill mb-5">
            ★ best value — save ₹{savings.toLocaleString('en-IN')}
          </div>

          {/* Headline */}
          <div className="font-serif font-bold text-cream leading-[1.2] mb-3" style={{ fontSize: 'clamp(22px,3.5vw,32px)' }}>
            One year inside the mind of someone<br />
            <em className="text-sky italic font-light">who left the system.</em>
          </div>

          <p className="text-sm text-cream/50 mb-2 max-w-[520px] mx-auto leading-[1.7]">
            The financial system is rigged to fleece the everyday customer. Newspapers and magazines are
            cluttered with declared and undeclared product advertisements. You need someone who is not
            part of it.
          </p>
          <p className="text-sm text-cream/[.65] mb-6 max-w-[520px] mx-auto leading-[1.7]">
            <strong className="text-cream/[.85]">All 12 courses + biweekly updates on every asset class</strong> —
            what's changed, what matters, what's noise. Not the newspaper version. The version you'd get
            if a risk analyst was your friend and called you every two weeks.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-7">
            {features.map((f) => (
              <span
                key={f}
                className="bg-cream/[.08] border border-cream/10 rounded-pill px-3.5 py-[5px] text-[11px] text-cream/70"
              >
                ✓ {f}
              </span>
            ))}
          </div>

          {/* Pricing */}
          <div className="border-t border-cream/[.08] pt-6 max-w-[320px] mx-auto">
            <div className="text-[13px] text-cream/30 line-through mb-1">
              individually: ₹{fullPrice.toLocaleString('en-IN')}
            </div>
            <div className="font-serif font-black text-cream tracking-tighter leading-none" style={{ fontSize: 'clamp(40px,6vw,56px)' }}>
              ₹{price.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-cream/50 mt-1 mb-1.5">one-time payment · 1-year membership</div>
            <div className="inline-flex bg-success/[.15] border border-success/25 rounded-pill px-3 py-[3px] text-[11px] font-semibold text-green-400 mb-5">
              you save ₹{savings.toLocaleString('en-IN')} ({savingsPercent}% off)
            </div>
            <button
              onClick={handleBuyBundle}
              className="flex items-center justify-center w-full px-7 py-[15px] rounded-pill text-[15px] font-medium text-white mb-2.5 hover:-translate-y-px transition-transform cursor-pointer"
              style={{ background: 'linear-gradient(135deg,#5B4FD6,#1E8FE1)' }}
            >
              get everything — ₹{price.toLocaleString('en-IN')} →
            </button>
            <p className="text-[11px] text-cream/30">100% money-back guarantee on your first course</p>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
