'use server'
import { prisma } from "@/lib/dbPrisma";

export async function getUpsellRecommendations(currentCourseIds: string[]) {
  // If no items in cart/checkout, return nothing
  if (!currentCourseIds || currentCourseIds.length === 0) return [];

  try {
    // 1. Get the categories of the items the user is currently buying
    const currentCourses = await prisma.course.findMany({
      where: {
        id: { in: currentCourseIds }
      },
      select: {
        categoryId: true
      }
    });
    
    // Extract unique Category IDs (e.g., ["coding-id", "design-id"])
    const categoryIds = [...new Set(currentCourses.map(c => c.categoryId))];

    if (categoryIds.length === 0) return [];

    // 2. Find other courses in the same categories
    const recommendations = await prisma.course.findMany({
      where: {
        isPublished: true,
        categoryId: { in: categoryIds }, // Match the category
        id: { notIn: currentCourseIds }  // EXCLUDE items they are already buying
      },
      take: 1, // We only need 1 for the Upsell Card
      orderBy: {
        price: 'desc', // Suggest higher value courses
      },
      select: {
        id: true,
        title: true,
        price: true,
        thumbnail: true,
      }
    });

    return recommendations;
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
    return [];
  }
}