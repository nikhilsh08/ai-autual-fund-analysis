'use server'

import { dataBasePrisma } from "@/lib/dbPrisma";
import { mapBlogToFrontend } from "@/lib/typeUtils";

/**
 * Get all published blog posts for the home page
 * Server action that fetches and maps blogs to frontend format
 */
export async function getHomePageBlogsAction() {
  try {
    const blogs = await dataBasePrisma.blog.findMany({
      where: {
        isPublished: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5, // Limit to 5 most recent articles for performance
    });

    return blogs.map((blog) => mapBlogToFrontend(blog));
  } catch (error) {
    console.error("Home page blogs fetch error:", error);
    return [];
  }
}

/**
 * Get a single blog by slug for the modal/detail view
 */
export async function getBlogBySlugAction(slug: string) {
  try {
    const blog = await dataBasePrisma.blog.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!blog) return null;
    return mapBlogToFrontend(blog);
  } catch (error) {
    console.error(`Blog fetch error for slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get featured blog (most recent)
 */
export async function getFeaturedBlogAction() {
  try {
    const blog = await dataBasePrisma.blog.findFirst({
      where: {
        isPublished: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!blog) return null;
    return mapBlogToFrontend(blog);
  } catch (error) {
    console.error("Featured blog fetch error:", error);
    return null;
  }
}
