import { getCourseBySlugAction } from "@/server/actions/get-courses";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, BookOpen, Clock, BarChart, BellRing } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

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
            title: "Course Not Found",
        };
    }

    return {
        title: `${course.title} | CashFlowCrew`,
        description: course.oneLiner,
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
            <section className="pt-32 pb-16 bg-zinc-50 border-b border-zinc-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        <div className="flex-1">
                            <Link href="/courses" className="text-sm text-zinc-500 hover:text-blue-600 mb-6 inline-block">
                                ← Back to Courses
                            </Link>
                            <div className="flex items-center gap-3 mb-6">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                    {categoryName}
                                </Badge>
                                {course.status === "Coming Soon" && (
                                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Coming Soon</Badge>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                                {course.title}
                            </h1>
                            <p className="text-xl text-zinc-600 mb-8 leading-relaxed">
                                {course.oneLiner}
                            </p>

                            <div className="flex items-center gap-6 text-sm text-zinc-500 mb-8">
                                <div className="flex items-center gap-2">
                                    <Clock size={18} />
                                    <span>Self-Paced</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BarChart size={18} />
                                    <span>Beginner to Advanced</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BookOpen size={18} />
                                    <span>Lifetime Access</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                {course.status === "Available" ? (
                                    <>
                                        <Button size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700">
                                            Enroll Now — {course.price}
                                        </Button>
                                    </>
                                ) : (
                                    <Button size="lg" variant="outline" className="h-12 px-8 text-base gap-2">
                                        <BellRing size={18} />
                                        Notify Me When Available
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Visual/Sidebar */}
                        <div className="w-full md:w-1/3">
                            <div className="aspect-video bg-zinc-200 rounded-2xl flex items-center justify-center text-zinc-400">
                                <span className="text-sm">Course Preview / Thumbnail</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">

                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-zinc-900 mb-6">About This Course</h2>
                        <div className="prose prose-zinc max-w-none text-zinc-600 leading-relaxed">
                            <p>{course.description}</p>
                        </div>
                    </div>

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

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
                        <h3 className="text-xl font-bold text-zinc-900 mb-4">Ready to start your journey?</h3>
                        <p className="text-zinc-600 mb-6">Join thousands of students mastering their finances with CashFlowCrew.</p>
                        {course.status === "Available" ? (
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                                Get Instant Access — {course.price}
                            </Button>
                        ) : (
                            <Button variant="outline">
                                Get Notified
                            </Button>
                        )}
                    </div>

                </div>
            </section>
        </>
    );
}
