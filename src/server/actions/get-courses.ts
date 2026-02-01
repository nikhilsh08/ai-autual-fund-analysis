'use server'

import { auth } from "@/server/auth/auth";
import {prisma} from "../../lib/dbPrisma"

// get all courses
export async function getCoursesAction() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' }
      ,
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
    const course = await prisma.course.findUnique({
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

