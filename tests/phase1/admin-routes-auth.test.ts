import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ADMIN_API = fileURLToPath(new URL("../../src/app/api/admin", import.meta.url));

// Intentionally public: returns a constant body and is rate limited (N4).
const PUBLIC_ALLOWLIST = ["is-admin/route.ts"];

function routeFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) routeFiles(full, out);
    else if (name === "route.ts") out.push(full);
  }
  return out;
}

function isGuarded(src: string): boolean {
  const usesVerifyAdmin = /\bverifyAdmin\(/.test(src);
  const usesSessionRole = /\bauth\(\)/.test(src) && /ADMIN/.test(src);
  return usesVerifyAdmin || usesSessionRole;
}

describe("every /api/admin/** handler checks the admin role (N14)", () => {
  it("has no unguarded handler outside the allowlist", () => {
    const files = routeFiles(ADMIN_API);
    expect(files.length).toBeGreaterThan(20);

    const unguarded = files
      .map((f) => relative(ADMIN_API, f).replace(/\\/g, "/"))
      .filter((rel) => !PUBLIC_ALLOWLIST.includes(rel))
      .filter((rel) => !isGuarded(readFileSync(join(ADMIN_API, rel), "utf8")));

    expect(unguarded).toEqual([]);
  });
});
