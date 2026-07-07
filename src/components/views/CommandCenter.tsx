import { useEffect, useState } from 'react';
import {
  Users, Shield, Activity, Heart, Bus, Leaf, Zap, TrendingUp, AlertTriangle,
  CheckCircle2, Clock, Brain, Sparkles, Cpu, Radio, MapPin,
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardTitle } from '../ui/Card';
import { Button, Badge } from '../ui/Button';
import { KpiCard } from '../ui/KpiCard';
import { Sparkline } from '../ui/Sparkline';
import { Gauge } from '../ui/Gauge';
import { Progress } from '../ui/Progress';
import { KPIS, AGENTS, generateAlerts, generateSparkline } from '../../lib/mock-data';
import { cn, statusColor, timeAgo, severityRank } from '../../lib/utils';
import type { Alert } from '../../types';

const KPI_ICONS: Record<string, typeof Users> = {
  attendance: Users, density: Users, 'queue-time': Clock, incidents: AlertTriangle,
  'response-time': Shield, energy: Zap, water: Leaf, carbon: Leaf,
  'metro-load': Bus, 'parking-avail': Bus, 'fan-satisfaction': Heart, 'ai-accuracy': Brain,
};

export function CommandCenter() {
  const [alerts] = useState<Alert[]>(() => generateAlerts(8));
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [opsChat, setOpsChat] = useState<string>('');
  const [opsResponse, setOpsResponse] = useState<string | null>(null);
  const [liveData, setLiveData] = useState(() => generateSparkline(20, 64, 12));

  useEffect(() => {
    const t = setInterval(() => {
      setLiveData((prev) => [...prev.slice(1), Math.max(40, Math.min(90, prev[prev.length - 1] + (Math.random() - 0.5) * 8))]);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setSelectedAlert(alerts[0] ?? null);
  }, [alerts]);

  const sortedAlerts = [...alerts].sort((a, b) => severityRank(b.severity) - severityRank(a.severity));

  const handleOpsQuery = () => {
    if (!opsChat.trim()) return;
    const query = opsChat;
    setOpsChat('');
    setOpsResponse('analyzing');
    setTimeout(() => {
      if (query.toLowerCase().includes('summary') || query.toLowerCase().includes('status')) {
        setOpsResponse(`**Operations Summary — ${new Date().toLocaleTimeString()}**

Attendance: 78,432 / 88,000 (89%). Active incidents: 7 (2 critical, 3 high, 2 medium). Crowd density: 64% avg, North Stand critical at 88%. AI accuracy: 96.8%.

**Top 3 priorities:**
1. North Stand congestion — mitigation active, 12 volunteers deployed
2. Metro Station at 86% — 6 additional trains requested
3. Unattended item at Concourse L1 — security dispatched (ETA 90s)

All systems nominal. AI agents operating at 96.8% accuracy.`);
      } else {
        setOpsResponse(`Query analyzed: "${query}"

Based on real-time data from 7 AI agents monitoring 18 zones:

**Key insight:** North Stand density is rising 2.1%/min and will reach 95% in 12 minutes without intervention. The Crowd Management Agent has generated a 5-step mitigation plan with 94.2% confidence.

**Recommended action:** Approve the mitigation plan to open overflow gates B2 and B3, deploy 8 stewards, and broadcast a soft diversion via the fan app. Estimated impact: -18% North Stand density within 8 minutes.`);
      }
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Operations Command Center</h1>
          <p className="text-sm text-ink-400 mt-1">Real-time intelligence across the entire stadium ecosystem</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success"><span className="w-1.5 h-1.5 rounded-full bg-pitch-400 animate-pulse" /> All systems operational</Badge>
          <Badge variant="info"><Cpu size={10} /> 7 agents online</Badge>
          <Badge variant="pitch"><Radio size={10} /> 96.8% AI accuracy</Badge>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {KPIS.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} icon={(() => {
            const Icon = KPI_ICONS[kpi.id];
            return Icon ? <Icon size={16} /> : null;
          })()} />
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Live ops feed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-nexus-400" /> Live Operations Feed
              </CardTitle>
              <Badge variant="success"><span className="w-1.5 h-1.5 rounded-full bg-pitch-400 animate-pulse" /> Streaming</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {[
                { t: '18:42:12', a: 'Crowd Management Agent', m: 'Predicted congestion at North Stand in 28 min. Confidence 94.2%.', s: 'warning', icon: Users },
                { t: '18:41:58', a: 'Security Agent', m: 'Flagged unattended bag at Concourse L1, Section 104. Dispatching team.', s: 'critical', icon: Shield },
                { t: '18:41:34', a: 'Operations Commander', m: 'Reallocated 12 volunteers from Concourse to Gate A.', s: 'info', icon: Brain },
                { t: '18:40:21', a: 'Fan Experience Agent', m: 'Resolved 47 fan queries across 8 languages in last 5 min.', s: 'success', icon: Heart },
                { t: '18:39:48', a: 'Transport Agent', m: 'Rerouted 4 buses to Metro Station. ETA 6 min.', s: 'info', icon: Bus },
                { t: '18:38:12', a: 'Sustainability Agent', m: 'Reduced HVAC load by 18% in West Stand via predictive optimization.', s: 'success', icon: Leaf },
                { t: '18:37:55', a: 'Volunteer Copilot', m: 'Assigned 3 new tasks to Zone B volunteers.', s: 'info', icon: Heart },
                { t: '18:36:08', a: 'Crowd Management Agent', m: 'Gate A density 72% — within threshold. Monitoring.', s: 'success', icon: Users },
                { t: '18:35:42', a: 'Security Agent', m: 'Perimeter scan complete. No threats detected.', s: 'success', icon: Shield },
                { t: '18:34:18', a: 'Operations Commander', m: 'Approved mitigation plan for Food Plaza queue. Mobile cart CP-7 activated.', s: 'info', icon: Brain },
              ].map((e, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-ink-800/40 transition-colors animate-slide-in" style={{ animationDelay: `${i * 30}ms` }}>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${statusColor(e.s)}15`, color: statusColor(e.s) }}
                  >
                    <e.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-ink-500">{e.t}</span>
                      <span className="text-xs font-medium text-ink-200">{e.a}</span>
                    </div>
                    <p className="text-sm text-ink-300 mt-0.5">{e.m}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* AI Agents status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-pitch-400" /> AI Agent Network
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {AGENTS.map((a) => (
                <div key={a.id} className="p-3 rounded-xl bg-ink-900/40 border border-ink-700/50 hover:border-nexus-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: statusColor(a.status), boxShadow: `0 0 8px ${statusColor(a.status)}` }}
                      />
                      <span className="text-sm font-medium text-ink-100">{a.name}</span>
                    </div>
                    <span className="text-xs text-ink-400 tabular-nums">{a.accuracy.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-ink-400">
                    <span>Load: <span className="text-ink-200 tabular-nums">{Math.round(a.load * 100)}%</span></span>
                    <span>Latency: <span className="text-ink-200 tabular-nums">{a.latencyMs}ms</span></span>
                    <span>Tasks: <span className="text-ink-200 tabular-nums">{a.tasksHandled.toLocaleString()}</span></span>
                  </div>
                  <div className="mt-2 h-1 bg-ink-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${a.load * 100}%`, background: a.color }}
                    />
                  </div>
                  <p className="text-xs text-ink-500 mt-2 italic">"{a.lastAction}"</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Alerts + AI Assistant */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-alert-400" /> Active Alerts
                <Badge variant="danger">{sortedAlerts.filter(a => a.status === 'active').length} active</Badge>
              </CardTitle>
              <Button variant="ghost" size="sm">View all</Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid md:grid-cols-2 gap-3">
              {sortedAlerts.slice(0, 6).map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAlert(a)}
                  className={cn(
                    'text-left p-3 rounded-xl border transition-all',
                    selectedAlert?.id === a.id
                      ? 'bg-nexus-500/10 border-nexus-500/40'
                      : 'bg-ink-900/40 border-ink-700/50 hover:border-ink-600',
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span
                      className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded"
                      style={{ background: `${statusColor(a.severity)}20`, color: statusColor(a.severity) }}
                    >
                      {a.severity}
                    </span>
                    <span className="text-[10px] text-ink-500">{timeAgo(a.timestamp)}</span>
                  </div>
                  <p className="text-sm font-medium text-ink-100 line-clamp-1">{a.title}</p>
                  <p className="text-xs text-ink-400 mt-1 line-clamp-2">{a.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-ink-500">
                    <MapPin size={10} /> {a.zone}
                    <span>·</span>
                    <span>{a.source}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Alert detail */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-nexus-400" /> AI Incident Analysis
            </CardTitle>
          </CardHeader>
          <CardBody>
            {selectedAlert && (
              <div className="space-y-3 animate-fade-in">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded"
                      style={{ background: `${statusColor(selectedAlert.severity)}20`, color: statusColor(selectedAlert.severity) }}
                    >
                      {selectedAlert.severity}
                    </span>
                    <Badge variant="info">{selectedAlert.status}</Badge>
                  </div>
                  <p className="font-display font-semibold text-ink-50">{selectedAlert.title}</p>
                  <p className="text-sm text-ink-400 mt-1">{selectedAlert.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-ink-900/40">
                    <p className="text-ink-500">Zone</p>
                    <p className="text-ink-200 font-medium">{selectedAlert.zone}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-ink-900/40">
                    <p className="text-ink-500">Source</p>
                    <p className="text-ink-200 font-medium">{selectedAlert.source}</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-nexus-500/10 border border-nexus-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={12} className="text-nexus-400" />
                    <p className="text-xs font-semibold text-nexus-300">AI Confidence: {(selectedAlert.confidence * 100).toFixed(1)}%</p>
                  </div>
                  <p className="text-xs text-ink-300 mb-2 font-medium">Recommended Actions:</p>
                  <ul className="space-y-1.5">
                    {selectedAlert.recommendedActions.map((ra, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-ink-200">
                        <CheckCircle2 size={12} className="text-pitch-400 mt-0.5 shrink-0" />
                        <span>{ra}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">Approve & Execute</Button>
                  <Button variant="ghost" size="sm">Acknowledge</Button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* NL Analytics + Gauges */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pitch-400" /> Natural Language Analytics
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={opsChat}
                onChange={(e) => setOpsChat(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleOpsQuery()}
                placeholder="Ask: 'Give me a status brief' or 'What's the crowd situation?'"
                className="flex-1 px-4 py-2.5 bg-ink-900/60 border border-ink-700 rounded-xl text-sm text-ink-50 placeholder-ink-500 focus:border-nexus-500 focus:ring-1 focus:ring-nexus-500 outline-none"
              />
              <Button onClick={handleOpsQuery} disabled={!opsChat.trim()}>
                <Brain size={14} /> Analyze
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Operations summary', 'Crowd situation', 'Active incidents', 'Transport report', 'Sustainability brief'].map((q) => (
                <button
                  key={q}
                  onClick={() => setOpsChat(q)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-ink-800/60 border border-ink-700 text-ink-300 hover:border-nexus-500/40 hover:text-ink-100 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
            {opsResponse === 'analyzing' && (
              <div className="p-4 rounded-xl bg-ink-900/40 border border-ink-700/50">
                <div className="flex items-center gap-2 text-ink-400">
                  <div className="w-4 h-4 border-2 border-nexus-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">AI analyzing across 7 agents...</span>
                </div>
              </div>
            )}
            {opsResponse && opsResponse !== 'analyzing' && (
              <div className="p-4 rounded-xl bg-nexus-500/5 border border-nexus-500/30 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={14} className="text-nexus-400" />
                  <span className="text-xs font-semibold text-nexus-300">Operations Commander AI</span>
                  <Badge variant="info">94.2% confidence</Badge>
                </div>
                <pre className="text-sm text-ink-200 whitespace-pre-wrap font-sans leading-relaxed">{opsResponse}</pre>
              </div>
            )}
            {!opsResponse && (
              <div className="p-4 rounded-xl bg-ink-900/40 border border-ink-700/50 text-center">
                <Brain className="w-8 h-8 text-ink-500 mx-auto mb-2" />
                <p className="text-sm text-ink-400">Ask any question about stadium operations. The AI will synthesize data from all 7 agents.</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* System health gauges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-flame-400" /> System Health
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <Gauge value={96.8} label="AI Accuracy" color="#00e890" size={110} />
              </div>
              <div className="flex flex-col items-center">
                <Gauge value={99.99} label="Uptime" color="#4d8fff" size={110} />
              </div>
              <div className="flex flex-col items-center">
                <Gauge value={64} label="Crowd Load" color="#ff8c00" size={110} />
              </div>
              <div className="flex flex-col items-center">
                <Gauge value={89} label="Capacity" color="#1f6fff" size={110} />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-ink-700/50">
              <p className="text-xs text-ink-400 mb-2">Live crowd density (real-time)</p>
              <Sparkline data={liveData} color="#ff8c00" width={240} height={48} />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Impact metrics strip */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Congestion Reduction', value: 35, icon: Users, color: '#ff8c00' },
              { label: 'Faster Navigation', value: 40, icon: MapPin, color: '#1f6fff' },
              { label: 'Faster Incident Response', value: 50, icon: Shield, color: '#00e890' },
              { label: 'Accessibility Improvement', value: 60, icon: Heart, color: '#4d8fff' },
              { label: 'Cost Reduction', value: 22, icon: TrendingUp, color: '#a855f7' },
              { label: 'Fan Satisfaction', value: 18, icon: Heart, color: '#ff8c00' },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <div
                  className="w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-2"
                  style={{ background: `${m.color}15`, color: m.color }}
                >
                  <m.icon className="w-5 h-5" />
                </div>
                <p className="font-display text-2xl font-bold" style={{ color: m.color }}>{m.value}%</p>
                <p className="text-xs text-ink-400 mt-0.5">{m.label}</p>
                <Progress value={m.value} color={m.color} className="mt-2" height={4} />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
