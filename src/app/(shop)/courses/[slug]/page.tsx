
export const dynamic = 'force-dynamic';
import { getCourseBySlugAction } from "@/server/actions/get-courses";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, BookOpen, Clock, BarChart, BellRing } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { NotifyCourseButton } from "@/components/NotifyCourseButton";
import { siteConfig } from "@/config/seo";
import Image from "next/image";
import { Instructor } from "@/components/Instructor";
import { FAQ } from "@/components/FAQ";
import { V2Disclaimer } from "@/components/templates/ai-mutual-fund-v2/components/V2Disclaimer";
import { V2Pricing } from "@/components/templates/ai-mutual-fund-v2/components/V2Pricing";
import { V2Credibility } from "@/components/templates/ai-mutual-fund-v2/components/V2Credibility";

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
            type: "website", // Or 'article' based on content
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
    const categoryName = typeof course?.category === 'object' ? course.category.name : course?.category || 'Uncategorized';

    if (!course) {
        notFound();
    }

    return (
        <>
            {/* Hero Section */}
            <section className={`pt-32 pb-16 border-b ${course.thumbnail ? "relative overflow-hidden border-zinc-800" : "bg-zinc-50 border-zinc-200"}`}>
                {course.thumbnail && (
                    <>
                        <Image
                            src={course.thumbnail}
                            alt={course.title || "Course Thumbnail"}
                            fill
                            className="object-cover"
                            priority
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-black/55" />
                    </>
                )}

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="max-w-4xl">
                        <Link
                            href="/courses"
                            className={`text-sm mb-6 inline-block ${course.thumbnail ? "text-white/80 hover:text-white" : "text-zinc-500 hover:text-blue-600"}`}
                        >
                            ← Back to Courses
                        </Link>
                        <div className="flex items-center gap-3 mb-6">
                            <Badge
                                variant="secondary"
                                className={course.thumbnail ? "bg-white/20 text-white hover:bg-white/20" : "bg-blue-100 text-blue-700 hover:bg-blue-100"}
                            >
                                {categoryName}
                            </Badge>
                            {course.status === "Coming Soon" && (
                                <Badge
                                    variant="outline"
                                    className={course.thumbnail ? "text-amber-200 border-amber-200/50 bg-amber-500/20" : "text-amber-600 border-amber-200 bg-amber-50"}
                                >
                                    Coming Soon
                                </Badge>
                            )}
                        </div>
                        <h1 className={`text-3xl md:text-5xl font-bold mb-6 leading-tight ${course.thumbnail ? "text-white" : "text-zinc-900"}`}>
                            {course.title}
                        </h1>
                        <p className={`text-xl mb-8 leading-relaxed ${course.thumbnail ? "text-white/90" : "text-zinc-600"}`}>
                            {course.oneLiner}
                        </p>

                        <div className={`flex items-center gap-6 text-sm mb-8 ${course.thumbnail ? "text-white/85" : "text-zinc-500"}`}>
                            <div className="flex items-center gap-2">
                                <Clock size={18} />
                                <span>Self-Paced</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BarChart size={18} />
                                <span>Beginner to Advanced</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {course.status === "Available" ? (
                                <Button size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700">
                                    Enroll Now — {course.price}
                                </Button>
                            ) : (
                                <NotifyCourseButton
                                    courseId={course.id}
                                    variant="outline"
                                    size="lg"
                                    className={course.thumbnail ? "h-12 px-8 text-base gap-2 border-white text-white hover:bg-white hover:text-zinc-900" : "h-12 px-8 text-base gap-2"}
                                    text="Notify Me When Available"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    {course.content ? (
                        <div className="mx-auto max-w-3xl px-6 pt-16 lg:px-8">
                            <h2 className="text-2xl font-bold text-zinc-900 mb-6">About This Course</h2>
                            <div
                                className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-300
                                [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:text-gray-900 [&>h2]:dark:text-white
                                [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:text-gray-900 [&>h3]:dark:text-white
                                [&>p]:mt-0 [&>p]:mb-6 [&>p]:leading-relaxed
                                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6
                                [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6
                                [&>li]:mb-2
                                [&>blockquote]:border-l-4 [&>blockquote]:border-gray-200 [&>blockquote]:dark:border-zinc-700 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>blockquote]:dark:text-gray-400
                                [&>img]:rounded-xl [&>img]:my-8 [&>img]:w-full [&>img]:shadow-lg
                                [&>a]:text-blue-600 [&>a]:dark:text-blue-400 [&>a]:underline [&>a]:hover:text-blue-500
                                "
                                dangerouslySetInnerHTML={{ __html: course.content }}
                            />
                        </div>
                    ) : (
                        <div className="mb-16">
                            <h2 className="text-3xl font-bold text-zinc-900 mb-6">About This Course</h2>
                            <div className="prose prose-zinc max-w-none text-zinc-600 leading-relaxed">
                                <p>{course.description}</p>
                            </div>
                        </div>
                    )}

                    {course.curriculum && (
                        <div className="mb-16">
                            <h2 className="text-2xl font-bold text-zinc-900 mb-6">What You'll Learn</h2>
                            <div className="grid gap-4">
                                {course.curriculum.map((item: string, i: number) => (
                                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-zinc-100 bg-zinc-50">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                                        <span className="text-zinc-700 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
                        <h3 className="text-xl font-bold text-zinc-900 mb-4">Ready to start your journey?</h3>
                        <p className="text-zinc-600 mb-6">Join thousands of students mastering their finances with CashFlowCrew.</p>
                        {course.status === "Available" ? (
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                                Get Instant Access — {course.price}
                            </Button>
                        ) : (
                            <NotifyCourseButton
                                courseId={course.id}
                                variant="outline"
                                text="Get Notified"
                            />
                        )}
                    </div> */}

                </div>
            </section>

            {/* Credibility */}
            <V2Credibility />

            {/* Pricing */}
            <V2Pricing
                courseId={course.id}
                price={course.price}
                originalPrice={course.originalPrice}
                startDate={course.startDate}
                duration={course.duration}
                type={course.type}
            />
            {/* Disclaimer */}
             <V2Disclaimer />

        </>
    );
}
