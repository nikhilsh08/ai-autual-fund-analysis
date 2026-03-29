/* ═══════════════════════════════════════════════════════════
   utils/siteData.ts — All content & data for CashFlowCrew homepage
   ═══════════════════════════════════════════════════════════ */

export const PHOTO_URL =
  "https://res.cloudinary.com/dq1llsy7f/image/upload/v1738855885/c1gzyxcgfokizkisio3j.jpg";

export const NAV_LINKS = ["courses", "founder", "blog"];

export const PROOF_STATS = [
  { value: "10,000+", label: "students enrolled" },
  { value: "12", label: "courses" },
  { value: "4.8 ★", label: "avg. rating" },
  { value: "₹399", label: "starting at" },
];

export const CATEGORY_FILTERS = [
  { value: "all", label: "all" },
  { value: "foundations", label: "foundations" },
  { value: "equity", label: "equity" },
  { value: "debt", label: "debt & credit" },
  { value: "assets", label: "other assets" },
];

export const COURSES = [
  { id: 1, title: "6 Ratios + Emergency Fund", category: "foundations", price: 399, tagline: "the maths you need before anything else.", level: "beginner", tag: "start here", icon: "ratios" },
  { id: 2, title: "Expense Management + Net Worth", category: "foundations", price: 499, tagline: "you can't grow what you can't measure.", level: "beginner", icon: "rupee" },
  { id: 3, title: "Credit Score Deep Dive", category: "debt", price: 399, tagline: "what actually moves your score — and what myths are costing you.", level: "beginner", icon: "card" },
  { id: 4, title: "Master Mutual Funds", category: "equity", price: 399, tagline: "the real analysis behind what your advisor won't explain.", level: "beginner", tag: "bestseller", icon: "trend" },
  { id: 5, title: "Equity Mutual Funds Deep Dive", category: "equity", price: 899, tagline: "passive vs active. AI-assisted fund analysis.", level: "intermediate", icon: "lens" },
  { id: 6, title: "Equity Stock Selection", category: "equity", price: 699, tagline: "when is a stock cheap? the frameworks that matter.", level: "intermediate", icon: "arrow" },
  { id: 7, title: "Asset Allocation Deep Dive", category: "equity", price: 699, tagline: "the only free lunch in investing. risk management in action.", level: "intermediate", icon: "target" },
  { id: 8, title: "Debt as an Asset Class", category: "debt", price: 499, tagline: "bonds. FDs. the yield curve. why fixed income matters.", level: "intermediate", icon: "bank" },
  { id: 9, title: "Real Estate Deep Dive", category: "assets", price: 699, tagline: "rent vs buy. the maths nobody runs.", level: "intermediate", icon: "house" },
  { id: 10, title: "Alternative Assets", category: "assets", price: 599, tagline: "gold. SGBs. REITs. InvITs. when they belong.", level: "advanced", icon: "gold" },
  { id: 11, title: "International Investments", category: "assets", price: 699, tagline: "why your portfolio needs global exposure.", level: "advanced", icon: "globe" },
  { id: 12, title: "Beginner's Masterclass", category: "foundations", price: 399, tagline: "compounding. time value. what school never taught.", level: "beginner", icon: "seed" },
];

export const BUNDLE = {
  fullPrice: 6787,
  price: 3999,
  savings: 2788,
  savingsPercent: 41,
  features: [
    "All 12 courses",
    "Biweekly video updates",
    "Biweekly written analysis",
    "Live sessions",
    "Community access",
    "1-year of updates",
  ],
};

export const DELAY_STATS = [
  {
    pct: "57%",
    stat: "of Indians run out of money within 10 years of retirement.",
    sub: "Most find out when it's already too late.",
    src: "Business Today",
    href: "https://www.businesstoday.in/personal-finance/retirement-planning/story/57-people-believe-their-retirement-corpus-will-exhaust-in-10-years-max-life-insurance-survey-450355-2024-10-16",
    color: "#C084FC",
    iconType: "retirement",
  },
  {
    pct: "57%",
    stat: "say financial stress impacts their mental health.",
    sub: "It impacts sleep, relationships, and overall wellbeing.",
    src: "PwC",
    href: "https://www.pwc.com/us/en/services/consulting/business-transformation/library/employee-financial-wellness-survey.html",
    color: "#FBBF24",
    iconType: "stress",
  },
  {
    pct: "79%",
    stat: "of policyholders aren't sure their insurance coverage is adequate.",
    sub: "This leaves families exposed when it matters the most.",
    src: "Business World",
    href: "https://www.businessworld.in/article/survey-reveals-79-indians-unsure-about-adequate-insurance-coverage-561301",
    color: "#93C5FD",
    iconType: "shield",
  },
  {
    pct: "75%",
    stat: "of Indians have no emergency fund.",
    sub: "An unforeseen circumstance can derail multiple lives.",
    src: "The Times of India",
    href: "https://timesofindia.indiatimes.com/business/india-business/75-of-indians-dont-have-an-emergency-fund-can-default-on-emis-in-case-of-a-sudden-lay-off-survey/articleshow/98293295.cms",
    color: "#6EE7B7",
    iconType: "clock",
  },
];

