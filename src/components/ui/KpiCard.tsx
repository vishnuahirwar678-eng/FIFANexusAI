import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { KPI } from '../../types';
import { Sparkline } from './Sparkline';
import { cn } from '../../lib/utils';

const STATUS_COLORS: Record<string, string> = {
  good: '#00e890',
  warning: '#ff8c00',
  critical: '#e61e1e',
};

interface KpiCardProps {
  kpi: KPI;
  icon?: ReactNode;
  animated?: boolean;
}

export function KpiCard({ kpi, icon, animated = true }: KpiCardProps) {
  const color = STATUS_COLORS[kpi.status];
  const isPositive = kpi.trend > 0;
  const trendColor = kpi.status === 'good' ? (isPositive ? 'text-pitch-400' : 'text-pitch-400') : (isPositive ? 'text-alert-400' : 'text-pitch-400');
  return (
    <div
      className={cn(
        'glass rounded-2xl p-4 border border-ink-700/50 transition-all duration-300 hover:border-nexus-500/30 hover:shadow-card group relative overflow-hidden',
        animated && 'animate-fade-in',
      )}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${color}15, transparent 70%)` }}
      />
      <div className="relative flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-ink-400 font-medium uppercase tracking-wider">{kpi.label}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-display text-2xl font-bold text-ink-50 tabular-nums">
              {kpi.value.toLocaleString(undefined, { maximumFractionDigits: 1 })}
            </span>
            <span className="text-sm text-ink-400">{kpi.unit}</span>
          </div>
        </div>
        {icon && (
          <div
            className="p-2 rounded-xl"
            style={{ background: `${color}15`, color }}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="relative flex items-center justify-between">
        <div className={cn('flex items-center gap-1 text-xs font-medium', trendColor)}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{isPositive ? '+' : ''}{kpi.trend.toFixed(1)}</span>
        </div>
        <Sparkline data={kpi.sparkline} color={color} width={80} height={28} />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 h-1 bg-ink-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%`, background: color }}
          />
        </div>
        <span className="text-[10px] text-ink-500 tabular-nums">target {kpi.target}</span>
      </div>
    </div>
  );
}
