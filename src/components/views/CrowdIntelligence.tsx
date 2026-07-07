import { useEffect, useState } from 'react';
import {
  Users, Activity, TrendingUp, Brain, Sparkles, Clock,
  ArrowRight, MapPin, Zap, Eye, Layers, Flame,
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardTitle } from '../ui/Card';
import { Button, Badge } from '../ui/Button';
import { Sparkline } from '../ui/Sparkline';
import { Progress } from '../ui/Progress';
import { STADIUM_ZONES, generateSparkline, generateHeatmapGrid } from '../../lib/mock-data';
import { densityColor } from '../../lib/utils';

export function CrowdIntelligence() {
  const [heatmap] = useState(() => generateHeatmapGrid(32, 20));
  const [tick, setTick] = useState(0);
  const [queueData, setQueueData] = useState(() => generateSparkline(20, 12, 6));
  const [flowData, setFlowData] = useState(() => generateSparkline(20, 580, 120));

  useEffect(() => {
    const t = setInterval(() => {
      setTick((x) => x + 1);
      setQueueData((p) => [...p.slice(1), Math.max(4, Math.min(22, p[p.length - 1] + (Math.random() - 0.5) * 2))]);
      setFlowData((p) => [...p.slice(1), Math.max(300, Math.min(800, p[p.length - 1] + (Math.random() - 0.5) * 60))]);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const congestedZones = STADIUM_ZONES.filter((z) => z.density > 0.7).sort((a, b) => b.density - a.density);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Users className="w-7 h-7 text-flame-400" /> AI Crowd Intelligence
          </h1>
          <p className="text-sm text-ink-400 mt-1">Density heatmaps · Queue prediction · 30-min congestion forecasting</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success"><span className="w-1.5 h-1.5 rounded-full bg-pitch-400 animate-pulse" /> Live</Badge>
          <Badge variant="info"><Brain size={10} /> 94.2% accuracy</Badge>
          <Badge variant="warning"><Flame size={10} /> {congestedZones.length} congested</Badge>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Fans', value: '78,432', icon: Users, color: '#1f6fff', trend: '+2.4%' },
          { label: 'Avg Density', value: '64%', icon: Activity, color: '#ff8c00', trend: '-3.1%' },
          { label: 'Peak Queue', value: '18 min', icon: Clock, color: '#e61e1e', trend: '+1.2%' },
          { label: 'Flow Rate', value: '580/min', icon: TrendingUp, color: '#00e890', trend: '+4.1%' },
        ].map((k) => (
          <Card key={k.label} hover>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${k.color}15`, color: k.color }}>
                  <k.icon className="w-4 h-4" />
                </div>
                <span className="text-xs text-pitch-400">{k.trend}</span>
              </div>
              <p className="font-display text-2xl font-bold text-ink-50">{k.value}</p>
              <p className="text-xs text-ink-400">{k.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Heatmap */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-flame-400" /> Crowd Density Heatmap
              </CardTitle>
              <Badge variant="info"><Eye size={10} /> Real-time</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <div className="relative aspect-[16/10] rounded-xl bg-ink-950 border border-ink-700/50 overflow-hidden bg-stadium-grid">
              <svg viewBox="0 0 100 62.5" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                  <radialGradient id="ci-hot" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#e61e1e" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#e61e1e" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="ci-warm" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ff8c00" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#ff8c00" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="ci-cool" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#4d8fff" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#4d8fff" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {heatmap.map((row, r) =>
                  row.map((v, c) => {
                    if (v < 0.3) return null;
                    const x = (c / 32) * 100;
                    const y = (r / 20) * 62.5;
                    const radius = v * 7 + 2;
                    const fill = v > 0.7 ? 'url(#ci-hot)' : v > 0.5 ? 'url(#ci-warm)' : 'url(#ci-cool)';
                    return <circle key={`${r}-${c}`} cx={x} cy={y} r={radius} fill={fill} className="heatmap-glow" style={{ opacity: 0.6 + Math.sin(tick * 0.3 + r + c) * 0.2 }} />;
                  }),
                )}
              </svg>
              {/* Hotspots */}
              {congestedZones.slice(0, 4).map((z) => (
                <div
                  key={z.id}
                  className="absolute"
                  style={{
                    left: `${z.x + z.width / 2}%`,
                    top: `${z.y + z.height / 2}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full animate-ping" style={{ background: densityColor(z.density) }} />
                    <div className="absolute inset-0 w-3 h-3 rounded-full" style={{ background: densityColor(z.density) }} />
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-ink-900/90 text-ink-100 border border-ink-700">
                        {z.name}: {Math.round(z.density * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="absolute bottom-2 left-2 glass rounded-lg p-2 flex items-center gap-3 text-[10px]">
                <span className="text-ink-400 font-medium">Density:</span>
                {[
                  { c: '#00e890', l: 'Low' },
                  { c: '#4d8fff', l: 'Med' },
                  { c: '#ff8c00', l: 'High' },
                  { c: '#e61e1e', l: 'Critical' },
                ].map((x) => (
                  <div key={x.l} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: x.c }} />
                    <span className="text-ink-400">{x.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Queue prediction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-nexus-400" /> Queue Prediction
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {[
                { name: 'Food Plaza Central', current: 18, predicted: 24, color: '#e61e1e' },
                { name: 'Gate A — North', current: 6, predicted: 9, color: '#ff8c00' },
                { name: 'Metro Station', current: 4, predicted: 12, color: '#ff8c00' },
                { name: 'Restroom Block N', current: 2, predicted: 3, color: '#00e890' },
                { name: 'Food Court North', current: 8, predicted: 6, color: '#4d8fff' },
              ].map((q) => (
                <div key={q.name} className="p-3 rounded-lg bg-ink-900/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-ink-100">{q.name}</span>
                    <Badge variant={q.predicted > 15 ? 'danger' : q.predicted > 8 ? 'warning' : 'success'}>
                      {q.predicted} min
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-[10px] text-ink-500 mb-1">
                        <span>Now: {q.current}m</span>
                        <span>+30m: {q.predicted}m</span>
                      </div>
                      <div className="relative h-1.5 bg-ink-800 rounded-full overflow-hidden">
                        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(q.current / 25) * 100}%`, background: q.color }} />
                        <div className="absolute inset-y-0 left-0 rounded-full opacity-40" style={{ width: `${(q.predicted / 25) * 100}%`, background: q.color }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Congestion forecast + mitigation */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-flame-400" /> 30-Minute Congestion Forecast
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {congestedZones.slice(0, 5).map((z) => {
                const forecast = Math.min(1, z.density + 0.12 + Math.sin(tick * 0.2) * 0.03);
                return (
                  <div key={z.id} className="p-3 rounded-lg bg-ink-900/40">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-ink-400" />
                        <span className="text-sm font-medium text-ink-100">{z.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-ink-400">Now: <span className="font-bold" style={{ color: densityColor(z.density) }}>{Math.round(z.density * 100)}%</span></span>
                        <ArrowRight size={10} className="text-ink-500" />
                        <span className="text-xs text-ink-400">+30m: <span className="font-bold" style={{ color: densityColor(forecast) }}>{Math.round(forecast * 100)}%</span></span>
                      </div>
                    </div>
                    <div className="relative h-2 bg-ink-800 rounded-full overflow-hidden">
                      <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700" style={{ width: `${z.density * 100}%`, background: densityColor(z.density) }} />
                      <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 opacity-40" style={{ width: `${forecast * 100}%`, background: densityColor(forecast) }} />
                    </div>
                    <div className="flex items-center justify-between mt-1.5 text-[10px] text-ink-500">
                      <span>Capacity: {z.capacity.toLocaleString()}</span>
                      <span>Flow: {z.flowRate}/min</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* AI mitigation plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pitch-400" /> AI-Generated Mitigation Plan
              </CardTitle>
              <Badge variant="pitch"><Brain size={10} /> 94.2% confidence</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-alert-500/10 border border-alert-500/30">
                <p className="text-xs font-semibold text-alert-300 mb-1">Critical: North Stand</p>
                <p className="text-xs text-ink-200">Density 88% rising 2.1%/min. Will reach 95% in 12 min without intervention.</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-ink-200 mb-2">Recommended Actions (prioritized):</p>
                <div className="space-y-2">
                  {[
                    { p: 'CRITICAL', t: 'Open overflow gates B2, B3', impact: '-18% density', time: 'Immediate', color: '#e61e1e' },
                    { p: 'HIGH', t: 'Deploy 8 stewards to North Stand', impact: 'Crowd flow +25%', time: '5 min', color: '#ff8c00' },
                    { p: 'HIGH', t: 'Activate queue management at F&B', impact: '-40% queue time', time: '3 min', color: '#ff8c00' },
                    { p: 'MEDIUM', t: 'Broadcast soft diversion via app', impact: '-12% inflow', time: 'Immediate', color: '#4d8fff' },
                    { p: 'MEDIUM', t: 'Pre-position medical team', impact: 'Response -2 min', time: '10 min', color: '#4d8fff' },
                  ].map((a, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-ink-900/40 border border-ink-700/50">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0" style={{ background: `${a.color}20`, color: a.color }}>
                        {a.p}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-ink-100">{a.t}</p>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-ink-500">
                          <span className="flex items-center gap-1"><Zap size={9} /> {a.impact}</span>
                          <span className="flex items-center gap-1"><Clock size={9} /> {a.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm">Approve All <ArrowRight size={12} /></Button>
                <Button variant="outline" size="sm">Modify Plan</Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Live flow + zone breakdown */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-pitch-400" /> Live Crowd Flow
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-ink-400 mb-2">Inflow Rate (fans/min)</p>
                <Sparkline data={flowData} color="#00e890" width={300} height={80} />
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-ink-400">Current: <span className="text-pitch-400 font-bold tabular-nums">{Math.round(flowData[flowData.length - 1])}</span></span>
                  <span className="text-ink-400">Peak: <span className="text-ink-200 tabular-nums">{Math.round(Math.max(...flowData))}</span></span>
                </div>
              </div>
              <div>
                <p className="text-xs text-ink-400 mb-2">Avg Queue Time (min)</p>
                <Sparkline data={queueData} color="#ff8c00" width={300} height={80} />
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-ink-400">Current: <span className="text-flame-400 font-bold tabular-nums">{queueData[queueData.length - 1].toFixed(1)}m</span></span>
                  <span className="text-ink-400">Target: <span className="text-ink-200 tabular-nums">≤ 12m</span></span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-nexus-400" /> Zone Status
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {STADIUM_ZONES.map((z) => (
                <div key={z.id} className="flex items-center gap-2 p-2 rounded-lg bg-ink-900/40 hover:bg-ink-800/50 transition-colors">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: densityColor(z.density), boxShadow: `0 0 6px ${densityColor(z.density)}` }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-ink-100 truncate">{z.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={z.density * 100} color={densityColor(z.density)} height={4} className="flex-1" />
                      <span className="text-[10px] text-ink-400 tabular-nums w-8 text-right">{Math.round(z.density * 100)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
