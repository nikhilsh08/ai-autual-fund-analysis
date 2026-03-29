
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
  FileText,
  BarChart2,
  BookOpen,
  PenTool as Tool,
  
  Link
} from 'lucide-react';

import { DivideIcon as LucideIcon } from 'lucide-react';

export interface Message {
  type: 'student' | 'instructor';
  text: string;
  time: string;
}

export interface Testimonial {
  name: string;
  avatar: string;
  messages: Message[];
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

export interface Bonus {
  icon: typeof LucideIcon;
  title: string;
  description: string;
  worth: Number;
}





export const testimonials: Testimonial[] = [
  {
    name: "Priya Sharma",
    avatar: "https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ljnd17sv5jbjjopc4qh6.jpg",
    messages: [
      { type: "student", text: "Sir, your SIP vs lumpsum explanation was GOLD! 🙌", time: "9:41 AM" },
      { type: "instructor", text: "Keep investing consistently! 🚀", time: "9:45 AM" },
      { type: "student", text: "Will do! This workshop changed everything for me 😃", time: "9:46 AM" }
    ]
  },
  {
    name: "Rahul Verma",
    avatar: "https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6a8yt2rtr0lwmtltxgy5.jpg",
    messages: [
      { type: "student", text: "The alpha & beta concepts were confusing at first 😅", time: "2:15 PM" },
      { type: "instructor", text: "Think of alpha as bonus points, beta as market risk level 📊", time: "2:20 PM" },
      { type: "student", text: "That makes perfect sense! Thank you 🙌", time: "2:22 PM" }
    ]
  },
  {
    name: "Amit Patel",
    avatar: "https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nwlzdgdq8h16lqbht2t2.jpg",
    messages: [
      { type: "student", text: "Love how practical the portfolio analysis was! 📈", time: "7:30 PM" },
      { type: "instructor", text: "Glad it helped! Keep applying these concepts 💡", time: "7:35 PM" },
      { type: "student", text: "Best investment workshop ever! Worth every penny 💯", time: "7:36 PM" }
    ]
  }
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
    description: "Managed ₹65Bn AUM, risk analysis for flagship hedge funds"
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

export const bonuses: Bonus[] = [
  {
    icon: FileText,
    title: "Mutual Fund Investment Starter Guide",
    description: "Learn the fundamentals of mutual fund investing with this easy-to-follow guide, perfect for beginners.",
    worth: 1500
  },
  {
    icon: BarChart2,
    title: "Quick Hacks to Improve Portfolio Returns",
    description: "Discover actionable strategies to optimize your mutual fund portfolio and maximize returns.",
    worth: 1500
  },
  {
    icon: TrendingUp,
    title: "Monthly Portfolio Audit Checklist",
    description: "Stay on track with your financial goals using this powerful, comprehensive portfolio evaluation blueprint.",
    worth: 2000
  },
  {
    icon: BookOpen,
    title: "Essential Mutual Fund Strategies for Beginners",
    description: "Master the key strategies for mutual fund selection and smart investing.",
    worth: 1500
  },
  {
    icon: Tool,
    title: "Portfolio Analysis Tools & Templates",
    description: "Access powerful tools and ready-to-use templates to make better financial decisions.",
    worth: 1000
  },
  {
  icon: Link,
  title: "Get a List of All Websites Discussed in Class",
  description: "Access a curated list of all the websites covered during live sessions — each packed with resources to help you kickstart and refine your portfolio analysis.",
  worth: 1500
}

];