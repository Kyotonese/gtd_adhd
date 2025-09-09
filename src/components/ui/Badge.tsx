import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'difficulty-1' | 'difficulty-2' | 'difficulty-3' | 'difficulty-4' | 'difficulty-5';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variants = {
      default: 'bg-primary-100 text-primary-800 border-primary-200',
      secondary: 'bg-gray-100 text-gray-800 border-gray-200',
      success: 'bg-success-100 text-success-800 border-success-200',
      warning: 'bg-warning-100 text-warning-800 border-warning-200',
      danger: 'bg-danger-100 text-danger-800 border-danger-200',
      'difficulty-1': 'bg-green-100 text-green-800 border-green-200',
      'difficulty-2': 'bg-blue-100 text-blue-800 border-blue-200',
      'difficulty-3': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'difficulty-4': 'bg-orange-100 text-orange-800 border-orange-200',
      'difficulty-5': 'bg-red-100 text-red-800 border-red-200',
    };

    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-2 text-base',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full border',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };