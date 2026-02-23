"use client";
import { useRouter } from "next/navigation";
import { V2CTA } from "./V2CTA";
import { Button } from "@/components/ui/button";

interface V2FinalCTAProps {
    courseId: string;
    price: number;
}

const path1 = [
    "Continue trusting recommendations you can't verify",
    "Feel guilty every quarter about not reviewing your portfolio",
    "Wonder if your 4 funds are actually diversified or just the same stocks four times",
    "Hope your advisor is right about that ULIP",
    "Spend 12–14 hours trying to do this yourself… and give up",
    "In 6 months, you'll still be here. Same anxiety. Same uncertainty.",
];

const path2 = [
    "Spend one weekend building your own AI-powered verification system",
    "Run the checks on YOUR portfolio during the workshop",
    "See what's actually happening with your money — possibly for the first time",
    "Set up a 15-minute monthly routine that keeps you informed forever",
    "In 6 months, you'll have verified your entire portfolio twice",
];

export const V2FinalCTA: React.FC<V2FinalCTAProps> = ({ courseId, price }) => {
    const router = useRouter();

    return (
        <section className="py-20 px-6 bg-zinc-950 text-white">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 leading-tight">
                    You Have Two Paths From Here
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-14">
                    {/* Path 1 */}
                    <div className="bg-red-950/40 border border-red-900/50 rounded-2xl p-7">
                        <p className="font-bold text-red-400 text-lg mb-5">PATH 1: Keep Postponing</p>
                        <ul className="space-y-3">
                            {path1.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-zinc-400 text-sm">
                                    <span className="text-red-500 font-bold mt-0.5 flex-shrink-0">→</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Path 2 */}
                    <div className="bg-blue-950/40 border border-blue-700/50 rounded-2xl p-7">
                        <p className="font-bold text-blue-400 text-lg mb-5">PATH 2: Set Up Your Verifier</p>
                        <ul className="space-y-3">
                            {path2.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                                    <span className="text-blue-400 font-bold mt-0.5 flex-shrink-0">→</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-10 text-center">
                    <p className="text-zinc-400 leading-relaxed mb-2">The honest truth:</p>
                    <p className="text-zinc-300 leading-relaxed mb-4">
                        If nothing changes, most working professionals never get around to properly auditing
                        their mutual funds. Not because they don't care. But because the manual effort keeps
                        pushing it to "next quarter."
                    </p>
                    <p className="font-bold text-white text-xl">
                        This is your chance to break that cycle. For ₹{price.toLocaleString("en-IN")}. In one
                        weekend.
                    </p>
                    <p className="text-zinc-500 text-sm mt-2">
                        Limited slots. Next cohort fills quietly. When seats close, enrollment pauses.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-6">
                    <V2CTA courseId={courseId} price={price} discountCode="" />

                    <div className="text-center">
                        <p className="text-zinc-500 text-sm mb-3">Not ready to commit?</p>
                        <Button
                            onClick={() => router.push("/master-mutual-funds")}
                            variant="outline"
                            className="border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-full"
                        >
                            REGISTER FOR FREE WEBINAR →
                        </Button>
                        <p className="text-zinc-600 text-xs mt-2">
                            10,000+ working professionals have taken it. (You can always come back to this
                            workshop later.)
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
