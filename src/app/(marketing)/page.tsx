/**
 * Home Page - CashFlowCrew Marketing Homepage (Server-Side)
 * Path: /home - Full AIDA Sales Funnel with SEO & Server Actions
 * Uses Server Actions to fetch data at page level, then passes to client component
 */

export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import { HomeContent } from "@/components/pages/home/HomeContent";
import { getHomePageCoursesAction } from "@/server/actions/home-courses";
import { getHomePageBlogsAction } from "@/server/actions/home-blogs";
import { getActiveBundleForHomepage } from "@/server/actions/bundle.action";

/**
 * SEO Metadata - Optimized for search engines and social sharing
 */
export const metadata: Metadata = {
  title: "CashFlowCrew | Master Personal Finance & Investing",
  description: "Build a wealth-generating portfolio with AI-assisted fund analysis. Learn from a risk analyst who managed ₹65,000 Cr+. 12 courses, biweekly updates, live sessions.",
  keywords: [
    "personal finance course",
    "mutual fund analysis",
    "investing in India",
    "wealth building",
    "financial education",
    "portfolio management",
    "AI fund analysis",
    "investment courses India"
  ],
  authors: [
    {
      name: "Nikhil Sharma",
    }
  ],
  creator: "CashFlowCrew",
  publisher: "CashFlowCrew",
  openGraph: {
    title: "CashFlowCrew | Master Personal Finance & Investing",
    description: "Build a wealth-generating portfolio with institutional-grade frameworks. Learn AI-assisted fund analysis from a risk analyst with ₹65,000 Cr+ experience.",
    url: "https://cashflowcrew.in/home",
    siteName: "CashFlowCrew",
    images: [
      {
        url: "https://res.cloudinary.com/dq1llsy7f/image/upload/v1738855885/c1gzyxcgfokizkisio3j.jpg",
        width: 1200,
        height: 630,
        alt: "CashFlowCrew - Master Your Money",
      }
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CashFlowCrew | Master Personal Finance & Investing",
    description: "Build a wealth-generating portfolio with AI-assisted fund analysis. 12 courses, biweekly updates, live sessions.",
    images: ["https://res.cloudinary.com/dq1llsy7f/image/upload/v1738855885/c1gzyxcgfokizkisio3j.jpg"],
  },
  alternates: {
    canonical: "https://cashflowcrew.in/home",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function HomePage() {
  // Fetch data server-side using Server Actions
  const courses = await getHomePageCoursesAction();
  const blogs = await getHomePageBlogsAction();
  const bundleResult = await getActiveBundleForHomepage();
  const bundle = bundleResult.success ? bundleResult.data : null;

  // Structured data for rich snippets
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'CashFlowCrew',
    url: 'https://cashflowcrew.in',
    description: 'Personal finance education and AI-assisted investment analysis for Indian investors',
    image: 'https://res.cloudinary.com/dq1llsy7f/image/upload/v1738855885/c1gzyxcgfokizkisio3j.jpg',
    founder: {
      '@type': 'Person',
      name: 'Nikhil Sharma',
      jobTitle: 'Risk Analyst, Financial Educator',
      image: 'https://res.cloudinary.com/dq1llsy7f/image/upload/v1738855885/c1gzyxcgfokizkisio3j.jpg'
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN'
    },
  };

  const courseCollectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'CashFlowCrew Course Curriculum',
    description: '12 comprehensive courses on personal finance and investing',
    url: 'https://cashflowcrew.in/home#courses',
    hasPart: courses.slice(0, 3).map((course: any) => ({
      '@type': 'Course',
      name: course.title,
      description: course.tagline,
      provider: {
        '@type': 'Organization',
        name: 'CashFlowCrew'
      }
    }))
  };

  return (
    <>
      {/* SEO: Structured Data for Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseCollectionSchema) }}
      />

      {/* Client component for interactive elements */}
      <HomeContent
        courses={courses}
        blogs={blogs}
        bundle={bundle}
      />
    </>
  );
}
