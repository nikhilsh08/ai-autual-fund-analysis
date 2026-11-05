#!/usr/bin/env node
// Converts the Master Mutual Funds v10 designer handoff (a single index.html
// using the dc-runtime <x-dc>/<sc-if>/style-hover authoring format) into a
// plain template the website can fill with real data. See
// docs/master-mutual-funds-v10/day-2-handoff.md for what this does and why.
//
// Usage: node scripts/convert-mmf-template.mjs <path-to-handoff-folder>

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const OUTPUT_PATH = resolve(
  PROJECT_ROOT,
  "src/components/templates/mmf-v10/template.generated.ts"
);

function fail(message) {
  console.error(`convert-mmf-template: ${message}`);
  process.exit(1);
}

const handoffArg = process.argv[2];
if (!handoffArg) {
  fail("missing argument — usage: node scripts/convert-mmf-template.mjs <path-to-handoff-folder>");
}

const handoffDir = resolve(process.cwd(), handoffArg);
const indexPath = resolve(handoffDir, "index.html");

let raw;
try {
  raw = readFileSync(indexPath, "utf8");
} catch {
  fail(`could not read ${indexPath} — point this script at the unzipped handoff folder`);
}

// ---------------------------------------------------------------------------
// 1. Pull apart the dc-runtime document: <x-dc> → <helmet><style>…</style>
//    </helmet> → the visible body → the dc-runtime's own <script
//    type="text/x-dc"> logic block, which this project's renderer replaces
//    and does not need.
// ---------------------------------------------------------------------------

const xdcMatch = raw.match(/<x-dc>([\s\S]*?)<\/x-dc>/);
if (!xdcMatch) fail("no <x-dc> block found in index.html — is this the dc-runtime handoff format?");
const xdcInner = xdcMatch[1];

const helmetMatch = xdcInner.match(/<helmet>([\s\S]*?)<\/helmet>/);
if (!helmetMatch) fail("no <helmet> block found inside <x-dc>");
const helmetInner = helmetMatch[1];

const styleMatch = helmetInner.match(/<style>([\s\S]*?)<\/style>/);
if (!styleMatch) fail("no <style> block found inside <helmet>");
const baseCss = styleMatch[1].trim();

const helmetEnd = xdcInner.indexOf("</helmet>");
let body = xdcInner.slice(helmetEnd + "</helmet>".length);
// Drop the dc-runtime's own props/logic <script type="text/x-dc">…</script>
// trailer — it belongs to support.js, which this project does not use.
body = body.replace(/<script type="text\/x-dc"[\s\S]*?<\/script>\s*$/, "").trim();

// ---------------------------------------------------------------------------
// 2. style-hover="…" → a generated class + a real CSS :hover rule.
//    React inline styles cannot express :hover, so each hover style becomes
//    its own class and the declarations move into a stylesheet string.
// ---------------------------------------------------------------------------

let hoverCount = 0;
const hoverRules = [];

body = body.replace(
  /<[a-zA-Z][a-zA-Z0-9-]*(?:\s+[^<>]*?)?\sstyle-hover="[^"]*"[^<>]*>/g,
  (tag) => {
    const hoverMatch = tag.match(/\sstyle-hover="([^"]*)"/);
    if (!hoverMatch) return tag;
    hoverCount += 1;
    const className = `mmf-hv-${hoverCount}`;
    hoverRules.push(`.${className}:hover{${hoverMatch[1]}}`);

    let next = tag.replace(/\sstyle-hover="[^"]*"/, "");
    if (/\sclass="[^"]*"/.test(next)) {
      next = next.replace(/\sclass="([^"]*)"/, (_m, existing) => ` class="${existing} ${className}"`);
    } else {
      next = next.replace(/^<([a-zA-Z][a-zA-Z0-9-]*)/, `<$1 class="${className}"`);
    }
    return next;
  }
);

const hoverCss = hoverRules.join("\n");

