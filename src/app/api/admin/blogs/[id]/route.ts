import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        const { id } = await params;

        if (!id) {
            return NextResponse.json({ message: "Blog ID is required" }, { status: 400 });
        }

        const blog = await dataBasePrisma.blog.findUnique({
            where: { id },
            include: { author: { select: { name: true, email: true } } },
        });

        if (!blog) {
            return NextResponse.json({ message: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, blog });
    } catch (error: any) {
        console.error("Get blog error:", error?.message || error);
        return NextResponse.json({ message: error?.message || "Server error" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        const { id } = await params;

        if (!id) {
            return NextResponse.json({ message: "Blog ID is required" }, { status: 400 });
        }

        const body = await req.json();
        const { title, slug, content, excerpt, thumbnail, isPublished, seoTitle, seoDesc, tags } = body;
        const updatedBlog = await dataBasePrisma.blog.update({
            where: { id },
            data: {
                title,
                slug,
                content,
                excerpt,
                thumbnail,
                isPublished,
                seoTitle,
                seoDesc,
                tags,
            },
        });

        return NextResponse.json({ success: true, blog: updatedBlog });
    } catch (error: any) {
        console.error("Update blog error:", error?.message || error);

        // Handle Prisma record not found error
        if (error?.code === 'P2025') {
            return NextResponse.json({ message: "Blog not found" }, { status: 404 });
        }

        // Handle Prisma unique constraint error
        if (error?.code === 'P2002') {
            return NextResponse.json({ message: "A blog with this slug already exists" }, { status: 400 });
        }

        return NextResponse.json({ message: error?.message || "Server error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        const { id } = await params;

        if (!id) {
            return NextResponse.json({ message: "Blog ID is required" }, { status: 400 });
        }

        await dataBasePrisma.blog.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: "Blog deleted successfully" });
    } catch (error: any) {
        console.error("Delete blog error:", error?.message || error);

        if (error?.code === 'P2025') {
            return NextResponse.json({ message: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json({ message: error?.message || "Server error" }, { status: 500 });
    }
}
