export type CourseStatus = "Available" | "Coming Soon";

export interface Course {
    id: number;
    slug: string;
    title: string;
    oneLiner: string;
    description: string;
    category: string;
    status: CourseStatus;
    subHeading?: string;
    content?: string;
    price?: string;
    curriculum?: string[];
}

export const courses: Course[] = [
    // Getting Started
    {
        id: 1,
        slug: "beginners-investment-masterclass",
        title: "Beginner's Investment Masterclass",
        oneLiner: "The fundamentals of investing when you're just starting out — from savings to your first SIP.",
        description: "Start your investment journey on the right foot. This masterclass covers everything from building an emergency fund to understanding different asset classes and starting your first SIP. Perfect for students, young professionals, and anyone looking to take control of their financial future.",
        category: "Getting Started",
        status: "Available",
        price: "₹999",
        curriculum: [
            "Module 1: Money Mindset & Goal Setting",
            "Module 2: Building a Safety Net (Emergency Funds & Insurance)",
            "Module 3: Understanding Asset Classes (Equity, Debt, Gold, Real Estate)",
            "Module 4: Mutual Funds Basics",
            "Module 5: Your First Investment Plan"
        ]
    },
    {
        id: 4,
        slug: "net-worth-calculation",
        title: "Net Worth Calculation & Expense Management",
        oneLiner: "Track where your money goes, calculate your real net worth, and take control — with a ready-to-use Excel sheet.",
        description: "You can't manage what you don't measure. Learn how to accurately calculate your net worth, track your expenses without feeling restricted, and identify where your money is actually going. Includes a powerful, custom-built Excel tracker.",
        category: "Getting Started",
        status: "Available",
        price: "₹499",
        curriculum: [
            "Module 1: Assets vs Liabilities",
            "Module 2: Calculating Your True Net Worth",
            "Module 3: The 50-30-20 Rule & Expense Tracking",
            "Module 4: Using the CashFlowCrew Net Worth Tracker"
        ]
    },
    {
        id: 5,
        slug: "financial-ratios",
        title: "The 6 Ratios That Determine Your Financial Future",
        oneLiner: "Six numbers. That's all it takes to know if you're on track or falling behind. Learn them.",
        description: "Financial health isn't about one big number; it's about the ratios. Learn the 6 key ratios that banks and financial planners use to assess financial stability, and how to apply them to your own life.",
        category: "Getting Started",
        status: "Coming Soon"
    },

    // Mutual Funds & Equity
    {
        id: 2,
        slug: "equity-mutual-fund-analysis",
        title: "Equity Mutual Fund Analysis",
        oneLiner: "Learn to evaluate mutual funds the way Goldman Sachs analysts do — Sortino ratios, Active Share, Rolling Returns, and more.",
        description: "Stop investing in 5-star rated funds blindly. Learn the institutional frameworks for evaluating mutual fund performance, risk, and consistency. We'll cover advanced metrics like Sortino Ratio, Capture Ratios, and Active Share to help you pick true winners.",
        category: "Mutual Funds & Equity",
        status: "Available",
        price: "₹2,499",
        curriculum: [
            "Module 1: The Flaw in Star Ratings",
            "Module 2: Risk-Adjusted Returns (Sharpe vs Sortino)",
            "Module 3: Rolling Returns Analysis",
            "Module 4: Active Share & Portfolio Overlap",
            "Module 5: Constructing a Core & Satellite Portfolio"
        ]
    },
    {
        id: 3,
        slug: "ai-portfolio-analysis",
        title: "AI-Powered Portfolio Analysis",
        oneLiner: "Use AI tools to analyze your equity mutual fund portfolio — institutional-grade insights, zero jargon.",
        description: "Leverage the power of AI to analyze your portfolio. Learn how to use modern tools to detect overlap, check for diversification, and optimize your returns with data-driven insights.",
        category: "Mutual Funds & Equity",
        status: "Coming Soon"
    },
    {
        id: 10,
        slug: "equity-stocks",
        title: "Equity Stocks as an Investment",
        oneLiner: "When and how to go beyond mutual funds into direct equity — frameworks for stock selection and risk.",
        description: "Ready to move beyond mutual funds? Learn the frameworks for direct stock investing. We check fundamental analysis basics, how to read an annual report, and risk management for direct equity portfolios.",
        category: "Mutual Funds & Equity",
        status: "Coming Soon"
    },

    // Advanced Strategies
    {
        id: 6,
        slug: "credit-debt-mastery",
        title: "Credit & Debt Mastery",
        oneLiner: "Turn debt from a liability into a strategic lever. Master credit scores, EMI optimization, and debt payoff frameworks.",
        description: "Debt can be a tool or a trap. Learn how to master your credit score, optimize your loans, and strategically use debt to build wealth.",
        category: "Advanced Strategies",
        status: "Coming Soon"
    },
    {
        id: 7,
        slug: "real-estate-investing",
        title: "Real Estate Investing",
        oneLiner: "Cut through the noise. Learn when real estate makes sense, how to evaluate deals, and how it fits your portfolio.",
        description: "Real estate is the biggest purchase most people make. Learn how to evaluate rental yields, capital appreciation potential, and the role of REITs in a modern portfolio.",
        category: "Advanced Strategies",
        status: "Coming Soon"
    },
    {
        id: 8,
        slug: "asset-allocation",
        title: "Asset Allocation Strategies",
        oneLiner: "The single most important investment decision you'll ever make — and how to get it right.",
        description: "Asset allocation drives 90% of your portfolio's returns. Learn how to design an asset allocation strategy that fits your age, risk profile, and financial goals.",
        category: "Advanced Strategies",
        status: "Coming Soon"
    },
    {
        id: 9,
        slug: "international-allocation",
        title: "International Allocation & Commodities",
        oneLiner: "Go beyond India. Learn to diversify globally with international funds, gold, silver, and other commodities.",
        description: "Don't put all your eggs in one country's basket. Learn the why and how of international diversification and the role of commodities like Gold and Silver as hedges.",
        category: "Advanced Strategies",
        status: "Coming Soon"
    },
    {
        id: 11,
        slug: "debt-asset-class",
        title: "Debt Asset Class as an Investment",
        oneLiner: "Fixed deposits, bonds, government securities, and debt funds — how to build a rock-solid fixed income portfolio.",
        description: "Debt isn't just FD. Explore the world of Debt Mutual Funds, Bonds, G-Secs, and Corporate FDs to build a stable income stream and capital protection layer.",
        category: "Advanced Strategies",
        status: "Coming Soon"
    },
    {
        id: 12,
        slug: "retirement-planning",
        title: "Retirement Planning",
        oneLiner: "Learn why SWP is not the answer we seek + do we need a pension plan when retiring",
        description: "Retirement planning goes beyond just saving a corpus. Learn about withdrawal strategies, inflation protection, and why the standard SWP advice might not be enough.",
        category: "Advanced Strategies",
        status: "Coming Soon"
    }
];

export const categories = ["All", "Getting Started", "Mutual Funds & Equity", "Advanced Strategies"];
