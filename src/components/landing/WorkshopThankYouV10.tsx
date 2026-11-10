"use client";

import type { ReactNode } from "react";
import { CalendarPlus, Check, MessageCircle, Video, X } from "lucide-react";
import { MMF_COPY, withoutWeekday } from "@/lib/mmf-copy";
import { googleCalendarUrl, useWorkshopBooking, type WorkshopBooking } from "@/components/checkout/useWorkshopBooking";
import s from "./ThankYouV10.module.css";

export type Tone = "paid" | "verifying" | "failed";

const SUPPORT_EMAIL = "support@cashflowcrew.in";
const STATUS_LABEL: Record<Tone, string> = { paid: "Paid", verifying: "Verifying…", failed: "Failed" };

// The last word of a headline carries the Playfair italic accent, the way
// every headline on the landing page does. The text itself is unchanged.
function AccentTitle({ text }: { text: string }) {
    const cut = text.lastIndexOf(" ");
    if (cut < 0) return <>{text}</>;
    return (
        <>
            {text.slice(0, cut + 1)}
            <em className={s.accent}>{text.slice(cut + 1)}</em>
        </>
    );
}

const formatDuration = (minutes: number) =>
    minutes % 60 === 0 ? `${minutes / 60} ${minutes === 60 ? "hour" : "hours"}` : `${minutes} minutes`;

// The single centred card: badge, eyebrow, headline and lead on top, then
// whatever the state needs (`children`), ending with <OrderMeta />.
export function ThankYouCard({ tone, title, lead, children }: { tone: Tone; title: string; lead?: string; children: ReactNode }) {
    const badgeTone = tone === "verifying" ? s.badgeGold : tone === "failed" ? s.badgeRed : "";
    return (
        <div className={s.card}>
            <div className={s.cardHead}>
                <div className={`${s.badge} ${badgeTone}`} aria-hidden="true">
                    {tone === "verifying" ? (
                        <span className={s.spinner} />
                    ) : tone === "failed" ? (
                        <X size={30} strokeWidth={2.5} />
                    ) : (
                        <Check size={30} strokeWidth={2.75} />
                    )}
                </div>
                <p className={s.eyebrow}>{MMF_COPY.contentName}</p>
                <h1 className={s.title}>
                    <AccentTitle text={title} />
                </h1>
                {lead && <p className={s.lead}>{lead}</p>}
            </div>
            {children}
        </div>
    );
}

// Soft box at the bottom of the card: requirements and support line (T7, T8),
// then Order ID and Status. Shown in every state of the page.
export function OrderMeta({ orderId, tone }: { orderId: string; tone: Tone }) {
    const t = MMF_COPY.thankYou;
    const [helpBefore, helpAfter] = t.T8.split(SUPPORT_EMAIL);
    return (
        <div className={s.meta}>
            <p className={s.item}>
                <span className={s.tick} aria-hidden="true">
                    <Check size={12} strokeWidth={3} />
                </span>
                <span>{t.T7}</span>
            </p>
            <p className={s.item}>
                <span className={s.tick} aria-hidden="true">
                    <Check size={12} strokeWidth={3} />
                </span>
                <span>
                    {helpAfter === undefined ? (
                        t.T8
                    ) : (
                        <>
                            {helpBefore}
                            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
                            {helpAfter}
                        </>
                    )}
                </span>
            </p>
            <div className={s.rows}>
                <div className={s.row}>
                    <span>Order ID</span>
                    <span className={s.rowValue}>{orderId}</span>
                </div>
                <div className={s.row}>
                    <span>Status</span>
                    <span className={`${s.pill} ${s[tone]}`}>{STATUS_LABEL[tone]}</span>
                </div>
            </div>
        </div>
    );
}

function DayTile({ eyebrow, date, time, href, label }: { eyebrow: string; date: string; time: string; href: string | null; label: string }) {
    return (
        <div className={s.day}>
            <span className={s.dayEyebrow}>{eyebrow}</span>
            <span className={s.dayDate}>{date}</span>
            <span className={s.dayTime}>{time}</span>
            {href && (
                <a href={href} target="_blank" rel="noopener noreferrer" className={s.btn}>
                    <Video size={17} /> {label}
                </a>
            )}
        </div>
    );
}

// Paid state of the v10 thank-you page: the two sessions with their join
// links (polled until ready), WhatsApp group, calendar links, then
// requirements and order details.
export default function WorkshopThankYouV10({ orderId, initialBooking }: { orderId: string; initialBooking?: WorkshopBooking }) {
    const { booking, linksReady } = useWorkshopBooking(orderId, initialBooking);
    const batch = booking?.batch;
    const t = MMF_COPY.thankYou;
    const timeLine = batch ? `${batch.startTime} IST · ${formatDuration(batch.durationMinutes)}` : "";

    return (
        <ThankYouCard tone="paid" title={t.T1} lead={batch ? t.T2(withoutWeekday(batch.day1Date), withoutWeekday(batch.day2Date), batch.startTime) : undefined}>
            {batch && (
                <>
                    <p className={s.cardLabel}>Your two sessions</p>
                    <div className={s.days}>
                        <DayTile
                            eyebrow="Day 1 · Saturday"
                            date={withoutWeekday(batch.day1Date)}
                            time={timeLine}
                            href={linksReady ? (booking?.joinLinkDay1 ?? null) : null}
                            label={t.T3_DAY1}
                        />
                        <DayTile
                            eyebrow="Day 2 · Sunday"
                            date={withoutWeekday(batch.day2Date)}
                            time={timeLine}
                            href={linksReady ? (booking?.joinLinkDay2 ?? null) : null}
                            label={t.T3_DAY2}
                        />
                    </div>
                </>
            )}

            {!linksReady && (
                <p className={s.note} data-testid="join-pending">
                    <span className={s.spinnerSm} aria-hidden="true" />
                    <span>{t.T4}</span>
                </p>
            )}

            <div className={s.actions}>
                {booking?.whatsappGroupLink && (
                    <a href={booking.whatsappGroupLink} target="_blank" rel="noopener noreferrer" className={`${s.btn} ${s.btnOutline}`}>
                        <MessageCircle size={18} /> {t.T5}
                    </a>
                )}

                {batch && (
                    <details className={s.details}>
                        <summary>
                            <CalendarPlus size={18} /> {t.T6}
                        </summary>
                        <div className={s.detailsBody}>
                            <a className={s.chip} href={`/api/batches/${batch.id}/ics?order=${encodeURIComponent(orderId)}`}>
                                Download calendar file (.ics)
                            </a>
                            <a
                                className={s.chip}
                                target="_blank"
                                rel="noopener noreferrer"
                                href={googleCalendarUrl(`${MMF_COPY.contentName} — Day 1`, batch.day1StartAt, batch.durationMinutes, t.T7)}
                            >
                                Google Calendar — Saturday
                            </a>
                            <a
                                className={s.chip}
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

            <OrderMeta orderId={orderId} tone="paid" />
        </ThankYouCard>
    );
}
