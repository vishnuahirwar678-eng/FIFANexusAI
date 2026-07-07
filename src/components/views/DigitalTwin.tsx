import { useEffect, useMemo, useState } from 'react';
import {
  Boxes, Users, DoorOpen, Car, UtensilsCrossed, Stethoscope, Train, Radio,
  Play, Pause, SkipForward, RotateCcw, Maximize2, Layers, Eye, Thermometer,
  Wind, ArrowRight, AlertTriangle, CheckCircle2, Activity, MapPin,
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardTitle } from '../ui/Card';
import { Button, Badge } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { STADIUM_ZONES, generateHeatmapGrid } from '../../lib/mock-data';
import { cn, densityColor, formatNumber } from '../../lib/utils';
import type { Zone } from '../../types';

type SimMode = 'live' | 'forecast' | 'evacuation' | 'gate-opt';

const SIM_MODES: { id: SimMode; label: string; icon: typeof Radio; desc: string }[] = [
  { id: 'live', label: 'Live', icon: Radio, desc: 'Real-time crowd state' },
  { id: 'forecast', label: '30-min Forecast', icon: Activity, desc: 'AI-predicted congestion' },
  { id: 'evacuation', label: 'Evacuation Sim', icon: AlertTriangle, desc: 'Emergency evacuation' },
  { id: 'gate-opt', label: 'Gate Optimization', icon: DoorOpen, desc: 'Optimal gate allocation' },
];

const ZONE_ICONS: Record<string, typeof Users> = {
  stand: Users, concourse: Users, gate: DoorOpen, parking: Car,
  food: UtensilsCrossed, medical: Stethoscope, transport: Train,
};

