import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'destructive' | 'warning' | 'muted';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  ...props
}) => {
  const variants = {
    default: 'border-transparent bg-blue-600 text-white',
    secondary: 'border-transparent bg-slate-100 text-slate-800',
    outline: 'border-slate-300 text-slate-700 bg-white',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700 font-bold',
    destructive: 'border-rose-200 bg-rose-50 text-rose-700 font-bold',
    warning: 'border-amber-200 bg-amber-50 text-amber-800 font-bold',
    muted: 'border-slate-200 bg-slate-100 text-slate-600 font-medium',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors shrink-0',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
