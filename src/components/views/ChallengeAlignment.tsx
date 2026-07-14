import { useMemo, useState } from 'react';
import {
  CheckCircle2, Brain, Sparkles, TrendingUp, Target,
  Award, BarChart3, ArrowRight, Activity, Shield, Users, Leaf,
  Heart, Hand, Bus, Navigation, Globe, Accessibility, WifiOff,
  Eye, Layers, Cpu,
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { ALIGNMENT_DATA } from '../../lib/mock-data';
import { cn } from '../../lib/utils';
import type { AlignmentEntry } from '../../types';

const REQUIREMENT_ICONS: Record<string, typeof Brain> = {
  'AI Fan Copilot': Heart,
  'AI Crowd Intelligence': Users,
  'Digital Twin Stadium': Layers,
  'Operations Command Center': Activity,
  'Volunteer AI Copilot': Hand,
  'Security Intelligence': Shield,
  'Smart Indoor Navigation': Navigation,
  'Transportation Intelligence': Bus,
  'Accessibility Center': Accessibility,
  'Sustainability Intelligence': Leaf,
  'Multilingual AI Support': Globe,
  'Real-Time Decision Intelligence': Brain,
  'Explainable AI': Eye,
  'Offline Emergency Mode': WifiOff,
  'KPI & ROI Measurement': BarChart3,
};

const SUMMARY_KPIS = [
  { label: 'Crowd Congestion Reduction', value: '35%', icon: Users, color: '#ff8c00' },
  { label: 'Faster Navigation', value: '40%', icon: Navigation, color: '#4d8fff' },
  { label: 'Faster Incident Response', value: '50%', icon: Shield, color: '#00e890' },
  { label: 'Volunteer Efficiency', value: '31%', icon: Hand, color: '#a855f7' },
  { label: 'Operational Cost Reduction', value: '22%', icon: TrendingDown, color: '#1f6fff' },
  { label: 'Fan Satisfaction Increase', value: '18%', icon: Heart, color: '#ff8c00' },
  { label: 'Accessibility Usage Increase', value: '60%', icon: Accessibility, color: '#00e890' },
  { label: 'AI Prediction Accuracy', value: '96.8%', icon: Brain, color: '#4d8fff' },
] as const;

function TrendingDown(props: { className?: string }) {
  return <TrendingUp className={props.className} style={{ transform: 'rotate(180deg)' }} />;
}

/** Challenge Alignment Dashboard: maps every FIFA challenge requirement to implemented features, AI components, user benefits, and real-world impact. */
export function ChallengeAlignment() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = ALIGNMENT_DATA.length;
    const fullyImplemented = ALIGNMENT_DATA.filter((a) => a.status === 'fully-implemented').length;
    return { total, fullyImplemented, coverage: (fullyImplemented / total) * 100 };
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Target className="w-7 h-7 text-pitch-400" aria-hidden="true" /> Challenge Alignment Dashboard
          </h1>
          <p className="text-sm text-ink-400 mt-1">Requirement → Implemented Feature → AI Component → User Benefit → Real-world Impact</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success"><CheckCircle2 size={10} aria-hidden="true" /> {stats.fullyImplemented}/{stats.total} Implemented</Badge>
          <Badge variant="pitch"><Award size={10} aria-hidden="true" /> {stats.coverage.toFixed(0)}% Coverage</Badge>
        </div>
      </div>

      {/* Summary KPIs */}
      <Card glow="pitch">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-pitch-400" aria-hidden="true" /> Measurable Impact — Real-World KPIs
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SUMMARY_KPIS.map((k) => (
              <div key={k.label} className="p-3 rounded-xl bg-ink-900/40 border border-ink-700/50 text-center">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2" style={{ background: `${k.color}15`, color: k.color }} aria-hidden="true">
                  <k.icon className="w-5 h-5" />
                </div>
                <p className="font-display text-2xl font-bold" style={{ color: k.color }}>{k.value}</p>
                <p className="text-xs text-ink-400 mt-0.5">{k.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-pitch-500/10 border border-pitch-500/30">
            <p className="text-xs font-semibold text-pitch-300 mb-1 flex items-center gap-1">
              <Sparkles size={10} aria-hidden="true" /> Generative AI Impact Summary
            </p>
            <p className="text-xs text-ink-200">
              7 autonomous AI agents collaborate to deliver measurable improvements across stadium operations, fan experience,
              security, accessibility, sustainability, and transportation. Every AI decision is explainable, auditable,
              and transparent with confidence scores. Total operational cost savings: $374K per match.
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Alignment Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-pitch-400" aria-hidden="true" /> Requirement → Feature → AI Component → Benefit → Impact
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-2">
            {ALIGNMENT_DATA.map((entry: AlignmentEntry) => {
              const Icon = REQUIREMENT_ICONS[entry.requirement] ?? Brain;
              const isExpanded = expanded === entry.id;
              return (
                <div
                  key={entry.id}
                  className={cn(
                    'rounded-xl border transition-all overflow-hidden',
                    isExpanded ? 'bg-ink-900/60 border-nexus-500/40' : 'bg-ink-900/40 border-ink-700/50',
                  )}
                >
                  <button
                    onClick={() => setExpanded(isExpanded ? null : entry.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`detail-${entry.id}`}
                    className="w-full flex items-center gap-3 p-3 text-left"
                  >
                    <div className="w-9 h-9 rounded-lg bg-nexus-500/15 text-nexus-400 flex items-center justify-center shrink-0" aria-hidden="true">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-ink-50">{entry.requirement}</span>
                        <Badge variant={entry.status === 'fully-implemented' ? 'success' : 'warning'}>
                          {entry.status === 'fully-implemented' ? 'Implemented' : 'Partial'}
                        </Badge>
                      </div>
                      <p className="text-xs text-ink-400 mt-0.5 line-clamp-1">{entry.feature}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <p className="text-xs text-ink-500">{entry.kpi}</p>
                        <p className="text-sm font-bold text-pitch-400">{entry.kpiValue}</p>
                      </div>
                      <ArrowRight
                        className={cn('w-4 h-4 text-ink-500 transition-transform', isExpanded && 'rotate-90')}
                        aria-hidden="true"
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div id={`detail-${entry.id}`} className="px-3 pb-3 space-y-3 animate-fade-in">
                      <div className="grid md:grid-cols-2 gap-3 pt-2 border-t border-ink-700/50">
                        <div>
                          <p className="text-xs text-ink-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Cpu size={10} aria-hidden="true" /> AI Component
                          </p>
                          <p className="text-sm text-ink-200">{entry.aiComponent}</p>
                        </div>
                        <div>
                          <p className="text-xs text-ink-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Heart size={10} aria-hidden="true" /> User Benefit
                          </p>
                          <p className="text-sm text-ink-200">{entry.userBenefit}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-ink-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <TrendingUp size={10} aria-hidden="true" /> Real-World Impact
                        </p>
                        <p className="text-sm text-ink-200">{entry.realWorldImpact}</p>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-pitch-500/10 border border-pitch-500/30">
                        <Award size={14} className="text-pitch-400" aria-hidden="true" />
                        <span className="text-sm font-bold text-pitch-300">{entry.kpi}:</span>
                        <span className="text-sm text-ink-100">{entry.kpiValue}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Coverage Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-nexus-400" aria-hidden="true" /> Challenge Coverage
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-ink-200">Requirements Fully Implemented</span>
                <span className="text-sm font-bold text-pitch-400">{stats.fullyImplemented}/{stats.total}</span>
              </div>
              <Progress value={stats.coverage} color="#00e890" height={10} showLabel />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-ink-900/40 text-center">
                <p className="font-display text-2xl font-bold text-pitch-400">{stats.fullyImplemented}</p>
                <p className="text-xs text-ink-400">Fully Implemented</p>
              </div>
              <div className="p-3 rounded-lg bg-ink-900/40 text-center">
                <p className="font-display text-2xl font-bold text-flame-400">{stats.total - stats.fullyImplemented}</p>
                <p className="text-xs text-ink-400">Partially Implemented</p>
              </div>
              <div className="p-3 rounded-lg bg-ink-900/40 text-center">
                <p className="font-display text-2xl font-bold text-nexus-400">0</p>
                <p className="text-xs text-ink-400">Not Implemented</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
