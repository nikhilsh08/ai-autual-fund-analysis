'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/cart-store';
import { Check, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { log } from 'console';

// ── Types ──────────────────────────────────────────────
interface Bundle {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    savings: number;
    savingsPercent: number;
    features: string[];
    courseIds: string[];
    coursesIncluded: number;
}

interface Category {
    id: string;
    name: string;
}

interface Course {
    id: string | number;
    title: string;
    category: string | Category;
    price: number;
    slug?: string;
    status?: string;
    thumbnail?: string;
    originalPrice?: number;
}

export interface BundlePageProps {
    bundle: Bundle | null;
    courses: Course[];
}

// ── Comparison Table Data ──────────────────────────────
const comparisonRows = [
    { feature: 'Course Content',    individual: 'Single Course Only',   bundle: 'All 12 Courses' },
    { feature: 'Biweekly Updates',  individual: 'No',                   bundle: 'Yes (1 Year)' },
    { feature: 'Community Access',  individual: 'Course Specific Only', bundle: 'Full Community' },
    { feature: 'Live Sessions',     individual: 'No',                   bundle: 'Yes' },
    { feature: 'Mentoring Access',  individual: 'Standard Pricing',     bundle: 'Priority Booking' },
];

// ── Component ──────────────────────────────────────────
export function BundlePage({ bundle, courses }: BundlePageProps) {

    const router = useRouter();
    const { data: session } = useSession();
    const { addBundle, hasConflictingCourses } = useCartStore();
    console.log(bundle , "and, ", courses);
    
    

    // Static fallback values
    const price          = bundle?.price ?? 3999;
    const originalPrice  = bundle?.originalPrice ?? 6286;
    const savings        = bundle?.savings ?? (originalPrice - price);
    const savingsPercent = bundle?.savingsPercent ?? 37;
    const features       = bundle?.features ?? [
        'All 12 courses',
        'Biweekly video updates',
        'Biweekly written analysis',
        'Live sessions',
        'Community access',
        '1 year of updates',
    ];

    const handleEnroll = async () => {
        if (!bundle) return;

        const hasConflicts = hasConflictingCourses(bundle.courseIds);
        if (hasConflicts) {
            const ok = window.confirm(
                'Some courses in your cart are included in this bundle. Replace for better savings?'
            );
            if (!ok) return;
        }

        await addBundle(
            {
                id: bundle.id,
                title: bundle.name,
                price,
                type: 'bundle',
                courseIds: bundle.courseIds,
            },
            !!session
        );

        router.push('/checkout');
    };

    return (
        <div className="min-h-screen bg-cream text-ink font-sans">

            {/* ── Hero ── */}
            <section className="pt-28 pb-12 text-center px-6 border-b border-border">
                <span className="inline-block bg-sky/10 text-sky text-[10px] font-bold tracking-[.12em] uppercase px-4 py-1.5 rounded-pill mb-6 border border-sky/20">
                    ✦ The Complete Curriculum
                </span>
                <h1
                    className="font-serif font-black tracking-tighter leading-[1.02] text-ink mb-5"
                    style={{ fontSize: 'clamp(36px,6vw,64px)' }}
                >
                    The CashFlowCrew<br />
                    <em className="font-light italic">Mastery Bundle.</em>
                </h1>
                <p className="text-ink-secondary text-[clamp(15px,1.8vw,18px)] font-light max-w-xl mx-auto leading-[1.7]">
                    Stop guessing. Start building. Get every course, every framework,
                    and every update for one full year.
                </p>
            </section>

            {/* ── Course Grid + Pricing Card ── */}
            <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">

                {/* Left — Course List */}
                <div>
                    <p className="flex items-center gap-2 text-[13px] font-semibold text-ink-secondary uppercase tracking-[.1em] mb-6">
                        <BookOpen size={14} />
                        {bundle?.coursesIncluded ?? 12} Courses Included
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="bg-white border border-border rounded-2xl px-5 py-4 hover:border-sky/40 hover:shadow-sm transition-all cursor-pointer"
                                onClick={() => router.push(`/courses/${course.slug}`)}
                            >
                                {course.category && (
                                        <p className="text-[9px] font-bold tracking-[.12em] uppercase text-ink-secondary/60 mb-1">
                                            {typeof course.category === 'object' ? course.category.name : course.category}
                                        </p>
                                    )}
                                <p className="text-[14px] font-semibold text-ink leading-snug">
                                    {course.title}
                                </p>
                                {course.status === 'Coming Soon' && (
                                    <span className="inline-block mt-2 text-[9px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-pill">
                                        Coming Soon
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right — Pricing Card */}
                <div className="lg:sticky lg:top-28">
                    <div className="bg-ink rounded-[22px] overflow-hidden relative text-center p-8">
                        <div
                            className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
                            style={{ background: 'radial-gradient(circle,rgba(91,79,214,.35),transparent 70%)' }}
                        />
                        <div className="relative z-[1]">
                            <div className="inline-flex bg-sky text-white text-[10px] font-bold tracking-[.12em] uppercase px-3.5 py-1 rounded-pill mb-4">
                                Save ₹{savings.toLocaleString('en-IN')}
                            </div>
                            <h2 className="font-serif font-bold text-cream text-xl mb-1">The Bundle</h2>
                            <p className="text-[11px] text-cream/40 uppercase tracking-widest mb-5">1-Year Full Access</p>

                            <ul className="text-left space-y-2 mb-7 max-w-[240px] mx-auto">
                                {features.map((f) => (
                                    <li key={f} className="flex items-center gap-2 text-[13px] text-cream/75">
                                        <Check size={13} className="text-green-400 shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <div className="border-t border-cream/10 pt-6">
                                <div className="text-[13px] text-cream/30 line-through mb-1">
                                    ₹{originalPrice.toLocaleString('en-IN')}
                                </div>
                                <div
                                    className="font-serif font-black text-cream tracking-tighter leading-none mb-1"
                                    style={{ fontSize: 'clamp(42px,6vw,58px)' }}
                                >
                                    ₹{price.toLocaleString('en-IN')}
                                </div>
                                <p className="text-[11px] text-cream/40 mb-1">one-time payment · instant access</p>
                                <div className="inline-flex bg-green-500/10 border border-green-500/20 rounded-pill px-3 py-1 text-[11px] font-semibold text-green-400 mb-5">
                                    you save {savingsPercent}% off
                                </div>

                                <button
                                    onClick={handleEnroll}
                                    className="flex items-center justify-center w-full px-7 py-[15px] rounded-pill text-[15px] font-medium text-white mb-2.5 hover:-translate-y-px transition-transform cursor-pointer"
                                    style={{ background: 'linear-gradient(135deg,#5B4FD6,#1E8FE1)' }}
                                >
                                    ENROLL NOW →
                                </button>
                                <p className="text-[11px] text-cream/30">🔒 Secure Checkout · 100% Guarantee</p>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial */}
                    <div className="mt-4 bg-white border border-border rounded-2xl p-5 flex items-start gap-3">
                        <span className="text-yellow-400 text-lg">★</span>
                        <p className="text-[13px] text-ink-secondary italic leading-snug">
                            "The best investment I've made." — <span className="text-ink font-medium not-italic">Student, Mumbai</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* ── 3 Feature Highlights ── */}
            <section className="bg-ink py-20 px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
                    {[
                        { icon: '▶', title: 'Biweekly Video Updates', desc: 'Every two weeks, deep dives on what changed in each asset class — what\'s noise, what matters.' },
                        { icon: '📖', title: 'Written Analysis', desc: 'Frameworks applied to current events. Specific stocks, mutual funds, or economic shifts.' },
                        { icon: '👥', title: 'Live Q&A Sessions', desc: 'When something big happens, we go live. Get your questions answered directly.' },
                    ].map((item) => (
                        <div key={item.title}>
                            <div className="text-3xl mb-4">{item.icon}</div>
                            <h3 className="font-semibold text-cream text-[16px] mb-2">{item.title}</h3>
                            <p className="text-cream/50 text-[13px] leading-[1.7]">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Comparison Table ── */}
            <section className="max-w-4xl mx-auto px-6 py-20">
                <h2
                    className="font-serif font-black tracking-tighter text-center text-ink mb-3"
                    style={{ fontSize: 'clamp(28px,4vw,44px)' }}
                >
                    <em className="font-light italic">individual</em> vs bundle.
                </h2>
                <p className="text-center text-ink-secondary text-sm mb-10">Why 85% of our students choose the bundle.</p>

                <div className="rounded-2xl border border-border overflow-hidden">
                    {/* Header */}
                    <div className="grid grid-cols-3 bg-cream-dark px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-ink-secondary">
                        <span>Feature</span>
                        <span className="text-center">Individual Courses</span>
                        <span className="text-center text-sky">Bundle Access</span>
                    </div>

                    {comparisonRows.map((row, i) => (
                        <div
                            key={row.feature}
                            className={`grid grid-cols-3 px-6 py-4 text-sm border-t border-border ${i % 2 === 0 ? 'bg-white' : 'bg-cream'}`}
                        >
                            <span className="font-medium text-ink">{row.feature}</span>
                            <span className="text-center text-ink-secondary">{row.individual}</span>
                            <span className="text-center font-semibold text-ink">{row.bundle}</span>
                        </div>
                    ))}

                    {/* Total Row */}
                    <div className="grid grid-cols-3 px-6 py-4 border-t border-border bg-sky/5">
                        <span className="font-bold text-ink">Total Value</span>
                        <span className="text-center text-ink-secondary">₹{originalPrice.toLocaleString('en-IN')}+</span>
                        <span className="text-center font-bold text-sky">₹{price.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section className="py-20 px-6 text-center border-t border-border">
                <h2
                    className="font-serif font-black tracking-tighter text-ink mb-6"
                    style={{ fontSize: 'clamp(28px,5vw,52px)' }}
                >
                    Ready to master<br />
                    <em className="font-light italic">your money?</em>
                </h2>
                <p className="text-ink-secondary text-sm mb-8">Join 10,000+ students building institutional-grade portfolios.</p>
                <button
                    onClick={handleEnroll}
                    className="inline-flex items-center px-10 py-4 rounded-pill text-white font-medium text-[15px] hover:-translate-y-px transition-transform"
                    style={{ background: 'linear-gradient(135deg,#5B4FD6,#1E8FE1)' }}
                >
                    GET THE BUNDLE — ₹{price.toLocaleString('en-IN')} →
                </button>
                <div className="mt-4">
                    <button onClick={() => router.push('/')} className="text-sm text-ink-secondary hover:text-ink underline underline-offset-4">
                        Back to Home
                    </button>
                </div>
            </section>

        </div>
    );
}