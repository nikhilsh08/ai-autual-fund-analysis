// One place for browser events so Pixel and GA4 stay in step. Never put
// personal data or fund names into event payloads.
type AnyWindow = Record<string, unknown> & {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

const w = () => (typeof window === "undefined" ? ({} as AnyWindow) : (window as unknown as AnyWindow));

export const ga4ViaGtm = () => process.env.NEXT_PUBLIC_GA4_VIA_GTM === "true";

interface ItemEvent {
  contentIds: string[];
  contentName: string;
  value: number;
  currency?: string;
}

function ga4Event(name: string, event: ItemEvent) {
  const win = w();
  const payload = {
    currency: event.currency ?? "INR",
    value: event.value,
    items: event.contentIds.map((id) => ({ item_id: id, item_name: event.contentName, price: event.value })),
  };
  if (ga4ViaGtm()) {
    win.dataLayer = win.dataLayer ?? [];
    win.dataLayer.push({ event: name, ecommerce: payload });
  } else if (typeof win.gtag === "function") {
    win.gtag("event", name, payload);
  }
}

function pixelEvent(name: string, event: ItemEvent) {
  const win = w();
  if (typeof win.fbq !== "function") return;
  win.fbq("track", name, {
    content_ids: event.contentIds,
    content_type: "product",
    content_name: event.contentName,
    value: event.value,
    currency: event.currency ?? "INR",
  });
}

export function trackViewContent(event: ItemEvent) {
  pixelEvent("ViewContent", event);
  ga4Event("view_item", event);
}

export function trackInitiateCheckout(event: ItemEvent) {
  pixelEvent("InitiateCheckout", event);
  ga4Event("begin_checkout", event);
}
