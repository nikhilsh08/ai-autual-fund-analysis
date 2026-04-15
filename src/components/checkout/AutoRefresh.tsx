'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface AutoRefreshProps {
    /** Cashfree order ID used for active verification polling */
    orderId: string;
    /** How many seconds between each refresh (default: 5) */
    intervalSeconds?: number;
    /** Stop refreshing after this many attempts (default: 12 = 60s total) */
    maxRefreshes?: number;
}

/**
 * AutoRefresh — silently refreshes the Next.js page on an interval.
 * Used on the order-status page when the payment is PENDING (webhook still processing).
 * Stops automatically after maxRefreshes * intervalSeconds seconds.
 */
export default function AutoRefresh({
    orderId,
    intervalSeconds = 5,
    maxRefreshes = 12,
}: AutoRefreshProps) {
    const router = useRouter();
    const count = useRef(0);
    const inFlight = useRef(false);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (inFlight.current) return;
            inFlight.current = true;

            try {
                // Actively verify with Cashfree so status can flip even if webhook is delayed.
                await fetch('/api/payment/cashfree/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId }),
                    cache: 'no-store',
                });
            } catch {
                // Ignore transient network errors and keep polling.
            } finally {
                count.current += 1;
                router.refresh();
                inFlight.current = false;
                if (count.current >= maxRefreshes) {
                    clearInterval(interval);
                }
            }
        }, intervalSeconds * 1000);

        return () => clearInterval(interval);
    }, [router, orderId, intervalSeconds, maxRefreshes]);

    return null;
}
