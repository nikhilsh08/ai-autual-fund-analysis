"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { BellRing, BookOpen, ShoppingCart, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
    category: string | { name: string };
    price: number;
    status: string;
    oneLiner?: string | null;
    description?: string;
    thumbnail?: string | null;
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
            type: 'course',
        }, isLoggedIn);
    };

    return (
        <section className="py-20 bg-card">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-serif text-ink mb-4">
                        Practical Courses for Every Stage of Your Financial Journey
                    </h2>
                    <p className="text-ink-secondary">
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
                                    ? "bg-ink text-cream shadow-md"
                                    : "bg-cream-dark text-ink-secondary hover:bg-cream-darkest"
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
                            <div key={course.id} className="relative group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-accent/30 cursor-pointer" onClick={() => router.push(courseUrl)}>
                                {/* Thumbnail Placeholder */}
                                <div className="h-48 bg-cream-dark relative overflow-hidden flex-shrink-0">
                                    {course.thumbnail ? (
                                        <Image
                                            src={course.thumbnail}
                                            alt={course.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-br from-cream-dark to-cream-darkest group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute inset-0 flex items-center justify-center text-ink-muted">
                                                <BookOpen size={48} strokeWidth={1} />
                                            </div>
                                        </>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm text-ink text-xs font-medium px-2 py-0.5 rounded-md border-0 shadow-sm">
                                            {catName}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-ink line-clamp-2 leading-tight group-hover:text-accent transition-colors">
                                            {course.title}
                                        </h3>
                                    </div>

                                    <p className="text-ink-secondary text-sm mb-6 flex-grow leading-relaxed">
                                        {course.oneLiner || course.description || "Learn the ins and outs of this topic."}
                                    </p>

                                    {/* Action Footer */}
                                    <div className="pt-4 border-t border-border mt-auto flex items-center justify-between z-10">
                                        {course.status === "Available" ? (
                                            <>
                                                <span className="text-lg font-bold text-ink">
                                                    ₹{course.price}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <Button size="icon" variant="outline" className="h-9 w-9 text-accent border-accent/30 hover:bg-accent-light" onClick={(e) => handleAddToCart(e, course)}>
                                                        <ShoppingCart size={16} />
                                                    </Button>
                                                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-white" onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(courseUrl); }}>
                                                        Enroll Now
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-sm font-medium text-gold bg-gold/10 px-3 py-1 rounded-full">
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
