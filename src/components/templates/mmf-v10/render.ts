import type { Course } from "@prisma/client";
import { MMF_V10_BASE_CSS, MMF_V10_HOVER_CSS, MMF_V10_BODY_HTML } from "./template.generated";

export { MMF_V10_BASE_CSS, MMF_V10_HOVER_CSS };

type MmfValue = string | boolean;
type MmfValues = Record<string, MmfValue>;

function formatClassDate(d: Date): string {
  // e.g. "Saturday, 12 December 2026"
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(d);
}

function formatBookingCloseDate(d: Date): string {
  // e.g. "11 December, 8:00 pm IST"
  const datePart = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: "Asia/Kolkata",
  }).format(d);
  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  })
    .format(d)
    .toLowerCase();
  return `${datePart}, ${timePart} IST`;
}

function buildValues(batch: Course): MmfValues {
  const max = batch.maxSeats ?? 50;
  const seats = Math.max(0, max - batch.seatsSold);
  const low = seats <= 15;
  const hasStart = !!batch.startTime;
  const hasLang = !!batch.language;

  return {
    showBar: true,
    showStickyCta: true,
    hasStart,
    hasLang,
    startTime: batch.startTime ?? "",
    language: batch.language ?? "",
    lowSeats: low,
    notLowSeats: !low,
    seatsText: `${seats} of 50 seats left in this batch.`,
    barSeats: low ? `${seats} of 50 seats left` : "50 seats per batch",
    stickyLine: low ? `${seats} of 50 seats left` : "2-day live workshop + 5 guides",
  };
}

// Removes a <!--mmf:if EXPR--> … <!--mmf:endif--> block, keeping the inner
// HTML only when values[EXPR] is truthy. None of the blocks in the current
// template nest, matching the converter that produced them (Day 1B).
function applyIfBlocks(html: string, values: MmfValues): string {
  return html.replace(
    /<!--mmf:if ([a-zA-Z0-9_]+)-->([\s\S]*?)<!--mmf:endif-->/g,
    (_m, expr: string, inner: string) => (values[expr] ? inner : "")
  );
}

function applyInterpolation(html: string, values: MmfValues): string {
  return html
    // The one boolean HTML attribute the handoff sets via {{ true }}
    // (the first FAQ item stays open on load).
    .replace(/\sopen="\{\{\s*true\s*\}\}"/g, " open")
    .replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_m, expr: string) => {
      const v = values[expr];
      if (v === undefined) {
        throw new Error(`mmf render: no value provided for {{ ${expr} }}`);
      }
      return typeof v === "boolean" ? String(v) : v;
    });
}

/**
 * Fills ₹{price}, {class date}, {booking close date} and the seat lines into
 * the generated template, and resolves the <!--mmf:if--> / {{ }} markers.
 * Throws if any `{` survives, per BACKEND.md's launch checklist.
 */
export function renderMmfBody(batch: Course): string {
  if (!batch.startDate) {
    throw new Error(`mmf render: batch ${batch.id} is missing startDate`);
  }

  const values = buildValues(batch);

  let html = applyIfBlocks(MMF_V10_BODY_HTML, values);
  html = applyInterpolation(html, values);

  const priceText = batch.price.toLocaleString("en-IN");
  html = html
    .replace(/₹\{price\}/g, `₹${priceText}`)
    .replace(/\{class date\}/g, formatClassDate(batch.startDate))
    .replace(
      /\{booking close date\}/g,
      batch.bookingCloseAt ? formatBookingCloseDate(batch.bookingCloseAt) : "to be announced"
    );

  const leftoverIndex = html.indexOf("{");
  if (leftoverIndex !== -1) {
    const sample = html.slice(leftoverIndex, leftoverIndex + 60);
    throw new Error(`mmf render: unresolved token left in rendered HTML near: ${sample}`);
  }

  return html;
}
