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
                paymentTransaction: true,
                lead: true
            },
        });

        if (!order) {
            return new NextResponse("Order not found", { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.log("[ORDER_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
