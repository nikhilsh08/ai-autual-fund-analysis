import { BadgeCheck, Briefcase, TrendingUp } from "lucide-react";
import Image from "next/image";

export const Instructor = () => {
    return (
        <section className="py-20 bg-zinc-50 border-t border-zinc-200">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-12 items-center">

                    {/* Image Column */}
                    <div className="flex-1 lg:max-w-md w-full">
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-200 relative">
                            <Image
                                src="https://res.cloudinary.com/dq1llsy7f/image/upload/v1738855885/c1gzyxcgfokizkisio3j.jpg"
                                alt="Nikhil Sharma"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                                <div className="font-bold text-lg">Nikhil Sharma</div>
                                <div className="text-sm text-zinc-200">Co-Founder, CashFlowCrew</div>
                            </div>
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium mb-6">
                            <BadgeCheck className="w-3 h-3" />
                            <span>Ex-Goldman Sachs</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">
                            Meet Your Instructor
                        </h2>

                        <div className="space-y-6 text-zinc-600 text-lg leading-relaxed mb-8">
                            <p>
                                Nikhil Sharma spent 5+ years at Goldman Sachs managing risk for a portfolio worth over ₹65,000 Crore across mutual funds and hedge funds. He's seen firsthand how institutional investors analyze funds — and realized that none of this knowledge reaches the average Indian investor.
                            </p>
                            <p>
                                That gap is what led him to co-found CashFlowCrew. His mission is simple: take the exact frameworks used by the world's top investment banks and make them accessible to every Indian who wants to invest smarter.
                            </p>
                            <p>
                                He's also a 3-time founder (Collabroot/BlueFlowerCo, LitmusEye & CashFlowCrew), former National Head of Operations at a Sequoia Capital backed startup, and has led enterprise sales for a Y-Combinator backed fintech.
                            </p>
                        </div>

                        {/* Stats Bar */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-zinc-200">
                            <div>
                                <div className="text-2xl font-bold text-zinc-900 mb-1">₹65,000 Cr+</div>
                                <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium">AUM Managed at Goldman Sachs</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-zinc-900 mb-1">5+ Years</div>
                                <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Risk Analysis Experience</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-zinc-900 mb-1">3x Founder</div>
                                <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Collabroot/BlueFlowerCo, LitmusEye & CashFlowCrew</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
