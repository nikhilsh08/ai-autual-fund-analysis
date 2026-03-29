'use client';

interface CourseIconProps {
  name: string;
  size?: number;
}

const PATHS: Record<string, React.ReactNode> = {
  ratios: (
    <>
      <path d="M12 44V24" />
      <path d="M22 44V16" />
      <path d="M32 44V28" />
      <path d="M42 44V12" />
      <path d="M10 44h36" strokeWidth="2.5" />
    </>
  ),
  rupee: (
    <>
      <circle cx="28" cy="28" r="16" />
      <path d="M28 18v20" />
      <path d="M23 23h10c2.5 0 4 1.5 4 3.5s-1.5 3.5-4 3.5h-7c-2.5 0-4 1.5-4 3.5s1.5 3.5 4 3.5h10" />
    </>
  ),
  card: (
    <>
      <rect x="8" y="16" width="40" height="26" rx="4" />
      <path d="M8 26h40" strokeWidth="2.5" />
      <path d="M16 34h10" />
    </>
  ),
  trend: (
    <>
      <path d="M10 44L22 28L32 36L48 14" />
      <circle cx="48" cy="14" r="3.5" />
    </>
  ),
  lens: (
    <>
      <circle cx="24" cy="24" r="12" />
      <path d="M24 36v14" />
      <path d="M16 50h16" />
    </>
  ),
  arrow: (
    <>
      <path d="M10 42l12-16 10 8 16-24" />
      <path d="M40 10h8v8" />
    </>
  ),
  target: (
    <>
      <circle cx="28" cy="28" r="18" />
      <circle cx="28" cy="28" r="11" />
      <circle cx="28" cy="28" r="4" fill="currentColor" />
    </>
  ),
  bank: (
    <>
      <path d="M8 22l20-12 20 12" strokeWidth="2.5" />
      <path d="M14 22v18M22 22v18M30 22v18M38 22v18" />
      <path d="M10 40h32" strokeWidth="2.5" />
    </>
  ),
  house: (
    <>
      <path d="M6 28L28 10l22 18" strokeWidth="2.5" />
      <path d="M14 26v22h28V26" />
      <path d="M22 48V36h12v12" />
    </>
  ),
  gold: (
    <>
      <path d="M18 42l5-14h10l5 14z" />
      <path d="M14 42h28" strokeWidth="2.5" />
      <circle cx="28" cy="18" r="8" />
    </>
  ),
  globe: (
    <>
      <circle cx="28" cy="28" r="18" />
      <ellipse cx="28" cy="28" rx="9" ry="18" />
      <path d="M10 28h36" />
    </>
  ),
  seed: (
    <>
      <path d="M28 48V28" strokeWidth="2.5" />
      <path d="M28 34c-10-2-15-12-12-20 8 0 12 8 12 20" />
      <path d="M28 26c8-5 18-2 18 8-8 2-14-2-18-8" />
    </>
  ),
};

export default function CourseIcon({ name, size = 44 }: CourseIconProps): React.ReactNode {
  const paths = PATHS[name];
  if (!paths) return null;

  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-accent"
    >
      {paths}
    </svg>
  );
}
