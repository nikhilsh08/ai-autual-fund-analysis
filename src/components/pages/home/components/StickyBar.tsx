'use client';

export default function StickyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-cream/[.97] backdrop-blur-2xl border-t border-border px-5 py-3 hidden max-[768px]:flex items-center justify-center gap-3">
      <span className="font-serif text-lg font-black text-ink">from ₹399</span>
      <a
        href="#courses"
        className="px-6 py-2.5 rounded-pill text-[13px] font-medium bg-accent text-white border-none cursor-pointer hover:-translate-y-px transition-transform"
      >
        explore courses →
      </a>
    </div>
  );
}
