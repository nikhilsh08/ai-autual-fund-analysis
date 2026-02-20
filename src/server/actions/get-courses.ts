'use server'

import { auth } from "@/server/auth/auth";
import { dataBasePrisma } from "../../lib/dbPrisma"

// get all courses
export async function getCoursesAction() {
  try {
    const courses = await dataBasePrisma.course.findMany({
      where: {
        visibility: 'show'
      },
      orderBy: [
        { status: 'asc' }, // "Available" comes before "Coming Soon" alphabetically
        { createdAt: 'desc' }
      ],
      include: {
        category: true,
      }
    });

    return courses;
  } catch (error) {
    console.error("Courses fetch error:", error);
    return [];
  }
}

//get single course by id
export async function getCourseByIdAction(id: string) {
  try {
    const course = await dataBasePrisma.course.findUnique({
      where: { id },
      include: {
        category: true,
      }
    });

    return course;
  } catch (error) {
    console.error(`Course fetch error for id ${id}:`, error);
    return null;
  }
}

export async function getCourseBySlugAction(slug: string) {
  try {
    // Try finding by staticRoute first
    const byStaticRoute = await dataBasePrisma.course.findFirst({
      where: { staticRoute: slug },
      include: { category: true }
    });
    if (byStaticRoute) return byStaticRoute;

    // Try finding by slug
    const bySlug = await dataBasePrisma.course.findUnique({
      where: { slug },
      include: { category: true }
    });
    if (bySlug) return bySlug;

    // Try finding by ID (only if it looks like an ObjectId)
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      const byId = await dataBasePrisma.course.findUnique({
        where: { id: slug },
        include: { category: true }
      });
      if (byId) return byId;
    }

    return null;
  } catch (error) {
    console.error(`Course fetch error for slug ${slug}:`, error);
    return null;
  }
}

