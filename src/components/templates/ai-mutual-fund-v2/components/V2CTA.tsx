"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface V2CTAProps {
    courseId: string;
    price: number;
    originalPrice?: number | null;
    variant?: "primary" | "dark" | "outline";
    className?: string;
    discountCode?: string;
    label?: string;
}

export const V2CTA: React.FC<V2CTAProps> = ({
    courseId,
    price,
    originalPrice,
    variant = "primary",
    className = "",
    discountCode,
    label,
}) => {
    const router = useRouter();

    const handleEnroll = () => {
        router.push(`/checkout?courseId=${courseId}`);
    };

    const bgClass =
        variant === "primary"
            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
            : variant === "dark"
                ? "bg-zinc-900 hover:bg-zinc-800 text-white"
                : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50";

    return (
        <div className={`flex flex-col items-center gap-3 ${className}`}>
            <Button
                onClick={handleEnroll}
                className={`px-10 py-6 text-lg font-bold rounded-full transition-all duration-200 transform hover:-translate-y-0.5 ${bgClass}`}
            >
                {label ?? `REGISTER NOW — ₹${price.toLocaleString("en-IN")}`}
                {originalPrice && originalPrice > price && (
                    <span className="ml-2 line-through text-sm opacity-60">
                        ₹{originalPrice.toLocaleString("en-IN")}
                    </span>
                )}
            </Button>
            {discountCode && (
                <p className="text-sm text-zinc-500">
                    Use code{" "}
                    <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {discountCode}
                    </span>{" "}
                    on checkout
                </p>
            )}
        </div>
    );
};
