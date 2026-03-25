import { NextResponse } from "next/server";
import { auth } from "@/server/auth/auth";
import { dataBasePrisma as prisma } from "@/lib/dbPrisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session || !session.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;

        const order = await prisma.order.findUnique({
            where: {
                id,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                items: {
                    include: {
                        course: {
                            select: {
                                title: true,
                                price: true,
                            },
                        },
                    },
                },
                bundleItems: {
                    include: {
                        bundle: {
                            select: {
                                name: true,
                                slug: true,
                                price: true,
                                originalPrice: true,
                                courseIds: true,
                            },
                        },
                    },
                },
                paymentTransaction: true,
                lead: true
            },
        });

        if (!order) {
            return new NextResponse("Order not found", { status: 404 });
        }

        const courseToBundleNames = new Map<string, Set<string>>();

        for (const bundleItem of order.bundleItems || []) {
            const bundleName = bundleItem.bundle?.name || "Bundle";
            for (const courseId of bundleItem.bundle?.courseIds || []) {
                const existing = courseToBundleNames.get(courseId) || new Set<string>();
                existing.add(bundleName);
                courseToBundleNames.set(courseId, existing);
            }
        }

        const bundleCourseIds = Array.from(courseToBundleNames.keys());
        const bundleCourses = bundleCourseIds.length > 0
            ? await prisma.course.findMany({
                where: { id: { in: bundleCourseIds } },
                select: { id: true, title: true, price: true },
            })
            : [];

        const purchasedCourseDetails = [
            ...(order.items || []).map((item) => ({
                id: item.courseId,
                title: item.course?.title || "Untitled Course",
                price: item.price,
                source: "DIRECT" as const,
                bundleNames: [] as string[],
            })),
            ...bundleCourses.map((course) => ({
                id: course.id,
                title: course.title,
                price: course.price,
                source: "BUNDLE" as const,
                bundleNames: Array.from(courseToBundleNames.get(course.id) || []),
            })),
        ];

        return NextResponse.json({
            ...order,
            purchasedCourseDetails,
        });
    } catch (error) {
        console.log("[ORDER_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
