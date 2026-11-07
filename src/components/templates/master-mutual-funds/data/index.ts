
import {
  Calendar,
  Clock,
  Video,
  Building2,
  Briefcase,
  Target,
  Rocket,
  LineChart,
  ArrowDownUp,
  PieChart,
  Shield,
  Wallet,
  TrendingUp,
  Target as TargetIcon,
  AlertTriangle,
} from 'lucide-react';

import { DivideIcon as LucideIcon } from 'lucide-react';

export interface Testimonial {
  name: string;
  initials: string;
  quote: string;
}



export interface Experience {
  icon: typeof LucideIcon;
  title: string;
  description: string;
}

export interface TimelineItem {
  icon: typeof LucideIcon;
  title: string;
  description: string;
  timeSlot: string;
}

export interface Guide {
  cover: string;
  title: string;
  description: string;
}





// Copied word for word from past session chat transcripts, per
// CONTENT-RULES.md — one quote per person, nothing invented or "representative".
export const testimonials: Testimonial[] = [
  {
    name: "Ananya Mehta",
    initials: "AM",
    quote: "I've been investing through SIPs for around 4 years now. Mostly picked funds based on ratings and returns. Never really checked what stocks these funds were holding. That was something new for me.",
  },
  {
    name: "Rohan Verma",
    initials: "RV",
    quote: "I have 7-8 mutual funds in my portfolio. Always thought having more funds means better diversification. The overlap part was quite interesting. I should probably check my own portfolio now.",
  },
  {
    name: "Priya Nair",
    initials: "PN",
    quote: "Whenever I had to select a fund, I would just check 3 year and 5 year returns on Groww. Didn't know there were so many other things to look at. The drawdown example was particularly useful.",
  },
  {
    name: "Karan Shah",
    initials: "KS",
    quote: "One of my funds has been underperforming for some time. I was thinking of stopping the SIP and moving to another fund. The session helped me understand what I should be checking before making that decision.",
  },
  {
    name: "Sneha Iyer",
    initials: "SI",
    quote: "The live portfolio analysis was good. It was helpful to actually see how a fund is checked instead of just hearing about different ratios and metrics.",
  },
  {
    name: "Arjun Malhotra",
    initials: "AM",
    quote: "I recently started my SIPs and honestly was quite confused about large cap, mid cap, small cap etc. The first session cleared up quite a few basics for me.",
  },
];

export const targetAudience = [
  'Aspiring Investors',
  'Finance Enthusiasts',
  'Beginners in Mutual Funds',
  'Young Professionals',
  'Students Curious About Investments',
  'Retirees Seeking Financial Security',
];

export const experiences: Experience[] = [
  {
    icon: Building2,
    title: "Goldman Sachs (4+ years)",
    description: "Analysed the risk of $65B of mutual fund and hedge-fund assets"
  },
  {
    icon: Briefcase,
    title: "Credy",
    description: "Led sales for Y-Combinator backed FinTech"
  },
  {
    icon: Target,
    title: "LocoNav",
    description: "Scaled enterprise sales, secured major partnerships"
  },
  {
    icon: Rocket,
    title: "Entrepreneurship",
    description: "Founded LitmusEye & BlueFlowerCo"
  }
];

export const timelineItems: TimelineItem[] = [
  {
    icon: LineChart,
    title: "Mutual Fund Mechanics: How Money Really Works",
    description: "Master how equity mutual funds operate, understand NAV calculations, and learn the four key principles of pooled investing.",
    timeSlot: "0 - 18 mins"
  },
  {
    icon: ArrowDownUp,
    title: "Fund Selection: Choosing Your Winners",
    description: "Learn fund types by market cap and style, master the 5-minute health check, and understand when to use SIP vs lump sum strategies.",
    timeSlot: "18 - 35 mins"
  },
  {
    icon: PieChart,
    title: "Performance Analysis: Beyond Basic Returns",
    description: "Master rolling returns vs absolute returns, learn Sortino ratio for downside risk assessment, and understand benchmark comparison techniques.",
    timeSlot: "35 - 52 mins"
  },
  {
    icon: Shield,
    title: "Portfolio Construction: The Real Game-Changer",
    description: "Discover why asset allocation is the most critical factor, learn the core-satellite strategy, and build your risk capacity framework.",
    timeSlot: "52 - 70 mins"
  },
  {
    icon: Wallet,
    title: "Hidden Costs: What's Killing Your Returns",
    description: "Identify the silent wealth killers in regular vs direct plans, understand when advisory fees add value, and learn expense ratio verification.",
    timeSlot: "70 - 85 mins"
  },
  {
    icon: TrendingUp,
    title: "Goldman Sachs Analysis: Wall Street Techniques",
    description: "Learn active weight calculations, understand what fund managers aren't telling you, and master institutional-level risk analysis with AI tools.",
    timeSlot: "85 - 110 mins"
  },
  {
    icon: TargetIcon,
    title: "Behavioral Finance: Psychology of Winning",
    description: "Master your 30% portfolio drop action plan, understand why smart people make dumb moves, and learn market crash response strategies.",
    timeSlot: "110 - 125 mins"
  },
  {
    icon: AlertTriangle,
    title: "Advanced Implementation: Putting It All Together",
    description: "Master STP/SWP advanced strategies, learn tax optimization techniques, and get your personalized action plan with AI analysis tools.",
    timeSlot: "125 - 150 mins"
  }
];

// The 5 guides are shared as PDFs during the live workshop, never emailed
// before and never linked directly from the page (see BACKEND.md section 4).
export const guides: Guide[] = [
  {
    cover: "/master-mutual-funds/assets/guide-1.webp",
    title: "Mutual Fund Investment Starter Guide",
    description: "From what a mutual fund is to your first portfolio.",
  },
  {
    cover: "/master-mutual-funds/assets/guide-2.webp",
    title: "Essential Mutual Fund Strategies for Beginners",
    description: "The strategies that suit a first-time investor, and the ones to avoid.",
  },
  {
    cover: "/master-mutual-funds/assets/guide-3.webp",
    title: "Monthly Portfolio Audit Checklist",
    description: "A list of checks to run on your portfolio once a month.",
  },
  {
    cover: "/master-mutual-funds/assets/guide-4.webp",
    title: "Complete Guide to Free Portfolio Analysis Tools in India",
    description: "Five free websites and tools for checking a mutual fund or a portfolio, and what each one is good for.",
  },
  {
    cover: "/master-mutual-funds/assets/guide-5.webp",
    title: "Small Changes That Reduce Your Costs and Taxes",
    description: "Practical ideas on costs, taxes and investing habits.",
  },
];