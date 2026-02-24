import { cn } from "@/lib/utils";

type BadgeVariant = "ocean" | "sand" | "palm" | "red" | "gray" | "glass";
type BadgeSize = "sm" | "md";

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    className?: string;
    dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
    ocean: "bg-ocean/10 text-ocean border border-ocean/20",
    sand: "bg-sand/15 text-sand-dark border border-sand/30",
    palm: "bg-palm/10 text-palm-dark border border-palm/20",
    red: "bg-red-50 text-red-700 border border-red-200",
    gray: "bg-warmgray/10 text-warmgray border border-warmgray/20",
    glass:
        "bg-white/20 backdrop-blur-sm text-white border border-white/30",
};

const sizes: Record<BadgeSize, string> = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
};

export function Badge({
    children,
    variant = "ocean",
    size = "md",
    className,
    dot = false,
}: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center font-sans font-medium rounded-full",
                variants[variant],
                sizes[size],
                className
            )}
        >
            {dot && (
                <span
                    className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        variant === "palm" && "bg-palm",
                        variant === "ocean" && "bg-ocean",
                        variant === "sand" && "bg-sand",
                        variant === "red" && "bg-red-500",
                        variant === "gray" && "bg-warmgray",
                        variant === "glass" && "bg-white"
                    )}
                />
            )}
            {children}
        </span>
    );
}
