"use client"
import { Bonuses, CTA, Disclaimer, EventDetails, FAQ, Header, InstructorCard, MentorSection, MoneyBackGuarantee, TargetAudience, Testimonials, Timeline } from "./components";
import { Popup } from "./components/Popup";



const MasterMutualFunds: React.FC = () => (
  <>
    <div className="flex-1 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <Header />
          <div className="flex flex-col items-center space-y-8 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <EventDetails />
              <InstructorCard />
            </div>
            <CTA />
          </div>
          <TargetAudience />
          <Testimonials />
          <Timeline />
          <MentorSection />
          <Bonuses />
          <MoneyBackGuarantee />
          <FAQ />
        </div>
      </div>
    </div>
    <Disclaimer />
    <Popup/>
  </>
);

export default MasterMutualFunds;
