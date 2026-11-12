import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/admin/is-admin/route";

const post = (body: unknown, ip: string) =>
  POST(
    new Request("http://localhost/api/admin/is-admin", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify(body),
    }),
  );

describe("POST /api/admin/is-admin (N4)", () => {
  it("gives an identical response for any email", async () => {
    const emails = ["admin@cashflowcrew.in", "nobody@example.com", "user@example.com"];
    const results = await Promise.all(
      emails.map(async (email) => {
        const res = await post({ email }, "10.0.0.1");
        return { status: res.status, body: await res.json() };
      }),
    );

    for (const r of results) {
      expect(r).toEqual(results[0]);
      expect(r.status).toBe(200);
      expect(r.body).not.toHaveProperty("isAdmin");
      expect(r.body).not.toHaveProperty("user");
    }
  });

  it("returns 400 without an email", async () => {
    const res = await post({}, "10.0.0.2");
    expect(res.status).toBe(400);
  });

  it("rate limits after 10 requests from one address", async () => {
    for (let i = 0; i < 10; i++) {
      const res = await post({ email: "x@example.com" }, "10.0.0.3");
      expect(res.status).toBe(200);
    }
    const blocked = await post({ email: "x@example.com" }, "10.0.0.3");
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get("Retry-After"))).toBeGreaterThan(0);

    const other = await post({ email: "x@example.com" }, "10.0.0.4");
    expect(other.status).toBe(200);
  });
});
