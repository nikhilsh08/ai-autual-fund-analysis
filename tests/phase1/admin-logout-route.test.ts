import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/server/auth/auth", () => ({ signOut: vi.fn() }));

import { signOut } from "@/server/auth/auth";
import { POST } from "@/app/api/admin/logout/route";

describe("POST /api/admin/logout", () => {
  beforeEach(() => {
    vi.mocked(signOut).mockReset();
  });

  it("clears the session without redirecting and is not cached", async () => {
    vi.mocked(signOut).mockResolvedValue(undefined as never);

    const res = await POST();

    expect(signOut).toHaveBeenCalledWith({ redirect: false });
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(await res.json()).toEqual({ success: true });
  });

  it("answers 500 without leaking the error when sign-out fails", async () => {
    vi.mocked(signOut).mockRejectedValue(new Error("secret detail"));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await POST();

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ message: "Could not sign out" });
    log.mockRestore();
  });
});
