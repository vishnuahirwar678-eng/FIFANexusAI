interface GaugeProps {
  value: number;
  max?: number;
  size?: number;
  label?: string;
  unit?: string;
  color?: string;
}

export function Gauge({ value, max = 100, size = 120, label, unit = '%', color = '#4d8fff' }: GaugeProps) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circumference * (1 - pct * 0.75);
  const center = size / 2;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
      <svg width={size} height={size} className="-rotate-[135deg]">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth="8"
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
          strokeLinecap="round"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-bold text-ink-50">
          {value.toFixed(unit === '%' ? 0 : 1)}
          <span className="text-sm text-ink-400">{unit}</span>
        </span>
        {label && <span className="text-xs text-ink-400 mt-0.5">{label}</span>}
      </div>
    </div>
  );
}