export const DELAY_STAT_FULL = {
  pct: "70%",
  stat: "of urban Indians fail to meet their financial goals.",
  sub: "Lack of planning leads to lack of progress.",
  src: "The Economic Times",
  href: "https://economictimes.indiatimes.com/markets/stocks/news/urban-indians-save-more-but-struggle-to-meet-financial-goals-survey-finds/articleshow/118145786.cms",
  color: "#F472B6",
  iconType: "alert",
};

export const COMMUNITY_PERKS = [
  { emoji: "🎬", text: "biweekly video — what's changed in each asset class" },
  { emoji: "✍️", text: "biweekly written analysis — frameworks applied to current events" },
  { emoji: "🎙", text: "live sessions when something big happens" },
  { emoji: "💬", text: "community access — ask questions, share learnings" },
];

export const TESTIMONIALS = [
  { name: "Priya M.", role: "PM, Bangalore", text: "I finally understand why my advisor keeps pushing certain funds. This changed how I see my entire portfolio." },
  { name: "Rahul K.", role: "SWE, Pune", text: "The AI prompts alone are worth it. I audited my fund overlap in 4 minutes." },
  { name: "Sneha D.", role: "Doctor, Mumbai", text: "Nikhil explains things the way I wish my MBA friends would — without the jargon." },
];

export const FAQS = [
  ["How is this different from free YouTube content?", "Two things. First, structure — these aren't random videos, they're a curriculum built from first principles. Second, skin in the game — we don't earn from ads or affiliate links. We earn when you enroll, which keeps us honest."],
  ["What exactly am I getting?", "Pre-recorded courses covering every major personal finance topic. Each course is self-paced, with 1-year access, and updated every few weeks. The bundle includes biweekly updates, live sessions, and community access."],
  ["I'm a complete beginner. Will I understand this?", "Absolutely. Every course is written in plain English — the way you'd explain it to a friend. No jargon. No assumed knowledge."],
  ["Is this investment advice?", "No. We teach you frameworks so you can make informed decisions. We don't tell you what to buy or sell. We give you the lens."],
  ["What if I don't like it? Is there a refund?", "Yes. 100% money-back guarantee on your first course, within 7 days. No questions asked."],
  ["Why is the bundle ₹3,999 when individual courses add up to ₹6,787?", "Personal finance is connected. Asset allocation matters as much as stock selection. The bundle saves you money by learning the whole picture."],
  ["Can I buy just one course to try?", "Absolutely. Every course starts at ₹399. Try one and see if you like how we teach."],
  ["Do the courses get updated?", "Yes, every few weeks. With new regulations, rules, and AI tools. Bundle members get biweekly updates on how current events affect each asset class."],
  ["Who is Nikhil Sharma?", "Risk analyst turned educator. 5 years at Goldman Sachs managing ₹60,000 Cr+ in portfolios. Built CashFlowCrew to share these frameworks with people who need them."],
];

export const ARTICLES = [
  { id: "lt", tag: "most read", date: "Mar 12", readTime: "8 min", category: "wealth mindset", title: "The Lifestyle Tax: Why People Earning ₹25 Lakhs Feel Broke", subtitle: "What nobody tells you about making more money in India." },
  { id: "home", tag: "controversial", date: "Mar 9", readTime: "10 min", category: "real estate", title: "Your Home Is Not an Asset. It's Where You Live.", subtitle: "The most expensive belief in Indian personal finance." },
  { id: "pa", date: "Mar 2", readTime: "9 min", category: "mindset", title: "Why Your Parents' Money Advice Is Wrong (And It's Not Their Fault)", subtitle: "Their India doesn't exist anymore. And that's okay." },
];

export const FOOTER_COLUMNS = [
  {
    heading: "courses",
    links: ["all courses", "free masterclass", "bundle"],
  },
  {
    heading: "for students",
    links: ["dashboard", "community", "live sessions"],
  },
  {
    heading: "company",
    links: ["about", "contact", "careers"],
  },
  {
    heading: "legal",
    links: ["privacy", "terms", "refund policy"],
  },
];
