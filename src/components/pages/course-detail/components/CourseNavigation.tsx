"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface CourseNavigationProps {
    courseId: string;
    price: number;
}

const navItems = [
    { label: "Summary", href: "#summary" },
    { label: "Modules", href: "#modules" },
    { label: "FAQs", href: "#faqs" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Get Started", href: "#get-started" },
];

export const CourseNavigation = ({ courseId, price }: CourseNavigationProps) => {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState("summary");
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);

            // Find active section
            const sections = navItems.map(item => item.href.slice(1));
            for (const section of sections.reverse()) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 150) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleEnroll = () => {
        router.push(`/checkout?courseId=${courseId}`);
    };

    const scrollToSection = (href: string) => {
        const element = document.getElementById(href.slice(1));
        if (element) {
            const offset = 80;
            const top = element.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: "smooth" });
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Navigation Tabs */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <button
                                key={item.href}
                                onClick={() => scrollToSection(item.href)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    activeSection === item.href.slice(1)
                                        ? "bg-ink text-white"
                                        : isScrolled
                                        ? "text-ink-secondary hover:bg-cream-dark"
                                        : "text-ink-secondary hover:bg-white/50"
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Title */}
                    <div className="md:hidden">
                        <span className={`font-semibold text-sm ${isScrolled ? "text-ink" : "text-ink"}`}>
                            CashFlowCrew
                        </span>
                    </div>

                    {/* CTA Button */}
                    <Button
                        onClick={handleEnroll}
                        className={`rounded-full px-6 transition-all ${
                            isScrolled
                                ? "bg-accent hover:bg-accent/90 text-white"
                                : "bg-ink hover:bg-ink-body text-white"
                        }`}
                    >
                        Enroll
                    </Button>
                </div>
            </div>
        </nav>
    );
};
