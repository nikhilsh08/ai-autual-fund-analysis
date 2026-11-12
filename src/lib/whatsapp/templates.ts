import { formatIstDate, formatIstTime } from "@/lib/ist";

// Parameter order follows the drafts in Part 3 of the brief (W1–W4).
interface BatchDates {
  day1StartAt: Date;
  day2StartAt: Date;
}

export function w1Params(input: {
  name: string;
  batch: BatchDates;
  joinLink: string;
  groupLink: string | null;
  orderRef: string;
}): string[] {
  return [
    input.name,
    formatIstDate(input.batch.day1StartAt),
    formatIstDate(input.batch.day2StartAt),
    formatIstTime(input.batch.day1StartAt),
    input.joinLink,
    input.groupLink ?? "to be shared by email",
    input.orderRef,
  ];
}

export function w2Params(input: { name: string; batch: BatchDates; joinLink: string }): string[] {
  return [
    input.name,
    formatIstDate(input.batch.day1StartAt),
    formatIstTime(input.batch.day1StartAt),
    input.joinLink,
  ];
}

export function w3Params(input: { name: string; sessionStartAt: Date; joinLink: string }): string[] {
  return [input.name, formatIstTime(input.sessionStartAt), input.joinLink];
}

export function w4Params(input: { name: string; surveyUrl: string }): string[] {
  return [input.name, input.surveyUrl];
}

export function surveyUrlForBatch(base: string, batchNumber: number): string {
  const url = new URL(base);
  url.searchParams.set("batch", String(batchNumber));
  return url.toString();
}
