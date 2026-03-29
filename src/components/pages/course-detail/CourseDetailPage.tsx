"use client";

import { CourseNavigation } from "./components/CourseNavigation";
import { CourseHero } from "./components/CourseHero";
import { WhatYoullLearn } from "./components/WhatYoullLearn";
import { CourseTestimonials } from "./components/CourseTestimonials";
import { CourseCurriculum } from "./components/CourseCurriculum";
import { CourseInstructor } from "./components/CourseInstructor";
import { CoursePricing } from "./components/CoursePricing";
import { RelatedCourses } from "./components/RelatedCourses";
import { CourseGuarantee } from "./components/CourseGuarantee";
import { CourseFAQ } from "./components/CourseFAQ";
import { CourseReadyCTA } from "./components/CourseReadyCTA";
import { CourseFooter } from "./components/CourseFooter";
import PersonalisedHelp from "../home/components/PersonalisedHelp";

interface CourseDetailPageProps {
    course: any;
    relatedCourses: any[];
    bentoStyleList: string[] | { key: string; value: string[] | null }[];
    courseModules: string[] | { key: string; value: string[] | null }[];
    faqItems: string[] | { key: string; value: string[] | null }[];
    bundle: any;
}

export const CourseDetailPage = ({
    course,
    relatedCourses,
    bentoStyleList,
    courseModules,
    faqItems,
    bundle
}: CourseDetailPageProps) => {
    return (
        <div className="min-h-screen bg-cream font-sans [text-rendering:optimizeLegibility] [&_h1]:font-serif [&_h2]:font-serif [&_h3]:font-serif [&_h1]:tracking-tight [&_h2]:tracking-tight [&_h3]:tracking-tight">
            {/* Sticky Navigation */}
            <CourseNavigation courseId={course.id} price={course.price} />

            {/* Hero Section */}
            <section id="summary">
                <CourseHero course={course} />
            </section>

            {/* What You'll Learn */}
            <WhatYoullLearn curriculum={bentoStyleList as string[]} />

            {/* Testimonials */}
            <CourseTestimonials />

            {/* Curriculum / Modules */}
            <section id="modules">
                <CourseCurriculum
                    curriculum={courseModules as { key: string; value: string[] | null }[]}
                    duration={course.duration}
                />
            </section>


            {/* Instructor Section */}
            <CourseInstructor />

            {/* Pricing Section */}
            <section id="get-started">
                <CoursePricing
                    courseId={course.id}
                    price={course.price}
                    originalPrice={course.originalPrice}
                    duration={course.duration}
                    bundle={bundle}
                />
            </section>

            {/* Related Courses */}
            {relatedCourses.length > 0 && (
                <RelatedCourses courses={relatedCourses} />
            )}

            {/* Money-Back Guarantee */}
            <CourseGuarantee />

            {/* Need Help Section */}
            <PersonalisedHelp />

            {/* And Much More */}


            {/* Ready CTA */}
            <CourseReadyCTA
                courseId={course.id}
                price={course.price}
            />


            {/* FAQ Section */}
            <section id="faqs">
                <CourseFAQ faqsItems={faqItems} />
            </section>

            {/* Footer with Disclaimer */}
            <CourseFooter />

        </div>
    );
};
