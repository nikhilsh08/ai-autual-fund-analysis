import ModernTemplate from "@/components/templates/modernTemplate";



export default async function CoursePage({ params }: { params: { courseId: string } }) {
  // 1. Fetch Data
let course = {
    theme:"val"
}

  if (!course) return <div>Course not found</div>;

//   const recommendations = await getRecommendations(params.courseId);

  // 2. The Switcher Logic
  // This decides which UI to show based on the DB field
  switch (course.theme) {
    case "coding":
      return <ModernTemplate course={'course'} recommendations={'recommendations'} />;
      
    case "artistic":
      return <ModernTemplate course={'course'} recommendations={'recommendations'} />;
      
    case "modern":
    default:
      return <ModernTemplate course={'course'} recommendations={'recommendations'} />;
  }
}