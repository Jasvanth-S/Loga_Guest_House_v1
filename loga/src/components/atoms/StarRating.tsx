import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
    rating: number;
    max?: number;
    size?: "sm" | "md" | "lg";
    showValue?: boolean;
    className?: string;
    interactive?: boolean;
    onRate?: (rating: number) => void;
}

const sizes = { sm: 12, md: 16, lg: 20 };

export function StarRating({
    rating,
    max = 5,
    size = "md",
    showValue = true,
    className,
    interactive = false,
    onRate,
}: StarRatingProps) {
    const starSize = sizes[size];

    return (
        <div className={cn("inline-flex items-center gap-1", className)}>
            <div className="flex items-center gap-0.5">
                {Array.from({ length: max }, (_, i) => {
                    const filled = i < Math.round(rating);
                    const partial = !filled && i < rating;

                    return (
                        <button
                            key={i}
                            type={interactive ? "button" : undefined}
                            onClick={interactive && onRate ? () => onRate(i + 1) : undefined}
                            disabled={!interactive}
                            className={cn(
                                "transition-transform duration-150",
                                interactive && "cursor-pointer hover:scale-110",
                                !interactive && "cursor-default"
                            )}
                        >
                            <Star
                                size={starSize}
                                className={cn(
                                    "transition-colors duration-150",
                                    filled
                                        ? "fill-sand text-sand"
                                        : partial
                                            ? "fill-sand/40 text-sand/40"
                                            : "fill-transparent text-sand/30"
                                )}
                            />
                        </button>
                    );
                })}
            </div>

            {showValue && (
                <span
                    className={cn(
                        "font-sans font-medium text-charcoal/70",
                        size === "sm" && "text-xs",
                        size === "md" && "text-sm",
                        size === "lg" && "text-base"
                    )}
                >
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
