import { V2CTA } from "./V2CTA";

interface V2HeroProps {
    courseId: string;
    price: number;
    originalPrice?: number | null;
}

export const V2Hero: React.FC<V2HeroProps> = ({ courseId, price, originalPrice }) => {
    return (
        <section className="relative bg-gradient-to-b from-zinc-950 to-zinc-900 text-white overflow-hidden">
            {/* Background grid */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "64px 64px",
                }}
            />

            <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-20 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-semibold px-4 py-2 rounded-full mb-8">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    10,000+ Working Professionals Trained
                </div>

                {/* Headline */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
                    Stop Wondering If Your Mutual Funds Are{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                        Quietly Failing You.
                    </span>
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                        Now You Can Know
                    </span>{" "}
                    — In Under 30 Minutes.
                </h1>

                {/* Subhead */}
                <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed mb-8">
                    Set up your own AI-powered portfolio verifier in one weekend workshop. It checks what
                    your advisor won't show you. It catches what you don't have time to find. And it works
                    on YOUR funds — not some textbook example.
                </p>

                {/* Value props */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm">
                        <span className="text-yellow-400">⚡</span>
                        <span className="text-zinc-300">3–4 hours of Excel → under 5 minutes with AI</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm">
                        <span className="text-yellow-400">⚡</span>
                        <span className="text-zinc-300">Works even if you've never read a fund factsheet</span>
                    </div>
                </div>

                {/* Credibility line */}
                <p className="text-sm text-zinc-400 mb-10">
                    Built by an{" "}
                    <span className="text-white font-semibold">ex-Goldman Sachs risk analyst</span> who spent
                    5 years stress-testing ₹65B+ in mutual fund portfolios — so you don't have to become
                    one yourself.
                </p>

                {/* CTA */}
                <V2CTA
                    courseId={courseId}
                    price={price}
                    originalPrice={originalPrice}
                    discountCode=""
                />

                {/* Scroll hook */}
                <p className="text-sm text-zinc-500 mt-10 animate-bounce">
                    ↓ Wondering if this is actually your problem? Scroll down. The answer might keep you up
                    tonight.
                </p>
            </div>
        </section>
    );
};
