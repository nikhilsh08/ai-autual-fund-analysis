import { prisma } from "@/lib/prisma";
import { mapBlogToFrontend } from "@/lib/typeUtils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
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
        createdAt: "desc",
      },
    });

    // Map Prisma blogs to frontend format using utility function
    const mappedBlogs = blogs.map((blog) => mapBlogToFrontend(blog));

    return NextResponse.json(mappedBlogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
