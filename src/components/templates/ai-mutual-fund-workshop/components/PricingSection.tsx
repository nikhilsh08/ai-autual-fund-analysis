import { WorkshopCTA } from "./WorkshopCTA";

interface PricingSectionProps {
    courseId: string;
    price: number;
    originalPrice?: number | null;
    startDate?: Date | null | undefined;
}

const formatDate = (date: Date | null | undefined) => {
    if (!date) return "TBA";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

export const PricingSection: React.FC<PricingSectionProps> = ({
    courseId,
    price,
    originalPrice,
    startDate,
}) => {
    const formattedDate = formatDate(startDate);

    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-bold text-center mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        ₹{price.toLocaleString("en-IN")}
                    </span>
                </h2>
                <p className="text-2xl text-center text-zinc-600 mb-12">Once. Forever.</p>

                <div className="bg-zinc-50 rounded-2xl p-8 md:p-12 mb-12">
                    <h3 className="text-2xl font-bold text-zinc-900 mb-6">The Math:</h3>
                    <div className="space-y-3 text-lg text-zinc-700">
                        <p>
                            <span className="font-semibold">Cost of workshop:</span> ₹
                            {price.toLocaleString("en-IN")}
                        </p>
                        <p>
                            <span className="font-semibold">Average fee savings discovered:</span> ₹11,000/year
                        </p>
                        <p>
                            <span className="font-semibold">One avoided ULIP mistake:</span> ₹50,000-2,00,000
                            (over policy term)
                        </p>
                        <p className="text-xl font-bold text-green-700 pt-4">
                            Break-even point: One insight. One avoided mistake. One verified decision.
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 mb-12 border border-blue-200">
                    <h3 className="text-2xl font-bold text-zinc-900 mb-6">Workshop Details:</h3>
                    <div className="grid md:grid-cols-2 gap-6 text-lg">
                        <div>
                            <p className="text-zinc-600 mb-1">Date:</p>
                            <p className="font-bold text-zinc-900">{formattedDate}</p>
                        </div>
                        <div>
                            <p className="text-zinc-600 mb-1">Duration:</p>
                            <p className="font-bold text-zinc-900">Full Day Workshop</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-zinc-600 mb-1">Format:</p>
                            <p className="font-bold text-zinc-900">Live + recording (lifetime access)</p>
                        </div>
                    </div>
                    <p className="text-sm text-zinc-500 mt-6">
                        Limited slots — applications close when filled.
                    </p>
                </div>

                <WorkshopCTA
                    courseId={courseId}
                    price={price}
                    originalPrice={originalPrice}
                    discountCode="EARLYBIRD"
                    className="scale-110"
                />
            </div>
        </section>
    );
};
