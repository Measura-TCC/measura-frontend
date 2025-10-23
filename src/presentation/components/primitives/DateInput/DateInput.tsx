import React, { forwardRef } from "react";
import { cn } from "@/core/utils";

export interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, value, onChange, error, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <input
        ref={ref}
        type="date"
        value={value || ""}
        onChange={handleChange}
        className={cn(
          "mt-1 block w-full rounded-md border-gray-300 shadow-sm",
          "focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
    );
  }
);

DateInput.displayName = "DateInput";
