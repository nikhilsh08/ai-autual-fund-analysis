import { WorkshopCTA } from "./WorkshopCTA";

interface WorkshopHeroProps {
    courseId: string;
    price: number;
    originalPrice?: number | null;
}

export const WorkshopHero: React.FC<WorkshopHeroProps> = ({ courseId, price, originalPrice }) => {
    return (
        <div className="text-center space-y-8 py-12">
            {/* Hard cut headline after dream sequence */}
            <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 leading-tight">
                    These Aren't Fantasies.{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        They're Math Problems.
                    </span>
                </h1>
                <p className="text-xl md:text-2xl text-zinc-700 max-w-3xl mx-auto">
                    And math problems have solutions — if you have the right tools.
                </p>
            </div>

            {/* Sub-subhead */}
            <p className="text-lg md:text-xl text-zinc-600 max-w-4xl mx-auto leading-relaxed">
                Learn to analyse your equity mutual funds using AI — in one weekend workshop.{" "}
                <span className="font-semibold">No finance degree. No Excel manipulation.</span> Just
                answers, directly.
            </p>

            {/* Credibility line */}
            <p className="text-sm md:text-base text-zinc-500 max-w-3xl mx-auto">
                Built by an ex-Goldman Sachs risk analyst who spent 5 years stress-testing mutual fund
                portfolios worth ₹65B+ in AUM | <span className="font-bold">10,000+ investors trained</span>
            </p>

            {/* CTA */}
            <WorkshopCTA
                courseId={courseId}
                price={price}
                originalPrice={originalPrice}
                discountCode=""
            />

            {/* Micro-hook */}
            <p className="text-sm text-zinc-400 mt-8 animate-bounce">
                ↓ Wondering if this is actually your problem? Scroll down. The reality might surprise you.
            </p>
        </div>
    );
};
