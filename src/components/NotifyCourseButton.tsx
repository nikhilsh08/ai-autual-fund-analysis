"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BellRing } from "lucide-react";
import { NotifyModal } from "./NotifyModal";

interface NotifyCourseButtonProps {
    courseId: string;
    variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
    text?: string;
}

export function NotifyCourseButton({ courseId, variant = "outline", size = "sm", className, text = "Notify Me" }: NotifyCourseButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button
                variant={variant}
                size={size}
                className={className || "gap-2 text-zinc-600 hover:text-amber-600 hover:border-amber-200"}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsModalOpen(true);
                }}
            >
                <BellRing size={variant === "outline" || variant === "ghost" ? 14 : 18} />
                {text}
            </Button>

            <NotifyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                courseId={courseId}
            />
        </>
    );
}
