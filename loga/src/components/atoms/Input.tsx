"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, icon, iconPosition = "left", className, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="font-sans text-sm font-medium text-ocean-dark"
                    >
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    {icon && iconPosition === "left" && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-warmgray pointer-events-none">
                            {icon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            "w-full font-sans text-sm bg-white border rounded-xl text-charcoal placeholder:text-warmgray/60",
                            "transition-all duration-200",
                            "focus:outline-none focus:ring-2 focus:ring-sand/40 focus:border-sand",
                            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-coconut",
                            error
                                ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                                : "border-coconut-darker hover:border-sand/50",
                            icon && iconPosition === "left" ? "pl-10" : "pl-3.5",
                            icon && iconPosition === "right" ? "pr-10" : "pr-3.5",
                            "py-2.5",
                            className
                        )}
                        {...props}
                    />

                    {icon && iconPosition === "right" && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-warmgray pointer-events-none">
                            {icon}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="font-sans text-xs text-red-600 flex items-center gap-1">
                        <span>⚠</span> {error}
                    </p>
                )}
                {hint && !error && (
                    <p className="font-sans text-xs text-warmgray">{hint}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

// Textarea variant
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, hint, className, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label htmlFor={inputId} className="font-sans text-sm font-medium text-ocean-dark">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={inputId}
                    className={cn(
                        "w-full font-sans text-sm bg-white border rounded-xl text-charcoal placeholder:text-warmgray/60",
                        "transition-all duration-200 resize-none",
                        "focus:outline-none focus:ring-2 focus:ring-sand/40 focus:border-sand",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        error
                            ? "border-red-300 focus:ring-red-200"
                            : "border-coconut-darker hover:border-sand/50",
                        "px-3.5 py-2.5 min-h-[120px]",
                        className
                    )}
                    {...props}
                />
                {error && <p className="font-sans text-xs text-red-600">⚠ {error}</p>}
                {hint && !error && <p className="font-sans text-xs text-warmgray">{hint}</p>}
            </div>
        );
    }
);

Textarea.displayName = "Textarea";

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, className, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label htmlFor={inputId} className="font-sans text-sm font-medium text-ocean-dark">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <select
                    ref={ref}
                    id={inputId}
                    className={cn(
                        "w-full font-sans text-sm bg-white border rounded-xl text-charcoal",
                        "transition-all duration-200 cursor-pointer",
                        "focus:outline-none focus:ring-2 focus:ring-sand/40 focus:border-sand",
                        error ? "border-red-300" : "border-coconut-darker hover:border-sand/50",
                        "px-3.5 py-2.5 appearance-none",
                        className
                    )}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && <p className="font-sans text-xs text-red-600">⚠ {error}</p>}
            </div>
        );
    }
);

Select.displayName = "Select";
