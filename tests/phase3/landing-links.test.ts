// Linkage between the three workshop landing pages and the admin panel.
// Each page (/v10, /v20, /v30) is linked to its OWN course through
// Course.landingPage (Admin -> Masterclasses -> "Workshop landing page"), and
// shows that course's batch on sale: its price, dates and start time.
import { beforeEach, describe, expect, it, vi } from "vitest";
import { istToUtc } from "@/lib/ist";

const prisma = vi.hoisted(() => ({
  course: { findFirst: vi.fn(), findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn() },
  batch: { findMany: vi.fn(), findFirst: vi.fn(), count: vi.fn() },
  batchSettings: { findUnique: vi.fn(), findMany: vi.fn() },
  orderItem: { count: vi.fn() },
  order: { groupBy: vi.fn() },
}));
vi.mock("@/lib/dbPrisma", () => ({ dataBasePrisma: prisma }));
vi.mock("@/lib/auth-admin", () => ({ verifyAdmin: vi.fn() }));

import { verifyAdmin } from "@/lib/auth-admin";
import { getLandingCourse, getLandingLinks } from "@/lib/landing/course-link";
import { GET as v10Route } from "@/app/(landing)/v10/route";
import { GET as v20Route } from "@/app/(landing)/v20/route";
import { GET as v30Route } from "@/app/(landing)/v30/route";
import { GET as v30Checkout } from "@/app/(landing)/v30/checkout/route";
import { GET as v20ThankYou } from "@/app/(landing)/v20/thank-you/route";
import { GET as v30ThankYou } from "@/app/(landing)/v30/thank-you/route";
import { GET as landingPagesRoute } from "@/app/api/admin/landing-pages/route";
import { GET as batchSettingsRoute } from "@/app/api/admin/batch-settings/route";
import { POST as createCourse } from "@/app/api/admin/masterclass/create/route";
import { PATCH as updateCourse } from "@/app/api/admin/masterclass/update/[masterclassId]/route";

type Course = {
  id: string;
  title: string;
  slug: string;
  price: number;
  isPublished: boolean;
  useBatches: boolean;
  landingPage: string | null;
};

const course = (over: Partial<Course> & { id: string; slug: string }): Course => ({
  title: over.id,
  price: 100,
  isPublished: true,
  useBatches: true,
  landingPage: null,
  ...over,
});

const batchFor = (courseId: string, priceRupees: number, day1: string, start: string) => ({
  id: `batch-${courseId}`,
  courseId,
  batchNumber: 1,
  status: "OPEN",
  priceRupees,
  startTimeIst: start,
  day1StartAt: istToUtc(day1, start),
  day2StartAt: istToUtc(day1, start), // not asserted
  bookingCloseAt: new Date(Date.now() + 86_400_000),
  durationMinutes: 120,
  language: "English",
  zohoWebinarKeyDay1: "k1",
  zohoWebinarKeyDay2: "k2",
  whatsappGroupLink: "https://chat.whatsapp.com/x",
});

// A small in-memory database behind the mocked Prisma calls.
let courses: Course[] = [];
let batches: ReturnType<typeof batchFor>[] = [];

beforeEach(() => {
  vi.clearAllMocks();
  courses = [];
  batches = [];
  prisma.course.findFirst.mockImplementation(async ({ where }: { where: { landingPage: string } }) =>
    courses.find((c) => c.landingPage === where.landingPage) ?? null,
  );
  prisma.course.findUnique.mockImplementation(async ({ where }: { where: { slug?: string; id?: string } }) =>
    courses.find((c) => (where.slug ? c.slug === where.slug : c.id === where.id)) ?? null,
  );
  prisma.course.findMany.mockImplementation(async () => courses);
  prisma.course.create.mockImplementation(async ({ data }: { data: Omit<Course, "id"> }) => ({ id: "new", ...data }));
  prisma.course.update.mockImplementation(async ({ where, data }: { where: { id: string }; data: Partial<Course> }) => ({
    id: where.id,
    ...data,
  }));
  prisma.batch.findMany.mockImplementation(async ({ where }: { where: { courseId: string } }) =>
    batches.filter((b) => b.courseId === where.courseId),
  );
  prisma.batch.findFirst.mockResolvedValue(null);
  prisma.batch.count.mockImplementation(
    async ({ where }: { where: { courseId: string } }) => batches.filter((b) => b.courseId === where.courseId).length,
  );
  prisma.batchSettings.findUnique.mockResolvedValue(null);
  prisma.batchSettings.findMany.mockResolvedValue([]);
  prisma.orderItem.count.mockResolvedValue(0);
  prisma.order.groupBy.mockResolvedValue([]);
  vi.mocked(verifyAdmin).mockResolvedValue({ id: "admin1", email: "a@b.c", role: "ADMIN" } as never);
});

