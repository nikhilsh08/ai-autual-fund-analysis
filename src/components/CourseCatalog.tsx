"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { BellRing, BookOpen } from "lucide-react";
import Link from "next/link";
import { courses, categories } from "@/data/courses";

export const CourseCatalog = () => {
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredCourses = activeCategory === "All"
        ? courses
        : courses.filter(course => course.category === activeCategory);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                        Practical Courses for Every Stage of Your Financial Journey
                    </h2>
                    <p className="text-zinc-600">
                        Select a category to find the right course for you
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category
                                    ? "bg-zinc-900 text-white shadow-md"
                                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.map((course) => (
                        <Link
                            href={`/courses/${course.slug}`}
                            key={course.id}
                            className="group flex flex-col bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-200"
                        >
                            {/* Thumbnail Placeholder */}
                            <div className="h-48 bg-zinc-100 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200 group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
                                    <BookOpen size={48} strokeWidth={1} />
                                </div>
                                <div className="absolute top-4 left-4">
                                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-zinc-800 text-xs font-medium px-2 py-0.5 rounded-md border-0 shadow-sm">
                                        {course.category}
                                    </Badge>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-zinc-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                        {course.title}
                                    </h3>
                                </div>

                                <p className="text-zinc-600 text-sm mb-6 flex-grow leading-relaxed">
                                    {course.oneLiner}
                                </p>

                                <div className="pt-4 border-t border-zinc-100 mt-auto flex items-center justify-between">
                                    {course.status === "Available" ? (
                                        <>
                                            <span className="text-lg font-bold text-zinc-900">
                                                {course.price}
                                            </span>
                                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                                                Enroll Now
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                                                Coming Soon
                                            </span>
                                            <Button variant="outline" size="sm" className="gap-2 text-zinc-600">
                                                <BellRing size={14} />
                                                Notify Me
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
};
