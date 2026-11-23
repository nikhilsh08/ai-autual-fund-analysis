import { dataBasePrisma } from "@/lib/dbPrisma";
import { pickCurrentBatch } from "./schedule";

export async function getCurrentBatch(courseId: string, now: Date = new Date()) {
  const batches = await dataBasePrisma.batch.findMany({
    where: { courseId, status: "OPEN", bookingCloseAt: { gt: now } },
    orderBy: { day1StartAt: "asc" },
  });
  return pickCurrentBatch(batches, now);
}

export async function getCurrentBatchForSlug(slug: string, now: Date = new Date()) {
  const course = await dataBasePrisma.course.findUnique({
    where: { slug },
    select: { id: true, useBatches: true, title: true },
  });
  if (!course || !course.useBatches) return { course, batch: null };
  return { course, batch: await getCurrentBatch(course.id, now) };
}
