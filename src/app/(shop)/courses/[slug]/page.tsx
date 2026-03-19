export const dynamic = 'force-dynamic';

import { getCourseBySlugAction, getCoursesAction } from "@/server/actions/get-courses";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { siteConfig } from "@/config/seo";
import { CourseDetailPage } from "@/components/pages/course-detail/CourseDetailPage";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const course = await getCourseBySlugAction(slug) as any;

    if (!course) {
        return {
            title: "Course Not Found | CashFlowCrew",
        };
    }

    const ogUrl = `${siteConfig.url}/courses/${slug}`;
    const ogImage = course.thumbnail || siteConfig.ogImage;

    return {
        title: `${course.title} | CashFlowCrew`,
        description: course.oneLiner,
        openGraph: {
            title: `${course.title} | CashFlowCrew`,
            description: course.oneLiner || siteConfig.description,
            url: ogUrl,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: course.title,
                },
            ],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${course.title} | CashFlowCrew`,
            description: course.oneLiner || siteConfig.description,
            images: [ogImage],
        },
    };
}

export default async function CoursePage({ params }: Props) {
    const { slug } = await params;
    const course = await getCourseBySlugAction(slug) as any;

    if (!course) {
        notFound();
    }

    // Fetch related courses for the "More courses" section
    const allCourses = await getCoursesAction() as any[];
    const relatedCourses = allCourses
        .filter(c => c.id !== course.id)
        .slice(0, 2);

    return (
        <CourseDetailPage
            course={course}
            relatedCourses={relatedCourses}
        />
    );
}
