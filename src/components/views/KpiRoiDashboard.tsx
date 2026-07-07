import { useState } from 'react';
import {
  TrendingUp, TrendingDown, Users, Clock, Heart, Leaf,
  DollarSign, Target, Award, BarChart3, ArrowUpRight,
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardTitle } from '../ui/Card';
import { Button, Badge } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { Gauge } from '../ui/Gauge';
import { Sparkline } from '../ui/Sparkline';
import { generateKpiRoiMetrics, generateSparkline } from '../../lib/mock-data';
import { cn } from '../../lib/utils';
import type { KpiRoiMetric } from '../../types';

const CATEGORY_ICONS: Record<string, typeof Users> = {
  crowd: Users,
  efficiency: Clock,
  accessibility: Heart,
  sustainability: Leaf,
  cost: DollarSign,
  satisfaction: Heart,
};

const CATEGORY_COLORS: Record<string, string> = {
  crowd: '#ff8c00',
  efficiency: '#4d8fff',
  accessibility: '#00e890',
  sustainability: '#22c55e',
  cost: '#a855f7',
  satisfaction: '#e61e1e',
};

export function KpiRoiDashboard() {
  const [metrics] = useState<KpiRoiMetric[]>(() => generateKpiRoiMetrics());
  const [trendData] = useState(() => generateSparkline(24, 65, 15));
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(metrics.map((m) => m.category)))];
  const filtered = filter === 'all' ? metrics : metrics.filter((m) => m.category === filter);

  const totalSavings = metrics.reduce((s, m) => s + m.savings, 0);
  const avgImprovement = metrics.reduce((s, m) => s + m.improvement, 0) / metrics.length;
  const exceededPredictions = metrics.filter((m) => m.actual > m.predicted).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-nexus-400" /> KPI & ROI Dashboard
          </h1>
          <p className="text-sm text-ink-400 mt-1">Executive analytics — predicted vs actual impact across all operational dimensions</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success"><Award size={10} /> {exceededPredictions}/{metrics.length} exceeded targets</Badge>
          <Button variant="outline" size="sm"><DollarSign size={14} /> Export Report</Button>
        </div>
      </div>

      {/* Executive summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Cost Savings', value: `$${(totalSavings / 1000).toFixed(0)}K`, icon: DollarSign, color: '#a855f7', sub: 'vs. baseline operations' },
          { label: 'Avg Improvement', value: `+${avgImprovement.toFixed(1)}%`, icon: TrendingUp, color: '#00e890', sub: 'above predicted targets' },
          { label: 'Targets Exceeded', value: `${exceededPredictions}/${metrics.length}`, icon: Target, color: '#4d8fff', sub: 'metrics beating forecast' },
          { label: 'ROI Score', value: '4.2x', icon: Award, color: '#ff8c00', sub: 'return on AI investment' },
        ].map((k) => (
          <Card key={k.label} hover>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${k.color}15`, color: k.color }}>
                  <k.icon className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-pitch-400" />
              </div>
              <p className="font-display text-2xl font-bold text-ink-50">{k.value}</p>
              <p className="text-xs text-ink-300">{k.label}</p>
              <p className="text-[10px] text-ink-500 mt-0.5">{k.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Impact trend chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-pitch-400" /> Impact Score Trend (24h)
            </CardTitle>
            <Badge variant="success"><span className="w-1.5 h-1.5 rounded-full bg-pitch-400 animate-pulse" /> Live</Badge>
          </div>
        </CardHeader>
        <CardBody>
          <Sparkline data={trendData} color="#00e890" width={800} height={140} />
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-ink-400">Min: <span className="text-ink-200 tabular-nums">{Math.round(Math.min(...trendData))}%</span></span>
            <span className="text-ink-400">Current: <span className="text-pitch-400 font-bold tabular-nums">{Math.round(trendData[trendData.length - 1])}%</span></span>
            <span className="text-ink-400">Max: <span className="text-ink-200 tabular-nums">{Math.round(Math.max(...trendData))}%</span></span>
            <span className="text-ink-400">Avg: <span className="text-ink-200 tabular-nums">{Math.round(trendData.reduce((a, b) => a + b, 0) / trendData.length)}%</span></span>
          </div>
        </CardBody>
      </Card>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={cn(
              'text-xs px-3 py-1.5 rounded-lg border transition-colors capitalize',
              filter === c
                ? 'bg-nexus-500/15 text-nexus-200 border-nexus-500/40'
                : 'bg-ink-800/60 border-ink-700 text-ink-300 hover:border-ink-600',
            )}
          >
            {c === 'all' ? 'All Metrics' : c}
          </button>
        ))}
      </div>

      {/* Predicted vs Actual cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((m) => {
          const Icon = CATEGORY_ICONS[m.category] ?? Target;
          const color = CATEGORY_COLORS[m.category] ?? '#4d8fff';
          const exceeded = m.actual > m.predicted;
          const ratio = (m.actual / m.predicted) * 100;
          return (
            <Card key={m.id} hover>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, color }}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-100">{m.label}</p>
                      <p className="text-[10px] text-ink-500 capitalize">{m.category}</p>
                    </div>
                  </div>
                  {exceeded ? (
                    <TrendingUp className="w-4 h-4 text-pitch-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-flame-400" />
                  )}
                </div>

                {/* Predicted vs Actual bar comparison */}
                <div className="space-y-2 mb-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-ink-500">Predicted</span>
                      <span className="text-ink-300 tabular-nums">{m.predicted}{m.unit}</span>
                    </div>
                    <div className="h-2 bg-ink-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full opacity-50" style={{ width: `${Math.min(100, m.predicted)}%`, background: color }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-ink-300 font-medium">Actual</span>
                      <span className="text-ink-100 font-bold tabular-nums">{m.actual}{m.unit}</span>
                    </div>
                    <div className="h-2 bg-ink-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.min(100, m.actual)}%`, background: color }} />
                    </div>
                  </div>
                </div>

                {/* Improvement + savings */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-ink-700/50">
                  <div>
                    <p className="text-[10px] text-ink-500">Improvement</p>
                    <p className={cn('text-sm font-bold tabular-nums', exceeded ? 'text-pitch-400' : 'text-flame-400')}>
                      +{m.improvement}{m.unit.includes('%') ? '%' : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-ink-500">{m.savings > 0 ? 'Savings' : 'Impact'}</p>
                    <p className="text-sm font-bold text-ink-100 tabular-nums">
                      {m.savings > 0
                        ? m.savings > 1000
                          ? `${(m.savings / 1000).toFixed(1)}K ${m.savingsUnit}`
                          : `${m.savings} ${m.savingsUnit}`
                        : `${ratio.toFixed(0)}% of target`}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ROI gauges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-4 h-4 text-nexus-400" /> Target Achievement Summary
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <Gauge value={35} label="Congestion" color="#ff8c00" size={120} unit="%" />
              <p className="text-xs text-ink-400 mt-2">Target: 30%</p>
            </div>
            <div className="flex flex-col items-center">
              <Gauge value={50} label="Response" color="#00e890" size={120} unit="%" />
              <p className="text-xs text-ink-400 mt-2">Target: 45%</p>
            </div>
            <div className="flex flex-col items-center">
              <Gauge value={60} label="Accessibility" color="#4d8fff" size={120} unit="%" />
              <p className="text-xs text-ink-400 mt-2">Target: 50%</p>
            </div>
            <div className="flex flex-col items-center">
              <Gauge value={22} label="Cost Saved" color="#a855f7" size={120} unit="%" />
              <p className="text-xs text-ink-400 mt-2">Target: 18%</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Savings breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-pitch-400" /> Operational Cost Savings Breakdown
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {[
              { label: 'Staff Efficiency Optimization', value: 86000, color: '#4d8fff', desc: '31% improvement in volunteer coordination' },
              { label: 'Energy Management (AI)', value: 124000, color: '#22c55e', desc: '18% reduction in HVAC and lighting' },
              { label: 'Incident Prevention', value: 78000, color: '#e61e1e', desc: '50% faster response, 35% fewer escalations' },
              { label: 'Waste Diversion', value: 52000, color: '#ff8c00', desc: '82% waste diverted from landfill' },
              { label: 'Transport Optimization', value: 34000, color: '#a855f7', desc: '39% faster exit flow, 6 min queue reduction' },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div>
                    <span className="text-ink-200 font-medium">{s.label}</span>
                    <span className="text-xs text-ink-500 ml-2">{s.desc}</span>
                  </div>
                  <span className="text-ink-100 font-bold tabular-nums">${s.value.toLocaleString()}</span>
                </div>
                <Progress value={(s.value / 124000) * 100} color={s.color} height={6} />
              </div>
            ))}
            <div className="pt-3 border-t border-ink-700/50 flex items-center justify-between">
              <span className="font-display font-bold text-ink-50">Total Operational Savings</span>
              <span className="font-display text-2xl font-bold text-pitch-400 tabular-nums">$374,000</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
