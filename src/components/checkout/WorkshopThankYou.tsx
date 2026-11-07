"use client";

import { useEffect, useState } from "react";
import { CalendarPlus, CheckCircle2, MessageCircle, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MMF_COPY, withoutWeekday } from "@/lib/mmf-copy";

interface Booking {
    status: string;
    isBatchOrder: boolean;
    batch: {
        id: string;
        day1Date: string;
        day2Date: string;
        startTime: string;
        durationMinutes: number;
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

const stamp = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

function googleCalendarUrl(summary: string, startIso: string, minutes: number, details: string) {
    const end = new Date(new Date(startIso).getTime() + minutes * 60_000).toISOString();
    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: summary,
        dates: `${stamp(startIso)}/${stamp(end)}`,
        details,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function WorkshopThankYou({ orderId }: { orderId: string }) {
    const [booking, setBooking] = useState<Booking | null>(null);
    const [polls, setPolls] = useState(0);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/booking`, { cache: "no-store" });
                if (!res.ok) return;
                const data: Booking = await res.json();
                if (!cancelled) setBooking(data);
            } catch {
                // keep polling
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [orderId, polls]);

    const linksReady = Boolean(booking?.joinLinkDay1 && booking?.joinLinkDay2);

    useEffect(() => {
        if (!booking || linksReady || polls >= POLL_LIMIT) return;
        const handle = setTimeout(() => setPolls((n) => n + 1), POLL_MS);
        return () => clearTimeout(handle);
    }, [booking, linksReady, polls]);

    const batch = booking?.batch;
    const t = MMF_COPY.thankYou;

    return (
        <div className="space-y-6 text-left">
            <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-teal" />
            </div>

            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold text-ink">{t.T1}</h1>
                {batch && (
                    <p className="text-ink-secondary">
                        {t.T2(withoutWeekday(batch.day1Date), withoutWeekday(batch.day2Date), batch.startTime)}
                    </p>
                )}
            </div>

            <div className="space-y-3">
                {linksReady && booking ? (
                    <>
                        <a href={booking.joinLinkDay1 ?? "#"} target="_blank" rel="noopener noreferrer" className="block">
                            <Button className="w-full h-12 rounded-xl text-base bg-ink text-cream hover:bg-ink/90" size="lg">
                                <Video className="mr-2 w-4 h-4" /> {t.T3_DAY1}
                            </Button>
                        </a>
                        <a href={booking.joinLinkDay2 ?? "#"} target="_blank" rel="noopener noreferrer" className="block">
                            <Button className="w-full h-12 rounded-xl text-base bg-ink text-cream hover:bg-ink/90" size="lg">
                                <Video className="mr-2 w-4 h-4" /> {t.T3_DAY2}
                            </Button>
                        </a>
                    </>
                ) : (
                    <p className="text-sm text-ink-secondary bg-cream-dark border border-border rounded-xl px-4 py-3" data-testid="join-pending">
                        {t.T4}
                    </p>
                )}

                {booking?.whatsappGroupLink && (
                    <a href={booking.whatsappGroupLink} target="_blank" rel="noopener noreferrer" className="block">
                        <Button variant="outline" className="w-full h-12 rounded-xl text-base" size="lg">
                            <MessageCircle className="mr-2 w-4 h-4" /> {t.T5}
                        </Button>
                    </a>
                )}

                {batch && (
                    <details className="rounded-xl border border-border bg-cream-dark px-4 py-3 text-sm">
                        <summary className="cursor-pointer font-medium text-ink flex items-center gap-2">
                            <CalendarPlus className="w-4 h-4" /> {t.T6}
                        </summary>
                        <div className="mt-3 flex flex-col gap-2">
                            <a className="underline" href={`/api/batches/${batch.id}/ics?order=${encodeURIComponent(orderId)}`}>
                                Download calendar file (.ics)
                            </a>
                            <a
                                className="underline"
                                target="_blank"
                                rel="noopener noreferrer"
                                href={googleCalendarUrl(`${MMF_COPY.contentName} — Day 1`, batch.day1StartAt, batch.durationMinutes, t.T7)}
                            >
                                Google Calendar — Saturday
                            </a>
                            <a
                                className="underline"
                                target="_blank"
                                rel="noopener noreferrer"
                                href={googleCalendarUrl(`${MMF_COPY.contentName} — Day 2`, batch.day2StartAt, batch.durationMinutes, t.T7)}
                            >
                                Google Calendar — Sunday
                            </a>
                        </div>
                    </details>
                )}
            </div>

            <div className="bg-cream-dark rounded-2xl p-4 text-sm text-ink-secondary border border-border space-y-2">
                <p>{t.T7}</p>
                <p>{t.T8}</p>
                <div className="flex justify-between pt-2 border-t border-border">
                    <span>Order ID</span>
                    <span className="font-mono font-medium text-ink">{orderId}</span>
                </div>
            </div>
        </div>
    );
}
