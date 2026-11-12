import { afterEach, describe, expect, it } from "vitest";
import { getProvider, isDryRun, normalizeIndianPhone, templateName } from "@/lib/whatsapp";
import { surveyUrlForBatch, w1Params } from "@/lib/whatsapp/templates";
import { istToUtc } from "@/lib/ist";

describe("normalizeIndianPhone", () => {
  it("normalises Indian mobile numbers to E.164", () => {
    expect(normalizeIndianPhone("9876543210")).toBe("+919876543210");
    expect(normalizeIndianPhone("09876543210")).toBe("+919876543210");
    expect(normalizeIndianPhone("91 98765 43210")).toBe("+919876543210");
    expect(normalizeIndianPhone("+91-98765-43210")).toBe("+919876543210");
  });

  it("rejects numbers that cannot be a mobile number", () => {
    expect(normalizeIndianPhone("12345")).toBeNull();
    expect(normalizeIndianPhone("1234567890")).toBeNull();
    expect(normalizeIndianPhone("")).toBeNull();
  });
});

describe("provider selection", () => {
  const saved = { DRY_RUN: process.env.DRY_RUN, WA_PROVIDER: process.env.WA_PROVIDER };
  afterEach(() => {
    process.env.DRY_RUN = saved.DRY_RUN;
    process.env.WA_PROVIDER = saved.WA_PROVIDER;
  });

  it("is a dry run outside production unless DRY_RUN=false", () => {
    delete process.env.DRY_RUN;
    expect(isDryRun()).toBe(true);
    process.env.DRY_RUN = "false";
    expect(isDryRun()).toBe(false);
  });

  it("uses the dry-run provider whenever dry run is on, even with a real provider configured", () => {
    process.env.DRY_RUN = "true";
    process.env.WA_PROVIDER = "interakt";
    expect(getProvider().name).toBe("dry-run");
  });

  it("falls back to conventional template names", () => {
    expect(templateName("W1")).toBe(process.env.WA_TPL_CONFIRMATION || "mmf_w1");
  });
});

describe("template params", () => {
  it("builds W1 in the drafted order", () => {
    const params = w1Params({
      name: "Asha",
      batch: { day1StartAt: istToUtc("2026-11-21", "19:00"), day2StartAt: istToUtc("2026-11-22", "19:00") },
      joinLink: "https://meeting.zoho.in/j/1",
      groupLink: "https://chat.whatsapp.com/x",
      orderRef: "ORD1",
    });
    expect(params).toEqual([
      "Asha",
      "Saturday, 21 November 2026",
      "Sunday, 22 November 2026",
      "7:00 PM",
      "https://meeting.zoho.in/j/1",
      "https://chat.whatsapp.com/x",
      "ORD1",
    ]);
  });

  it("appends the batch number to the survey URL", () => {
    expect(surveyUrlForBatch("https://forms.example.com/s?x=1", 7)).toBe("https://forms.example.com/s?x=1&batch=7");
  });
});
