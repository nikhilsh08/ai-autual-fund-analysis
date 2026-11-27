// The addresses the three workshop pages are advertised on:
//   /personalfinance  -> the /v10 page
//   /personalfinance1 -> the /v20 page
//   /personalfinance2 -> the /v30 page
// next.config.ts serves each one from its /vNN route without changing the
// address in the browser. The booking, thank-you and refund pages sit under
// the same address (/personalfinance/checkout, /personalfinance/thank-you),
// so a buyer never sees /v10, /v20 or /v30.
import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";
import { LANDING_PAGES, LANDING_PUBLIC_PATH, LANDING_SOURCES } from "@/lib/landing/sources";
import { MMF_V10_CHECKOUT_PATH, MMF_V10_LANDING_PATH, MMF_V10_THANK_YOU_PATH } from "@/lib/landing/v10";
import { MPF_V20_CHECKOUT_PATH, MPF_V20_LANDING_PATH, MPF_V20_THANK_YOU_PATH } from "@/lib/landing/v20";
import {
  MPF_V30_CHECKOUT_PATH,
  MPF_V30_LANDING_PATH,
  MPF_V30_REFUND_PATH,
  MPF_V30_THANK_YOU_PATH,
} from "@/lib/landing/v30";

const APP_DIR = fileURLToPath(new URL("../../src/app", import.meta.url));

// First path segment of every page and route in src/app. Folders in brackets,
// such as (landing), group routes without adding a segment.
function topLevelSegments(): Set<string> {
  const segments = new Set<string>();
  for (const entry of readdirSync(APP_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (!entry.name.startsWith("(")) {
      segments.add(entry.name);
      continue;
    }
    for (const child of readdirSync(`${APP_DIR}/${entry.name}`, { withFileTypes: true })) {
      if (child.isDirectory()) segments.add(child.name);
    }
  }
  return segments;
}

describe("public addresses of the workshop pages", () => {
  it("serves each address, and the pages under it, from its own page", async () => {
    expect(await nextConfig.rewrites?.()).toEqual([
      { source: "/personalfinance", destination: "/v10" },
      { source: "/personalfinance/:path*", destination: "/v10/:path*" },
      { source: "/personalfinance1", destination: "/v20" },
      { source: "/personalfinance1/:path*", destination: "/v20/:path*" },
      { source: "/personalfinance2", destination: "/v30" },
      { source: "/personalfinance2/:path*", destination: "/v30/:path*" },
    ]);
  });

  it("keeps the buyer on the advertised address for booking, thank-you and refund policy", () => {
    // Used by the payment return page and the admin panel's Landing pages screen.
    expect(Object.values(LANDING_SOURCES).map((s) => [s.page, s.landing, s.checkout, s.thankYou])).toEqual([
      ["v10", "/personalfinance", "/personalfinance/checkout", "/personalfinance/thank-you"],
      ["v20", "/personalfinance1", "/personalfinance1/checkout", "/personalfinance1/thank-you"],
      ["v30", "/personalfinance2", "/personalfinance2/checkout", "/personalfinance2/thank-you"],
    ]);

    // Used by the pages themselves for their buttons, links and redirects.
    expect([MMF_V10_LANDING_PATH, MMF_V10_CHECKOUT_PATH, MMF_V10_THANK_YOU_PATH]).toEqual([
      "/personalfinance",
      "/personalfinance/checkout",
      "/personalfinance/thank-you",
    ]);
    expect([MPF_V20_LANDING_PATH, MPF_V20_CHECKOUT_PATH, MPF_V20_THANK_YOU_PATH]).toEqual([
      "/personalfinance1",
      "/personalfinance1/checkout",
      "/personalfinance1/thank-you",
    ]);
    expect([MPF_V30_LANDING_PATH, MPF_V30_CHECKOUT_PATH, MPF_V30_THANK_YOU_PATH, MPF_V30_REFUND_PATH]).toEqual([
      "/personalfinance2",
      "/personalfinance2/checkout",
      "/personalfinance2/thank-you",
      "/personalfinance2/refund-policy",
    ]);
  });

  it("links only to pages that exist under each route", () => {
    // /personalfinance/checkout is served by src/app/(landing)/v10/checkout, and so on.
    const served = (page: string, sub: string) =>
      ["page.tsx", "route.ts"].some((file) => existsSync(`${APP_DIR}/(landing)/${page}/${sub}/${file}`));

    for (const page of LANDING_PAGES) {
      expect(served(page, "checkout")).toBe(true);
      expect(served(page, "thank-you")).toBe(true);
    }
    expect(served("v30", "refund-policy")).toBe(true);
  });

  it("gives every page one address of a single path segment, used by no other page", () => {
    const paths = LANDING_PAGES.map((page) => LANDING_PUBLIC_PATH[page]);

    for (const path of paths) expect(path).toMatch(/^\/[a-z0-9-]+$/);
    expect(new Set(paths).size).toBe(LANDING_PAGES.length);
  });

  it("does not take an address that a page of the site already has", () => {
    // A real page wins over a rewrite, so the workshop page would never show.
    const taken = topLevelSegments();
    expect(taken.has("v10")).toBe(true); // the folders were read

    for (const page of LANDING_PAGES) {
      expect(taken.has(LANDING_PUBLIC_PATH[page].slice(1))).toBe(false);
    }
  });
});
