import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/server/auth/auth";
import { dataBasePrisma } from "@/lib/dbPrisma";
import cloudinary from "@/lib/cloudinary";

export async function GET(request: Request) {
    const user = await auth();

    if (!user || !user.user || user.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const token = (await cookies()).get("authjs.session-token")?.value;
    try {
        const images = await dataBasePrisma.image.findMany({
            where: {
                provider: "CLOUDINARY"
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ success: true, images, token });
    } catch (error) {
        console.error("[CLOUDINARY_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(request: Request) {
    const user = await auth();

    if (!user || !user.user || user.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new NextResponse("File is required", { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'admin_uploads',
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            ).end(buffer);
        }) as any;

        const image = await dataBasePrisma.image.create({
            data: {
                url: uploadResult.secure_url,
                key: uploadResult.public_id,
                name: file.name,
                provider: "CLOUDINARY"
            }
        });

        return NextResponse.json({ success: true, image });
    } catch (error) {
        console.error("[CLOUDINARY_POST]", error);
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

        if (!image || image.provider !== "CLOUDINARY") {
            return new NextResponse("Cloudinary Image not found", { status: 404 });
        }

        // 1. Delete from Cloudinary
        await cloudinary.uploader.destroy(image.key);

        // 2. Delete from Database
        await dataBasePrisma.image.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: "Image deleted successfully" });
    } catch (error) {
        console.error("[CLOUDINARY_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
