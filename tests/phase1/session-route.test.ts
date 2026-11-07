import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth-admin", () => ({ verifyAdmin: vi.fn() }));

import { verifyAdmin } from "@/lib/auth-admin";
import { GET } from "@/app/api/admin/session/route";

const get = () => GET(new Request("http://localhost/api/admin/session"));

describe("GET /api/admin/session (M1)", () => {
  it("returns 401 when there is no admin session", async () => {
    vi.mocked(verifyAdmin).mockResolvedValue(null);
    const res = await get();
    expect(res.status).toBe(401);
  });

  it("returns the admin user shape without sensitive fields", async () => {
    vi.mocked(verifyAdmin).mockResolvedValue({
      id: "u1",
      email: "admin@cashflowcrew.in",
      name: "Ada Lovelace",
      role: "ADMIN",
      password: "hash",
    } as never);

    const res = await get();
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(await res.json()).toEqual({
      user: {
        id: "u1",
        email: "admin@cashflowcrew.in",
        name: "Ada Lovelace",
        firstName: "Ada",
        lastName: "Lovelace",
        role: "admin",
        isAdmin: true,
      },
    });
  });
});
