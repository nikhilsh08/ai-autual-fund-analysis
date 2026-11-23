// A batch's two days can differ (owner, 23 Nov 2026): day 2 can be any later
// date, with its own start time and its own length (Admin → Batches).
//
// The designers' page files are written for two days in a row that start at
// the same time and run for the same length. They print one time after both
// dates ("Saturday 5 Dec and Sunday 6 Dec, 10:30 AM IST"), "Both days start
// at …", "about 2 hours each day" and "Sat 5 Dec – Sun 6 Dec".
//
// The functions here rewrite those places for a batch whose days differ, and
// only for such a batch. With matching days they return the page file
// unchanged, so the pages read exactly as they did before. Call them on the
// page file itself, before the weekdays (fillWeekdays) and the tokens go in.

import { formatDuration, formatIstTime } from "@/lib/ist";
import { day2Minutes, daysInARow, sameStartTime, type TwoDays } from "@/lib/batches/schedule";

export interface EachDay {
  // Each day's start time ("10:30 AM", "7:00 PM") when the two differ. Null
  // when both days start at the same time, and when nothing is on sale.
  times: [string, string] | null;
  // Day 2 is the day after day 1.
  inARow: boolean;
  // Length of each session in minutes: [day 1, day 2].
  minutes: [number, number];
}

export function eachDayOf(batch: TwoDays): EachDay {
  return {
    times: sameStartTime(batch) ? null : [formatIstTime(batch.day1StartAt), formatIstTime(batch.day2StartAt)],
    inARow: daysInARow(batch),
    minutes: [batch.durationMinutes, day2Minutes(batch)],
  };
}

// "7:00 PM" -> "7 PM", for the one-line bars on phones.
const compact = (time: string) => time.replace(":00", "");

// A bar is one line that is cut off at the screen edge. With two times it is
// longer, so it may run onto a second line instead.
const BAR_MAY_WRAP = 'style="flex-wrap:wrap;white-space:normal"';

// ------------------------------------------------- /v20 and /v30 page files

const HOOK_RE = /<(span|i) data-(?:val|out)="startTime"><\/\1>/g;
const DAY1_TOKEN = "{class date}";
const DAY2_TOKEN = "{day 2 date}";

// The end of a date token, past the </b> that closes a bold date.
function tokenEnd(text: string, at: number, token: string): number {
  const end = at + token.length;
  return text.startsWith("</b>", end) ? end + 4 : end;
}

// Every start-time hook on a line speaks for the date printed before it.
//   after day 1's date            -> day 1's time
//   after day 2's date            -> day 2's time
//   after both dates (one time)   -> each date gets its own time
// A hook with no date before it is left alone (it shows day 1's time).
function timesOnLine(line: string, [time1, time2]: [string, string]): string {
  let out = "";
  let cursor = 0;
  for (const hook of line.matchAll(HOOK_RE)) {
    const at = hook.index ?? 0;
    let before = line.slice(cursor, at);
    const day1At = before.lastIndexOf(DAY1_TOKEN);
    const day2At = before.lastIndexOf(DAY2_TOKEN);
    let shown = hook[0];
    if (day2At > day1At) {
      shown = `${time2} IST`;
      if (day1At !== -1) {
        // "Sat 5 Dec – Sun 6 Dec, …" is the short line used on phones.
        const short = /\bSat (?:<b>)?$/.test(before.slice(0, day1At));
        const end = tokenEnd(before, day1At, DAY1_TOKEN);
        const rest = before.slice(end).replace(/(?:, starting | · |, )$/, short ? " " : ", ");
        before = short
          ? `${before.slice(0, end)} ${compact(time1)}${rest.replace(" – ", " · ")}`
          : `${before.slice(0, end)}, ${time1} IST${rest}`;
        if (short) shown = `${compact(time2)} IST`;
      }
    } else if (day1At !== -1) {
      shown = `${time1} IST`;
    }
    out += before + shown;
    cursor = at + hook[0].length;
  }
  return out + line.slice(cursor);
}

