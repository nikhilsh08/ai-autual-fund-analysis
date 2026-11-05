"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

interface MmfClientProps {
  courseId: string;
  price: number;
  title: string;
}

// Mounts the page's own animation script and wires the single checkout
// button and tracking events. Never puts fund names, amounts invested or
// portfolio details into events or URLs — only the batch id, price and the
// workshop title.
export default function MmfClient({ courseId, price, title }: MmfClientProps) {
  const viewFiredRef = useRef(false);

  useEffect(() => {
    if (viewFiredRef.current) return;
    viewFiredRef.current = true;

    // PageView already fires globally from the root layout's MetaPixel
    // component; this page adds ViewContent / view_item on top of it.
    window.fbq?.("track", "ViewContent", {
      value: price,
      currency: "INR",
      content_name: title,
      content_ids: [courseId],
      content_type: "product",
    });
    window.dataLayer?.push({
      event: "view_item",
      ecommerce: { currency: "INR", value: price, items: [{ item_id: courseId, item_name: title, price }] },
    });
  }, [courseId, price, title]);

  useEffect(() => {
    if (!document.querySelector('script[data-mmf-motion="1"]')) {
      const script = document.createElement("script");
      script.src = "/mmf/motion.js";
      script.setAttribute("data-mmf-motion", "1");
      document.body.appendChild(script);
    }

    const checkoutButton = document.querySelector<HTMLAnchorElement>('[data-checkout="1"]');
    if (!checkoutButton) return;

    checkoutButton.setAttribute("href", `/checkout?courseId=${courseId}`);

    const onClick = () => {
      window.fbq?.("track", "InitiateCheckout", {
        value: price,
        currency: "INR",
        content_name: title,
        content_ids: [courseId],
        content_type: "product",
      });
      window.dataLayer?.push({
        event: "begin_checkout",
        ecommerce: { currency: "INR", value: price, items: [{ item_id: courseId, item_name: title, price }] },
      });
    };
    checkoutButton.addEventListener("click", onClick);
    return () => checkoutButton.removeEventListener("click", onClick);
  }, [courseId, price, title]);

  return null;
}
