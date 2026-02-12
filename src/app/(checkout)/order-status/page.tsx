import { verifyCashfreePayment } from '@/server/actions/payment.action';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle2, XCircle, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function OrderStatusPage({
    searchParams,
}: {
    searchParams: Promise<{ order_id: string }>;
}) {
    const { order_id: orderId } = await searchParams;

    if (!orderId) {
        redirect('/');
    }

    const verification = await verifyCashfreePayment(orderId);

    // If status is paid, we show success
    const isSuccess = verification.success && verification.status === 'PAID';
    const isPending = verification.status === 'PENDING';
    const isFailed = verification.status === 'FAILED';

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-zinc-50 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-zinc-200 p-8 text-center">
                {isSuccess ? (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-zinc-900">Payment Successful!</h1>
                            <p className="text-zinc-500">
                                Thank you for your purchase. Your order has been confirmed.
                            </p>
                        </div>

                        <div className="bg-zinc-50 rounded-2xl p-4 text-sm text-zinc-600 border border-zinc-100">
                            <div className="flex justify-between py-2 border-b border-zinc-100">
                                <span>Order ID</span>
                                <span className="font-mono font-medium text-zinc-900">{orderId}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span>Status</span>
                                <span className="font-medium text-green-600">Paid</span>
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <Link href="/dashboard">
                                <Button className="w-full h-12 rounded-xl text-base" size="lg">
                                    Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button variant="outline" className="w-full h-12 rounded-xl text-base" size="lg">
                                    Continue Shopping
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : isPending ? (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto">
                            <AlertCircle className="w-10 h-10 text-yellow-500" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-zinc-900">Payment Pending</h1>
                            <p className="text-zinc-500">
                                We are verifying your payment status. Please wait a moment or check back later.
                            </p>
                        </div>

                        <div className="bg-zinc-50 rounded-2xl p-4 text-sm text-zinc-600 border border-zinc-100">
                            <div className="flex justify-between py-2 border-b border-zinc-100">
                                <span>Order ID</span>
                                <span className="font-mono font-medium text-zinc-900">{orderId}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span>Status</span>
                                <span className="font-medium text-yellow-600">Verification Pending</span>
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <Link href={`/order-status?order_id=${orderId}`}>
                                <Button className="w-full h-12 rounded-xl text-base" size="lg">
                                    Check Status Again
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button variant="outline" className="w-full h-12 rounded-xl text-base" size="lg">
                                    Contact Support
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                            <XCircle className="w-10 h-10 text-red-500" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-zinc-900">Payment Failed</h1>
                            <p className="text-zinc-500">
                                Something went wrong with your transaction. You have not been charged.
                            </p>
                        </div>

                        <div className="bg-zinc-50 rounded-2xl p-4 text-sm text-zinc-600 border border-zinc-100">
                            <div className="flex justify-between py-2 border-b border-zinc-100">
                                <span>Order ID</span>
                                <span className="font-mono font-medium text-zinc-900">{orderId}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span>Status</span>
                                <span className="font-medium text-red-600">Failed</span>
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <Link href="/checkout">
                                <Button className="w-full h-12 rounded-xl text-base" size="lg">
                                    Try Again <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button variant="outline" className="w-full h-12 rounded-xl text-base" size="lg">
                                    Back to Home
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
