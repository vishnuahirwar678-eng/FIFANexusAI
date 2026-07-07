import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-nexus-500 hover:bg-nexus-400 text-white shadow-glow',
    secondary: 'bg-ink-700 hover:bg-ink-600 text-ink-50',
    ghost: 'hover:bg-ink-700/50 text-ink-200',
    danger: 'bg-alert-500 hover:bg-alert-400 text-white shadow-glow-alert',
    success: 'bg-pitch-500 hover:bg-pitch-400 text-ink-900 shadow-glow-pitch',
    outline: 'border border-nexus-500/40 hover:bg-nexus-500/10 text-nexus-200',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexus-400 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'pitch';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-ink-700 text-ink-200 border-ink-600',
    success: 'bg-pitch-500/15 text-pitch-300 border-pitch-500/30',
    warning: 'bg-flame-500/15 text-flame-300 border-flame-500/30',
    danger: 'bg-alert-500/15 text-alert-300 border-alert-500/30',
    info: 'bg-nexus-500/15 text-nexus-300 border-nexus-500/30',
    pitch: 'bg-pitch-500/20 text-pitch-200 border-pitch-500/40',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
