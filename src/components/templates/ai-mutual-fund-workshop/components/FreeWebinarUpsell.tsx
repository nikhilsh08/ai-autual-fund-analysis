import Link from "next/link";

export const FreeWebinarUpsell = () => {
    return (
        <section className="py-16 px-6 bg-blue-50 border-t border-b border-blue-200">
            <div className="max-w-4xl mx-auto text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-4">
                    Not Ready to Commit Yet?
                </h3>
                <p className="text-lg text-zinc-700 mb-6">
                    Attend our free webinar first. We cover the fundamentals of equity mutual fund investing —
                    what Sortino ratios mean, why rolling returns matter, how to read a factsheet.
                </p>
                <p className="text-lg text-zinc-700 mb-8">
                    10,000+ people have taken it. It's a great starting point if you're new to this.
                </p>
                <Link
                    href="/master-mutual-funds"
                    className="inline-block px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-colors"
                >
                    REGISTER FOR FREE WEBINAR →
                </Link>
                <p className="text-sm text-zinc-500 mt-4">
                    (You can always come back to this workshop later.)
                </p>
            </div>
        </section>
    );
};
