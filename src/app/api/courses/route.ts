import { prisma } from "@/lib/prisma";
import { mapCourseToFrontend } from "@/lib/typeUtils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map Prisma courses to frontend format using utility function
    const mappedCourses = courses.map((course) =>
      mapCourseToFrontend(course)
    );

    return NextResponse.json(mappedCourses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
