import Image from "next/image";

export const InstructorSection = () => {
    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 text-center mb-16">
                    Built By Someone Who Did This For A Living
                </h2>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="flex justify-center">
                        <div className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-lg">
                            <Image
                                src="https://res.cloudinary.com/dq1llsy7f/image/upload/v1738855885/c1gzyxcgfokizkisio3j.jpg"
                                alt="Nikhil Sharma"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-3xl font-bold text-zinc-900 mb-2">Nikhil Sharma</h3>
                            <p className="text-xl text-blue-600 font-semibold">
                                Founder, CashFlowCrew | Ex-Goldman Sachs
                            </p>
                        </div>

                        <p className="text-lg text-zinc-700 leading-relaxed">
                            Nikhil spent 5 years at Goldman Sachs managing risk for mutual fund and hedge fund
                            portfolios worth ₹65B+ in AUM. His job: finding problems in portfolios BEFORE they
                            cost money.
                        </p>

                        <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-600">
                            <p className="font-bold text-zinc-900 mb-2">The Realisation:</p>
                            <p className="text-zinc-700">
                                The tools Nikhil used daily — overlap analysis, risk-adjusted metrics, benchmark
                                deviation tracking — weren't secret. The frameworks were publicly documented. The
                                data was freely available.
                            </p>
                            <p className="text-zinc-700 mt-4 font-semibold">
                                The only difference between retail investors and institutional analysts?
                            </p>
                            <p className="text-zinc-700 mt-2">
                                Retail investors didn't have the prompts. They didn't know which calculations to
                                run. They didn't know how to interpret the outputs. They didn't have 8 hours to
                                figure it out.
                            </p>
                        </div>

                        <p className="text-xl font-bold text-blue-600">This workshop fixes that.</p>
                    </div>
                </div>

                <div className="mt-12 bg-zinc-50 rounded-2xl p-8 md:p-12">
                    <h4 className="text-2xl font-bold text-zinc-900 mb-6">Career Timeline:</h4>
                    <div className="space-y-4 text-zinc-700">
                        <p>
                            <span className="font-bold">Goldman Sachs (4+ years)</span> — Managed ₹65Bn AUM, risk
                            analysis for flagship hedge funds
                        </p>
                        <p>
                            <span className="font-bold">Credy</span> — Led sales for Y-Combinator backed FinTech
                        </p>
                        <p>
                            <span className="font-bold">LocoNav</span> — Ex National Head of Operations &
                            Enterprise Sales
                        </p>
                        <p>
                            <span className="font-bold">Entrepreneurship</span> — Founded LitmusEye, BlueFlowerCo
                            & CashFlowCrew
                        </p>
                    </div>

                    <div className="mt-8 bg-white rounded-xl p-6 border-l-4 border-green-600">
                        <p className="text-lg text-zinc-700 italic">
                            "As the founder of CashFlowCrew, my mission is to empower the average Indian with the
                            knowledge and tools to achieve financial freedom. By simplifying complex financial
                            concepts and teaching risk management strategies used by top investment banks, I help
                            individuals unlock their full growth potential."
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
