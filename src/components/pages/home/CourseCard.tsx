'use client';

import CourseIcon from './CourseIcon';

interface Course {
  id: string | number;
  title: string;
  category: string;
  price: number;
  tagline: string;
  level: string;
  tag?: string;
  icon: string;
}

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const { title, category, price, tagline, level, tag, icon } = course;

  return (
    <div className="bg-card border border-border rounded-[18px] overflow-hidden flex flex-col h-full">
      {/* Header with icon */}
      <div className="px-[22px] py-5 pb-4 flex items-center gap-3.5 border-b border-border">
        <div className="w-[52px] h-[52px] rounded-[14px] bg-accent-light flex items-center justify-center shrink-0">
          <CourseIcon name={icon} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <span className="text-[9px] tracking-[.1em] uppercase text-ink-muted">{category}</span>
            {tag && (
              <span
                className={`text-[9px] font-bold px-2 py-[2px] rounded-pill uppercase ${
                  tag === 'bestseller'
                    ? 'bg-accent-light text-accent'
                    : 'bg-orange-50 text-orange-700'
                }`}
              >
                {tag}
              </span>
            )}
          </div>
          <span className="text-[10px] text-ink-muted">{level}</span>
        </div>
      </div>

      {/* Body */}
      <div className="px-[22px] py-[18px] pb-[22px] flex-1 flex flex-col">
        <h3 className="font-serif text-[17px] font-bold text-ink leading-[1.3] mb-2">{title}</h3>
        <p className="text-[13px] text-ink-muted italic leading-[1.55] mb-[18px] flex-1">{tagline}</p>

        {/* Price row */}
        <div className="flex items-center justify-between pt-3.5 border-t border-border">
          <div>
            <span className="font-serif text-[22px] font-bold text-ink">₹{price}</span>
            <span className="text-[10px] text-ink-muted ml-1.5">
              or <span className="text-accent font-semibold">free in bundle</span>
            </span>
          </div>
          <span className="px-4 py-2 rounded-pill text-xs font-medium text-white bg-accent cursor-pointer hover:-translate-y-px transition-transform">
            enroll →
          </span>
        </div>
      </div>
    </div>
  );
}
