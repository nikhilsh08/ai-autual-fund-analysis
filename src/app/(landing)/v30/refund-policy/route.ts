import { renderV30RefundPolicy } from "@/lib/landing/render-v30";
import { htmlResponse, loadV20Template, v20Common } from "@/lib/landing/v20-data";

// GET /v30/refund-policy — the workshop's own refund policy (7 days after
// Day 2), linked from the v30 landing, checkout and thank-you pages. Static
// text; the HTML is cached for 5 minutes like the designer's _headers.
export function GET() {
    const html = renderV30RefundPolicy(loadV20Template("mpf-v30-refund-policy.html"), v20Common(""));
    return htmlResponse(html, "public, max-age=300");
}
