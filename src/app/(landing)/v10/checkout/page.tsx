import type { Metadata } from "next";
import { Archivo, Playfair_Display } from "next/font/google";
import { notFound, redirect } from "next/navigation";
import CheckoutV10 from "@/components/landing/CheckoutV10";
import V10Shell from "@/components/landing/V10Shell";
import { getCurrentBatch } from "@/lib/batches/current";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { formatIstDate, formatIstDateTime } from "@/lib/ist";
import { getLandingCourse } from "@/lib/landing/course-link";
import { MMF_V10_LANDING_PATH } from "@/lib/landing/v10";
import { previewBatchFor } from "@/lib/landing/v20-data";
import { MMF_COPY } from "@/lib/mmf-copy";
import s from "@/components/landing/CheckoutV10.module.css";

// The price and dates are read from the batch on sale on every request, so a
// change in the admin panel shows here straight away.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
    title: "Checkout · Master Mutual Funds",
    robots: { index: false, follow: false },
};

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["500", "600", "700", "800"],
    variable: "--mmf-archivo",
    display: "swap",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["500", "600", "700"],
    style: ["normal", "italic"],
    variable: "--mmf-playfair",
    display: "swap",
});

const announcementLine = (classDate: string) =>
    // Same line as the landing page's announcement bar (one line: no price, no seat count).
    `Live workshop · Starts ${classDate}`;

export default async function WorkshopCheckoutPage({ searchParams }: { searchParams: Promise<{ preview?: string }> }) {
    const fontClass = `${archivo.variable} ${playfair.variable}`;

    // Development-only preview; date, close time and price from the admin
    // panel (previewBatchFor, read only):
    //   /v10/checkout?preview=1
    // Paying from it is refused by the server, because the sample batch does not exist.
    const { preview } = await searchParams;
    if (preview && process.env.NODE_ENV !== "production") {
        const { batch, courseId } = await previewBatchFor("v10");
        if (!batch) redirect(`${MMF_V10_LANDING_PATH}?preview=1#seat`);
        const classDate = formatIstDate(batch.day1StartAt);
        return (
            <V10Shell className={fontClass} variant="checkout" announcement={announcementLine(classDate)}>
                <CheckoutV10
                    courseId={courseId ?? "preview"}
                    batch={{ id: "preview", priceRupees: batch.priceRupees, classDate, bookingCloseText: formatIstDateTime(batch.bookingCloseAt) }}
                />
            </V10Shell>
        );
    }

    const course = await getLandingCourse("v10");
    if (!course || !course.isPublished) notFound();
    // Not sold in batches: the main site's checkout handles it.
    if (!course.useBatches) redirect(`/checkout?courseId=${encodeURIComponent(course.id)}`);

    const batch = await getCurrentBatch(course.id);

    if (!batch) {
        return (
            <V10Shell className={fontClass} variant="checkout">
                <div className={`${s.card} ${s.closed}`}>
                    <h1 className={s.h}>Master Mutual Funds</h1>
                    <p>{MMF_COPY.landing.nothingOnSale}</p>
                    <a href={MMF_V10_LANDING_PATH} className={s.closedLink}>
                        Back to the workshop page
                    </a>
                </div>
            </V10Shell>
        );
    }

    const classDate = formatIstDate(batch.day1StartAt);

    return (
        <V10Shell className={fontClass} variant="checkout" announcement={announcementLine(classDate)}>
            <CheckoutV10
                courseId={course.id}
                batch={{
                    id: batch.id,
                    priceRupees: batch.priceRupees,
                    classDate,
                    bookingCloseText: formatIstDateTime(batch.bookingCloseAt),
                }}
            />
        </V10Shell>
    );
}
