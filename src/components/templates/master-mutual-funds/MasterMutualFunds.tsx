"use client"
import { Bonuses, CTA, Disclaimer, EventDetails, FAQ, Header, InstructorCard, MentorSection, MoneyBackGuarantee, TargetAudience, Testimonials, Timeline } from "./components";
import { Popup } from "./components/Popup";



import { Course } from "@prisma/client";
import { useRouter } from "next/navigation";

interface MasterMutualFundsProps {
  course: Course;
}

const MasterMutualFunds: React.FC<MasterMutualFundsProps> = ({ course }) => {
  const router = useRouter();

  const handleEnroll = () => {
    router.push(`/checkout?courseId=${course.id}`);
  };

  return (
    <>
      <div className="flex-1 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <Header />
            <div className="flex flex-col items-center space-y-8 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                <EventDetails startDate={course.startDate} />
                <InstructorCard />
              </div>
              <CTA
                price={course.price}
                originalPrice={course.originalPrice || undefined}
                onEnroll={handleEnroll}
              />
            </div>
            <TargetAudience />
            <Testimonials />
            <Timeline />
            <MentorSection />
            <Bonuses />
            <MoneyBackGuarantee onEnroll={handleEnroll} />
            <FAQ startDate={course.startDate} />
          </div>
        </div>
      </div>
      <Disclaimer />
      <Popup />
    </>
  );
};

export default MasterMutualFunds;
