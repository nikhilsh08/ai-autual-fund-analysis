export const siteConfig = {
    name: "CashFlowCrew",
    description: "Learn how to pick the right mutual funds and build a wealth-generating portfolio. Honest, data-driven financial education for Indian investors.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://www.cashflowcrew.in",
    ogImage: "https://y6aq91jvva.ufs.sh/f/cCffeigdLsYJStCzs34gOWhRfDH64bkSAM97QNqmCctJnaoz", // Default OG Image
    links: {
        twitter: "https://twitter.com/cashflowcrew", // Replace with actual
        youtube: "https://youtube.com/@cashflowcrew", // Replace with actual
        instagram: "https://instagram.com/cashflowcrew", // Replace with actual
    },
    creator: "Nikhil",
    keywords: [
        "mutual funds india",
        "investing",
        "personal finance",
        "financial freedom",
        "SIP",
        "active mutual funds",
        "index funds",
        "stock market india",
        "CashFlowCrew"
    ]
};

export type SiteConfig = typeof siteConfig;
