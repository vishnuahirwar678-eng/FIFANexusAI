import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: 'nexus' | 'pitch' | 'flame' | 'alert' | 'none';
  hover?: boolean;
  style?: CSSProperties;
}

export function Card({ children, className, glow = 'none', hover = false, style }: CardProps) {
  const glowClass = {
    nexus: 'shadow-glow',
    pitch: 'shadow-glow-pitch',
    flame: 'shadow-glow-flame',
    alert: 'shadow-glow-alert',
    none: '',
  }[glow];
  return (
    <div
      style={style}
      className={cn(
        'glass rounded-2xl border border-ink-700/50 shadow-card transition-all duration-300',
        hover && 'hover:border-nexus-500/40 hover:shadow-glow hover:-translate-y-0.5',
        glowClass,
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-5 border-b border-ink-700/40', className)}>{children}</div>;
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn('font-display text-lg font-semibold text-ink-50', className)}>{children}</h3>;
}
