'use client';

import { useState, useEffect } from "react";

import {
  NAV_LINKS,
  PROOF_STATS,
  CATEGORY_FILTERS,
  BUNDLE,
  FOOTER_COLUMNS,
  DELAY_STATS,
  DELAY_STAT_FULL,
  PHOTO_URL,
  COMMUNITY_PERKS,
  TESTIMONIALS,
  FAQS,
} from "@/Utils/siteData";

import CoursesSectionServer from "./CoursesSectionServer";
import BlogSectionServer from "./components/BlogSectionServer";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ContrastBanner from "./components/ContrastBanner";
import PriceOfDelay from "./components/PriceOfDelay";
import FounderLetter from "./components/FounderLetter";
import FreeResourceCapture from "./components/FreeResourceCapture";
import CommunitySection from "./components/CommunitySection";
import Testimonials from "./components/Testimonials";
import PersonalisedHelp from "./components/PersonalisedHelp";
import FAQSection from "./components/FAQSection";
import CTASection from "./components/CTASection";
import StickyBar from "./components/StickyBar";
import Footer from "./components/Footer";
import ArticleModal from "./components/ArticleModal";

interface HomeContentProps {
  courses: any[];
  blogs: any[];
  bundle?: any;
}
type FAQItem = [string, string];
export function HomeContent({ courses, blogs, bundle }: HomeContentProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [navScrolled, setNavScrolled] = useState(false);
  const [modalArticle, setModalArticle] = useState<any>(null);

  // Transform database bundle to BundleCard format
  const displayBundle = bundle ? {
    ...bundle,
    fullPrice: bundle.originalPrice || bundle.fullPrice,
  } : null;

  // Scroll listener for nav shrink (client-side only)
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="font-sans bg-cream text-ink-body leading-[1.65] antialiased">
      {/* ── Navigation ── */}
      {/* <Navbar links={NAV_LINKS} scrolled={navScrolled} /> */}

      {/* ── A — ATTENTION: Hero ── */}
      <HeroSection proofStats={PROOF_STATS} />

      {/* ── I — INTEREST: Contrast banner ── */}
      <ContrastBanner />

      {/* ── Price of delay infographic ── */}
      <PriceOfDelay stats={DELAY_STATS} fullWidthStat={DELAY_STAT_FULL} />

      {/* ── D — DESIRE: Founder letter ── */}
      <FounderLetter photoUrl={PHOTO_URL} />

      {/* ── Free resource capture ── */}
      <FreeResourceCapture />

      {/* ── D — DESIRE: Course catalog (Server-rendered, dynamic data) ── */}
      <CoursesSectionServer
        courses={courses}
        filters={CATEGORY_FILTERS}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        bundle={displayBundle || BUNDLE}
      />

      {/* ── Blog / articles (Server-rendered, dynamic data) ── */}
      <BlogSectionServer
        articles={blogs}
        onArticleClick={setModalArticle}
      />

      {/* ── Community / newsletter ── */}
      <CommunitySection perks={COMMUNITY_PERKS} bundlePrice={BUNDLE.price} />

      {/* ── Testimonials ── */}
      <Testimonials testimonials={TESTIMONIALS} />

      {/* ── Personalised help ── */}
      {/* <PersonalisedHelp /> */}

      {/* ── FAQ ── */}
      <FAQSection faqs={FAQS as FAQItem[]} />

      {/* ── Final CTA ── */}
      <CTASection />

      {/* ── Mobile sticky bar ── */}
      <StickyBar />

      {/* ── Footer ── */}
      {/* <Footer columns={FOOTER_COLUMNS} /> */}

      {/* ── Article modal ── */}
      {modalArticle && (
        <ArticleModal article={modalArticle} onClose={() => setModalArticle(null)} />
      )}
    </div>
  );
}