export function DigitalTwin() {
  const [mode, setMode] = useState<SimMode>('live');
  const [playing, setPlaying] = useState(true);
  const [tick, setTick] = useState(0);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(STADIUM_ZONES[4]);
  const [heatmap] = useState(() => generateHeatmapGrid(28, 18));

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setTick((x) => x + 1), 1500);
    return () => clearInterval(t);
  }, [playing]);

  const zones = useMemo(() => {
    return STADIUM_ZONES.map((z): Zone => {
      let density = z.density;
      if (mode === 'forecast') density = Math.min(1, z.density + 0.15 + Math.sin(tick * 0.3 + z.x) * 0.05);
      else if (mode === 'evacuation') density = Math.max(0, z.density - 0.3 - tick * 0.02);
      else if (mode === 'gate-opt') density = z.type === 'gate' ? Math.max(0.2, z.density - 0.2) : z.density * 0.7;
      else density = Math.max(0, Math.min(1, z.density + Math.sin(tick * 0.4 + z.x) * 0.04));
      const status: Zone['status'] = density > 0.85 ? 'critical' : density > 0.7 ? 'congested' : density > 0.45 ? 'busy' : 'normal';
      return { ...z, density, status };
    });
  }, [mode, tick]);

  const stats = useMemo(() => {
    const total = zones.reduce((s, z) => s + z.capacity * z.density, 0);
    const avgDensity = zones.reduce((s, z) => s + z.density, 0) / zones.length;
    const critical = zones.filter((z) => z.density > 0.85).length;
    const congested = zones.filter((z) => z.density > 0.7).length;
    return { total, avgDensity, critical, congested };
  }, [zones]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Boxes className="w-7 h-7 text-nexus-400" /> Digital Twin Stadium
          </h1>
          <p className="text-sm text-ink-400 mt-1">Real-time virtual replica · 18 zones · AI simulation engine</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success"><span className="w-1.5 h-1.5 rounded-full bg-pitch-400 animate-pulse" /> Twin synced</Badge>
          <Badge variant="info">{zones.length} zones</Badge>
          <Badge variant="pitch">Tick {tick}</Badge>
        </div>
      </div>

      {/* Sim mode tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SIM_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={cn(
              'p-3 rounded-xl border text-left transition-all',
              mode === m.id
                ? 'bg-nexus-500/10 border-nexus-500/40 shadow-glow'
                : 'bg-ink-900/40 border-ink-700/50 hover:border-ink-600',
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <m.icon className={cn('w-4 h-4', mode === m.id ? 'text-nexus-300' : 'text-ink-400')} />
              <span className={cn('text-sm font-medium', mode === m.id ? 'text-nexus-200' : 'text-ink-200')}>{m.label}</span>
            </div>
            <p className="text-xs text-ink-500">{m.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Stadium visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-nexus-400" /> Stadium View
                <Badge variant="info" className="capitalize">{mode}</Badge>
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause' : 'Play'}>
                  {playing ? <Pause size={14} /> : <Play size={14} />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setTick(0)} aria-label="Reset">
                  <RotateCcw size={14} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setTick((t) => t + 1)} aria-label="Step">
                  <SkipForward size={14} />
                </Button>
                <Button variant="ghost" size="sm" aria-label="Fullscreen">
                  <Maximize2 size={14} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="relative aspect-[16/10] rounded-xl bg-ink-950 border border-ink-700/50 overflow-hidden bg-stadium-grid">
              {/* Heatmap layer */}
              <svg viewBox="0 0 100 62.5" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                  <radialGradient id="hot" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#e61e1e" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#e61e1e" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="warm" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ff8c00" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#ff8c00" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="cool" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#4d8fff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#4d8fff" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {heatmap.map((row, r) =>
                  row.map((v, c) => {
                    if (v < 0.3) return null;
                    const x = (c / 28) * 100;
                    const y = (r / 18) * 62.5;
                    const radius = (v * 6 + 2);
                    const fill = v > 0.7 ? 'url(#hot)' : v > 0.5 ? 'url(#warm)' : 'url(#cool)';
                    return <circle key={`${r}-${c}`} cx={x} cy={y} r={radius} fill={fill} className="heatmap-glow" />;
                  }),
                )}
              </svg>

              {/* Pitch */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-1/3 h-1/4 border-2 border-pitch-500/40 rounded">
                  <div className="absolute inset-y-0 left-1/2 w-px bg-pitch-500/40" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-pitch-500/40 rounded-full" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-pitch-500/60 rounded-full" />
                </div>
              </div>

              {/* Zones */}
              {zones.map((z) => {
                const Icon = ZONE_ICONS[z.type] ?? Users;
                const color = densityColor(z.density);
                const isSel = selectedZone?.id === z.id;
                return (
                  <button
                    key={z.id}
                    onClick={() => setSelectedZone(z)}
                    className={cn(
                      'absolute rounded-lg border-2 transition-all duration-500 group',
                      isSel ? 'ring-2 ring-nexus-400 ring-offset-2 ring-offset-ink-950 z-10' : 'hover:z-10',
                    )}
                    style={{
                      left: `${z.x}%`,
                      top: `${z.y}%`,
                      width: `${z.width}%`,
                      height: `${z.height}%`,
                      borderColor: color,
                      background: `${color}20`,
                      boxShadow: z.density > 0.7 ? `0 0 20px ${color}40` : 'none',
                    }}
                    aria-label={`${z.name}: ${Math.round(z.density * 100)}% density`}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-1 overflow-hidden">
                      <Icon className="w-3 h-3 shrink-0" style={{ color }} />
                      <span className="text-[8px] font-bold tabular-nums" style={{ color }}>
                        {Math.round(z.density * 100)}%
                      </span>
                    </div>
                    {z.density > 0.7 && (
                      <span
                        className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse"
                        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                      />
                    )}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink-900 text-ink-100 border border-ink-700">
                        {z.name}
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Scan line effect */}
              {playing && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-nexus-400/60 to-transparent animate-scan" />
                </div>
              )}

              {/* Legend */}
              <div className="absolute bottom-2 left-2 glass rounded-lg p-2 flex items-center gap-3 text-[10px]">
                <span className="text-ink-400 font-medium">Density:</span>
                {[
                  { c: '#00e890', l: '<30%' },
                  { c: '#4d8fff', l: '30-50%' },
                  { c: '#ff8c00', l: '50-70%' },
                  { c: '#ff3b3b', l: '70-85%' },
                  { c: '#e61e1e', l: '>85%' },
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

        {/* Zone detail + stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-nexus-400" /> Zone Detail
              </CardTitle>
            </CardHeader>
            <CardBody>
              {selectedZone && (
                <div className="space-y-3 animate-fade-in">
                  <div>
                    <p className="text-xs text-ink-400 uppercase tracking-wider">{selectedZone.type}</p>
                    <p className="font-display text-lg font-semibold">{selectedZone.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-ink-900/40">
                      <p className="text-xs text-ink-500">Density</p>
                      <p className="font-display text-xl font-bold" style={{ color: densityColor(selectedZone.density) }}>
                        {Math.round(selectedZone.density * 100)}%
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-ink-900/40">
                      <p className="text-xs text-ink-500">Occupancy</p>
                      <p className="font-display text-xl font-bold text-ink-100">
                        {formatNumber(Math.round(selectedZone.capacity * selectedZone.density))}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-ink-900/40">
                      <p className="text-xs text-ink-500">Flow Rate</p>
                      <p className="font-display text-xl font-bold text-ink-100">{selectedZone.flowRate}<span className="text-xs text-ink-400">/min</span></p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-ink-900/40">
                      <p className="text-xs text-ink-500">Temp</p>
                      <p className="font-display text-xl font-bold text-ink-100">{selectedZone.temperature}°C</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-ink-400">Capacity</span>
                      <span className="text-ink-200 tabular-nums">{formatNumber(Math.round(selectedZone.capacity * selectedZone.density))} / {formatNumber(selectedZone.capacity)}</span>
                    </div>
                    <Progress value={selectedZone.density * 100} color={densityColor(selectedZone.density)} />
                  </div>
                  <div className="p-3 rounded-lg bg-nexus-500/10 border border-nexus-500/30">
                    <p className="text-xs font-semibold text-nexus-300 mb-1">AI Recommendation</p>
                    <p className="text-xs text-ink-200">
                      {selectedZone.density > 0.8
                        ? 'Critical density. Deploy 8 stewards, open overflow routes, broadcast diversion.'
                        : selectedZone.density > 0.6
                        ? 'Elevated density. Monitor closely, pre-position staff, prepare queue management.'
                        : 'Within normal range. Continue routine monitoring.'}
                    </p>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-pitch-400" /> Simulation Stats
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-400">Total Occupancy</span>
                  <span className="font-display font-bold text-ink-100 tabular-nums">{formatNumber(Math.round(stats.total))}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-400">Avg Density</span>
                  <span className="font-display font-bold tabular-nums" style={{ color: densityColor(stats.avgDensity) }}>
                    {Math.round(stats.avgDensity * 100)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-400">Critical Zones</span>
                  <Badge variant="danger">{stats.critical}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-400">Congested Zones</span>
                  <Badge variant="warning">{stats.congested}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-400">Normal Zones</span>
                  <Badge variant="success">{zones.length - stats.critical - stats.congested}</Badge>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* AI predictions + evacuation */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-flame-400" /> 30-Minute Congestion Forecast
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {zones.filter((z) => z.density > 0.5).slice(0, 5).map((z) => {
                const forecast = Math.min(1, z.density + 0.15);
                return (
                  <div key={z.id} className="p-3 rounded-lg bg-ink-900/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-ink-100">{z.name}</span>
                      <Badge variant={forecast > 0.85 ? 'danger' : 'warning'}>
                        Forecast: {Math.round(forecast * 100)}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-[10px] text-ink-500 mb-1">
                          <span>Now: {Math.round(z.density * 100)}%</span>
                          <span>+30m: {Math.round(forecast * 100)}%</span>
                        </div>
                        <div className="relative h-2 bg-ink-800 rounded-full overflow-hidden">
                          <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700" style={{ width: `${z.density * 100}%`, background: densityColor(z.density) }} />
                          <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 opacity-50" style={{ width: `${forecast * 100}%`, background: densityColor(forecast) }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-flame-500/10 border border-flame-500/30">
              <p className="text-xs font-semibold text-flame-300 mb-1">AI-Generated Mitigation Plan</p>
              <ul className="space-y-1 text-xs text-ink-200">
                <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-pitch-400 mt-0.5 shrink-0" /> Open overflow gates B2, B3 (immediate)</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-pitch-400 mt-0.5 shrink-0" /> Deploy 8 stewards to North Stand (5 min)</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-pitch-400 mt-0.5 shrink-0" /> Activate queue management at F&B (3 min)</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-pitch-400 mt-0.5 shrink-0" /> Broadcast soft diversion via app (immediate)</li>
              </ul>
              <Button size="sm" className="w-full mt-3">Approve & Execute Plan <ArrowRight size={12} /></Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-alert-400" /> Evacuation Simulation
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-lg bg-ink-900/40 text-center">
                  <p className="text-xs text-ink-500">Clearance Time</p>
                  <p className="font-display text-xl font-bold text-pitch-400">8.4<span className="text-xs text-ink-400">min</span></p>
                </div>
                <div className="p-3 rounded-lg bg-ink-900/40 text-center">
                  <p className="text-xs text-ink-500">Flow Rate</p>
                  <p className="font-display text-xl font-bold text-ink-100">12K<span className="text-xs text-ink-400">/min</span></p>
                </div>
                <div className="p-3 rounded-lg bg-ink-900/40 text-center">
                  <p className="text-xs text-ink-500">Bottlenecks</p>
                  <p className="font-display text-xl font-bold text-flame-400">3</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-ink-400 mb-2">Exit Flow Distribution</p>
                {[
                  { gate: 'Gate A — North', pct: 28, status: 'congested' },
                  { gate: 'Gate B — South', pct: 42, status: 'optimal' },
                  { gate: 'Gate C — East', pct: 18, status: 'normal' },
                  { gate: 'Gate D — West', pct: 12, status: 'normal' },
                ].map((g) => (
                  <div key={g.gate} className="mb-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-ink-300">{g.gate}</span>
                      <span className="text-ink-400 tabular-nums">{g.pct}%</span>
                    </div>
                    <Progress value={g.pct} color={g.status === 'congested' ? '#ff8c00' : g.status === 'optimal' ? '#00e890' : '#4d8fff'} height={6} />
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-lg bg-alert-500/10 border border-alert-500/30">
                <p className="text-xs font-semibold text-alert-300 mb-1">AI Evacuation Recommendation</p>
                <p className="text-xs text-ink-200">
                  Redirect 15% of Gate A flow to Gate C (underutilized at 18%). Estimated clearance improvement: -2.1 min. Bottleneck at Concourse L1 can be relieved by opening emergency Route E-7.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="danger" size="sm">Run Full Evacuation</Button>
                <Button variant="outline" size="sm">View Routes</Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Environmental sensors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-flame-400" /> Environmental Sensors
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Thermometer, label: 'Avg Temperature', value: 22.4, unit: '°C', color: '#ff8c00' },
              { icon: Wind, label: 'Air Flow', value: 4.2, unit: 'm/s', color: '#4d8fff' },
              { icon: Activity, label: 'CO2 Levels', value: 612, unit: 'ppm', color: '#00e890' },
              { icon: Layers, label: 'Humidity', value: 48, unit: '%', color: '#a855f7' },
            ].map((s) => (
              <div key={s.label} className="p-3 rounded-xl bg-ink-900/40 border border-ink-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                  <span className="text-xs text-ink-400">{s.label}</span>
                </div>
                <p className="font-display text-2xl font-bold text-ink-50 tabular-nums">
                  {s.value}<span className="text-sm text-ink-400 ml-1">{s.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
