import { NextResponse } from "next/server";
import { auth } from "@/server/auth/auth";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { UTApi } from "uploadthing/server";

export async function GET(request: Request) {
    const user = await auth();

    if (!user || !user.user || user.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const images = await dataBasePrisma.image.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ success: true, images });
    } catch (error) {
        console.error("[IMAGES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

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

        const image = await dataBasePrisma.image.findUnique({
            where: { id }
        });

        if (!image) {
            return new NextResponse("Image not found", { status: 404 });
        }

        // 1. Delete from UploadThing
        const utapi = new UTApi();
        await utapi.deleteFiles(image.key);

        // 2. Delete from Database
        await dataBasePrisma.image.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: "Image deleted successfully" });
    } catch (error) {
        console.error("[IMAGE_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
