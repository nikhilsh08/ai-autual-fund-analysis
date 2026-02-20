import { Hero } from "@/components/Hero";
import { CourseCatalog } from "@/components/CourseCatalog";
import { WhyCashFlowCrew } from "@/components/WhyCashFlowCrew";
import { WhoIsThisFor } from "@/components/WhoIsThisFor";
import { Testimonials } from "@/components/Testimonials";
import { Instructor } from "@/components/Instructor";
import { FAQ } from "@/components/FAQ";
import { getCoursesAction } from "@/server/actions/get-courses";


export default async function Home() {
  const rawCourses = await getCoursesAction();
  // Safely map complex category objects to string names for the CourseCatalog
  const courses = rawCourses.map(c => ({
    ...c,
    category: typeof c.category === 'object' && c.category ? c.category.name : c.category
  })) as any[];

  // Extract unique categories
  const categories = Array.from(new Set(courses.map(c => c.category).filter(Boolean)));

  return (
    <>
      <Hero />
      <CourseCatalog courses={courses} categories={categories} />
      <WhyCashFlowCrew />
      <WhoIsThisFor />
      <Testimonials />
      <Instructor />
      <FAQ />
    </>
  );
}
