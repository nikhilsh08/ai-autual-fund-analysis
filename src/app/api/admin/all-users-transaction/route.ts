import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin";
import { PaymentTransaction, User } from "@prisma/client";

export async function GET(req: Request) {
    const admin = await verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    try {
        // 1. Successful Transactions (PaymentTransaction status = SUCCESS)
        // Note: User schema uses "status" in PaymentTransaction.
        const transactionsSuccess = await dataBasePrisma.paymentTransaction.findMany({
            where: { status: "SUCCESS" },
            orderBy: { createdAt: "desc" },
            include: {
                order: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                                phone: true
                            }
                        }
                    }
                }
            }
        });
        // console.log("transactionsSuccess", transactionsSuccess);

        // 2. Failed Transactions (PaymentTransaction status != SUCCESS)
        const transactionsFailed = await dataBasePrisma.paymentTransaction.findMany({
            where: { status: { not: "SUCCESS" } },
            orderBy: { createdAt: "desc" },
            include: {
                order: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                                phone: true
                            }
                        }
                    }
                }
            }
        });

        // 3. All Transactions
        const allTransactions = await dataBasePrisma.paymentTransaction.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                order: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                                phone: true
                            }
                        }
                    }
                }
            }
        });


        // 4. Unprocessed Transactions (Users with PENDING orders? Or Orders that are pending?)
        // The user code checks "User.transactionStatus: PENDING".
        // Our User model does not have 'transactionStatus'.
        // However, Order has 'status: PENDING'.
        // Let's fetch PENDING orders as a proxy for "Unprocessed Transactions".
        const pendingOrders = await dataBasePrisma.order.findMany({
            where: { status: "PENDING" },
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                },
                lead: true
            }
        });

        // Map to user's desired format
        // They expect: transactionsuccess, transactionfailed, allTransaction, unproccessedTransaction
        // And inside transaction: populate("userId") -> so structure needs to look like user object is inside.

        const mapTransaction = (tx: any) => ({
            ...tx,
            userId: tx.order?.user || null, // Map order.user to userId to match expected format
            // Add other fields if necessary
        });
        // console.log("allTransactions",allTransactions, allTransactions.length);
        console.log("pendingOrders",pendingOrders, pendingOrders.length);


        return NextResponse.json({
            success: true,
            count: transactionsSuccess.length + transactionsFailed.length,
            transactionsuccess: transactionsSuccess.map(mapTransaction),
            transactionfailed: transactionsFailed.map(mapTransaction),
            totalFailed: transactionsFailed.length,
            totalSuccess: transactionsSuccess.length,
            allTransaction: allTransactions.map(mapTransaction),
            allTransactionCount: allTransactions.length,
            unproccessedTransaction: pendingOrders.map(o => ({
                ...o,
                // Map pending order to similar structure
                userId: o.user || { name: o.guestEmail, email: o.guestEmail } // Fallback for guest
            })),
            unproccessedTransactionCount: pendingOrders.length
        });

    } catch (error) {
        console.error("Get transactions error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
