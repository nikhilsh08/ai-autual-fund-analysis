export const EmotionalTruth = () => {
    return (
        <section className="py-20 px-6 bg-zinc-50 border-y border-zinc-100">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6 leading-tight">
                    Let's Be Honest About Why You Haven't Looked At Your Portfolio
                </h2>
                <p className="text-lg text-zinc-500 italic mb-8">
                    It's not laziness. It's not ignorance. You know this.
                </p>

                <div className="space-y-5 text-lg text-zinc-700 leading-relaxed">
                    <p>
                        It's because{" "}
                        <span className="font-semibold text-zinc-900">
                            not knowing feels safer than finding out something is wrong.
                        </span>
                    </p>
                    <p>
                        If you don't check, you can't be disappointed. If you don't verify, you don't have to
                        make a difficult decision. If you trust your advisor blindly, at least someone else is
                        responsible.
                    </p>
                    <p className="font-semibold text-zinc-900 border-l-4 border-blue-600 pl-4">
                        But that safety? It's an illusion. And somewhere between your morning coffee and your 9
                        PM Slack or Office WhatsApp messages, you already know it.
                    </p>
                    <p>
                        You've thought about this. Many times. You just haven't had a way to do it that doesn't
                        eat your entire weekend.
                    </p>

                    <div className="bg-white rounded-2xl p-8 border border-zinc-200 shadow-sm mt-8">
                        <p className="text-xl font-bold text-zinc-900 mb-4">This workshop gives you that way.</p>
                        <div className="space-y-3 text-zinc-600">
                            <p className="flex items-center gap-3">
                                <span className="text-red-500 font-bold">✗</span> Not a finance degree
                            </p>
                            <p className="flex items-center gap-3">
                                <span className="text-red-500 font-bold">✗</span> Not a 47-page Excel template
                            </p>
                            <p className="flex items-center gap-3">
                                <span className="text-red-500 font-bold">✗</span> Not another YouTube video that
                                explains theory without helping you DO anything
                            </p>
                            <hr className="border-zinc-200 my-4" />
                            <p className="flex items-center gap-3 text-zinc-900 font-semibold text-lg">
                                <span className="text-blue-600 font-bold">✓</span> A system. Built on AI. That
                                runs on YOUR portfolio.
                            </p>
                            <p className="text-zinc-500 ml-7">
                                In the time it takes to watch one episode of whatever you're bingeing on the
                                weekends.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
