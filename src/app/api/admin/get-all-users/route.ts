import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
    const admin = await verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';
        const filterBy = searchParams.get('filterBy') || 'all';

        const where: Prisma.UserWhereInput = {};

        // Search
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } }, // firstName/lastName combined in our schema
                { phone: { contains: search, mode: 'insensitive' } },
                // Order ID search would require relation filtering or separate query, simplified to user fields for now
                // or we can search orders and get users... keeping simple for performance or adding relation filter:
                { orders: { some: { orderId: { contains: search, mode: 'insensitive' } } } }
            ];
        }

        // Filter by payment status (transaction present/success)
        // User snippet uses "transaction=true/false" boolean on User.
        // Our schema relies on orders or purchases.
        // "success" -> has purchases? or has PAID order?
        // "pending" -> has PENDING order and NO purchases?
        if (filterBy === 'success') {
            where.purchases = { some: {} }; // Has at least one purchase
        } else if (filterBy === 'pending') {
            // Has orders but no purchases? Or just "not success"?
            // Simplifying to: Has PENDING order.
            where.orders = { some: { status: 'PENDING' } };
        }

        const [users, total] = await Promise.all([
            dataBasePrisma.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { [sortBy === 'firstName' ? 'name' : sortBy]: sortOrder }, // Map firstName to name
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    createdAt: true,
                    image: true,
                    // Include basic order info or purchases to determine status in frontend?
                    purchases: { select: { id: true } },
                    orders: { select: { id: true, status: true, totalAmount: true } }
                }
            }),
            dataBasePrisma.user.count({ where })
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            users: users.map(u => ({
                ...u,
                firstName: u.name?.split(' ')[0] || '',
                lastName: u.name?.split(' ').slice(1).join(' ') || '',
                transaction: u.purchases.length > 0 // Map to snippet's "transaction" boolean
            })),
            pagination: {
                currentPage: page,
                totalPages,
                totalUsers: total,
                hasNext: page < totalPages,
                hasPrev: page > 1,
                limit
            }
        });

    } catch (error) {
        console.error("Get all users error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
