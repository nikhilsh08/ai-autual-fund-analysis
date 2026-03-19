"use client";

import { CourseNavigation } from "./components/CourseNavigation";
import { CourseHero } from "./components/CourseHero";
import { WhatYoullLearn } from "./components/WhatYoullLearn";
import { CourseTestimonials } from "./components/CourseTestimonials";
import { CourseCurriculum } from "./components/CourseCurriculum";
import { WhatYouWalkAway } from "./components/WhatYouWalkAway";
import { CourseInstructor } from "./components/CourseInstructor";
import { CoursePricing } from "./components/CoursePricing";
import { RelatedCourses } from "./components/RelatedCourses";
import { CourseGuarantee } from "./components/CourseGuarantee";
import { CourseAndMore } from "./components/CourseAndMore";
import { CourseFAQ } from "./components/CourseFAQ";
import { CourseReadyCTA } from "./components/CourseReadyCTA";

interface CourseDetailPageProps {
    course: any;
    relatedCourses: any[];
}

export const CourseDetailPage = ({ course, relatedCourses }: CourseDetailPageProps) => {
    return (
        <div className="min-h-screen bg-cream">
            {/* Sticky Navigation */}
            <CourseNavigation courseId={course.id} price={course.price} />

            {/* Hero Section */}
            <section id="summary">
                <CourseHero course={course} />
            </section>

            {/* What You'll Learn */}
            <WhatYoullLearn curriculum={course.curriculum} />

            {/* Testimonials */}
            <CourseTestimonials />

            {/* Curriculum / Modules */}
            <section id="modules">
                <CourseCurriculum
                    curriculum={course.curriculum}
                    duration={course.duration}
                />
            </section>

            {/* What You Walk Away With */}
            <WhatYouWalkAway />

            {/* Instructor Section */}
            <CourseInstructor />

            {/* Pricing Section */}
            <section id="get-started">
                <CoursePricing
                    courseId={course.id}
                    price={course.price}
                    originalPrice={course.originalPrice}
                    duration={course.duration}
                />
            </section>

            {/* Related Courses */}
            {relatedCourses.length > 0 && (
                <RelatedCourses courses={relatedCourses} />
            )}

            {/* Money-Back Guarantee */}
            <CourseGuarantee />

            {/* And Much More */}
            <CourseAndMore />

            {/* FAQ Section */}
            <section id="faqs">
                <CourseFAQ />
            </section>

            {/* Ready CTA */}
            <CourseReadyCTA
                courseId={course.id}
                price={course.price}
            />
        </div>
    );
};
