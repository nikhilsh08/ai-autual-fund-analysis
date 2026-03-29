import { NextResponse } from "next/server";
import { auth } from "@/server/auth/auth";
import { dataBasePrisma as prisma } from "@/lib/dbPrisma";


// get all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


// create category 
export async function POST(request: Request) {
  const user = await auth();
  console.log(user)

  if (!user || !user.user || user.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { name } = body;
    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.log("[CATEGORY_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// update category 
export async function PATCH(request: Request) {
  const user = await auth();
  console.log(user)

  if (!user || !user.user || user.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name } = body;

    if (!id) {
      return new NextResponse("ID is required", { status: 400 });
    }

    const category = await prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

