/**
 * Type utilities for mapping Prisma models to front-end components
 * Maps database schema to component interfaces
 */

import { Course, Blog, Category, User } from "@prisma/client";

/**
 * Course with relations - used in API responses
 */
export type CourseWithRelations = Course & {
  category: Category;
};

/**
 * Blog with author - used in API responses
 */
export type BlogWithAuthor = Blog & {
  author: Pick<User, "id" | "name" | "email">;
};

/**
 * Frontend Course interface (used by CoursesSection component)
 */
export interface FrontendCourse {
  id: string | number;
  title: string;
  category: string;
  price: number;
  tagline: string;
  level: string;
  tag?: string;
  icon: string;
  thumbnail?: string;
  slug?: string;
  originalPrice?: number;
  description?: string;
  startDate?: Date | null;
}

/**
 * Frontend Blog interface (used by BlogSection component)
 */
export interface FrontendBlog {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  category: string;
  tag?: string;
  thumbnail?: string;
  author?: string;
  content?: string;
}

/**
 * Map Prisma Course with relations to Frontend Course interface
 * Used in /api/courses route
 */
export const mapCourseToFrontend = (
  course: CourseWithRelations,
  iconMap?: Record<string, string>
): FrontendCourse => {
  const defaultIconMap: Record<string, string> = {
    foundations: "ratios",
    equity: "trend",
    debt: "card",
    assets: "gold",
    credit: "card",
  };

  const icons = iconMap || defaultIconMap;
  const categoryName = course.category.name.toLowerCase();

  return {
    id: course.id,
    title: course.title,
    category: categoryName,
    price: course.price,
    tagline: course.subHeading || course.description || "",
    level: course.type === "LIVE" ? "intermediate" : "beginner",
    tag:
      course.status && course.status !== "Available"
        ? course.status
        : undefined,
    icon: icons[categoryName] || "ratios",
    thumbnail: course.thumbnail || undefined,
    slug: course.slug,
    originalPrice: course.originalPrice || undefined,
    description: course.description,
    startDate: course.startDate,
  };
};

/**
 * Map Prisma Blog with author to Frontend Blog interface
 * Used in /api/blogs route
 */
export const mapBlogToFrontend = (blog: BlogWithAuthor): FrontendBlog => {
  const wordsPerMinute = 200;
  const wordCount = blog.content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  const formattedDate = blog.createdAt.toLocaleDateString(
    "en-US",
    dateOptions
  );

  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    subtitle: blog.excerpt || blog.content.substring(0, 150),
    date: formattedDate,
    readTime: `${readTime} min`,
    category: blog.tags[0] || "general",
    tag: blog.tags[0] || undefined,
    thumbnail: blog.thumbnail || undefined,
    author: blog.author.name || "CashFlowCrew",
    content: blog.content,
  };
};
