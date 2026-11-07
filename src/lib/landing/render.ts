import { formatIstDate, formatIstDateTime, formatIstTime } from "@/lib/ist";
import { MMF_COPY } from "@/lib/mmf-copy";

export interface LandingBatch {
  id: string;
  priceRupees: number;
  day1StartAt: Date;
  bookingCloseAt: Date;
  language: string | null;
}

export interface LandingConfig {
  courseId: string;
  canonicalUrl: string;
  title: string;
  description: string;
  ogImage?: string;
  pixelId?: string;
  gtmId?: string;
  gaId?: string;
  ga4ViaGtm: boolean;
  clarityId?: string;
  // Used for the price token when nothing is on sale.
  fallbackPriceRupees: number | null;
}

export class LandingRenderError extends Error {}

const TOKEN_RE = /\{(price|class date|booking close date)\}/;
const SUPPORT_SCRIPT = '<script src="/mmf/support.js"></script>';
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const inr = (rupees: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(rupees);

// The data-props JSON lives in an attribute, so it is entity-encoded.
function setPropDefault(html: string, prop: string, value: string): string {
  const re = new RegExp(`(&quot;${prop}&quot;:\\{[^}]*?&quot;default&quot;:&quot;)([^&]*)(&quot;)`);
  if (!re.test(html)) throw new LandingRenderError(`data-props has no "${prop}"`);
  return html.replace(re, `$1${escapeHtml(value)}$3`);
}

function headSnippet(cfg: LandingConfig, priceRupees: number | null): string {
  const parts: string[] = [
    `<title>${escapeHtml(cfg.title)}</title>`,
    `<meta name="description" content="${escapeHtml(cfg.description)}">`,
    `<link rel="canonical" href="${escapeHtml(cfg.canonicalUrl)}">`,
    `<meta property="og:title" content="${escapeHtml(cfg.title)}">`,
    `<meta property="og:description" content="${escapeHtml(cfg.description)}">`,
    `<meta property="og:url" content="${escapeHtml(cfg.canonicalUrl)}">`,
    `<meta property="og:type" content="website">`,
  ];
  if (cfg.ogImage) {
    parts.push(
      `<meta property="og:image" content="${escapeHtml(cfg.ogImage)}">`,
      `<meta name="twitter:card" content="summary_large_image">`,
    );
  }

  // support.js reuses window.React / window.ReactDOM when they exist and
  // skips its own page re-fetch when window.__resources is set (spec 5.3).
  parts.push(
    '<script src="/mmf/vendor/react.production.min.js"></script>',
    '<script src="/mmf/vendor/react-dom.production.min.js"></script>',
    "<script>window.__resources={};</script>",
  );

  const item = JSON.stringify({
    contentIds: [cfg.courseId],
    contentName: MMF_COPY.contentName,
    value: priceRupees ?? 0,
    currency: "INR",
  });

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

  // UTM capture (same sessionStorage keys as components/analytics/UTMCapture.tsx)
  // and ViewContent / view_item. InitiateCheckout fires on /checkout.
  parts.push(`<script>
(function(){try{var p=new URLSearchParams(location.search);${JSON.stringify(UTM_KEYS)}.forEach(function(k){var v=p.get(k);if(v)sessionStorage.setItem(k,v);});}catch(e){}
var item=${item};
if(typeof fbq==='function'){fbq('track','ViewContent',{content_ids:item.contentIds,content_type:'product',content_name:item.contentName,value:item.value,currency:item.currency});}
var ga={currency:item.currency,value:item.value,items:item.contentIds.map(function(id){return {item_id:id,item_name:item.contentName,price:item.value};})};
${cfg.ga4ViaGtm ? "window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'view_item',ecommerce:ga});" : "if(typeof gtag==='function'){gtag('event','view_item',ga);}"}
})();
</script>`);

  return parts.join("\n");
}

function bodyNoscript(cfg: LandingConfig): string {
  const parts: string[] = [];
  if (cfg.gtmId) {
    parts.push(`<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${escapeHtml(cfg.gtmId)}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`);
  }
  if (cfg.pixelId) {
    parts.push(`<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${escapeHtml(cfg.pixelId)}&ev=PageView&noscript=1" alt=""></noscript>`);
  }
  return parts.join("\n");
}

export function renderLanding(template: string, batch: LandingBatch | null, cfg: LandingConfig): string {
  if (!template.includes(SUPPORT_SCRIPT)) throw new LandingRenderError("template is missing the support.js tag");

  const priceRupees = batch ? batch.priceRupees : cfg.fallbackPriceRupees;
  const priceText = priceRupees === null ? "" : inr(priceRupees);
  const classDate = batch ? formatIstDate(batch.day1StartAt) : MMF_COPY.landing.dateToBeAnnounced;
  const closeText = batch ? formatIstDateTime(batch.bookingCloseAt) : MMF_COPY.landing.dateToBeAnnounced;

  let html = template.replace("<html>", '<html lang="en">');
  html = html
    .replaceAll("{price}", escapeHtml(priceText))
    .replaceAll("{class date}", escapeHtml(classDate))
    .replaceAll("{booking close date}", escapeHtml(closeText));

  html = setPropDefault(html, "startTime", batch ? formatIstTime(batch.day1StartAt) : "");
  html = setPropDefault(html, "language", batch?.language ?? "");

  if (batch) {
    const href = `/checkout?courseId=${encodeURIComponent(cfg.courseId)}&amp;batchId=${encodeURIComponent(batch.id)}`;
    html = html.replace('href="#" data-checkout="1"', `href="${href}" data-checkout="1"`);
  } else {
    html = html.replace(/<a href="#" data-checkout="1"[^>]*>[\s\S]*?<\/a>/, "");
    html = html.replace(
      /(<p[^>]*data-batch-line="1"[^>]*>)[\s\S]*?(<\/p>)/,
      `$1${escapeHtml(MMF_COPY.landing.nothingOnSale)}$2`,
    );
  }

  html = html.replace(SUPPORT_SCRIPT, `${headSnippet(cfg, priceRupees)}\n${SUPPORT_SCRIPT}`);
  html = html.replace("<body>", `<body>\n${bodyNoscript(cfg)}`);

  if (TOKEN_RE.test(html)) throw new LandingRenderError("unfilled token in rendered page");
  if (/data-checkout="1"/.test(html) && !batch) throw new LandingRenderError("checkout button rendered without a batch");
  return html;
}
