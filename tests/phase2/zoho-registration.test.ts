import { beforeEach, describe, expect, it, vi } from "vitest";

const prisma = vi.hoisted(() => ({
  batchRegistration: { findUnique: vi.fn(), update: vi.fn() },
}));
vi.mock("@/lib/dbPrisma", () => ({ dataBasePrisma: prisma }));
vi.mock("axios");

import axios from "axios";
import { registerInZohoWebinar, sanitizeName } from "@/lib/zoho-webinar";

const registration = {
  id: "r1",
  orderId: "o1",
  email: "asha@example.com",
  name: "Asha Rao",
  zohoState: "PENDING",
  zohoAttempts: 0,
  joinLinkDay1: null,
  joinLinkDay2: null,
  batch: {
    zohoWebinarKeyDay1: "KEY1",
    zohoWebinarKeyDay2: "KEY2",
    zohoInstanceIdDay1: null,
    zohoInstanceIdDay2: null,
  },
};

describe("registerInZohoWebinar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ZW_CLIENT_ID = "id";
    process.env.ZW_CLIENT_SECRET = "secret";
    process.env.ZW_REFRESH_TOKEN = "refresh";
    process.env.ZW_ORG_ID = "123";
    process.env.ZW_DC = "in";
    prisma.batchRegistration.update.mockResolvedValue({});
  });

  it("does nothing for an already registered row", async () => {
    prisma.batchRegistration.findUnique.mockResolvedValue({ ...registration, zohoState: "REGISTERED" });
    await registerInZohoWebinar("r1");
    expect(axios.post).not.toHaveBeenCalled();
    expect(prisma.batchRegistration.update).not.toHaveBeenCalled();
  });

  it("marks FAILED with no_webinar_key when the batch has no keys", async () => {
    prisma.batchRegistration.findUnique.mockResolvedValue({
      ...registration,
      batch: { ...registration.batch, zohoWebinarKeyDay2: null },
    });
    await registerInZohoWebinar("r1");
    expect(prisma.batchRegistration.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ zohoState: "FAILED", zohoLastError: "no_webinar_key" }) }),
    );
  });

  it("registers both days on the India data centre with an array registrant body", async () => {
    prisma.batchRegistration.findUnique.mockResolvedValue(registration);
    vi.mocked(axios.post).mockImplementation(async (url: string) => {
      if (url.includes("/oauth/v2/token")) return { data: { access_token: "tok" } };
      const key = url.includes("/register/KEY1") ? "1" : "2";
      return { data: { registrant: [{ email: "asha@example.com", joinLink: `https://meeting.zoho.in/j/${key}` }], successCount: 1 } };
    });

    await registerInZohoWebinar("r1");

    const registerCalls = vi.mocked(axios.post).mock.calls.filter(([url]) => String(url).includes("/register/"));
    expect(registerCalls).toHaveLength(2);
    expect(String(registerCalls[0][0])).toMatch(/^https:\/\/webinar\.zoho\.in\/api\/v2\/123\/register\/KEY1\.json\?sendMail=true$/);
    expect(registerCalls[0][1]).toEqual({ registrant: [{ email: "asha@example.com", firstName: "Asha", lastName: "Rao" }] });

    expect(prisma.batchRegistration.update).toHaveBeenLastCalledWith({
      where: { id: "r1" },
      data: {
        joinLinkDay1: "https://meeting.zoho.in/j/1",
        joinLinkDay2: "https://meeting.zoho.in/j/2",
        zohoState: "REGISTERED",
        zohoLastError: null,
      },
    });
  });

  it("falls back to the registrant list when the register call returns no link (duplicate)", async () => {
    prisma.batchRegistration.findUnique.mockResolvedValue({ ...registration, joinLinkDay1: "https://meeting.zoho.in/j/1" });
    vi.mocked(axios.post).mockImplementation(async (url: string) => {
      if (url.includes("/oauth/v2/token")) return { data: { access_token: "tok" } };
      return { data: { successCount: 0, failedCount: 1 } };
    });
    vi.mocked(axios.get).mockResolvedValue({
      data: { registrants: [{ email: "asha@example.com", joinLink: "https://meeting.zoho.in/j/existing" }] },
    });

    await registerInZohoWebinar("r1");

    expect(vi.mocked(axios.post).mock.calls.filter(([url]) => String(url).includes("/register/KEY1"))).toHaveLength(0);
    expect(prisma.batchRegistration.update).toHaveBeenLastCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ joinLinkDay2: "https://meeting.zoho.in/j/existing", zohoState: "REGISTERED" }) }),
    );
  });

  it("records a short error and increments attempts on failure, without throwing", async () => {
    prisma.batchRegistration.findUnique.mockResolvedValue(registration);
    vi.mocked(axios.post).mockRejectedValue(new Error("network down"));

    await expect(registerInZohoWebinar("r1")).resolves.toBeUndefined();
    expect(prisma.batchRegistration.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ zohoState: "FAILED", zohoAttempts: { increment: 1 }, zohoLastError: "network down" }),
      }),
    );
  });

  it("sanitises names like TrainerCentral does", () => {
    expect(sanitizeName("john.doe99@gmail.com")).toEqual({ firstName: "john", lastName: "doe" });
    expect(sanitizeName("")).toEqual({ firstName: "Attendee", lastName: "Attendee" });
  });
});
