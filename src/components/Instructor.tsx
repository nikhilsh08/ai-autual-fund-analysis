import { BadgeCheck, Briefcase, TrendingUp } from "lucide-react";
import Image from "next/image";

export const Instructor = () => {
    return (
        <section id="about" className="py-20 bg-cream-dark border-t border-border">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-12 items-center">

                    {/* Image Column */}
                    <div className="flex-1 lg:max-w-md w-full">
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-cream-darkest relative">
                            <Image
                                src="https://res.cloudinary.com/dq1llsy7f/image/upload/v1738855885/c1gzyxcgfokizkisio3j.jpg"
                                alt="Nikhil Sharma"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-cream">
                                <div className="font-bold text-lg">Nikhil Sharma</div>
                                <div className="text-sm text-cream/80">Co-Founder, CashFlowCrew</div>
                            </div>
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light border border-accent/20 text-accent text-xs font-medium mb-6">
                            <BadgeCheck className="w-3 h-3" />
                            <span>Ex-Goldman Sachs</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold font-serif text-ink mb-6">
                            Meet Your Instructor
                        </h2>

                        <div className="space-y-6 text-ink-secondary text-lg leading-relaxed mb-8">
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
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-border">
                            <div>
                                <div className="text-2xl font-bold text-ink mb-1">₹65,000 Cr+</div>
                                <div className="text-xs text-ink-muted uppercase tracking-wider font-medium">AUM Managed at Goldman Sachs</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-ink mb-1">5+ Years</div>
                                <div className="text-xs text-ink-muted uppercase tracking-wider font-medium">Risk Analysis Experience</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-ink mb-1">3x Founder</div>
                                <div className="text-xs text-ink-muted uppercase tracking-wider font-medium">Collabroot/BlueFlowerCo, LitmusEye & CashFlowCrew</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
