"use client";

import { useEffect, useState } from "react";

// Shape returned by GET /api/orders/[orderId]/booking for a workshop order.
export interface WorkshopBooking {
    status: string;
    isBatchOrder: boolean;
    batch: {
        id: string;
        day1Date: string;
        day2Date: string;
        startTime: string;
        durationMinutes: number;
        // Day 2's own start time and length, and whether each day must be
        // stated in full (lib/batches/display.ts).
        day2StartTime?: string;
        day2DurationMinutes?: number;
        eachDayStated?: boolean;
        day1StartAt: string;
        day2StartAt: string;
    };
    zohoState?: string;
    joinLinkDay1?: string | null;
    joinLinkDay2?: string | null;
    whatsappGroupLink?: string | null;
}

const POLL_MS = 3000;
const POLL_LIMIT = 20; // 60 seconds

/**
 * Loads the booking for a workshop order and polls until both join links
 * exist or the poll limit is reached. A preset booking (development preview)
 * is used as-is and is never fetched or polled.
 */
export function useWorkshopBooking(orderId: string, initialBooking?: WorkshopBooking) {
    const [booking, setBooking] = useState<WorkshopBooking | null>(initialBooking ?? null);
    const [polls, setPolls] = useState(0);

    useEffect(() => {
        if (initialBooking) return;
        let cancelled = false;
        const load = async () => {
            try {
                const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/booking`, { cache: "no-store" });
                if (!res.ok) return;
                const data: WorkshopBooking = await res.json();
                if (!cancelled) setBooking(data);
            } catch {
                // keep polling
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [orderId, polls, initialBooking]);

    const linksReady = Boolean(booking?.joinLinkDay1 && booking?.joinLinkDay2);

    useEffect(() => {
        if (initialBooking || !booking || linksReady || polls >= POLL_LIMIT) return;
        const handle = setTimeout(() => setPolls((n) => n + 1), POLL_MS);
        return () => clearTimeout(handle);
    }, [booking, linksReady, polls, initialBooking]);

    return { booking, linksReady };
}

const stamp = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

export function googleCalendarUrl(summary: string, startIso: string, minutes: number, details: string) {
    const end = new Date(new Date(startIso).getTime() + minutes * 60_000).toISOString();
    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: summary,
        dates: `${stamp(startIso)}/${stamp(end)}`,
        details,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
