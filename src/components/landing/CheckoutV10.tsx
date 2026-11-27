"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { getSessionUTMs } from "@/components/analytics/UTMCapture";
import { trackInitiateCheckout } from "@/lib/analytics/track";
import { MMF_V10_LANDING_PATH, MMF_V10_SOURCE } from "@/lib/landing/v10";
import { MMF_COPY } from "@/lib/mmf-copy";
import { getCashfreeInstance } from "@/lib/PGinitialize";
import { validateCoupon } from "@/server/actions/coupon.action";
import s from "./CheckoutV10.module.css";

export interface CheckoutV10Batch {
    id: string;
    priceRupees: number;
    // "Saturday, 21 November 2026"
    classDate: string;
    // "Friday, 20 November 2026, 11:59 PM IST"
    bookingCloseText: string;
}

type Field = "name" | "email" | "phone";

const FORM_ID = "v10-checkout-form";
const GST_DIVISOR = 1.18; // prices are GST-inclusive (18%)
const SUPPORT_NOTE = " If money was deducted, write to support@cashflowcrew.in.";
const GENERIC_PAY_ERROR = "We could not start the payment. Please try again.";

const FIELD_ERRORS: Record<Field, string> = {
    name: "Please enter your name.",
    email: "Please enter a valid email address.",
    phone: "Please enter a 10-digit Indian mobile number.",
};

const inr = (n: number) => "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const whole = (n: number) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

// Digits only, without a leading +91 / 0.
const cleanPhone = (value: string) =>
    value
        .replace(/\D/g, "")
        .replace(/^(91|0)(?=\d{10}$)/, "")
        .slice(0, 10);

