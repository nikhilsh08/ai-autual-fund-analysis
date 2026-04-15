'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface AutoRefreshProps {
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
    intervalSeconds = 5,
    maxRefreshes = 12,
}: AutoRefreshProps) {
    const router = useRouter();
    const count = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            count.current += 1;
            router.refresh();
            if (count.current >= maxRefreshes) {
                clearInterval(interval);
            }
        }, intervalSeconds * 1000);

        return () => clearInterval(interval);
    }, [router, intervalSeconds, maxRefreshes]);

    return null;
}
