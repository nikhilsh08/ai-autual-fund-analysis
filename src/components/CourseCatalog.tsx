"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { BellRing, BookOpen, ShoppingCart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { NotifyCourseButton } from "./NotifyCourseButton";

export interface CourseData {
    id: string;
    title: string;
    slug: string;
    staticRoute?: string | null;
    category: any; // Can be string (old) or object (db)
    price: number;
    status: string;
    oneLiner?: string | null;
    description?: string;
}

interface CourseCatalogProps {
    courses: CourseData[];
    categories: string[];
}

export const CourseCatalog = ({ courses = [], categories = [] }: CourseCatalogProps) => {
    const [activeCategory, setActiveCategory] = useState("All");
    const { data: session } = useSession();
    const isLoggedIn = !!session?.user;
    const addItem = useCartStore((state) => state.addItem);
    const router = useRouter();

    const filteredCourses = activeCategory === "All"
        ? courses
        : courses.filter(course => {
            const catName = typeof course.category === 'string' ? course.category : course.category?.name || "Uncategorized";
            return catName === activeCategory;
        });

    const handleAddToCart = async (e: React.MouseEvent, course: CourseData) => {
        // Prevent clicking the Link
        e.preventDefault();
        e.stopPropagation();

        await addItem({
            id: course.id,
            title: course.title,
            price: course.price,
        }, isLoggedIn);
    };

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
                {categories.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mb-12">
                        {["All", ...categories].map((category) => (
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
                )}

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.map((course) => {
                        const catName = typeof course.category === 'string' ? course.category : course.category?.name || "Uncategorized";
                        // Determine route
                        const courseUrl = course.staticRoute ? `/${course.staticRoute}` : `/courses/${course.slug}`;

                        return (
                            <div key={course.id} className="relative group flex flex-col bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-200 cursor-pointer" onClick={() => router.push(courseUrl)}>
                                {/* Thumbnail Placeholder */}
                                <div className="h-48 bg-zinc-100 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200 group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
                                        <BookOpen size={48} strokeWidth={1} />
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-zinc-800 text-xs font-medium px-2 py-0.5 rounded-md border-0 shadow-sm">
                                            {catName}
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
                                        {course.oneLiner || course.description || "Learn the ins and outs of this topic."}
                                    </p>

                                    {/* Action Footer */}
                                    <div className="pt-4 border-t border-zinc-100 mt-auto flex items-center justify-between z-10">
                                        {course.status === "Available" ? (
                                            <>
                                                <span className="text-lg font-bold text-zinc-900">
                                                    ₹{course.price}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <Button size="icon" variant="outline" className="h-9 w-9 text-blue-600 border-blue-200 hover:bg-blue-50" onClick={(e) => handleAddToCart(e, course)}>
                                                        <ShoppingCart size={16} />
                                                    </Button>
                                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(courseUrl); }}>
                                                        Enroll Now
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                                                    Coming Soon
                                                </span>
                                                <NotifyCourseButton courseId={course.id} />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};