// ---------------------------------------------------------------------------
// 3. <sc-if value="{{ expr }}" …>…</sc-if> → <!--mmf:if expr--> markers.
//    None of the handoff's sc-if blocks nest, so one pass is enough; the
//    renderer (a later day) shows/hides between the two comment markers
//    based on the named value it computes.
// ---------------------------------------------------------------------------

let ifCount = 0;
body = body.replace(
  /<sc-if\s+value="\{\{\s*([^}]+?)\s*\}\}"[^>]*>([\s\S]*?)<\/sc-if>/g,
  (_m, expr, inner) => {
    ifCount += 1;
    return `<!--mmf:if ${expr.trim()}-->${inner}<!--mmf:endif-->`;
  }
);

// ---------------------------------------------------------------------------
// 4. Point image paths at /mmf/assets/, where Day 2 copied the handoff's
//    assets/ folder.
// ---------------------------------------------------------------------------

body = body
  .replace(/src="\.\/assets\//g, 'src="/mmf/assets/')
  .replace(/src="assets\//g, 'src="/mmf/assets/');

// ---------------------------------------------------------------------------
// 5. Refuse to finish if a guide PDF is linked, or a designer-only tag
//    survived the conversion above.
// ---------------------------------------------------------------------------

const problems = [];
if (/\.pdf\b/i.test(body)) problems.push("a .pdf reference remains in the template — guides must never be linked from the page");
if (/guides\//.test(body)) problems.push('a "guides/" path remains in the template');
if (/style-hover="/.test(body)) problems.push("a style-hover attribute was not converted");
if (/<sc-if\b/.test(body) || /<\/sc-if>/.test(body)) problems.push("an <sc-if> block was not converted");
if (/<x-dc\b/.test(body) || /<\/x-dc>/.test(body)) problems.push("a leftover <x-dc> tag remains in the template body");
if (/<helmet\b/.test(body) || /<\/helmet>/.test(body)) problems.push("a leftover <helmet> tag remains in the template body");

if (problems.length) {
  fail(`refusing to write the template — fix the handoff or this script:\n  - ${problems.join("\n  - ")}`);
}

// ---------------------------------------------------------------------------
// 6. Write the generated TypeScript module. Never edit this file by hand —
//    rerun this script against a new handoff instead.
// ---------------------------------------------------------------------------

function toTemplateLiteral(source) {
  return source.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });

const generatedAt = new Date().toISOString();
const output = `// GENERATED by scripts/convert-mmf-template.mjs from ${handoffArg}
// on ${generatedAt}. Do not edit by hand — update the handoff and rerun the
// converter instead. See docs/master-mutual-funds-v10/day-2-handoff.md.
//
// MMF_V10_BODY_HTML still contains two kinds of unresolved markers that a
// later renderer fills in:
//   - literal tokens: ₹{price}, {class date}, {booking close date}
//   - <!--mmf:if EXPR--> … <!--mmf:endif--> show/hide blocks, and {{ EXPR }}
//     text interpolation, both keyed by the same named values (e.g.
//     hasStart, lowSeats, seatsText, barSeats, stickyLine — see BACKEND.md)

export const MMF_V10_BASE_CSS = \`${toTemplateLiteral(baseCss)}\`;

export const MMF_V10_HOVER_CSS = \`${toTemplateLiteral(hoverCss)}\`;

export const MMF_V10_BODY_HTML = \`${toTemplateLiteral(body)}\`;

export const MMF_V10_TEMPLATE_META = {
  sourceHandoff: ${JSON.stringify(handoffArg)},
  generatedAt: ${JSON.stringify(generatedAt)},
  hoverStylesConverted: ${hoverCount},
  scIfBlocksConverted: ${ifCount},
} as const;
`;

writeFileSync(OUTPUT_PATH, output, "utf8");

console.log(
  `Done. Wrote src/components/templates/mmf-v10/template.generated.ts (${hoverCount} hover styles converted, ${ifCount} sc-if blocks converted).`
);
