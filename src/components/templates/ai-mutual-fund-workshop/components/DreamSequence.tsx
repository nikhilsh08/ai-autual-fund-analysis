"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const dreamVignettes = [
    {
        id: 1,
        title: "Early Retirement",
        caption: "What if you could stop working — not because you have to, but because you chose to?",
        emoji: "☕",
    },
    {
        id: 2,
        title: "The Home",
        caption: "What if that house you've been eyeing wasn't a dream — but a plan with a date on it?",
        emoji: "🏡",
    },
    {
        id: 3,
        title: "Children's Future",
        caption: "What if your children never had to worry about money — because you figured it out for them?",
        emoji: "🎓",
    },
    {
        id: 4,
        title: "The Vacation",
        caption: "What if you could take that trip without calculating if you can afford it?",
        emoji: "✈️",
    },
];

export const DreamSequence = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % dreamVignettes.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[400px] md:h-[500px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-12 text-center"
                >
                    <div className="text-8xl mb-6">{dreamVignettes[currentIndex].emoji}</div>
                    <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-4">
                        {dreamVignettes[currentIndex].title}
                    </h3>
                    <p className="text-lg md:text-xl text-zinc-700 max-w-2xl leading-relaxed">
                        {dreamVignettes[currentIndex].caption}
                    </p>
                </motion.div>
            </AnimatePresence>

            {/* Progress indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {dreamVignettes.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? "bg-blue-600 w-8" : "bg-blue-300"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};
