import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin";

export async function GET(req: Request) {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        const blogs = await dataBasePrisma.blog.findMany({
            orderBy: { createdAt: "desc" },
            include: { author: { select: { name: true, email: true } } },
        });

        return NextResponse.json({ success: true, blogs });
    } catch (error: any) {
        console.error("Fetch blogs error:", error?.message || error);
        return NextResponse.json({ message: error?.message || "Server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        const body = await req.json();
        const { title, slug, content, excerpt, thumbnail, isPublished, seoTitle, seoDesc, tags } = body;

        if (!title || !slug || !content) {
            return NextResponse.json({ message: "Title, slug, and content are required" }, { status: 400 });
        }

        // Use the admin's user ID as the author
        const authorId = admin.id;

        const newBlog = await dataBasePrisma.blog.create({
            data: {
                title,
                slug,
                content,
                excerpt,
                thumbnail,
                authorId,
                isPublished: isPublished ?? true,
                seoTitle,
                seoDesc,
                tags: tags || [],
            },
        });

        return NextResponse.json({ success: true, blog: newBlog }, { status: 201 });
    } catch (error: any) {
        console.error("Create blog error:", error?.message || error);

        // Handle Prisma unique constraint error
        if (error?.code === 'P2002') {
            return NextResponse.json({ message: "A blog with this slug already exists" }, { status: 400 });
        }

        return NextResponse.json({ message: error?.message || "Server error" }, { status: 500 });
    }
}
