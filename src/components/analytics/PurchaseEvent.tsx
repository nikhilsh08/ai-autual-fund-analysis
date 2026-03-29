"use client";

import { useEffect, useRef } from "react";

interface PurchaseEventProps {
    amount: number;
    currency: string;
    transactionId: string;
    items: Array<{
        item_id: string;
        item_name: string;
        price: number;
    }>;
    utm?: {
        source?: string;
        medium?: string;
        campaign?: string;
        term?: string;
        content?: string;
    };
}

export default function PurchaseEvent({
    amount,
    currency,
    transactionId,
    items,
    utm,
}: PurchaseEventProps) {
    const firedRef = useRef(false);

    useEffect(() => {
        if (firedRef.current) return;
        firedRef.current = true;

        // GA4 Purchase Event
        if (typeof (window as any).gtag !== "undefined") {
            (window as any).gtag("event", "purchase", {
                transaction_id: transactionId,
                value: amount,
                currency: currency,
                items: items,
                // GA4 automatically parses UTMs from URL, but we can set them as user properties or event params if needed explicitly
                // especially if we are on a different page than the landing page.
                campaign: utm?.campaign,
                source: utm?.source,
                medium: utm?.medium,
                term: utm?.term,
                content: utm?.content,
            });
        }

        // Meta Pixel Purchase Event
        if (typeof (window as any).fbq !== "undefined") {
            (window as any).fbq("track", "Purchase", {
                value: amount,
                currency: currency,
                content_ids: items.map((item) => item.item_id),
                content_type: "product",
                // Meta can also take custom parameters
                utm_source: utm?.source,
                utm_medium: utm?.medium,
                utm_campaign: utm?.campaign,
            });
        }

        console.log("Analytics: Purchase Event Fired", { transactionId, amount, utm });
    }, [amount, currency, items, transactionId, utm]);

    return null;
}
