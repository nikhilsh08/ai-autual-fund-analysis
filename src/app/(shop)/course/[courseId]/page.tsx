import ModernTemplate from "@/components/templates/ModernTemplate";
import MutualFoundBentoTheme from "@/components/templates/MutualFound-BentoTheme";
import { getCourseByIdAction } from "@/server/actions/get-courses";



export default async function CoursePage({ params }: { params: { courseId: string } }) {

  let course = await getCourseByIdAction(params.courseId);

  if (!course) return <div>Course not found</div>;

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