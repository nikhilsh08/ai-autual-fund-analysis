// The addresses the three workshop pages are advertised on:
//   /personalfinance  -> the /v10 page
//   /personalfinance1 -> the /v20 page
//   /personalfinance2 -> the /v30 page
// next.config.ts serves each one from its /vNN route without changing the
// address in the browser.
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";
import { LANDING_PAGES, LANDING_PUBLIC_PATH } from "@/lib/landing/sources";

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
  it("serves each address from its own page", async () => {
    expect(await nextConfig.rewrites?.()).toEqual([
      { source: "/personalfinance", destination: "/v10" },
      { source: "/personalfinance1", destination: "/v20" },
      { source: "/personalfinance2", destination: "/v30" },
    ]);
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
