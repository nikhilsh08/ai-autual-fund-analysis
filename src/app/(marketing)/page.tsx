import BentoStats from "@/components/BentoStats";
import FeaturedBento from "@/components/FeaturedBento";
import LogoTicker from "@/components/LogoTicker";
import { Newsletter } from "@/components/Newsletter";
import ReformHero from "@/components/ReformHero";
import TestimonialGrid from "@/components/TestimonialGrid";
// import { Button } from "@/components/ui/button"; // Button is now used inside Newsletter, not here directly
import { dataBasePrisma } from "@/lib/dbPrisma";


export default async function Home() {
  const latestCourse = await dataBasePrisma.course.findFirst({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <>
      <ReformHero course={latestCourse} />
      <LogoTicker />
      <BentoStats />
      <FeaturedBento />
      <TestimonialGrid />
      <Newsletter />
    </>
  );
}
