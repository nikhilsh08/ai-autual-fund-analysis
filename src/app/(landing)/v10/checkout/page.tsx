import type { Metadata } from "next";
import { Archivo, Playfair_Display } from "next/font/google";
import { notFound, redirect } from "next/navigation";
import CheckoutV10 from "@/components/landing/CheckoutV10";
import V10Shell from "@/components/landing/V10Shell";
import { getCurrentBatch } from "@/lib/batches/current";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { formatIstDate, formatIstDateTime } from "@/lib/ist";
import { MMF_V10_COURSE_SLUG, MMF_V10_LANDING_PATH } from "@/lib/landing/v10";
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

const rupees = (n: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

const announcementLine = (classDate: string, priceRupees: number) =>
    // Same line as the landing page's announcement bar.
    `Live workshop · Starts ${classDate} · ₹${rupees(priceRupees)} · ${MMF_COPY.landing.bar}`;

export default async function WorkshopCheckoutPage({ searchParams }: { searchParams: Promise<{ preview?: string }> }) {
    const fontClass = `${archivo.variable} ${playfair.variable}`;

    // Development-only preview with sample data, never reading the database:
    //   /v10/checkout?preview=1
    // Paying from it is refused by the server, because the sample batch does not exist.
    const { preview } = await searchParams;
    if (preview && process.env.NODE_ENV !== "production") {
        const classDate = "Saturday, 21 November 2026";
        return (
            <V10Shell className={fontClass} variant="checkout" announcement={announcementLine(classDate, 1999)}>
                <CheckoutV10
                    courseId="preview"
                    batch={{ id: "preview", priceRupees: 1999, classDate, bookingCloseText: "Friday, 20 November 2026, 11:59 PM IST" }}
                />
            </V10Shell>
        );
    }

    const course = await dataBasePrisma.course.findUnique({
        where: { slug: MMF_V10_COURSE_SLUG },
        select: { id: true, isPublished: true, useBatches: true },
    });
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
        <V10Shell className={fontClass} variant="checkout" announcement={announcementLine(classDate, batch.priceRupees)}>
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
