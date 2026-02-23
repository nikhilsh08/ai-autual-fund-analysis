"use client";
import { Course } from "@prisma/client";
import { V2Hero } from "./components/V2Hero";
import { EmotionalTruth } from "./components/EmotionalTruth";
import { EmpathySection } from "./components/EmpathySection";
import { ChecklistSection } from "./components/ChecklistSection";
import { UncomfortableTruth } from "./components/UncomfortableTruth";
import { OriginStory } from "./components/OriginStory";
import { ToolGap } from "./components/ToolGap";
import { UlipTruth } from "./components/UlipTruth";
import { UrgencySection } from "./components/UrgencySection";
import { WhatChanges } from "./components/WhatChanges";
import { V2Testimonials } from "./components/V2Testimonials";
import { OfferSection } from "./components/OfferSection";
import { V2WhoIsThisFor } from "./components/V2WhoIsThisFor";
import { V2Credibility } from "./components/V2Credibility";
import { V2Transparency } from "./components/V2Transparency";
import { EmotionalCertainty } from "./components/EmotionalCertainty";
import { V2Pricing } from "./components/V2Pricing";
import { V2Bonuses } from "./components/V2Bonuses";
import { V2Guarantee } from "./components/V2Guarantee";
import { V2FinalCTA } from "./components/V2FinalCTA";
import { V2Disclaimer } from "./components/V2Disclaimer";

interface AiMutualFundV2Props {
    course: Course;
}

const AiMutualFundV2: React.FC<AiMutualFundV2Props> = ({ course }) => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <V2Hero courseId={course.id} price={course.price} originalPrice={course.originalPrice} />

            {/* Emotional Hook */}
            <EmotionalTruth />

            {/* Empathy */}
            <EmpathySection />

            {/* Checklist */}
            <ChecklistSection courseId={course.id} price={course.price} />

            {/* Uncomfortable Truth */}
            <UncomfortableTruth />

            {/* Origin Story */}
            <OriginStory />

            {/* Tool Gap */}
            <ToolGap courseId={course.id} price={course.price} />

            {/* ULIP Truth */}
            <UlipTruth courseId={course.id} price={course.price} />

            {/* Urgency */}
            <UrgencySection />

            {/* What Changes */}
            <WhatChanges />

            {/* Testimonials */}
            <V2Testimonials courseId={course.id} price={course.price} />

            {/* Offer */}
            <OfferSection courseId={course.id} price={course.price} />

            {/* Who Is This For */}
            <V2WhoIsThisFor />

            {/* Credibility */}
            <V2Credibility />

            {/* Transparency */}
            <V2Transparency />

            {/* Emotional Certainty */}
            <EmotionalCertainty />

            {/* Pricing */}
            <V2Pricing
                courseId={course.id}
                price={course.price}
                originalPrice={course.originalPrice}
                startDate={course.startDate}
            />

            {/* Bonuses */}
            <V2Bonuses />

            {/* Guarantee */}
            <V2Guarantee courseId={course.id} price={course.price} />

            {/* Final CTA */}
            <V2FinalCTA courseId={course.id} price={course.price} />

            {/* Disclaimer */}
            <V2Disclaimer />
        </div>
    );
};

export default AiMutualFundV2;
