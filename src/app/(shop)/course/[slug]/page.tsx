import ModernTemplate from "@/components/templates/ModernTemplate";
import MutualFoundBentoTheme from "@/components/templates/MutualFound-BentoTheme";
import { getCourseBySlugAction } from "@/server/actions/get-courses";
import { redirect } from "next/navigation";


export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let course = await getCourseBySlugAction(resolvedParams.slug);

  if (!course) return <div>Course not found</div>;

  // Redirection Logic
  if (course.staticRoute && resolvedParams.slug !== course.staticRoute) {
    redirect(`/course/${course.staticRoute}`);
  } else if (!course.staticRoute && course.slug && resolvedParams.slug !== course.slug) {
    redirect(`/course/${course.slug}`);
  }

  switch (course.theme) {
    case "Bento-Minimalism":
      return <MutualFoundBentoTheme />;

    case "artistic":
      return <ModernTemplate course={'course'} recommendations={'recommendations'} />;

    case "modern":
    default:
      return <ModernTemplate course={'course'} recommendations={'recommendations'} />;
  }
}