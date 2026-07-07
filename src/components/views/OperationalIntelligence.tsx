import { useEffect, useState } from 'react';
import {
  Brain, Sparkles, AlertTriangle, TrendingUp,
  Activity, Zap, Eye, Target, ArrowRight, Lightbulb,
  Shield, Users, Bus, Leaf, Heart, Cpu, MapPin,
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardTitle } from '../ui/Card';
import { Button, Badge } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { Sparkline } from '../ui/Sparkline';
import { generateOperationalInsights, generateSparkline } from '../../lib/mock-data';
import { cn, timeAgo } from '../../lib/utils';
import type { OperationalInsight } from '../../types';

const TYPE_ICONS: Record<string, typeof Brain> = {
  prediction: TrendingUp,
  anomaly: AlertTriangle,
  recommendation: Lightbulb,
  trend: Activity,
};

const TYPE_COLORS: Record<string, string> = {
  prediction: '#4d8fff',
  anomaly: '#ff8c00',
  recommendation: '#00e890',
  trend: '#a855f7',
};

const IMPACT_COLORS: Record<string, string> = {
  low: '#00e890',
  medium: '#ff8c00',
  high: '#ff3b3b',
  critical: '#e61e1e',
};

export function OperationalIntelligence() {
  const [insights] = useState<OperationalInsight[]>(() => generateOperationalInsights());
  const [anomalyData, setAnomalyData] = useState(() => generateSparkline(30, 30, 25));
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    const t = setInterval(() => {
      setAnomalyData((p) => [...p.slice(1), Math.max(5, Math.min(80, p[p.length - 1] + (Math.random() - 0.5) * 20))]);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const types = ['all', 'prediction', 'anomaly', 'recommendation', 'trend'];
  const filtered = selectedType === 'all' ? insights : insights.filter((i) => i.type === selectedType);
  const actionableCount = insights.filter((i) => i.actionable).length;
  const criticalCount = insights.filter((i) => i.impact === 'critical' || i.impact === 'high').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Brain className="w-7 h-7 text-nexus-400" /> Operational Intelligence
          </h1>
          <p className="text-sm text-ink-400 mt-1">AI-generated insights · Predictive alerts · Anomaly detection · Executive decision recommendations</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info"><Sparkles size={10} /> {insights.length} active insights</Badge>
          <Badge variant="warning"><Zap size={10} /> {actionableCount} actionable</Badge>
          <Badge variant="danger"><AlertTriangle size={10} /> {criticalCount} high impact</Badge>
        </div>
      </div>

      {/* Intelligence KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: 'Predictions', value: insights.filter((i) => i.type === 'prediction').length, icon: TrendingUp, color: '#4d8fff' },
          { label: 'Anomalies', value: insights.filter((i) => i.type === 'anomaly').length, icon: AlertTriangle, color: '#ff8c00' },
          { label: 'Recommendations', value: insights.filter((i) => i.type === 'recommendation').length, icon: Lightbulb, color: '#00e890' },
          { label: 'Trends', value: insights.filter((i) => i.type === 'trend').length, icon: Activity, color: '#a855f7' },
          { label: 'Avg Confidence', value: `${((insights.reduce((s, i) => s + i.confidence, 0) / insights.length) * 100).toFixed(1)}%`, icon: Target, color: '#00e890' },
          { label: 'Zones Monitored', value: '18', icon: MapPin, color: '#1f6fff' },
        ].map((k) => (
          <Card key={k.label} hover>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${k.color}15`, color: k.color }}>
                  <k.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="font-display text-xl font-bold text-ink-50">{k.value}</p>
              <p className="text-xs text-ink-400">{k.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Anomaly detection live chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-flame-400" /> Anomaly Detection Engine — Live
            </CardTitle>
            <Badge variant="success"><span className="w-1.5 h-1.5 rounded-full bg-pitch-400 animate-pulse" /> Monitoring 18 zones</Badge>
          </div>
        </CardHeader>
        <CardBody>
          <Sparkline data={anomalyData} color="#ff8c00" width={800} height={120} />
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-ink-400">Anomaly Score: <span className="text-flame-400 font-bold tabular-nums">{Math.round(anomalyData[anomalyData.length - 1])}</span></span>
            <span className="text-ink-400">Threshold: <span className="text-ink-200 tabular-nums">65</span></span>
            <span className="text-ink-400">Peak: <span className="text-ink-200 tabular-nums">{Math.round(Math.max(...anomalyData))}</span></span>
            <span className="text-ink-400">Status: <span className="text-pitch-400 font-medium">Within bounds</span></span>
          </div>
        </CardBody>
      </Card>

      {/* Type filter */}
      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={cn(
              'text-xs px-3 py-1.5 rounded-lg border transition-colors capitalize flex items-center gap-1.5',
              selectedType === t
                ? 'bg-nexus-500/15 text-nexus-200 border-nexus-500/40'
                : 'bg-ink-800/60 border-ink-700 text-ink-300 hover:border-ink-600',
            )}
          >
            {t !== 'all' && (() => {
              const Icon = TYPE_ICONS[t];
              return <Icon size={12} style={{ color: TYPE_COLORS[t] }} />;
            })()}
            {t === 'all' ? 'All Insights' : t}
          </button>
        ))}
      </div>

      {/* Insights feed */}
      <div className="space-y-3">
        {filtered.map((insight) => {
          const Icon = TYPE_ICONS[insight.type];
          const typeColor = TYPE_COLORS[insight.type];
          const impactColor = IMPACT_COLORS[insight.impact];
          return (
            <Card key={insight.id} hover>
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${typeColor}15`, color: typeColor }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded"
                        style={{ background: `${typeColor}20`, color: typeColor }}
                      >
                        {insight.type}
                      </span>
                      <span
                        className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded"
                        style={{ background: `${impactColor}20`, color: impactColor }}
                      >
                        {insight.impact} impact
                      </span>
                      {insight.actionable && (
                        <Badge variant="pitch"><Zap size={9} /> Actionable</Badge>
                      )}
                      <span className="text-xs text-ink-500">{timeAgo(insight.timestamp)}</span>
                    </div>
                    <p className="text-sm font-medium text-ink-100 mb-1">{insight.title}</p>
                    <p className="text-sm text-ink-300">{insight.description}</p>

                    <div className="flex items-center gap-4 mt-3 text-xs">
                      <span className="text-ink-400">
                        Agent: <span className="text-ink-200">{insight.agent}</span>
                      </span>
                      <span className="text-ink-400 flex items-center gap-1">
                        <MapPin size={10} /> {insight.zone}
                      </span>
                      <span className="text-ink-400">
                        Confidence: <span className="font-bold" style={{ color: insight.confidence > 0.9 ? '#00e890' : '#ff8c00' }}>{(insight.confidence * 100).toFixed(1)}%</span>
                      </span>
                    </div>

                    {insight.recommendation && (
                      <div className="mt-3 p-3 rounded-lg bg-pitch-500/10 border border-pitch-500/30">
                        <p className="text-xs font-semibold text-pitch-300 mb-1 flex items-center gap-1">
                          <Lightbulb size={12} /> AI Recommendation
                        </p>
                        <p className="text-sm text-ink-200">{insight.recommendation}</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="success">
                            <Target size={12} /> Execute
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye size={12} /> Investigate
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-20">
                        <Progress value={insight.confidence * 100} color={typeColor} height={4} />
                      </div>
                      <span className="text-xs text-ink-300 tabular-nums">{(insight.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-[10px] text-ink-500">confidence</p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Executive decision support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-nexus-400" /> Executive Decision Recommendations
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {[
              {
                priority: 'critical',
                title: 'Activate Full Crowd Mitigation Protocol',
                rationale: 'North Stand projected to reach critical density in 12 min. Coordinated response across 4 agents recommended.',
                agents: ['Crowd Management', 'Operations Commander', 'Volunteer', 'Security'],
                impact: 'Prevents stampede risk, reduces density by 18%',
                confidence: 94.2,
              },
              {
                priority: 'high',
                title: 'Advance Metro Surge Response by 15 Minutes',
                rationale: 'Inbound passenger flow 34% above forecast. Post-match surge will arrive earlier than predicted.',
                agents: ['Transport', 'Operations Commander'],
                impact: 'Prevents platform overcrowding, reduces wait by 6 min',
                confidence: 89.1,
              },
              {
                priority: 'medium',
                title: 'Activate Sustainability Eco-Mode for 2nd Half',
                rationale: 'Energy usage 16% below target. Occupancy stabilizing. Optimal window for eco-mode activation.',
                agents: ['Sustainability', 'Operations Commander'],
                impact: 'Saves 340 kWh, reduces carbon by 4.2 tCO2',
                confidence: 87.6,
              },
            ].map((d) => (
              <div key={d.title} className="p-4 rounded-xl bg-ink-900/40 border border-ink-700/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded"
                        style={{ background: `${IMPACT_COLORS[d.priority]}20`, color: IMPACT_COLORS[d.priority] }}
                      >
                        {d.priority}
                      </span>
                      <p className="text-sm font-medium text-ink-100">{d.title}</p>
                    </div>
                    <p className="text-sm text-ink-300 mb-2">{d.rationale}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-ink-500">Coordinated agents:</span>
                      {d.agents.map((a) => (
                        <span key={a} className="text-xs px-2 py-0.5 rounded-md bg-ink-800 text-ink-300">{a}</span>
                      ))}
                    </div>
                    <p className="text-xs text-pitch-400 mt-2 flex items-center gap-1">
                      <ArrowRight size={10} /> {d.impact}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-ink-500">Confidence</p>
                    <p className="font-display text-lg font-bold" style={{ color: d.confidence > 90 ? '#00e890' : '#ff8c00' }}>
                      {d.confidence}%
                    </p>
                    <Button size="sm" className="mt-2">
                      <Shield size={12} /> Approve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Agent contribution to intelligence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-pitch-400" /> Agent Intelligence Contribution
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { agent: 'Crowd Management', insights: 3, icon: Users, color: '#ff8c00' },
              { agent: 'Security', insights: 1, icon: Shield, color: '#e61e1e' },
              { agent: 'Transport', insights: 1, icon: Bus, color: '#a855f7' },
              { agent: 'Sustainability', insights: 2, icon: Leaf, color: '#22c55e' },
              { agent: 'Fan Experience', insights: 2, icon: Heart, color: '#00e890' },
              { agent: 'Operations Commander', insights: 3, icon: Cpu, color: '#1f6fff' },
              { agent: 'Volunteer', insights: 1, icon: Users, color: '#4d8fff' },
              { agent: 'Total Active', insights: insights.length, icon: Brain, color: '#ff8c00' },
            ].map((a) => (
              <div key={a.agent} className="p-3 rounded-xl bg-ink-900/40 border border-ink-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${a.color}15`, color: a.color }}>
                    <a.icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs text-ink-300">{a.agent}</span>
                </div>
                <p className="font-display text-xl font-bold text-ink-50">{a.insights}</p>
                <p className="text-[10px] text-ink-500">insights generated</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
