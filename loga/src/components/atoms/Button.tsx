import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "sand" | "danger" | "outline";
type Size = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
    fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
    primary:
        "bg-gradient-to-r from-ocean to-ocean-light text-white border border-transparent shadow-luxury hover:shadow-luxury-md hover:-translate-y-0.5 active:translate-y-0",
    secondary:
        "bg-gradient-to-r from-sand to-sand-light text-ocean-dark border border-transparent shadow-sand hover:shadow-luxury hover:-translate-y-0.5",
    sand:
        "bg-sand/10 text-sand-dark border border-sand/30 hover:bg-sand/20 hover:border-sand/50",
    ghost:
        "bg-transparent text-ocean border border-transparent hover:bg-ocean/5 hover:border-ocean/20",
    outline:
        "bg-transparent border border-ocean/30 text-ocean hover:bg-ocean/5 hover:border-ocean/50",
    danger:
        "bg-red-600 text-white border border-transparent hover:bg-red-700 hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
    sm: "text-sm px-4 py-2 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-6 py-3 gap-2",
    xl: "text-base px-8 py-4 gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            loading = false,
            icon,
            iconPosition = "left",
            fullWidth = false,
            className,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={cn(
                    "inline-flex items-center justify-center font-sans font-medium rounded-xl transition-all duration-200 ease-luxury cursor-pointer select-none",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                    variants[variant],
                    sizes[size],
                    fullWidth && "w-full",
                    className
                )}
                {...props}
            >
                {loading && (
                    <Loader2 className="animate-spin shrink-0" size={16} />
                )}
                {!loading && icon && iconPosition === "left" && (
                    <span className="shrink-0">{icon}</span>
                )}
                {children && <span>{children}</span>}
                {!loading && icon && iconPosition === "right" && (
                    <span className="shrink-0">{icon}</span>
                )}
            </button>
        );
    }
);

Button.displayName = "Button";
