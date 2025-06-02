import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/core/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helper, type = 'text', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-default">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'input-base',
            error && 'input-error',
            className
          )}
          {...props}
        />
        {helper && !error && (
          <p className="text-sm text-muted">{helper}</p>
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; 