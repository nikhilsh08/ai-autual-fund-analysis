// ============================================================================
// META CONVERSIONS API (CAPI) - SERVER-SIDE EVENT TRACKING
// ============================================================================
// Sends Purchase events directly from server → Meta, bypassing the browser.
//
// WHY THIS EXISTS:
//   - Client-side Pixel fires only when user lands on /order-status page
//   - If user closes tab after payment, the Pixel event is NEVER sent
//   - Webhooks call verifyCashfreePayment() which calls this function
//   - This guarantees Purchase is ALWAYS tracked, even without the status page
//
// DEDUPLICATION:
//   - We use orderId as event_id in BOTH this server call AND the browser pixel
//   - Meta automatically deduplicates events with the same event_id
//   - So when both fire (user DID land on status page), it counts as ONE purchase
//
// DOCS: https://developers.facebook.com/docs/marketing-api/conversions-api
// ============================================================================

import crypto from "crypto";

// --- TYPE DEFINITIONS ---
interface CAPIEventItem {
  item_id: string;
  item_name: string;
  price: number;
}

export interface MetaCAPIPurchasePayload {
  orderId: string;        // Used as event_id for deduplication
  amount: number;         // Total order amount in INR
  currency: string;       // "INR"
  email?: string;         // Customer email (will be SHA-256 hashed)
  phone?: string;         // Customer phone (will be SHA-256 hashed)
  name?: string;          // Customer name (will be SHA-256 hashed)
  items?: CAPIEventItem[];
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  clientIpAddress?: string;  // Optional: improves match quality
  clientUserAgent?: string;  // Optional: improves match quality
  fbclid?: string;           // Optional: Facebook Click ID from fbclid URL param
}

// --- HELPER: SHA-256 HASH ---
// Meta requires PII (email, phone, name) to be SHA-256 hashed
// IMPORTANT: Normalize before hashing (lowercase, trim whitespace)
function sha256Hash(value: string): string {
  return crypto
    .createHash("sha256")
    .update(value.toLowerCase().trim())
    .digest("hex");
}

// --- HELPER: NORMALIZE PHONE ---
// Meta expects phone in E.164 format (+91XXXXXXXXXX) without spaces/dashes
function normalizePhone(phone: string): string {
  // Remove all non-digit characters except leading +
  const cleaned = phone.replace(/[^\d+]/g, "");
  // Add +91 if it's a 10-digit Indian number without country code
  if (/^\d{10}$/.test(cleaned)) {
    return `+91${cleaned}`;
  }
  return cleaned;
}

// ============================================================================
// MAIN FUNCTION: SEND META CAPI PURCHASE EVENT
// ============================================================================
export async function sendMetaCAPIPurchaseEvent(
  payload: MetaCAPIPurchasePayload
): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  // --- GUARD: Skip if not configured ---
  if (!pixelId || !accessToken) {
    console.warn(
      "[Meta CAPI] Skipping: META_CAPI_ACCESS_TOKEN or NEXT_PUBLIC_META_PIXEL_ID not set."
    );
    return;
  }

  // --- BUILD USER DATA (hashed PII) ---
  // Meta uses this to match server events with real users
  const userData: Record<string, string> = {};

  if (payload.email) {
    userData.em = sha256Hash(payload.email);
  }
  if (payload.phone) {
    userData.ph = sha256Hash(normalizePhone(payload.phone));
  }
  if (payload.name) {
    // Meta expects first name (fn) and last name (ln) separately
    const nameParts = payload.name.trim().split(" ");
    userData.fn = sha256Hash(nameParts[0] || "");
    if (nameParts.length > 1) {
      userData.ln = sha256Hash(nameParts.slice(1).join(" "));
    }
  }
  if (payload.clientIpAddress) {
    userData.client_ip_address = payload.clientIpAddress;
  }
  if (payload.clientUserAgent) {
    userData.client_user_agent = payload.clientUserAgent;
  }
  if (payload.fbclid) {
    userData.fbc = `fb.1.${Date.now()}.${payload.fbclid}`;
  }

  // --- BUILD CUSTOM DATA ---
  const customData: Record<string, any> = {
    value: payload.amount,
    currency: payload.currency || "INR",
    content_type: "product",
  };

  if (payload.items && payload.items.length > 0) {
    customData.content_ids = payload.items.map((item) => item.item_id);
    customData.contents = payload.items.map((item) => ({
      id: item.item_id,
      quantity: 1,
      item_price: item.price,
    }));
    customData.num_items = payload.items.length;
  }

  // --- BUILD EVENT PAYLOAD ---
  const eventData: Record<string, any> = {
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000), // Unix timestamp in seconds
    event_id: payload.orderId, // KEY: Enables deduplication with browser pixel
    action_source: "website",  // Required for Conversions API
    user_data: userData,
    custom_data: customData,
  };

  // --- BUILD API REQUEST ---
  const apiUrl = `https://graph.facebook.com/v19.0/${pixelId}/events`;

  const body = {
    data: [eventData],
    access_token: accessToken,
  };

  // --- SEND TO META ---
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      console.error("[Meta CAPI] API Error:", JSON.stringify(result.error || result));
    } else {
      console.log(
        `[Meta CAPI] ✅ Purchase event sent for order ${payload.orderId}. Events received: ${result.events_received}`
      );
    }
  } catch (err) {
    // IMPORTANT: Never throw — payment is already confirmed in DB
    // A CAPI failure should never affect the user's purchase experience
    console.error("[Meta CAPI] Network/Fetch Error:", err);
  }
}
