import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', disabled, ...props }, ref) => {
    const variants = {
      default: 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs active:scale-[0.98]',
      secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200/80 dark:hover:bg-slate-700 active:scale-[0.98]',
      outline: 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 active:scale-[0.98]',
      ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white active:scale-[0.98]',
      destructive: 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs active:scale-[0.98]',
      success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs active:scale-[0.98]',
    };

    const sizes = {
      default: 'h-9 px-4 py-2 text-xs font-semibold rounded-lg',
      sm: 'h-8 px-3 text-[11px] font-semibold rounded-md',
      lg: 'h-11 px-5 text-sm font-semibold rounded-xl',
      icon: 'h-8 w-8 rounded-lg p-0 flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1',
          'disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
