import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SKIP_DIRS = new Set(["node_modules", ".git", ".next", "docs"]);
const TEXT_EXT = /\.(ts|tsx|js|mjs|cjs|json|md|css|yml|yaml|txt|env|example)$/i;

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (!SKIP_DIRS.has(name)) walk(full, out);
    } else if (TEXT_EXT.test(name) || name.startsWith(".env")) {
      out.push(full);
    }
  }
  return out;
}

describe("Zwitch removal (N3)", () => {
  it("leaves no reference to zwitch anywhere in the repo", () => {
    const hits = walk(ROOT)
      .filter((file) => !file.endsWith("no-zwitch.test.ts"))
      .filter((file) => /zwitch/i.test(readFileSync(file, "utf8")))
      .map((file) => relative(ROOT, file));

    expect(hits).toEqual([]);
  });
});
