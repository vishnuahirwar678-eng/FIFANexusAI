import { cn } from '../../lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  showLabel?: boolean;
  height?: number;
}

export function Progress({ value, max = 100, color = '#4d8fff', className, showLabel = false, height = 8 }: ProgressProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-ink-400 mb-1">
          <span>{value.toLocaleString()}</span>
          <span>{pct.toFixed(0)}%</span>
        </div>
      )}
      <div className="w-full bg-ink-800 rounded-full overflow-hidden" style={{ height }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }}
        />
      </div>
    </div>
  );
}