const get = (path: string) => new Request(`http://localhost${path}`);
const json = (path: string, method: string, body: unknown) =>
  new Request(`http://localhost${path}`, {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
const ctx = (masterclassId: string) => ({ params: Promise.resolve({ masterclassId }) });

describe("which course each landing page sells", () => {
  it("uses the course linked to the page", async () => {
    courses = [
      course({ id: "A", slug: "any-a", landingPage: "v10" }),
      course({ id: "B", slug: "any-b", landingPage: "v20" }),
      course({ id: "C", slug: "any-c", landingPage: "v30" }),
    ];
    const links = await getLandingLinks();
    expect([links.v10?.id, links.v20?.id, links.v30?.id]).toEqual(["A", "B", "C"]);
  });

  it("still finds the two courses that existed before the link field, by slug", async () => {
    courses = [
      course({ id: "MMF", slug: "master-mutual-funds-invest-smarter" }),
      course({ id: "MPF", slug: "master-personal-finance-with-ai" }),
    ];
    const links = await getLandingLinks();
    expect(links.v10?.id).toBe("MMF");
    expect(links.v20?.id).toBe("MPF");
    // v30 never shares v20's course: it needs a course of its own.
    expect(links.v30).toBeNull();
  });

  it("an explicit link wins, and an unlinked course ('none') is not picked up by slug", async () => {
    courses = [
      course({ id: "OLD", slug: "master-personal-finance-with-ai", landingPage: "none" }),
      course({ id: "NEW", slug: "something-else", landingPage: "v20" }),
    ];
    expect((await getLandingCourse("v20"))?.id).toBe("NEW");
    courses = [course({ id: "OLD", slug: "master-personal-finance-with-ai", landingPage: "none" })];
    expect(await getLandingCourse("v20")).toBeNull();
  });
});

describe("each page shows its own course's batch", () => {
  beforeEach(() => {
    courses = [
      course({ id: "A", slug: "master-mutual-funds-invest-smarter" }), // v10, by slug
      course({ id: "B", slug: "any-b", landingPage: "v20" }),
      course({ id: "C", slug: "any-c", landingPage: "v30" }),
    ];
    batches = [
      batchFor("A", 411, "2099-01-03", "09:15"),
      batchFor("B", 2222, "2099-02-07", "18:30"),
      batchFor("C", 3333, "2099-03-07", "20:45"),
    ];
  });

  it("v10, v20 and v30 render three different prices, dates and times", async () => {
    const v10 = await (await v10Route(get("/v10"))).text();
    const v20 = await (await v20Route(get("/v20"))).text();
    const v30 = await (await v30Route(get("/v30"))).text();

    expect(v10).toContain("₹411");
    expect(v10).toContain("9:15 AM");
    // The canonical address is the one the page is advertised on.
    expect(v10).toMatch(/<link rel="canonical" href="[^"]*\/personalfinance">/);
    expect(v10).not.toContain("2,222");
    expect(v10).not.toContain("3,333");

    expect(v20).toContain("₹2,222");
    expect(v20).toContain("7 Feb");
    expect(v20).toContain("6:30 PM IST");
    expect(v20).not.toContain("3,333");

    expect(v30).toContain("₹3,333");
    expect(v30).toContain("7 Mar");
    expect(v30).toContain("8:45 PM IST");
    expect(v30).not.toContain("2,222");
  });

  it("the v30 checkout sells v30's course and batch, not v20's", async () => {
    const html = await (await v30Checkout(get("/v30/checkout"))).text();
    expect(html).toContain('"courseId":"C"');
    expect(html).toContain('"batchId":"batch-C"');
    expect(html).toContain('"landingSource":"mpf-v30"');
    expect(html).toContain("₹3,333");
  });

  it("a page with no linked course is not served (404), and one without an open batch shows 'opens soon'", async () => {
    courses = courses.filter((c) => c.id !== "C");
    expect((await v30Route(get("/v30"))).status).toBe(404);

    batches = batches.filter((b) => b.courseId !== "B");
    const v20 = await (await v20Route(get("/v20"))).text();
    expect(v20).toContain("opens soon");
    expect(v20).not.toContain('data-checkout="1">');
  });

  it("sends a visitor back with a path, never the host's internal address", async () => {
    // Behind Render's proxy the address a route sees is https://localhost:10000/...
    const internal = (path: string) => new Request(`https://localhost:10000${path}`);
    // ...and with the address the page is advertised on, not /v20 or /v30.
    expect((await v20ThankYou(internal("/v20/thank-you"))).headers.get("location")).toBe("/personalfinance1");
    expect((await v30ThankYou(internal("/v30/thank-you"))).headers.get("location")).toBe("/personalfinance2");

    batches = [];
    const res = await v30Checkout(internal("/v30/checkout"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("/personalfinance2#seat");
  });

  it("admin Landing pages lists three pages with three different courses and batches", async () => {
    const res = await landingPagesRoute(get("/api/admin/landing-pages"));
    const data = await res.json();
    const rows = data.pages.map((p: { page: string; status: string; course: { id: string } | null; batchOnSale: { priceRupees: number } | null; sharesCourseWith: string[] }) => [
      p.page,
      p.status,
      p.course?.id,
      p.batchOnSale?.priceRupees,
      p.sharesCourseWith.length,
    ]);
    expect(rows).toEqual([
      ["v10", "live", "A", 411, 0],
      ["v20", "live", "B", 2222, 0],
      ["v30", "live", "C", 3333, 0],
    ]);
    // The panel shows the addresses buyers see.
    expect(data.pages.map((p: { url: string; paths: { checkout: string } }) => [new URL(p.url).pathname, p.paths.checkout])).toEqual([
      ["/personalfinance", "/personalfinance/checkout"],
      ["/personalfinance1", "/personalfinance1/checkout"],
      ["/personalfinance2", "/personalfinance2/checkout"],
    ]);
  });

  it("admin Batches / Batch settings label each course with its own page", async () => {
    const data = await (await batchSettingsRoute(get("/api/admin/batch-settings"))).json();
    expect(data.courses.map((c: { id: string; landingPath: string | null }) => [c.id, c.landingPath])).toEqual([
      ["A", "/v10"],
      ["B", "/v20"],
      ["C", "/v30"],
    ]);
  });

  it("admin APIs refuse anyone who is not an admin", async () => {
    vi.mocked(verifyAdmin).mockResolvedValue(null as never);
    expect((await landingPagesRoute(get("/api/admin/landing-pages"))).status).toBe(403);
  });
});

describe("linking a course to a page in the admin panel", () => {
  const newCourse = { title: "MPF new design", price: "2999", categoryId: "cat1", description: "d" };

  it("creates a course linked to /v30, sold in batches, without a TrainerCentral ID", async () => {
    const res = await createCourse(json("/api/admin/masterclass/create", "POST", { ...newCourse, landingPage: "v30" }));
    expect(res.status).toBe(200);
    const data = prisma.course.create.mock.calls[0][0].data;
    expect(data.landingPage).toBe("v30");
    expect(data.useBatches).toBe(true);
  });

  it("refuses a second course on a page that already has one", async () => {
    courses = [course({ id: "C", slug: "c", title: "Existing v30 course", landingPage: "v30" })];
    const res = await createCourse(json("/api/admin/masterclass/create", "POST", { ...newCourse, landingPage: "v30" }));
    expect(res.status).toBe(409);
    expect((await res.json()).message).toContain("already linked");
    expect(prisma.course.create).not.toHaveBeenCalled();
  });

  it("links an existing course, and refuses when another course holds the page", async () => {
    courses = [course({ id: "B", slug: "b", landingPage: "v20" }), course({ id: "X", slug: "x", useBatches: false })];
    const ok = await updateCourse(json("/x", "PATCH", { landingPage: "v30" }), ctx("X"));
    expect(ok.status).toBe(200);
    expect(prisma.course.update.mock.calls[0][0].data).toMatchObject({ landingPage: "v30", useBatches: true });

    prisma.course.update.mockClear();
    const taken = await updateCourse(json("/x", "PATCH", { landingPage: "v20" }), ctx("X"));
    expect(taken.status).toBe(409);
    expect(prisma.course.update).not.toHaveBeenCalled();
  });

  it("will not move or remove a link while that course has an open batch", async () => {
    courses = [course({ id: "B", slug: "b", landingPage: "v20" })];
    batches = [batchFor("B", 2222, "2099-02-07", "18:30")];
    const res = await updateCourse(json("/x", "PATCH", { landingPage: "none" }), ctx("B"));
    expect(res.status).toBe(409);
    expect((await res.json()).message).toContain("open batch");
  });

  it("unlinks with 'none' when nothing is on sale, and leaves ordinary courses untouched", async () => {
    courses = [course({ id: "B", slug: "b", landingPage: "v20" }), course({ id: "N", slug: "n", useBatches: false })];
    await updateCourse(json("/x", "PATCH", { landingPage: "none" }), ctx("B"));
    expect(prisma.course.update.mock.calls[0][0].data.landingPage).toBe("none");

    prisma.course.update.mockClear();
    await updateCourse(json("/x", "PATCH", { landingPage: "none", title: "N2" }), ctx("N"));
    expect(prisma.course.update.mock.calls[0][0].data).not.toHaveProperty("landingPage");
  });
});