function invalidFields(values: Record<Field, string>): Field[] {
    const bad: Field[] = [];
    if (values.name.trim().length < 2) bad.push("name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) bad.push("email");
    if (!/^[6-9]\d{9}$/.test(values.phone.trim())) bad.push("phone");
    return bad;
}

// The initiate route answers with short error codes for the batch rules.
function payErrorMessage(code: unknown): string {
    if (code === "batch_not_on_sale" || code === "batch_required") return MMF_COPY.landing.nothingOnSale;
    if (typeof code === "string" && /coupon|minimum order/i.test(code)) return `${code}.`;
    return GENERIC_PAY_ERROR + SUPPORT_NOTE;
}

const PersonIcon = ({ size, stroke, width }: { size: [number, number]; stroke: string; width: number }) => (
    <svg width={size[0]} height={size[1]} viewBox="0 0 20 22" fill="none" aria-hidden="true">
        <circle cx="10" cy="6.5" r="4.2" stroke={stroke} strokeWidth={width} />
        <path d="M2 20.5c.8-4.2 4-6.5 8-6.5s7.2 2.3 8 6.5" stroke={stroke} strokeWidth={width} strokeLinecap="round" />
    </svg>
);

// Checkout for the v10 landing path. The price and dates come from the batch
// on sale (admin panel); the amount actually charged is decided again by
// /api/payment/cashfree/initiate, never by this page.
export default function CheckoutV10({ courseId, batch }: { courseId: string; batch: CheckoutV10Batch }) {
    const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", phone: "" });
    const [errors, setErrors] = useState<Field[]>([]);
    const [whatsappOptIn, setWhatsappOptIn] = useState(false);

    const [couponCode, setCouponCode] = useState("");
    const [coupon, setCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
    const [couponMsg, setCouponMsg] = useState<{ text: string; ok: boolean } | null>(null);
    const [checkingCoupon, setCheckingCoupon] = useState(false);

    const [formError, setFormError] = useState("");
    const [busy, setBusy] = useState(false);
    const [barHidden, setBarHidden] = useState(false);

    const formErrRef = useRef<HTMLDivElement>(null);
    const mainPayRef = useRef<HTMLButtonElement>(null);
    const tracked = useRef(false);

    const base = batch.priceRupees;
    const total = Math.max(0, base - (coupon?.discountAmount ?? 0));
    // Every row is shown before GST, so Subtotal − Coupon + GST = Total.
    const subtotal = base / GST_DIVISOR;
    const discountBeforeGst = (base - total) / GST_DIVISOR;
    const gst = total - total / GST_DIVISOR;

    // InitiateCheckout / begin_checkout, once per page load (same as /checkout).
    useEffect(() => {
        if (tracked.current || !(base > 0)) return;
        tracked.current = true;
        trackInitiateCheckout({ value: base, contentIds: [courseId], contentName: MMF_COPY.contentName });
    }, [base, courseId]);

    // The mobile pay bar steps aside while the main Pay button is on screen.
    useEffect(() => {
        const target = mainPayRef.current;
        if (!target || !("IntersectionObserver" in window)) return;
        const observer = new IntersectionObserver(([entry]) => setBarHidden(entry.isIntersecting));
        observer.observe(target);
        return () => observer.disconnect();
    }, []);

    // Coming back from the payment page with the browser's Back button
    // restores this page from cache with the button still disabled.
    useEffect(() => {
        const onShow = (event: PageTransitionEvent) => {
            if (event.persisted) setBusy(false);
        };
        window.addEventListener("pageshow", onShow);
        return () => window.removeEventListener("pageshow", onShow);
    }, []);

    const setField = (field: Field, value: string) => {
        setValues((v) => ({ ...v, [field]: field === "phone" ? cleanPhone(value) : value }));
        setErrors((e) => e.filter((f) => f !== field));
    };

    const applyCoupon = async () => {
        const code = couponCode.trim().toUpperCase();
        if (!code || checkingCoupon) return;
        setCheckingCoupon(true);
        try {
            const res = await validateCoupon(code, [courseId], base, [], batch.id);
            if (res.success && res.data) {
                setCoupon({ code: res.data.code, discountAmount: res.data.discountAmount });
                setCouponMsg({ text: "Coupon applied.", ok: true });
            } else {
                setCoupon(null);
                setCouponMsg({ text: res.error || "This code is not valid.", ok: false });
            }
        } catch {
            setCoupon(null);
            setCouponMsg({ text: "We could not check this code. Please try again.", ok: false });
        } finally {
            setCheckingCoupon(false);
        }
    };

    const removeCoupon = () => {
        setCoupon(null);
        setCouponCode("");
        setCouponMsg(null);
    };

    const showFormError = (message: string) => {
        setFormError(message);
        setBusy(false);
        requestAnimationFrame(() => formErrRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
    };

    const pay = async (event: FormEvent) => {
        event.preventDefault();
        if (busy) return;
        setFormError("");

        const bad = invalidFields(values);
        setErrors(bad);
        if (bad.length > 0) {
            const first = document.getElementById(`co-${bad[0]}`);
            first?.focus({ preventScroll: true });
            first?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        setBusy(true);
        try {
            const params = new URLSearchParams(window.location.search);
            const stored = getSessionUTMs();
            const res = await fetch("/api/payment/cashfree/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: values.name.trim(),
                    email: values.email.trim(),
                    phone: values.phone.trim(),
                    courseIds: [courseId],
                    couponCode: coupon?.code,
                    batchId: batch.id,
                    whatsappOptIn,
                    landingSource: MMF_V10_SOURCE,
                    // UTMs from this URL first, then the ones the landing page stored.
                    utmParams: {
                        utmSource: params.get("utm_source") || stored.utmSource,
                        utmMedium: params.get("utm_medium") || stored.utmMedium,
                        utmCampaign: params.get("utm_campaign") || stored.utmCampaign,
                        utmTerm: params.get("utm_term") || stored.utmTerm,
                        utmContent: params.get("utm_content") || stored.utmContent,
                    },
                }),
            });
            const data = await res.json().catch(() => ({}));
            const sessionId = data?.paymentSession?.payment_session_id;
            if (!res.ok || !data?.success || !sessionId) {
                showFormError(payErrorMessage(data?.error));
                return;
            }

            const cashfree = await getCashfreeInstance();
            // Full-page redirect to Cashfree. It returns to /payment/callback, which
            // verifies the payment and forwards to /personalfinance/thank-you.
            const result = await cashfree.checkout({ paymentSessionId: sessionId, redirectTarget: "_self" });
            if (result?.error) {
                showFormError((result.error.message || GENERIC_PAY_ERROR) + SUPPORT_NOTE);
            }
        } catch (error) {
            console.error("[v10 checkout] payment could not start", error);
            showFormError(
                (error instanceof TypeError
                    ? "We could not start the payment. Please check your connection and try again."
                    : GENERIC_PAY_ERROR) + SUPPORT_NOTE,
            );
        }
    };

    const fieldClass = (field: Field) => `${s.field} ${errors.includes(field) ? s.err : ""}`;
    const fieldError = (field: Field) =>
        errors.includes(field) && (
            <span className={s.ferr} id={`co-${field}-err`}>
                {FIELD_ERRORS[field]}
            </span>
        );
    const describedBy = (field: Field) => (errors.includes(field) ? `co-${field}-err` : undefined);

    return (
        <div className={s.wrap}>
            <a href={`${MMF_V10_LANDING_PATH}#admission`} className={s.back}>
                <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden="true">
                    <path d="M7.5 1.5 2 7l5.5 5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Cancel &amp; go back to workshop
            </a>

            {/* Phones only (CSS): what is being bought and its price, above the form. */}
            <div className={s.mobileItem}>
                <Image src="/mmf/assets/price-seat.webp" alt="" width={48} height={48} />
                <div className={s.mobileItemBody}>
                    <div className={s.mobileItemTitle}>Master Mutual Funds</div>
                    <div className={s.mobileItemMeta}>2-day live workshop · Starts {batch.classDate}</div>
                </div>
                <div className={s.mobileItemPrice}>{whole(total)}</div>
            </div>

            <div className={s.grid}>
                <div className={s.leftCol}>
                    <div className={s.secure}>
                        <svg width="22" height="24" viewBox="0 0 20 22" fill="none" aria-hidden="true">
                            <path d="M10 1.5 2.5 4.3v6c0 4.8 3.2 8.6 7.5 10.2 4.3-1.6 7.5-5.4 7.5-10.2v-6L10 1.5z" stroke="#2E6B4A" strokeWidth="1.7" strokeLinejoin="round" />
                            <path d="m6.8 11 2.3 2.3 4.2-4.6" stroke="#2E6B4A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className={s.securePill}>Secure Checkout</span>
                    </div>

                    <form id={FORM_ID} className={`${s.card} ${s.form}`} onSubmit={pay} noValidate data-clarity-mask="true">
                        <h2 className={`${s.h} ${s.hIcon}`}>
                            <PersonIcon size={[20, 22]} stroke="#B08D3F" width={1.9} />
                            Contact Information
                        </h2>

                        <div className={fieldClass("name")}>
                            <label className={s.label} htmlFor="co-name">
                                Full name
                            </label>
                            <div className={s.iwrap}>
                                <PersonIcon size={[17, 18]} stroke="#8C8576" width={1.8} />
                                <input
                                    className={s.input}
                                    id="co-name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Your full name"
                                    required
                                    value={values.name}
                                    onChange={(e) => setField("name", e.target.value)}
                                    aria-invalid={errors.includes("name")}
                                    aria-describedby={describedBy("name")}
                                />
                            </div>
                            {fieldError("name")}
                        </div>

                        <div className={fieldClass("email")}>
                            <label className={s.label} htmlFor="co-email">
                                Email address
                            </label>
                            <div className={s.iwrap}>
                                <svg width="19" height="15" viewBox="0 0 20 16" fill="none" aria-hidden="true">
                                    <rect x="1" y="1" width="18" height="14" rx="2.5" stroke="#8C8576" strokeWidth="1.6" />
                                    <path d="m2 3 8 6 8-6" stroke="#8C8576" strokeWidth="1.6" strokeLinejoin="round" />
                                </svg>
                                <input
                                    className={s.input}
                                    id="co-email"
                                    name="email"
                                    type="email"
                                    inputMode="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    required
                                    value={values.email}
                                    onChange={(e) => setField("email", e.target.value)}
                                    aria-invalid={errors.includes("email")}
                                    aria-describedby={describedBy("email")}
                                />
                            </div>
                            {fieldError("email")}
                        </div>

                        <div className={fieldClass("phone")}>
                            <label className={s.label} htmlFor="co-phone">
                                Mobile number
                            </label>
                            <div className={s.iwrap}>
                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                    <path
                                        d="M5.5 1.5h-2a2 2 0 0 0-2 2.2C2.4 12 8 17.6 16.3 18.5a2 2 0 0 0 2.2-2v-2.2l-4-1.6-2 2a12 12 0 0 1-5.2-5.2l2-2L7.7 1.5H5.5z"
                                        stroke="#8C8576"
                                        strokeWidth="1.5"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <input
                                    className={s.input}
                                    id="co-phone"
                                    name="phone"
                                    type="tel"
                                    inputMode="numeric"
                                    autoComplete="tel-national"
                                    placeholder="10-digit mobile number"
                                    required
                                    value={values.phone}
                                    onChange={(e) => setField("phone", e.target.value)}
                                    aria-invalid={errors.includes("phone")}
                                    aria-describedby={describedBy("phone")}
                                />
                            </div>
                            {fieldError("phone")}
                        </div>

                        <label className={s.consent}>
                            <input type="checkbox" checked={whatsappOptIn} onChange={(e) => setWhatsappOptIn(e.target.checked)} />
                            <span>{MMF_COPY.checkout.whatsappConsent}</span>
                        </label>
                    </form>
                </div>

                <aside className={`${s.card} ${s.summary}`}>
                    <h2 className={s.h}>Order Summary</h2>

                    <div className={s.item}>
                        <Image src="/mmf/assets/price-seat.webp" alt="" width={64} height={64} className={s.itemImg} />
                        <div className={s.itemBody}>
                            <div className={s.itemTitle}>Master Mutual Funds</div>
                            <div className={s.itemMeta}>2-day live workshop · Starts {batch.classDate}</div>
                            <div className={s.itemPrice}>{whole(base)}</div>
                        </div>
                    </div>

                    <div className={s.section}>
                        <label className={`${s.label} ${s.couponLabel}`} htmlFor="co-coupon">
                            Coupon code
                        </label>
                        <div className={s.couponRow}>
                            <input
                                className={`${s.input} ${s.couponInput}`}
                                id="co-coupon"
                                type="text"
                                autoComplete="off"
                                placeholder="ENTER CODE"
                                value={couponCode}
                                disabled={!!coupon}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        applyCoupon();
                                    }
                                }}
                            />
                            {coupon ? (
                                <button className={s.apply} type="button" onClick={removeCoupon}>
                                    Remove
                                </button>
                            ) : (
                                <button className={s.apply} type="button" onClick={applyCoupon} disabled={!couponCode.trim() || checkingCoupon}>
                                    Apply
                                </button>
                            )}
                        </div>
                        {couponMsg && (
                            <p className={`${s.couponMsg} ${couponMsg.ok ? s.couponOk : ""}`} role="status">
                                {couponMsg.text}
                            </p>
                        )}
                    </div>

                    <div className={`${s.section} ${s.totals}`}>
                        <div className={s.line}>
                            <span>Subtotal</span>
                            <span>{inr(subtotal)}</span>
                        </div>
                        {coupon && (
                            <div className={s.line}>
                                <span>
                                    Coupon <b>{coupon.code}</b>
                                </span>
                                <span className={s.discount}>−{inr(discountBeforeGst)}</span>
                            </div>
                        )}
                        <div className={s.line}>
                            <span>GST (18%)</span>
                            <span>{inr(gst)}</span>
                        </div>
                        <div className={s.totalLine}>
                            <span className={s.totalLabel}>Total</span>
                            <span className={s.totalValue} data-testid="checkout-total">
                                {inr(total)}
                            </span>
                        </div>
                    </div>

                    {formError && (
                        <div className={s.formErr} role="alert" ref={formErrRef}>
                            {formError}
                        </div>
                    )}

                    <button className={s.pay} type="submit" form={FORM_ID} disabled={busy} ref={mainPayRef}>
                        {busy && <span className={s.spin} />}
                        <span>{busy ? "Opening secure payment…" : `Pay ${whole(total)} and book my seat`}</span>
                        {!busy && (
                            <span className={s.arrow} aria-hidden="true">
                                →
                            </span>
                        )}
                    </button>

                    <div className={s.assure}>
                        <span>
                            <svg width="12" height="14" viewBox="0 0 14 16" fill="none" aria-hidden="true">
                                <rect x="1" y="7" width="12" height="8" rx="2" stroke="#7C766A" strokeWidth="1.5" />
                                <path d="M4 7V5a3 3 0 0 1 6 0v2" stroke="#7C766A" strokeWidth="1.5" />
                            </svg>
                            256-bit SSL Encrypted Payment
                        </span>
                        <div>
                            Full refund within 7 days. <a href="https://www.cashflowcrew.in/refund-policy">Refund policy</a>
                        </div>
                    </div>
                </aside>
            </div>

            <p className={s.closes}>Booking for this batch closes {batch.bookingCloseText}.</p>

            <div className={`${s.sticky} ${barHidden ? s.stickyHide : ""}`}>
                <div className={s.stickyTotal}>
                    <b>{inr(total)}</b>incl. GST
                </div>
                <button className={`${s.pay} ${s.payBar}`} type="submit" form={FORM_ID} disabled={busy}>
                    {busy && <span className={s.spin} />}
                    <span>{busy ? "Opening…" : "Book my seat"}</span>
                    {!busy && (
                        <span className={s.arrow} aria-hidden="true">
                            →
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}
