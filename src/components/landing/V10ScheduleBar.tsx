import { formatIstShortDate, formatIstTime, formatIstWeekday } from "@/lib/ist";
import s from "./ThankYouV10.module.css";

const inr = (rupees: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(rupees);

// The line in the black bar at the top of the v10 checkout page. It is the
// same line as the landing page's bar (src/landing/mmf-v10.html, .abar): both
// days with their dates, the start time, the price and the seats line, and no
// button (owner, 23 Nov 2026). Every value is the batch's own (Admin →
// Batches). On phones the short day names are used and the seats line gives
// way first, as on the landing page (see .bar in ThankYouV10.module.css).
export default function V10ScheduleBar({
    batch,
}: {
    batch: { day1StartAt: Date; day2StartAt: Date; priceRupees: number };
}) {
    const day1 = formatIstWeekday(batch.day1StartAt);
    const day2 = formatIstWeekday(batch.day2StartAt);
    const date1 = formatIstShortDate(batch.day1StartAt);
    const date2 = formatIstShortDate(batch.day2StartAt);
    const time = `${formatIstTime(batch.day1StartAt)} IST`;

    return (
        <>
            <span className={s.barLong}>2-day live workshop</span>
            <span className={s.barLong}>·</span>
            <span className={s.barLong}>
                {day1} <b>{date1}</b> and {day2} <b>{date2}</b>, {time}
            </span>
            <span className={s.barShort}>
                {day1.slice(0, 3)} <b>{date1}</b> – {day2.slice(0, 3)} <b>{date2}</b>, {time}
            </span>
            <span>·</span>
            <span>
                <b>₹{inr(batch.priceRupees)}</b>
            </span>
            <span className={s.barSeat}>·</span>
            <span className={`${s.barLong} ${s.barSeat}`}>Only 50 seats per batch</span>
            <span className={`${s.barShort} ${s.barSeat}`}>Only 50 seats</span>
        </>
    );
}
