"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface WorkshopCTAProps {
    courseId: string;
    price: number;
    originalPrice?: number | null;
    variant?: "primary" | "secondary" | "outline";
    className?: string;
    discountCode?: string;
}

export const WorkshopCTA: React.FC<WorkshopCTAProps> = ({
    courseId,
    price,
    originalPrice,
    variant = "primary",
    className = "",
    discountCode,
}) => {
    const router = useRouter();

    const handleEnroll = () => {
        router.push(`/checkout?courseId=${courseId}`);
    };

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`}>
            <Button
                onClick={handleEnroll}
                className={`
          px-8 py-6 text-lg font-bold rounded-full transition-all transform hover:-translate-y-0.5 hover:shadow-lg
          ${variant === "primary" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
          ${variant === "secondary" ? "bg-zinc-900 hover:bg-zinc-800 text-white" : ""}
          ${variant === "outline" ? "border-2 border-blue-600 text-blue-600 hover:bg-blue-50" : ""}
        `}
            >
                ENROLL NOW — ₹{price.toLocaleString("en-IN")}
                {originalPrice && originalPrice > price && (
                    <span className="ml-2 line-through text-sm opacity-70">
                        ₹{originalPrice.toLocaleString("en-IN")}
                    </span>
                )}
            </Button>
            {discountCode && (
                <p className="text-sm text-zinc-600">
                    Use code <span className="font-bold text-blue-600">{discountCode}</span> on checkout
                </p>
            )}
        </div>
    );
};
