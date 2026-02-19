import { Hero } from "@/components/Hero";
import { CourseCatalog } from "@/components/CourseCatalog";
import { WhyCashFlowCrew } from "@/components/WhyCashFlowCrew";
import { WhoIsThisFor } from "@/components/WhoIsThisFor";
import { Testimonials } from "@/components/Testimonials";
import { Instructor } from "@/components/Instructor";
import { FAQ } from "@/components/FAQ";


export default async function Home() {
  return (
    <>
      <Hero />
      <CourseCatalog />
      <WhyCashFlowCrew />
      <WhoIsThisFor />
      <Testimonials />
      <Instructor />
      <FAQ />
    </>
  );
}
