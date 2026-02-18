import { NextResponse } from "next/server";
import { auth } from "@/server/auth/auth";
import { dataBasePrisma as prisma } from "@/lib/dbPrisma";

export async function GET(request: Request) {
    try {
        const session = await auth();

        if (!session || !session.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const orders = await prisma.order.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                items: {
                    include: {
                        course: {
                            select: {
                                title: true,
                            },
                        },
                    },
                },
                paymentTransaction: true
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.log("[ORDERS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
