'use client';


import React from 'react';


import FadeIn from './components/FadeIn';
import BundleCard, { BundleCardProps } from './components/BundleCard';
import CourseCard from './CourseCard';

interface Course {
  id: string | number;
  title: string;
  category: string;
  price: number;
  tagline: string;
  level: string;
  tag?: string;
  icon: string;
  thumbnail?: string;
  slug?: string;
  originalPrice?: number;
  description?: string;
  staticRoute?: string | null;
}

interface Filter {
  value: string;
  label: string;
}

interface Bundle {
  price: number;
  savings: number;
  [key: string]: any;
}

interface CoursesSectionProps {
  courses: Course[];
  filters?: Filter[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  bundle?: Bundle;
}

const DEFAULT_FILTERS = [
  { value: 'all', label: 'all' },
  { value: 'foundations', label: 'foundations' },
  { value: 'equity', label: 'equity' },
  { value: 'debt', label: 'debt & credit' },
  { value: 'assets', label: 'other assets' },
];

const DEFAULT_BUNDLE = {
  fullPrice: 6787,
  price: 3999,
  savings: 2788,
  savingsPercent: 41,
};

export default function CoursesSectionServer({
  courses,
  filters = DEFAULT_FILTERS,
  activeFilter: initialFilter = 'all',
  onFilterChange: onFilterChangeCallback,
  bundle = DEFAULT_BUNDLE,
}: CoursesSectionProps) {
  const [activeFilter, setActiveFilter] = React.useState(initialFilter);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    onFilterChangeCallback?.(filter);
  };

  const filtered =
    activeFilter === 'all'
      ? courses
      : courses.filter((c) => c.category === activeFilter);

  return (
    <section
      id="courses"
      className="bg-cream-dark border-t border-border"
      style={{ padding: 'clamp(56px,7vw,96px) 0' }}
    >
      <div className="max-w-[1080px] mx-auto px-5 md:px-7">
        {/* Section heading */}
        <FadeIn>
          <div className="text-[11px] tracking-[.14em] uppercase text-ink-muted flex items-center gap-2.5 mb-4">
            <span className="w-[18px] h-px bg-ink-muted shrink-0" />
            the curriculum
          </div>
          <h2
            className="font-serif font-black tracking-tighter leading-[1.05] text-ink mb-2.5"
            style={{ fontSize: 'clamp(26px,5vw,52px)' }}
          >
            12 courses. <em className="font-light italic">every major topic.</em>
          </h2>
          <p className="text-[15px] text-ink-secondary max-w-[560px] mt-2.5 leading-[1.7] font-light mb-9">
            Built from first principles. Risk management at the core. AI tools in every module. 1-year
            access — with all updates during your subscription.
          </p>
        </FadeIn>

        {/* Bundle */}
        <BundleCard bundle={bundle as BundleCardProps['bundle']} />

        {/* Filters */}
        <FadeIn>
          <div className="flex justify-center mb-6">
            <div className="flex gap-2 flex-wrap justify-center items-center max-w-4xl">
              {filters.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleFilterChange(value)}
                  className={`px-4 py-[7px] rounded-pill text-xs font-sans cursor-pointer transition-colors border-[1.5px] ${
                    activeFilter === value
                      ? 'border-ink bg-ink text-cream'
                      : 'border-border bg-transparent text-ink-secondary hover:border-ink-muted'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Course grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length > 0 ? (
            filtered.map((course, i) => (
              <FadeIn key={course.id} delay={i * 0.04}>
                <CourseCard course={course} />
              </FadeIn>
            ))
          ) : (
            <p className="text-ink-secondary">No courses found in this category.</p>
          )}
        </div>

        {/* Bundle reminder */}
        <FadeIn>
          <div className="mt-7 px-6 py-5 bg-card border-[1.5px] border-dashed border-accent rounded-[14px] flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-ink font-medium mb-0.5">Buying more than 2 courses?</p>
              <p className="text-[13px] text-ink-secondary font-light">
                The bundle is ₹{bundle.price.toLocaleString('en-IN')} for all 12 + newsletter + live sessions + community. You save ₹{bundle.savings.toLocaleString('en-IN')}.
              </p>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill text-[13px] font-medium text-white shrink-0 hover:-translate-y-px transition-transform"
              style={{ background: 'linear-gradient(135deg,#5B4FD6,#1E8FE1)' }}
            >
              get the bundle →
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
