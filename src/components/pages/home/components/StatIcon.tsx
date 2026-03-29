'use client';

interface StatIconProps {
  type: string;
  color: string;
}

const ICONS: Record<string, (color: string) => React.ReactNode> = {
  retirement: (color) => (
    <svg viewBox="0 0 28 28" width="24" height="24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <path d="M5 24V10l9-6 9 6v14" /><path d="M10 24v-8h5v8" />
    </svg>
  ),
  stress: (color) => (
    <svg viewBox="0 0 28 28" width="24" height="24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <circle cx="14" cy="11" r="5" /><path d="M7 24c0-4 3-7 7-7s7 3 7 7" /><path d="M19 8l2-3M9 8L7 5" />
    </svg>
  ),
  shield: (color) => (
    <svg viewBox="0 0 28 28" width="24" height="24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <path d="M14 4c6 0 10 4 10 8-3 10-10 14-10 14S4 22 4 12c0-4 4-8 10-8z" />
    </svg>
  ),
  clock: (color) => (
    <svg viewBox="0 0 28 28" width="24" height="24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <circle cx="14" cy="14" r="9" /><path d="M14 9v4h-3" /><path d="M11 20l-3 3M17 20l3 3" />
    </svg>
  ),
  alert: (color) => (
    <svg viewBox="0 0 28 28" width="24" height="24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <circle cx="14" cy="14" r="9" /><path d="M14 10v5" /><circle cx="14" cy="21" r="0.5" fill={color} />
    </svg>
  ),
};

export default function StatIcon({ type, color }: StatIconProps): React.ReactNode {
  const render = ICONS[type];
  return render ? render(color) : null;
}
