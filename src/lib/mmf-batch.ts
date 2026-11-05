import { dataBasePrisma } from "@/lib/dbPrisma";
import type { Course } from "@prisma/client";

const MMF_BATCH_GROUP = "mmf";
const RESERVATION_WINDOW_MINUTES = 15;

/**
 * Finds the batch currently on sale: batch group "mmf", published, booking
 * still open, earliest Saturday first, with seats left. Returns null when no
 * batch qualifies (the page then shows "opens soon").
 */
export async function getCurrentMmfBatch(): Promise<Course | null> {
  const now = new Date();

  const candidates = await dataBasePrisma.course.findMany({
    where: {
      batchGroup: MMF_BATCH_GROUP,
      isPublished: true,
      OR: [{ bookingCloseAt: null }, { bookingCloseAt: { gt: now } }],
    },
    orderBy: { startDate: "asc" },
  });

  return candidates.find((c) => (c.maxSeats ? c.seatsSold < c.maxSeats : true)) ?? null;
}

/**
 * Refuses a closed or full Master Mutual Funds batch before payment is
 * taken. For any other course, returns null and does nothing. Counts the
 * buyer's own earlier unfinished checkouts (same email) in the last 15
 * minutes against nobody but themselves.
 */
export async function mmfBookingError(course: Course, email: string): Promise<string | null> {
  if (course.batchGroup !== MMF_BATCH_GROUP) return null;

  const now = new Date();
  if (course.bookingCloseAt && now > course.bookingCloseAt) {
    return "Booking for this batch has closed. Please go back to the workshop page to book the next batch.";
  }

  const max = course.maxSeats ?? 50;
  const reservedSince = new Date(now.getTime() - RESERVATION_WINDOW_MINUTES * 60 * 1000);

  const pendingCount = await dataBasePrisma.order.count({
    where: {
      status: "PENDING",
      createdAt: { gte: reservedSince },
      guestEmail: { not: email },
      items: { some: { courseId: course.id } },
    },
  });

  if (course.seatsSold + pendingCount >= max) {
    return "This batch is full. Please go back to the workshop page to book the next batch.";
  }

  return null;
}
