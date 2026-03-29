'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CourseIcon from './CourseIcon';
import { NotifyModal } from '@/components/NotifyModal';
import { BellRing } from 'lucide-react';

interface Course {
  id: string | number;
  title: string;
  category: string;
  price: number;
  tagline: string;
  level: string;
  tag?: string;
  icon: string;
  slug?: string;
  staticRoute?: string | null;
}

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const { title, category, price, tagline, level, tag, icon, id, slug, staticRoute } = course;
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const router = useRouter();

  // Check if tag indicates coming soon status
  // Database statuses other than "Available" are mapped to tag field
  const isComingSoon = tag && tag.toLowerCase().includes('coming');
  const isBestseller = tag && tag.toLowerCase() === 'bestseller';
  const isNewCourse = tag && (tag.toLowerCase() === 'new' || tag.toLowerCase() === 'new!');

  const handleCardClick = () => {
    if (isComingSoon) {
      setIsNotifyModalOpen(true);
    } else {
      // Navigate to course page - use staticRoute if available, otherwise use slug
      const courseUrl = staticRoute ? `/${staticRoute}` : `/courses/${slug}`;
      router.push(courseUrl);
    }
  };

  return (
    <>
      <div
        className={`bg-card border border-border rounded-[18px] overflow-hidden flex flex-col h-full transition-all ${
          isComingSoon
            ? 'opacity-90 cursor-pointer hover:border-gold/50 hover:shadow-md'
            : 'cursor-pointer hover:border-accent/30 hover:shadow-md'
        }`}
        onClick={handleCardClick}
      >
      {/* Header with icon */}
      <div className="px-[22px] py-5 pb-4 flex items-center gap-3.5 border-b border-border">
        <div className={`w-[52px] h-[52px] rounded-[14px] flex items-center justify-center shrink-0 ${
          isComingSoon ? 'bg-gold/10' : 'bg-accent-light'
        }`}>
          <CourseIcon name={icon} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <span className="text-[9px] tracking-[.1em] uppercase text-ink-muted">{category}</span>
            {tag && (
              <span
                className={`text-[9px] font-bold px-2 py-[2px] rounded-pill uppercase ${
                  isComingSoon
                    ? 'bg-gold/10 text-gold'
                    : isBestseller
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
          {isComingSoon ? (
            <>
              <span className="text-sm font-medium text-gold">
                Coming Soon
              </span>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-pill text-xs font-medium text-gold bg-gold/10 hover:bg-gold/20 transition-colors">
                <BellRing size={12} />
                Notify Me
              </button>
            </>
          ) : (
            <>
              <div>
                <span className="font-serif text-[22px] font-bold text-ink">₹{price}</span>
                <span className="text-[10px] text-ink-muted ml-1.5">
                  or <span className="text-accent font-semibold">free in bundle</span>
                </span>
              </div>
              <span className="px-4 py-2 rounded-pill text-xs font-medium text-white bg-accent cursor-pointer hover:-translate-y-px transition-transform">
                enroll →
              </span>
            </>
          )}
        </div>
      </div>
    </div>

    {/* Notify Modal */}
    {isNotifyModalOpen && (
      <NotifyModal
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
        courseId={id.toString()}
      />
    )}
  </>
  );
}
