import { WorkshopCTA } from "./WorkshopCTA";

interface TwoPathsCTAProps {
    courseId: string;
    price: number;
}

export const TwoPathsCTA: React.FC<TwoPathsCTAProps> = ({ courseId, price }) => {
    return (
        <section className="py-20 px-6 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-12">You Have Two Paths From Here</h2>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white/10 rounded-2xl p-8 border-2 border-red-500/50">
                        <h3 className="text-2xl font-bold text-red-400 mb-6">PATH 1: Keep Postponing</h3>
                        <div className="text-left space-y-3 text-zinc-300">
                            <p>→ Continue trusting recommendations you can't verify</p>
                            <p>→ Feel guilty every quarter about not reviewing your portfolio</p>
                            <p>→ Wonder if your 4 funds are actually diversified</p>
                            <p>→ Hope your advisor is right about that ULIP</p>
                            <p>→ Spend 12-14 hours trying to do this yourself (and give up)</p>
                            <p className="text-red-400 font-bold pt-4">
                                → In 6 months, you'll still be in the same place. Anxious. Uncertain. Postponing.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/10 rounded-2xl p-8 border-2 border-green-500/50">
                        <h3 className="text-2xl font-bold text-green-400 mb-6">PATH 2: Get The Tools</h3>
                        <div className="text-left space-y-3 text-zinc-300">
                            <p>→ Spend one weekend learning institutional-grade analysis</p>
                            <p>→ Run the prompts on YOUR portfolio during the workshop</p>
                            <p>→ Discover what's actually happening with your money</p>
                            <p>→ Build a 15-minute monthly audit routine</p>
                            <p>→ Never wonder again if you're making the right decisions</p>
                            <p className="text-green-400 font-bold pt-4">
                                → In 6 months, you'll have verified your entire portfolio. Twice. And you'll know
                                exactly where you stand.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/10 rounded-2xl p-8 md:p-12 mb-12">
                    <p className="text-2xl md:text-3xl font-bold mb-6">The Honest Truth:</p>
                    <p className="text-xl text-zinc-300 mb-4">
                        If you don't take this workshop, you'll probably never properly audit your mutual funds.
                    </p>
                    <p className="text-lg text-zinc-400">
                        Not because you don't care. But because the manual effort required makes it functionally
                        impossible for a working professional.
                    </p>
                    <p className="text-xl font-bold text-yellow-400 mt-6">
                        This is your chance to fix that. For ₹{price.toLocaleString("en-IN")}. Once.
                    </p>
                </div>

                <WorkshopCTA courseId={courseId} price={price} variant="secondary" />

                <p className="text-sm text-zinc-400 mt-8">
                    Limited slots. Applications close when filled.
                </p>
            </div>
        </section>
    );
};
