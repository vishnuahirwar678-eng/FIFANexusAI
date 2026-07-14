import { memo } from 'react';
import { cn } from '../../lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  showLabel?: boolean;
  height?: number;
  label?: string;
}

/** Linear progress bar with optional label and percentage display. */
export const Progress = memo(function Progress({
  value,
  max = 100,
  color = '#4d8fff',
  className,
  showLabel = false,
  height = 8,
  label,
}: ProgressProps) {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-ink-400 mb-1">
          <span>{label ?? value.toLocaleString()}</span>
          <span>{pct.toFixed(0)}%</span>
        </div>
      )}
      <div
        className="w-full bg-ink-800 rounded-full overflow-hidden"
        style={{ height }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label ?? `${pct.toFixed(0)}%`}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }}
        />
      </div>
    </div>
  );
});
