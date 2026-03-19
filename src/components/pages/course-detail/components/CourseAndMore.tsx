"use client";

import { MessageCircle, Users, Headphones, Video } from "lucide-react";

const extras = [
    {
        icon: MessageCircle,
        title: "Community Access",
        description: "Join our private community of like-minded learners",
    },
    {
        icon: Users,
        title: "Group Q&A Sessions",
        description: "Monthly live sessions to get your questions answered",
    },
    {
        icon: Headphones,
        title: "Priority Support",
        description: "Get help whenever you're stuck",
    },
    {
        icon: Video,
        title: "Bonus Resources",
        description: "Templates, checklists, and additional learning materials",
    },
];

export const CourseAndMore = () => {
    return (
        <section className="py-16 px-4 sm:px-6 bg-cream-dark">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold font-serif text-ink mb-2">
                        ...and much more
                    </h2>
                    <p className="text-ink-secondary">
                        Everything you need to succeed on your financial journey
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    {extras.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 border border-border hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                    <item.icon className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-ink mb-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-ink-secondary">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
