"use client";

/**
 * UTMCapture — Persists UTM parameters across page navigation
 * ============================================================
 * Problem: Facebook ads add ?utm_source=facebook&utm_medium=cpc&... to the
 * LANDING PAGE URL. But by the time the user reaches /checkout, those UTMs
 * are gone from the URL (normal browser navigation strips them).
 *
 * Solution: On every page load, if UTM params exist in the URL, save them to
 * sessionStorage. The checkout page falls back to sessionStorage if the URL
 * has no UTMs. sessionStorage clears when the browser tab is closed, so it
 * accurately represents the "session" that led to the purchase.
 *
 * Place this component inside RootLayout so it runs on every page.
 */

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export function UTMCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const hasAnyUtm = UTM_KEYS.some((key) => searchParams.get(key));

    if (hasAnyUtm) {
      // A UTM-tagged URL was loaded — persist all values to sessionStorage
      UTM_KEYS.forEach((key) => {
        const value = searchParams.get(key);
        if (value) {
          sessionStorage.setItem(key, value);
        }
      });
      console.log("[UTMCapture] Saved UTMs to sessionStorage:", {
        utm_source: searchParams.get("utm_source"),
        utm_medium: searchParams.get("utm_medium"),
        utm_campaign: searchParams.get("utm_campaign"),
      });
    }
  }, [searchParams]);

  return null; // Renders nothing
}

/**
 * Helper: Read saved UTMs from sessionStorage (use in checkout page)
 * Returns undefined for each key if not present.
 */
export function getSessionUTMs() {
  if (typeof window === "undefined") return {};
  return {
    utmSource: sessionStorage.getItem("utm_source") || undefined,
    utmMedium: sessionStorage.getItem("utm_medium") || undefined,
    utmCampaign: sessionStorage.getItem("utm_campaign") || undefined,
    utmTerm: sessionStorage.getItem("utm_term") || undefined,
    utmContent: sessionStorage.getItem("utm_content") || undefined,
  };
}