// src/landing/mpf-v20*.html and mpf-v30*.html (landing, checkout, thank-you).
export function fillEachDayMpf(html: string, days: EachDay): string {
  let out = html;

  if (days.times) {
    const [time1, time2] = days.times;
    const short = `Sat {class date} ${compact(time1)} · Sun {day 2 date} ${compact(time2)} IST`;
    const long = `Saturday {class date}, ${time1} IST and Sunday {day 2 date}, ${time2} IST`;
    out = out
      // FAQ and schedule lead.
      .replace(
        /Both days start at <span data-val="startTime"><\/span>\./g,
        `Day 1 starts at ${time1} IST and Day 2 at ${time2} IST.`,
      )
      // First screen: one item per day, each with its time, and no third item.
      .replace(
        /<span>Saturday \{class date\}<\/span><span>Sunday \{day 2 date\}<\/span><span data-if="hasStart">(?:<span>)?<span data-val="startTime"><\/span>(?:<\/span>)?<\/span>/,
        `<span>Saturday {class date}, ${time1} IST</span><span>Sunday {day 2 date}, ${time2} IST</span>`,
      )
      // Bottom bar and "starts" line, built by the page's own script (/v20, then /v30).
      .replace("'Sat {class date} – Sun {day 2 date} · ' + (cfg.startTime || 'live online')", `'${short}'`)
      .replace("['Saturday {class date} and Sunday {day 2 date}', cfg.startTime, cfg.language]", `['${long}', cfg.language]`)
      .replace(
        /"Sat \{class date\} – Sun \{day 2 date\}"\+\(window\.innerWidth<390\?"":" · "\+\(\w+\.startTime\|\|"live online"\)\)/,
        `(window.innerWidth<390?"Sat {class date} – Sun {day 2 date}":"${short}")`,
      )
      .replace(/\["Saturday \{class date\} and Sunday \{day 2 date\}",\w+\.startTime,/, `["${long}",`)
      .replaceAll('<div class="bar">', `<div class="bar" ${BAR_MAY_WRAP}>`)
      // On phones the price may move to the second line: the dot before it is
      // then shown on wide screens only (class "bl"), so no line ends in a dot.
      .replace('<span>·</span><span><b>₹{price}</b></span>', '<span class="bl">·</span><span><b>₹{price}</b></span>')
      .replace('<span class="pr">·</span><span class="pr"><b>₹{price}</b></span>', '<span class="pr bl">·</span><span class="pr"><b>₹{price}</b></span>');
    out = out
      .split("\n")
      .map((line) => (line.includes('"startTime"') ? timesOnLine(line, [time1, time2]) : line))
      .join("\n");
  }

  // "Sat 5 Dec – Sun 6 Dec" reads as a run of days: true only of two days in a row.
  if (!days.inARow) out = out.replace(/ – (?=Sun (?:<b>)?\{day 2 date\})/g, " and ");

  return out;
}

// ------------------------------------------------- /v10 page file

const V10_BAR_LONG = "Saturday <b>{day 1 short date}</b> and Sunday <b>{day 2 short date}</b>{{ timeComma }}";
const V10_BAR_SHORT = "Sat <b>{day 1 short date}</b> – Sun <b>{day 2 short date}</b>{{ timeComma }}";
const V10_FIRST_SCREEN =
  '<span>{day 1}</span><span class="dot"></span><span>{day 2}</span><sc-if value="{{ hasStart }}" hint-placeholder-val="{{ false }}"><span class="dot"></span><span>{{ startTime }} IST</span></sc-if>';

// src/landing/mmf-v10.html. {{ timeComma }} and {{ bothStart }} are the page's
// own values for one shared start time; after a day 1 date they stay, since
// the page is given day 1's time.
export function fillEachDayV10(html: string, days: EachDay): string {
  let out = html;

  const [minutes1, minutes2] = days.minutes;
  if (minutes1 !== minutes2) {
    const length1 = formatDuration(minutes1);
    const length2 = formatDuration(minutes2);
    out = out
      .replace("Saturday {session duration} + Sunday {session duration}", `Saturday ${length1} + Sunday ${length2}`)
      .replaceAll("{session duration} each", `${length1} and ${length2}`);
  }

  if (days.times) {
    const [time1, time2] = days.times;
    out = out
      .replace(
        V10_BAR_LONG,
        `Saturday <b>{day 1 short date}</b>, ${time1} IST and Sunday <b>{day 2 short date}</b>, ${time2} IST`,
      )
      .replace(
        V10_BAR_SHORT,
        `Sat <b>{day 1 short date}</b> ${compact(time1)} · Sun <b>{day 2 short date}</b> ${compact(time2)} IST`,
      )
      .replace(
        V10_FIRST_SCREEN,
        `<span>{day 1}, ${time1} IST</span><span class="dot"></span><span>{day 2}, ${time2} IST</span>`,
      )
      .replaceAll("{day 1} and {day 2}{{ timeComma }}", `{day 1}, ${time1} IST and {day 2}, ${time2} IST`)
      .replaceAll("{day 2}{{ timeComma }}", `{day 2}, ${time2} IST`)
      .replaceAll("{{ bothStart }}", ` Day 1 starts at ${time1} IST and Day 2 at ${time2} IST.`)
      .replace('<div class="abar">', `<div class="abar" ${BAR_MAY_WRAP}>`)
      // On phones the price may move to the second line: the dot before it is
      // then shown on wide screens only (class "al"), so no line ends in a dot.
      .replace('<span>·</span><span><b>₹{price}</b></span>', '<span class="al">·</span><span><b>₹{price}</b></span>');
  } else if (!days.inARow) {
    out = out.replace(" – Sun <b>{day 2 short date}</b>", " and Sun <b>{day 2 short date}</b>");
  }

  return out;
}
