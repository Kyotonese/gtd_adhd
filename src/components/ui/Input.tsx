import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  adhdMode?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, adhdMode = false, ...props }, ref) => {
    const inputClasses = cn(
      'w-full border border-gray-300 rounded-md shadow-sm',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      adhdMode ? 'adhd-input' : 'px-3 py-2 text-sm',
      error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
      className
    );

    return (
      <div className="w-full">
        {label && (
          <label className={cn(
            'block font-medium text-gray-700 mb-1',
            adhdMode ? 'text-base' : 'text-sm'
          )}>
            {label}
          </label>
        )}
        <input
          type={type}
          className={inputClasses}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };