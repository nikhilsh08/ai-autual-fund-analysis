import { afterEach, describe, expect, it, vi } from "vitest";
import { buildIcs } from "@/lib/batches/ics";
import { isCronAuthorized } from "@/lib/cron-auth";

vi.mock("@/lib/batches/jobs", () => ({
  runBatchesJob: vi.fn().mockResolvedValue({ closed: 0, completed: 0, created: 1, alerts: [] }),
  runMessagesJob: vi.fn(),
}));

import { GET as cronBatches } from "@/app/api/cron/batches/route";

describe("buildIcs", () => {
  it("emits two events with UTC timestamps and escaped text", () => {
    const ics = buildIcs(
      [
        {
          uid: "a@x",
          start: new Date("2026-11-21T13:30:00Z"),
          end: new Date("2026-11-21T15:30:00Z"),
          summary: "Day 1, live",
          description: "Join link: https://x\nBring audio",
        },
        { uid: "b@x", start: new Date("2026-11-22T13:30:00Z"), end: new Date("2026-11-22T15:30:00Z"), summary: "Day 2", description: "" },
      ],
      new Date("2026-11-01T00:00:00Z"),
    );
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(2);
    expect(ics).toContain("DTSTART:20261121T133000Z");
    expect(ics).toContain("SUMMARY:Day 1\\, live");
    expect(ics).toContain("\\nBring audio");
  });
});

describe("cron authorisation", () => {
  const saved = process.env.CRON_SECRET;
  afterEach(() => {
    process.env.CRON_SECRET = saved;
  });

  const req = (auth?: string) =>
    new Request("http://localhost/api/cron/batches", { headers: auth ? { authorization: auth } : {} });

  it("rejects when no secret is configured", () => {
    delete process.env.CRON_SECRET;
    expect(isCronAuthorized(req("Bearer anything"))).toBe(false);
  });

  it("requires the exact bearer secret", async () => {
    process.env.CRON_SECRET = "s3cret";
    expect((await cronBatches(req())).status).toBe(401);
    expect((await cronBatches(req("Bearer wrong"))).status).toBe(401);
    const ok = await cronBatches(req("Bearer s3cret"));
    expect(ok.status).toBe(200);
    expect(await ok.json()).toMatchObject({ ok: true, created: 1 });
  });
});
