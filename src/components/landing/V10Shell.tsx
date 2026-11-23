import Image from "next/image";
import type { ReactNode } from "react";
import { MMF_V10_LANDING_PATH } from "@/lib/landing/v10";
import s from "./ThankYouV10.module.css";

// The address the page is advertised on (/personalfinance).
const LANDING = MMF_V10_LANDING_PATH;
const SUPPORT_EMAIL = "support@cashflowcrew.in";

// Page chrome for pages that belong to the v10 landing path: the landing
// page's own nav (deep green bar, gold logo, wordmark) on top and its footer
// below, both mirroring src/landing/mmf-v10.html. The main site's navbar is
// deliberately not used here. `className` carries the next/font variables
// for Archivo and Playfair Display.
//
// The thank-you page uses the defaults. The checkout page passes
// `variant="checkout"`: the landing page's black announcement bar
// (`announcement`), its section links in the nav, a plain cream main area, and
// room under the footer for the mobile pay bar.
const NAV_LINKS = [
    { href: `${LANDING}#learn`, label: "Your 2-day path" },
    { href: `${LANDING}#live`, label: "Live check" },
    { href: `${LANDING}#instructor`, label: "Instructor" },
    { href: `${LANDING}#faq`, label: "FAQ" },
];

export default function V10Shell({
    className,
    children,
    variant = "thankYou",
    announcement,
}: {
    className?: string;
    children: ReactNode;
    variant?: "thankYou" | "checkout";
    announcement?: ReactNode;
}) {
    const checkout = variant === "checkout";
    return (
        <div className={`${s.page} ${checkout ? s.pageCheckout : ""} ${className ?? ""}`}>
            {announcement && (
                <div className={s.bar}>
                    <span>{announcement}</span>
                </div>
            )}
            <nav className={s.nav} aria-label="Workshop">
                <div className={`${s.navInner} ${checkout ? s.navInnerWide : ""}`}>
                    <a href={LANDING} className={s.brand}>
                        <Image src="/mmf/assets/logo-gold.png" alt="" width={26} height={27} priority />
                        CashFlowCrew
                    </a>
                    {checkout && (
                        <div className={s.navLinks}>
                            {NAV_LINKS.map((link) => (
                                <a key={link.href} href={link.href}>
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    )}
                    <a href={`mailto:${SUPPORT_EMAIL}`} className={`${s.navLink} ${checkout ? s.navMail : ""}`}>
                        {SUPPORT_EMAIL}
                    </a>
                </div>
            </nav>

            <main className={checkout ? s.mainCheckout : s.main}>{children}</main>

            <footer className={`${s.footer} ${checkout ? s.footerSticky : ""}`}>
                <div className={s.footerInner}>
                    <div className={s.footerGrid}>
                        <div>
                            <span className={s.footerBrand}>
                                <Image src="/mmf/assets/logo-gold.png" alt="" width={28} height={29} />
                                CashFlowCrew
                            </span>
                            <p className={s.footerText}>Master Mutual Funds: a live workshop on how to research mutual funds.</p>
                            <a href={`mailto:${SUPPORT_EMAIL}`} className={s.footerMail}>
                                {SUPPORT_EMAIL}
                            </a>
                        </div>
                        <div>
                            <h4 className={s.footerHead}>Quick links</h4>
                            <div className={s.footerLinks}>
                                <a href="https://www.cashflowcrew.in/#about">About Us</a>
                                <a href="https://www.cashflowcrew.in/contact-us">Contact Us</a>
                            </div>
                        </div>
                        <div>
                            <h4 className={s.footerHead}>Legal</h4>
                            <div className={s.footerLinks}>
                                <a href="https://www.cashflowcrew.in/privacy-policy">Privacy Policy</a>
                                <a href="https://www.cashflowcrew.in/terms-conditions">Terms &amp; Conditions</a>
                                <a href="https://www.cashflowcrew.in/refund-policy">Refund Policy</a>
                                <a href="https://www.cashflowcrew.in/delivery-policy">Delivery Policy</a>
                            </div>
                        </div>
                    </div>
                    <div className={s.footerLegal}>
                        <p>
                            <b>Education only, not investment advice.</b> CashFlowCrew does not give investment advice or recommend any
                            security or fund. Nothing on this page or in the workshop is a recommendation to buy, sell or hold any security
                            or mutual fund scheme. For personalised investment advice, consult a SEBI-registered Investment Adviser (RIA).
                        </p>
                        <p>
                            Mutual fund investments are subject to market risks; read all scheme-related documents carefully. Mutual fund
                            returns are not guaranteed, and past performance does not indicate future returns. Examples marked
                            &quot;illustrative&quot; use hypothetical numbers. Goldman Sachs is named only to describe the instructor&apos;s past
                            employment and does not endorse this workshop. AI tools can produce inaccurate information; verify any AI output
                            against official fund documents.
                        </p>
                        <p>
                            © 2026 CashFlowCrew. All rights reserved. CashFlowCrew is owned and operated by{" "}
                            <a href="https://collabroot.com">Collabroot Marketing Private Limited</a>, Gurugram, Haryana.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
