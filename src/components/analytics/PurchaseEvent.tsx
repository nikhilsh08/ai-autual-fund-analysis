"use client";

import { useEffect, useRef } from "react";
import { trackPurchase } from "@/lib/analytics/track";

interface PurchaseEventProps {
    amount: number;
    currency: string;
    transactionId: string;
    items: Array<{
        item_id: string;
        item_name: string;
        price: number;
    }>;
    // Kept for callers; the order's UTM tags are stored on the order and sent
    // server-side. They are not added to the browser events.
    utm?: {
        source?: string;
        medium?: string;
        campaign?: string;
        term?: string;
        content?: string;
    };
}

// Fires GA4 `purchase` and Meta Pixel `Purchase` for a paid order, once per
// order per browser. The Pixel event carries eventID = transactionId (the
// order ID), the same value the Conversions API sends as event_id
// (lib/meta-capi.ts), so Meta counts one purchase, not two.
export default function PurchaseEvent({ amount, currency, transactionId, items }: PurchaseEventProps) {
    const firedRef = useRef(false);

    useEffect(() => {
        if (firedRef.current) return;
        firedRef.current = true;
        // Waits for the Pixel and gtag if they are still loading (a reload or
        // a direct visit to the thank-you page), so the event is not dropped.
        trackPurchase({ orderId: transactionId, value: amount, currency, items });
    }, [amount, currency, items, transactionId]);

    return null;
}
