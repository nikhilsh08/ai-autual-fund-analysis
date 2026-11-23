"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

export default function MetaPixel({ pixelId }: { pixelId: string }) {
    const pathname = usePathname();
    const [loaded, setLoaded] = useState(false);
    const lastTrackedPath = useRef<string | null>(null);

    useEffect(() => {
        if (!loaded) return;
        // The init snippet below already fires PageView for the first page;
        // only client-side route changes need another one.
        if (lastTrackedPath.current === null) {
            lastTrackedPath.current = pathname;
            return;
        }
        if (lastTrackedPath.current === pathname) return;
        lastTrackedPath.current = pathname;
        (window as any).fbq('track', 'PageView');
    }, [pathname, loaded]);

    if (!pixelId) return null;

    return (
        <>
            <Script
                id="fb-pixel"
                strategy="afterInteractive"
                onLoad={() => setLoaded(true)}
                dangerouslySetInnerHTML={{
                    __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
                }}
            />
            {/* Fallback NoScript */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: "none" }}
                    src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                    alt="meta-pixel"
                />
            </noscript>
        </>
    );
}
