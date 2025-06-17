import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/core/utils";
import { SpinnerIcon } from "@/presentation/assets/icons";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-primary text-white hover:bg-primary-dark ",
      secondary:
        "border border-border bg-background text-default hover:bg-background-secondary ",
      ghost: "bg-transparent text-default hover:bg-background-secondary ",
      danger: "bg-red-600 text-white hover:bg-red-700 ",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className,
          "cursor-pointer"
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <SpinnerIcon className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
