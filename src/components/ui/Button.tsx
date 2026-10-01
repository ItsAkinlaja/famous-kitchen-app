import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

    const variants = {
      primary:
        "bg-[#FC0003] text-white hover:bg-[#d40002] focus-visible:ring-[#FC0003]",
      secondary:
        "bg-stone-100 text-stone-900 hover:bg-stone-200 focus-visible:ring-stone-400",
      outline:
        "border border-stone-300 bg-transparent text-stone-900 hover:bg-stone-50 focus-visible:ring-stone-400",
      ghost:
        "bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus-visible:ring-stone-400",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm rounded",
      md: "h-10 px-4 text-sm rounded",
      lg: "h-11 px-6 text-base rounded",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
