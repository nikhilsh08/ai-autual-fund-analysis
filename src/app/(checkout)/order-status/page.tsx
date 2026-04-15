import { getOrderStatus } from '@/server/actions/payment.action';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2, ArrowRight, BookOpen } from 'lucide-react';
import { redirect } from 'next/navigation';
import PurchaseEvent from '@/components/analytics/PurchaseEvent';
import RedirectHandler from '@/components/checkout/RedirectHandler';
import AutoRefresh from '@/components/checkout/AutoRefresh';

export default async function OrderStatusPage({
    searchParams,
}: {
    searchParams: Promise<{ order_id: string }>;
}) {
    const { order_id: orderId } = await searchParams;

    if (!orderId) {
        redirect('/');
    }

    // READ-ONLY: only check the DB, never trigger payment processing.
    // The Cashfree webhook is the single source of truth for processing.
    // This completely eliminates the race/deadlock between page + webhook.
    const statusCheck = await getOrderStatus(orderId);

    if (!statusCheck.found) {
        redirect('/');
    }

    const isSuccess = statusCheck.status === 'PAID';
    const isPending = statusCheck.status === 'PENDING';
    const isFailed  = statusCheck.status === 'FAILED';
    const orderData = statusCheck.data;

    // Prepare purchase event data (only fires on success)
    const purchaseEventData = isSuccess && orderData ? {
        amount: (orderData as any).totalAmount,
        currency: "INR",
        transactionId: (orderData as any).paymentId || (orderData as any).id,
        items: (orderData as any).items?.map((item: any) => ({
            item_id: item.courseId,
            item_name: item.course?.title || "Course",
            price: item.price
        })) || [],
        utm: {
            source: (orderData as any).utmSource || undefined,
            medium: (orderData as any).utmMedium || undefined,
            campaign: (orderData as any).utmCampaign || undefined,
            term: (orderData as any).utmTerm || undefined,
            content: (orderData as any).utmContent || undefined,
        }
    } : null;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-cream flex items-center justify-center">
            {purchaseEventData && (
                <PurchaseEvent
                    amount={purchaseEventData.amount}
                    currency={purchaseEventData.currency}
                    transactionId={purchaseEventData.transactionId}
                    items={purchaseEventData.items}
                    utm={purchaseEventData.utm}
                />
            )}
            <div className="max-w-md w-full bg-card rounded-3xl shadow-sm border border-border p-8 text-center">
                {isSuccess ? (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10 text-teal" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-ink">Payment Successful!</h1>
                            <p className="text-ink-secondary">
                                Thank you for your purchase. Your order has been confirmed.
                            </p>
                        </div>

                        <div className="bg-cream-dark rounded-2xl p-4 text-sm text-ink-secondary border border-border">
                            <div className="flex justify-between py-2 border-b border-border">
                                <span>Order ID</span>
                                <span className="font-mono font-medium text-ink">{orderId}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span>Status</span>
                                <span className="font-medium text-teal">Paid</span>
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <Link href="/portal-access-guide">
                                <Button className="w-full h-12 rounded-xl text-base bg-ink text-cream hover:bg-ink/90" size="lg">
                                    <BookOpen className="mr-2 w-4 h-4" /> What Next? (Portal Guide)
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button variant="outline" className="w-full h-12 rounded-xl text-base" size="lg">
                                    Go to Home Page
                                </Button>
                            </Link>
                            <RedirectHandler status="SUCCESS" delaySeconds={10} redirectTo="/portal-access-guide" />
                        </div>
                    </div>
                ) : isPending ? (
                    <div className="space-y-6">
                        {/* Silently refreshes every 5s (up to 60s) while the webhook processes */}
                        <AutoRefresh intervalSeconds={5} maxRefreshes={12} />

                        <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto">
                            <Loader2 className="w-10 h-10 text-gold animate-spin" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-ink">Processing Your Payment…</h1>
                            <p className="text-ink-secondary">
                                Your payment was received. We are confirming your order — this takes just a few seconds. Please do not close this page.
                            </p>
                        </div>

                        <div className="bg-cream-dark rounded-2xl p-4 text-sm text-ink-secondary border border-border">
                            <div className="flex justify-between py-2 border-b border-border">
                                <span>Order ID</span>
                                <span className="font-mono font-medium text-ink">{orderId}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span>Status</span>
                                <span className="font-medium text-gold">Verifying…</span>
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <Link href={`/order-status?order_id=${orderId}`}>
                                <Button className="w-full h-12 rounded-xl text-base" size="lg">
                                    Refresh Status
                                </Button>
                            </Link>
                            <Link href="/contact-us">
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
                            <h1 className="text-2xl font-bold text-ink">Payment Failed</h1>
                            <p className="text-ink-secondary">
                                Something went wrong with your transaction. You have not been charged.
                            </p>
                        </div>

                        <div className="bg-cream-dark rounded-2xl p-4 text-sm text-ink-secondary border border-border">
                            <div className="flex justify-between py-2 border-b border-border">
                                <span>Order ID</span>
                                <span className="font-mono font-medium text-ink">{orderId}</span>
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
                            <RedirectHandler status="FAILED" delaySeconds={3} redirectTo="/" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
