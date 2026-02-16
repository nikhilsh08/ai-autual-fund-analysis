"use client";
import { Course } from "@prisma/client";
import { DreamSequence } from "./components/DreamSequence";
import { WorkshopHero } from "./components/WorkshopHero";
import { ValidationSection } from "./components/ValidationSection";
import { GuiltActivation } from "./components/GuiltActivation";
import { BackstorySection } from "./components/BackstorySection";
import { InformationAsymmetry } from "./components/InformationAsymmetry";
import { IncentiveProblem } from "./components/IncentiveProblem";
import { GlobalWakeUp } from "./components/GlobalWakeUp";
import { VerificationCapability } from "./components/VerificationCapability";
import { SocialProof } from "./components/SocialProof";
import { WorkshopDetails } from "./components/WorkshopDetails";
import { WhoIsThisFor } from "./components/WhoIsThisFor";
import { InstructorSection } from "./components/InstructorSection";
import { TransparencySection } from "./components/TransparencySection";
import { SafetyFramework } from "./components/SafetyFramework";
import { PricingSection } from "./components/PricingSection";
import { BonusesSection } from "./components/BonusesSection";
import { MoneyBackGuarantee } from "./components/MoneyBackGuarantee";
import { WorkshopFAQ } from "./components/WorkshopFAQ";
import { TwoPathsCTA } from "./components/TwoPathsCTA";
import { FreeWebinarUpsell } from "./components/FreeWebinarUpsell";
import { WorkshopDisclaimer } from "./components/WorkshopDisclaimer";

interface AiMutualFundWorkshopProps {
    course: Course;
}

const AiMutualFundWorkshop: React.FC<AiMutualFundWorkshopProps> = ({ course }) => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section with Dream Sequence */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <DreamSequence />
                <WorkshopHero
                    courseId={course.id}
                    price={course.price}
                    originalPrice={course.originalPrice}
                />
            </section>

            {/* Validation & Problem Awareness */}
            <ValidationSection />
            <GuiltActivation courseId={course.id} price={course.price} />

            {/* Backstory & Authority */}
            <BackstorySection />

            {/* Information Asymmetry & Incentive Problem */}
            <InformationAsymmetry courseId={course.id} price={course.price} />
            <IncentiveProblem courseId={course.id} price={course.price} />

            {/* Global Wake-Up Call */}
            <GlobalWakeUp />

            {/* Verification Capability */}
            <VerificationCapability />

            {/* Social Proof */}
            <SocialProof courseId={course.id} price={course.price} />

            {/* Workshop Details */}
            <WorkshopDetails />
            <WhoIsThisFor />

            {/* Instructor & Trust */}
            <InstructorSection />
            <TransparencySection />
            <SafetyFramework />

            {/* Conversion */}
            <PricingSection
                courseId={course.id}
                price={course.price}
                originalPrice={course.originalPrice}
                startDate={course.startDate}
            />
            <BonusesSection />
            <MoneyBackGuarantee courseId={course.id} price={course.price} />
            <WorkshopFAQ />

            {/* Final CTA */}
            <TwoPathsCTA courseId={course.id} price={course.price} />

            {/* Webinar Upsell */}
            <FreeWebinarUpsell />

            {/* Disclaimer */}
            <WorkshopDisclaimer />
        </div>
    );
};

export default AiMutualFundWorkshop;
