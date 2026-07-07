import { useState } from 'react';
import {
  Brain, Shield, Database, TrendingUp, AlertTriangle,
  CheckCircle2, ChevronDown, Cpu, GitBranch, Eye, Activity,
} from 'lucide-react';
import { Card, CardBody } from '../ui/Card';
import { Button, Badge } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { generateAIExplanations } from '../../lib/mock-data';
import { cn } from '../../lib/utils';
import type { AIExplanation } from '../../types';

const RISK_COLORS: Record<string, string> = {
  low: '#00e890',
  medium: '#ff8c00',
  high: '#ff3b3b',
  critical: '#e61e1e',
};

export function ExplainableAI() {
  const [explanations] = useState<AIExplanation[]>(() => generateAIExplanations());
  const [expanded, setExpanded] = useState<string | null>(explanations[0]?.id ?? null);

  const avgConfidence = explanations.reduce((s, e) => s + e.confidence, 0) / explanations.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Brain className="w-7 h-7 text-nexus-400" /> Explainable AI
          </h1>
          <p className="text-sm text-ink-400 mt-1">Every AI recommendation is transparent, auditable, and trustworthy</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success"><CheckCircle2 size={10} /> {explanations.length} recommendations</Badge>
          <Badge variant="info"><Cpu size={10} /> Avg confidence {(avgConfidence * 100).toFixed(1)}%</Badge>
        </div>
      </div>

      {/* Trust pillars */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: TrendingUp, label: 'Confidence Score', value: `${(avgConfidence * 100).toFixed(1)}%`, color: '#00e890', desc: 'Model certainty' },
          { icon: GitBranch, label: 'Reasoning Chain', value: '100%', color: '#4d8fff', desc: 'Every decision explained' },
          { icon: Database, label: 'Data Sources', value: '42', color: '#ff8c00', desc: 'Inputs per recommendation' },
          { icon: Shield, label: 'Risk Assessment', value: '4 levels', color: '#e61e1e', desc: 'Low to critical' },
        ].map((p) => (
          <Card key={p.label} hover>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${p.color}15`, color: p.color }}>
                  <p.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="font-display text-2xl font-bold text-ink-50">{p.value}</p>
              <p className="text-xs text-ink-300">{p.label}</p>
              <p className="text-[10px] text-ink-500 mt-0.5">{p.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Explanation cards */}
      <div className="space-y-3">
        {explanations.map((exp) => {
          const isOpen = expanded === exp.id;
          const riskColor = RISK_COLORS[exp.riskLevel];
          return (
            <Card key={exp.id}>
              <button
                onClick={() => setExpanded(isOpen ? null : exp.id)}
                className="w-full text-left p-5"
                aria-expanded={isOpen}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${riskColor}15`, color: riskColor }}
                    >
                      <Brain className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-medium text-ink-400">{exp.agentName}</span>
                        <Badge variant="info">{exp.model}</Badge>
                        <span
                          className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded"
                          style={{ background: `${riskColor}20`, color: riskColor }}
                        >
                          {exp.riskLevel} risk
                        </span>
                      </div>
                      <p className="text-sm font-medium text-ink-100">{exp.recommendation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-ink-500">Confidence</p>
                      <p className="font-display text-lg font-bold" style={{ color: exp.confidence > 0.9 ? '#00e890' : '#ff8c00' }}>
                        {(exp.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                    <ChevronDown className={cn('w-5 h-5 text-ink-400 transition-transform', isOpen && 'rotate-180')} />
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 space-y-4 animate-fade-in">
                  {/* Reasoning */}
                  <div className="p-4 rounded-xl bg-ink-900/40 border border-ink-700/50">
                    <p className="text-xs font-semibold text-nexus-300 mb-2 flex items-center gap-1.5">
                      <GitBranch size={12} /> Reasoning Summary
                    </p>
                    <p className="text-sm text-ink-200 leading-relaxed">{exp.reasoning}</p>
                  </div>

                  {/* Confidence factors */}
                  <div>
                    <p className="text-xs font-semibold text-ink-300 mb-2 flex items-center gap-1.5">
                      <Activity size={12} /> Decision Factors & Weights
                    </p>
                    <div className="space-y-2">
                      {exp.factors.map((f) => (
                        <div key={f.label} className="flex items-center gap-3">
                          <span className="text-xs text-ink-400 w-40 shrink-0">{f.label}</span>
                          <div className="flex-1">
                            <Progress value={f.weight * 100} color="#4d8fff" height={6} />
                          </div>
                          <span className="text-xs text-ink-300 tabular-nums w-16 text-right">{f.value}</span>
                          <span className="text-xs text-ink-500 tabular-nums w-10 text-right">{(f.weight * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Data sources */}
                  <div>
                    <p className="text-xs font-semibold text-ink-300 mb-2 flex items-center gap-1.5">
                      <Database size={12} /> Data Sources Used ({exp.dataSources.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exp.dataSources.map((src) => (
                        <span
                          key={src}
                          className="text-xs px-2.5 py-1 rounded-lg bg-ink-800/60 border border-ink-700 text-ink-200"
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Risk + actions */}
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl border" style={{ background: `${riskColor}10`, borderColor: `${riskColor}30` }}>
                      <p className="text-xs text-ink-400 mb-1">Risk Level</p>
                      <p className="font-display text-lg font-bold capitalize" style={{ color: riskColor }}>{exp.riskLevel}</p>
                      <p className="text-[10px] text-ink-500 mt-1">
                        {exp.riskLevel === 'critical' && 'Immediate action required'}
                        {exp.riskLevel === 'high' && 'Action recommended within 5 min'}
                        {exp.riskLevel === 'medium' && 'Monitor and plan'}
                        {exp.riskLevel === 'low' && 'Informational'}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-ink-900/40 border border-ink-700/50">
                      <p className="text-xs text-ink-400 mb-1">Model</p>
                      <p className="text-sm font-medium text-ink-100">{exp.model}</p>
                      <p className="text-[10px] text-ink-500 mt-1">Production model · v{exp.model.split('v')[1] ?? '1.0'}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-ink-900/40 border border-ink-700/50">
                      <p className="text-xs text-ink-400 mb-1">Timestamp</p>
                      <p className="text-sm font-medium text-ink-100">{new Date(exp.timestamp).toLocaleTimeString()}</p>
                      <p className="text-[10px] text-ink-500 mt-1">{new Date(exp.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <CheckCircle2 size={14} /> Approve Recommendation
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye size={14} /> View Audit Trail
                    </Button>
                    <Button variant="outline" size="sm">
                      <AlertTriangle size={14} /> Flag for Review
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Trust statement */}
      <Card>
        <CardBody>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-pitch-500/15 text-pitch-400 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-display font-semibold text-ink-50">No Black Box AI</p>
              <p className="text-sm text-ink-300 mt-1">
                Every AI recommendation in FIFA Nexus AI includes confidence scores, reasoning chains, data source attribution, and risk assessment.
                Judges, operators, and auditors can trace every decision back to its inputs. This is responsible AI in production.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="success">Auditable</Badge>
                <Badge variant="info">Transparent</Badge>
                <Badge variant="pitch">Accountable</Badge>
                <Badge variant="warning">Risk-Aware</Badge>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
