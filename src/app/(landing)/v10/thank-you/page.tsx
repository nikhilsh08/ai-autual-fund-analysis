import type { Metadata } from "next";
import Link from "next/link";
import { Archivo, Playfair_Display } from "next/font/google";
import { redirect } from "next/navigation";
import { MessageCircle, RefreshCw } from "lucide-react";
import { getOrderStatus } from "@/server/actions/payment.action";
import PurchaseEvent from "@/components/analytics/PurchaseEvent";
import AutoRefresh from "@/components/checkout/AutoRefresh";
import type { WorkshopBooking } from "@/components/checkout/useWorkshopBooking";
import V10Shell from "@/components/landing/V10Shell";
import WorkshopThankYouV10, { OrderMeta, ThankYouCard } from "@/components/landing/WorkshopThankYouV10";
import { formatIstDate, formatIstTime } from "@/lib/ist";
import type { V20Batch } from "@/lib/landing/render-v20";
import { previewBatchFor } from "@/lib/landing/v20-data";
import { MMF_COPY } from "@/lib/mmf-copy";
import s from "@/components/landing/ThankYouV10.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
    title: "Your seat is booked | Master Mutual Funds",
    robots: { index: false, follow: false },
};

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["600", "700", "800"],
    variable: "--mmf-archivo",
    display: "swap",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["500", "600", "700"],
    style: ["normal", "italic"],
    variable: "--mmf-playfair",
    display: "swap",
});

const LANDING = "/v10";
const THANK_YOU = `${LANDING}/thank-you`;
const SUPPORT = "mailto:support@cashflowcrew.in";

// Development-only preview. Every date, time and length comes from the
// admin panel (previewBatchFor: batch on sale, next batch, or Batch
// settings), formatted exactly as GET /api/orders/[orderId]/booking does:
//   /v10/thank-you?preview=workshop            join links pending
//   /v10/thank-you?preview=workshop&links=1    join links ready
//   /v10/thank-you?preview=workshop&state=pending | failed
function previewBooking(batch: V20Batch, withLinks: boolean): WorkshopBooking {
    return {
        status: "PAID",
        isBatchOrder: true,
        batch: {
            id: batch.id,
            day1Date: formatIstDate(batch.day1StartAt),
            day2Date: formatIstDate(batch.day2StartAt),
            startTime: formatIstTime(batch.day1StartAt),
            durationMinutes: batch.durationMinutes,
            day1StartAt: batch.day1StartAt.toISOString(),
            day2StartAt: batch.day2StartAt.toISOString(),
        },
        zohoState: withLinks ? "REGISTERED" : "PENDING",
        joinLinkDay1: withLinks ? "https://example.com/join/day1" : null,
        joinLinkDay2: withLinks ? "https://example.com/join/day2" : null,
        whatsappGroupLink: "https://chat.whatsapp.com/preview",
    };
}

function Pending({ orderId, poll }: { orderId: string; poll: boolean }) {
    const t = MMF_COPY.thankYou;
    return (
        <>
            {/* Verifies with Cashfree and re-renders until the webhook has confirmed the order. */}
            {poll && <AutoRefresh orderId={orderId} intervalSeconds={2} maxRefreshes={30} />}
            <ThankYouCard tone="verifying" title={t.pendingTitle} lead={t.pendingBody}>
                <div className={`${s.actions} ${s.actionsRow}`}>
                    <Link href={`${THANK_YOU}?order_id=${encodeURIComponent(orderId)}`} prefetch={false} className={s.btn}>
                        <RefreshCw size={18} /> {t.refresh}
                    </Link>
                    <a href={SUPPORT} className={`${s.btn} ${s.btnOutline}`}>
                        <MessageCircle size={18} /> {t.contactSupport}
                    </a>
                </div>
                <OrderMeta orderId={orderId} tone="verifying" />
            </ThankYouCard>
        </>
    );
}

function Failed({ orderId }: { orderId: string }) {
    const t = MMF_COPY.thankYou;
    return (
        <ThankYouCard tone="failed" title={t.failedTitle} lead={t.failedBody}>
            <div className={`${s.actions} ${s.actionsRow}`}>
                <a href={`${LANDING}#admission`} className={s.btn}>
                    {t.backToWorkshop}
                </a>
                <a href={SUPPORT} className={`${s.btn} ${s.btnOutline}`}>
                    <MessageCircle size={18} /> {t.contactSupport}
                </a>
            </div>
            <OrderMeta orderId={orderId} tone="failed" />
        </ThankYouCard>
    );
}

export default async function WorkshopThankYouPage({
    searchParams,
}: {
    searchParams: Promise<{ order_id?: string; preview?: string; links?: string; state?: string }>;
}) {
    const { order_id: orderId, preview, links, state } = await searchParams;
    const fontClass = `${archivo.variable} ${playfair.variable}`;

    if (preview === "workshop" && process.env.NODE_ENV !== "production") {
        const previewId = "ORDER_PREVIEW_0000";
        const { batch } = await previewBatchFor("v10");
        if (!batch) redirect(`${LANDING}?preview=1`);
        return (
            <V10Shell className={fontClass}>
                {state === "pending" ? (
                    <Pending orderId={previewId} poll={false} />
                ) : state === "failed" ? (
                    <Failed orderId={previewId} />
                ) : (
                    <WorkshopThankYouV10 orderId={previewId} initialBooking={previewBooking(batch, links === "1")} />
                )}
            </V10Shell>
        );
    }

    if (!orderId) redirect(LANDING);

    // READ-ONLY: the Cashfree webhook is the single source of truth for
    // processing; this page only reads the stored status.
    const statusCheck = await getOrderStatus(orderId);
    if (!statusCheck.found || !statusCheck.data) redirect(LANDING);

    const order = statusCheck.data as any;
    const isBatchOrder = Boolean(order.items?.some((item: { batchId?: string | null }) => item.batchId));
    // Course orders keep the main site's confirmation page.
    if (!isBatchOrder) redirect(`/order-status?order_id=${encodeURIComponent(orderId)}`);

    const isPaid = statusCheck.status === "PAID";
    const isPending = statusCheck.status === "PENDING";

    return (
        <V10Shell className={fontClass}>
            {isPaid && (
                <PurchaseEvent
                    amount={order.totalAmount}
                    currency="INR"
                    // MUST match event_id in CAPI (meta-capi.ts uses orderId)
                    transactionId={order.orderId}
                    items={
                        order.items?.map((item: { courseId: string; price: number; course?: { title?: string } }) => ({
                            item_id: item.courseId,
                            item_name: item.course?.title || MMF_COPY.contentName,
                            price: item.price,
                        })) || []
                    }
                    utm={{
                        source: order.utmSource || undefined,
                        medium: order.utmMedium || undefined,
                        campaign: order.utmCampaign || undefined,
                        term: order.utmTerm || undefined,
                        content: order.utmContent || undefined,
                    }}
                />
            )}
            {isPaid ? <WorkshopThankYouV10 orderId={orderId} /> : isPending ? <Pending orderId={orderId} poll /> : <Failed orderId={orderId} />}
        </V10Shell>
    );
}
