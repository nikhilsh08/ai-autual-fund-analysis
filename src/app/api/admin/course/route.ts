import { NextResponse } from "next/server";
import { auth } from "@/server/auth/auth";
import { prisma } from "@/lib/dbPrisma";

//create course only admin can create the courses
export async function POST(request: Request) {
  const user = await auth();

  if (!user || !user.user || user.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, price, thumbnail, category,type,startDate } = body;
    const tcCourseId = `${Math.floor(100000 + Math.random() * 900000)}`;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price,
        thumbnail,
        categoryId:category,
        tcCourseId,
        type,
        startDate: new Date(startDate),
      },
    });

    return NextResponse.json({success:true,course});
  } catch (error) {
    console.log("[COURSES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
}
}

// get single course 
export async function GET(request: Request) {
  const user = await auth();

  if (!user || !user.user || user.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("ID is required", { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: {
        id,
      },
    });

    return NextResponse.json({success:true, course});
  } catch (error) {
    console.log("[COURSE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// delete course 
export async function DELETE(request: Request) {
  const user = await auth();

  if (!user || !user.user || user.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("ID is required", { status: 400 });
    }

    const course = await prisma.course.deleteMany({
      where: {
        id,
      },
    });

    return NextResponse.json({success:true, course});
  } catch (error) {
    console.log("[COURSE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// update course startDate with time 
export async function PATCH(request: Request) {
  const user = await auth();

  if (!user || !user.user || user.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, startDate, startTime } = body;

    if (!id) {
      return new NextResponse("ID is required", { status: 400 });
    }

    const course = await prisma.course.update({
      where: {
        id,
      },
      data: {
        startDate: new Date(`${startDate}T${startTime}`),
      },
    });

    return NextResponse.json({success:true, course});
  } catch (error) {
    console.log("[COURSE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}










