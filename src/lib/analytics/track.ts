// One place for browser events so Pixel and GA4 stay in step. Never put
// personal data or fund names into event payloads.
type AnyWindow = Record<string, unknown> & {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

const w = () => (typeof window === "undefined" ? ({} as AnyWindow) : (window as unknown as AnyWindow));

export const ga4ViaGtm = () => process.env.NEXT_PUBLIC_GA4_VIA_GTM === "true";

// The Pixel and gtag snippets are added by next/script after the page has
// hydrated (app/layout.tsx), which is later than a page's own first effect.
// An event fired on page load therefore waits for its tag instead of being
// dropped. If the tag never appears (not configured, or blocked by the
// browser) the event is given up after MAX_WAIT_MS.
const POLL_MS = 200;
const MAX_WAIT_MS = 10_000;

export function whenTagReady(isReady: () => boolean, send: () => void, waitedMs = 0): void {
  if (typeof window === "undefined") return;
  if (isReady()) {
    send();
    return;
  }
  if (waitedMs >= MAX_WAIT_MS) return;
  setTimeout(() => whenTagReady(isReady, send, waitedMs + POLL_MS), POLL_MS);
}

const pixelReady = () => typeof w().fbq === "function";
const gtagReady = () => typeof w().gtag === "function";

interface ItemEvent {
  contentIds: string[];
  contentName: string;
  value: number;
  currency?: string;
}

function ga4Send(name: string, payload: Record<string, unknown>) {
  if (ga4ViaGtm()) {
    // The dataLayer is a queue: GTM reads it whenever it loads.
    const win = w();
    win.dataLayer = win.dataLayer ?? [];
    win.dataLayer.push({ event: name, ecommerce: payload });
    return;
  }
  whenTagReady(gtagReady, () => w().gtag?.("event", name, payload));
}

function ga4Event(name: string, event: ItemEvent) {
  ga4Send(name, {
    currency: event.currency ?? "INR",
    value: event.value,
    items: event.contentIds.map((id) => ({ item_id: id, item_name: event.contentName, price: event.value })),
  });
}

function pixelEvent(name: string, event: ItemEvent) {
  whenTagReady(pixelReady, () =>
    w().fbq?.("track", name, {
      content_ids: event.contentIds,
      content_type: "product",
      content_name: event.contentName,
      value: event.value,
      currency: event.currency ?? "INR",
    }),
  );
}

export function trackViewContent(event: ItemEvent) {
  pixelEvent("ViewContent", event);
  ga4Event("view_item", event);
}

export function trackInitiateCheckout(event: ItemEvent) {
  pixelEvent("InitiateCheckout", event);
  ga4Event("begin_checkout", event);
}

export interface PurchaseTrack {
  // The order ID. Sent as the Pixel's eventID, the same value the server-side
  // Conversions API sends as event_id (lib/meta-capi.ts), so Meta counts the
  // purchase once.
  orderId: string;
  value: number;
  currency?: string;
  items: Array<{ item_id: string; item_name: string; price: number }>;
}

// Purchase / purchase, once per order per browser (a reload of the thank-you
// page does not send it again). Returns false when it was already sent.
export function trackPurchase(purchase: PurchaseTrack): boolean {
  if (typeof window === "undefined") return false;
  const key = `purchase_tracked_${purchase.orderId}`;
  try {
    if (window.localStorage.getItem(key)) return false;
    window.localStorage.setItem(key, "1");
  } catch {
    // Storage blocked: send anyway; Meta and GA4 both de-duplicate on the order ID.
  }

  const currency = purchase.currency ?? "INR";
  if (ga4ViaGtm()) {
    const win = w();
    win.dataLayer = win.dataLayer ?? [];
    win.dataLayer.push({ ecommerce: null });
  }
  ga4Send("purchase", { transaction_id: purchase.orderId, value: purchase.value, currency, items: purchase.items });

  whenTagReady(pixelReady, () =>
    w().fbq?.(
      "track",
      "Purchase",
      {
        value: purchase.value,
        currency,
        content_ids: purchase.items.map((item) => item.item_id),
        content_type: "product",
      },
      { eventID: purchase.orderId },
    ),
  );
  return true;
}
