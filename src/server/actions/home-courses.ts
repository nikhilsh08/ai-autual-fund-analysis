'use server'

import { dataBasePrisma } from "@/lib/dbPrisma";
import { mapCourseToFrontend } from "@/lib/typeUtils";

/**
 * Get all published courses for the home page
 * Server action that fetches and maps courses to frontend format
 */
export async function getHomePageCoursesAction() {
  try {
    const courses = await dataBasePrisma.course.findMany({
      where: {
        isPublished: true,
        visibility: 'show'
      },
      include: {
        category: true,
      },
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' }
      ],
    });

    // Map Prisma courses to frontend format
    return courses.map((course) => mapCourseToFrontend(course));
  } catch (error) {
    console.error("Home page courses fetch error:", error);
    return [];
  }
}

/**
 * Get published courses by category
 * Useful for filtering on the home page
 */
export async function getCoursesByCategoryAction(categoryName: string) {
  try {
    const courses = await dataBasePrisma.course.findMany({
      where: {
        isPublished: true,
        visibility: 'show',
        category: {
          name: categoryName
        }
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
    });

    return courses.map((course) => mapCourseToFrontend(course));
  } catch (error) {
    console.error(`Courses fetch error for category ${categoryName}:`, error);
    return [];
  }
}

/**
 * Get category list for filtering
 */
export async function getCategoriesAction() {
  try {
    const categories = await dataBasePrisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return categories;
  } catch (error) {
    console.error("Categories fetch error:", error);
    return [];
  }
}
