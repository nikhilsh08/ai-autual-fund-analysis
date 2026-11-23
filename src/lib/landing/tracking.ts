// Tracking tags shared by the server-rendered landing pages (v10, v20) and the
// v20 checkout and thank-you pages: Meta Pixel, Google Tag Manager, GA4 and
// Microsoft Clarity, plus the browser events each page fires. The Purchase
// event uses the order ID as eventID, the same value the server-side Meta
// Conversions API sends as event_id (src/lib/meta-capi.ts), so Meta counts a
// purchase once.

export interface TrackingConfig {
  pixelId?: string;
  gtmId?: string;
  gaId?: string;
  ga4ViaGtm: boolean;
  clarityId?: string;
}

export interface TrackedItem {
  contentIds: string[];
  contentName: string;
  value: number;
  currency: string;
}

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

export function trackingConfigFromEnv(): TrackingConfig {
  return {
    pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    gtmId: process.env.NEXT_PUBLIC_GTM_ID,
    gaId: process.env.NEXT_PUBLIC_GA_ID,
    ga4ViaGtm: process.env.NEXT_PUBLIC_GA4_VIA_GTM === "true",
    clarityId: process.env.NEXT_PUBLIC_CLARITY_ID,
  };
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// JSON that is safe inside an inline <script>: no "</script>" or "<!--" can end it early.
export function scriptJson(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(new RegExp(String.fromCharCode(0x2028), "g"), "\\u2028")
    .replace(new RegExp(String.fromCharCode(0x2029), "g"), "\\u2029");
}

// The tag loaders, each only when its ID is configured. Fires PageView.
export function trackingTags(cfg: TrackingConfig): string[] {
  const parts: string[] = [];

  if (cfg.pixelId) {
    parts.push(`<!-- Meta Pixel -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${escapeHtml(cfg.pixelId)}');
fbq('track','PageView');
</script>`);
  }

  if (cfg.gtmId) {
    parts.push(`<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${escapeHtml(cfg.gtmId)}');</script>`);
  }

  if (cfg.gaId && !cfg.ga4ViaGtm) {
    parts.push(`<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${escapeHtml(cfg.gaId)}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${escapeHtml(cfg.gaId)}');</script>`);
  }

  if (cfg.clarityId) {
    parts.push(`<!-- Microsoft Clarity -->
<script>(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${escapeHtml(cfg.clarityId)}");</script>`);
  }

  return parts;
}

export function trackingNoscript(cfg: TrackingConfig): string {
  const parts: string[] = [];
  if (cfg.gtmId) {
    parts.push(`<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${escapeHtml(cfg.gtmId)}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`);
  }
  if (cfg.pixelId) {
    parts.push(`<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${escapeHtml(cfg.pixelId)}&ev=PageView&noscript=1" alt=""></noscript>`);
  }
  return parts.join("\n");
}

// GA4 event code for an inline script: through GTM's dataLayer or gtag directly.
function ga4Call(cfg: TrackingConfig, eventName: string, payloadVar: string): string {
  return cfg.ga4ViaGtm
    ? `window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'${eventName}',ecommerce:${payloadVar}});`
    : `if(typeof gtag==='function'){gtag('event','${eventName}',${payloadVar});}`;
}

// Landing page: UTM capture (same sessionStorage keys as
// components/analytics/UTMCapture.tsx), ViewContent / view_item on load, and
// AddToCart / add_to_cart once per page view when the button that goes to
// checkout (a[data-checkout]) is clicked. InitiateCheckout fires on checkout.
export function landingEventsScript(cfg: TrackingConfig, item: TrackedItem): string {
  return `<script>
(function(){try{var p=new URLSearchParams(location.search);${JSON.stringify(UTM_KEYS)}.forEach(function(k){var v=p.get(k);if(v)sessionStorage.setItem(k,v);});}catch(e){}
var item=${scriptJson(item)};
if(typeof fbq==='function'){fbq('track','ViewContent',{content_ids:item.contentIds,content_type:'product',content_name:item.contentName,value:item.value,currency:item.currency});}
var ga={currency:item.currency,value:item.value,items:item.contentIds.map(function(id){return {item_id:id,item_name:item.contentName,price:item.value};})};
${ga4Call(cfg, "view_item", "ga")}
// AddToCart / add_to_cart: once per page view, when the visitor clicks the
// button that goes to checkout. Listens on the document because support.js
// re-renders the page.
var added=false;
document.addEventListener('click',function(e){
var a=e.target&&e.target.closest?e.target.closest('a[data-checkout]'):null;
if(!a||added)return;added=true;
if(typeof fbq==='function'){fbq('track','AddToCart',{content_ids:item.contentIds,content_type:'product',content_name:item.contentName,value:item.value,currency:item.currency});}
${ga4Call(cfg, "add_to_cart", "ga")}
},true);
})();
</script>`;
}

// Checkout page: InitiateCheckout / begin_checkout once per batch per browser tab.
export function checkoutEventsScript(cfg: TrackingConfig, item: TrackedItem, onceKey: string): string {
  return `<script>
(function(){var item=${scriptJson(item)},key=${scriptJson(onceKey)};
try{if(sessionStorage.getItem(key))return;sessionStorage.setItem(key,'1');}catch(e){}
if(typeof fbq==='function'){fbq('track','InitiateCheckout',{content_ids:item.contentIds,content_type:'product',content_name:item.contentName,value:item.value,currency:item.currency});}
var ga={currency:item.currency,value:item.value,items:item.contentIds.map(function(id){return {item_id:id,item_name:item.contentName,price:item.value};})};
${ga4Call(cfg, "begin_checkout", "ga")}
})();
</script>`;
}

// Thank-you page, paid orders only: Purchase / purchase once per order per
// browser. eventID = order ID, matching the Conversions API event_id.
export function purchaseEventScript(cfg: TrackingConfig, purchase: TrackedItem & { orderId: string }): string {
  return `<script>
(function(){var p=${scriptJson(purchase)},key='purchase_tracked_'+p.orderId;
try{if(localStorage.getItem(key))return;localStorage.setItem(key,'1');}catch(e){}
if(typeof fbq==='function'){fbq('track','Purchase',{value:p.value,currency:p.currency,content_ids:p.contentIds,content_type:'product'},{eventID:p.orderId});}
var ga={transaction_id:p.orderId,currency:p.currency,value:p.value,items:p.contentIds.map(function(id){return {item_id:id,item_name:p.contentName,price:p.value};})};
${ga4Call(cfg, "purchase", "ga")}
})();
</script>`;
}
