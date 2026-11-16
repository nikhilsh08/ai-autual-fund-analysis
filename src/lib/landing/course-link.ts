// Which course each workshop landing page sells. The link is Course.landingPage
// ("v10" | "v20" | "v30"), set in Admin -> Masterclasses -> "Workshop landing
// page". One course per page; each page has its own batches, price and seats.
import { dataBasePrisma } from "@/lib/dbPrisma";
import {
  LANDING_PAGES,
  LANDING_SEATS_PER_BATCH,
  LEGACY_COURSE_SLUG,
  isLandingPageKey,
  type LandingPageKey,
} from "@/lib/landing/sources";

const SELECT = {
  id: true,
  title: true,
  slug: true,
  price: true,
  isPublished: true,
  useBatches: true,
  landingPage: true,
} as const;

export interface LandingCourse {
  id: string;
  title: string;
  slug: string;
  price: number;
  isPublished: boolean;
  useBatches: boolean;
  landingPage: string | null;
}

// The course linked to a page, or null. A course created before the link
// field existed is still found by its slug, until it is linked or unlinked
// explicitly or another course takes the page.
export async function getLandingCourse(page: LandingPageKey): Promise<LandingCourse | null> {
  const linked = await dataBasePrisma.course.findFirst({
    where: { landingPage: page },
    select: SELECT,
    orderBy: { createdAt: "asc" },
  });
  if (linked) return linked;

  const slug = LEGACY_COURSE_SLUG[page];
  if (!slug) return null;
  const legacy = await dataBasePrisma.course.findUnique({ where: { slug }, select: SELECT });
  return legacy && !legacy.landingPage ? legacy : null;
}

// The page one course is linked to (same rules as getLandingCourse), or null.
export async function landingPageOfCourse(course: {
  id: string;
  slug?: string | null;
  landingPage?: string | null;
}): Promise<LandingPageKey | null> {
  if (isLandingPageKey(course.landingPage)) return course.landingPage;
  if (course.landingPage) return null; // "none": explicitly unlinked
  const page = LANDING_PAGES.find((p) => LEGACY_COURSE_SLUG[p] !== undefined && LEGACY_COURSE_SLUG[p] === course.slug);
  if (!page) return null;
  // Found by slug only while no other course has taken the page.
  const holder = await getLandingCourse(page);
  return holder?.id === course.id ? page : null;
}

// Paid bookings a batch of this course may take, or null for no limit.
export const seatLimitForPage = (page: LandingPageKey | null): number | null =>
  page ? LANDING_SEATS_PER_BATCH[page] : null;

// All three links at once: page -> course (or null).
export async function getLandingLinks(): Promise<Record<LandingPageKey, LandingCourse | null>> {
  const entries = await Promise.all(LANDING_PAGES.map(async (page) => [page, await getLandingCourse(page)] as const));
  return Object.fromEntries(entries) as Record<LandingPageKey, LandingCourse | null>;
}

// courseId -> the page it is linked to.
export async function landingPageByCourseId(): Promise<Map<string, LandingPageKey>> {
  const links = await getLandingLinks();
  const map = new Map<string, LandingPageKey>();
  for (const page of LANDING_PAGES) {
    const course = links[page];
    if (course) map.set(course.id, page);
  }
  return map;
}
