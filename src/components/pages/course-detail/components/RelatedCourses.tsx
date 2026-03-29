"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface RelatedCoursesProps {
    courses: any[];
}

export const RelatedCourses = ({ courses }: RelatedCoursesProps) => {
    if (!courses || courses.length === 0) return null;

    return (
        <section className="py-16 px-4 sm:px-6 bg-cream-dark">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <p className="text-accent font-bold uppercase tracking-widest text-sm mb-2">
                        Keep Learning
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold font-serif text-ink">
                        {courses.length} more beginner-level courses
                    </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                    {courses.map((course) => (
                        <Link
                            key={course.id}
                            href={`/courses/${course.slug || course.id}`}
                            className="group"
                        >
                            <div className="bg-white rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all hover:-translate-y-1">
                                {/* Thumbnail */}
                                {course.thumbnail && (
                                    <div className="relative h-40 bg-cream-darkest">
                                        <Image
                                            src={course.thumbnail}
                                            alt={course.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="font-semibold text-ink mb-2 group-hover:text-accent transition-colors">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-ink-secondary line-clamp-2 mb-4">
                                        {course.oneLiner || course.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-ink">
                                            ₹{course.price?.toLocaleString("en-IN")}
                                        </span>
                                        <span className="text-accent text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                            View course
                                            <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
