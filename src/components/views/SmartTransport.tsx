import { useEffect, useState } from 'react';
import {
  Bus, Train, Car, ArrowRight, Users, Leaf, Brain, Sparkles,
  AlertTriangle, Navigation,
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardTitle } from '../ui/Card';
import { Button, Badge } from '../ui/Button';
import { Sparkline } from '../ui/Sparkline';
import { Progress } from '../ui/Progress';
import { generateTransportRoutes, generateSparkline } from '../../lib/mock-data';
import { cn, statusColor, formatNumber } from '../../lib/utils';

export function SmartTransport() {
  const [routes] = useState(() => generateTransportRoutes());
  const [exitFlow, setExitFlow] = useState(() => generateSparkline(20, 30, 20));

  useEffect(() => {
    const t = setInterval(() => {
      setExitFlow((p) => [...p.slice(1), Math.max(10, Math.min(80, p[p.length - 1] + (Math.random() - 0.5) * 10))]);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const metro = routes.filter((r) => r.type === 'metro');
  const bus = routes.filter((r) => r.type === 'bus');
  const parking = routes.filter((r) => r.type === 'parking');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Bus className="w-7 h-7 text-nexus-400" /> Smart Transportation
          </h1>
          <p className="text-sm text-ink-400 mt-1">Metro · Bus · Parking · Exit flow prediction · Dynamic rerouting</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success"><span className="w-1.5 h-1.5 rounded-full bg-pitch-400 animate-pulse" /> Live</Badge>
          <Badge variant="info"><Brain size={10} /> AI-optimized</Badge>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Metro Load', value: '86%', icon: Train, color: '#e61e1e', trend: '+4.1%' },
          { label: 'Bus Capacity', value: '72%', icon: Bus, color: '#ff8c00', trend: '+1.8%' },
          { label: 'Parking Avail', value: '12%', icon: Car, color: '#e61e1e', trend: '-2.3%' },
          { label: 'Exit Flow', value: '38 min', icon: Navigation, color: '#00e890', trend: '-39%' },
        ].map((k) => (
          <Card key={k.label} hover>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${k.color}15`, color: k.color }}>
                  <k.icon className="w-4 h-4" />
                </div>
                <span className={cn('text-xs', k.trend.startsWith('-') ? 'text-pitch-400' : 'text-flame-400')}>{k.trend}</span>
              </div>
              <p className="font-display text-2xl font-bold text-ink-50">{k.value}</p>
              <p className="text-xs text-ink-400">{k.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Metro */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Train className="w-4 h-4 text-nexus-400" /> Metro Integration
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {metro.map((r) => (
                <div key={r.id} className="p-3 rounded-xl bg-ink-900/40 border border-ink-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-nexus-500/15 text-nexus-400 flex items-center justify-center">
                        <Train className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink-100">{r.name}</p>
                        <p className="text-xs text-ink-500">Next: {r.nextArrival}</p>
                      </div>
                    </div>
                    <Badge variant={r.status === 'congested' ? 'danger' : r.status === 'busy' ? 'warning' : 'success'}>
                      {r.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={r.load} color={statusColor(r.status)} className="flex-1" height={6} />
                    <span className="text-xs text-ink-300 tabular-nums w-10 text-right">{r.load}%</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-ink-500">
                    <span className="flex items-center gap-1"><Users size={10} /> {r.capacity.toLocaleString()} cap</span>
                    <span className="flex items-center gap-1"><Leaf size={10} /> {r.carbon} kgCO2/km</span>
                  </div>
                </div>
              ))}
              <div className="p-3 rounded-lg bg-nexus-500/10 border border-nexus-500/30">
                <p className="text-xs font-semibold text-nexus-300 mb-1 flex items-center gap-1">
                  <Sparkles size={10} /> AI Recommendation
                </p>
                <p className="text-xs text-ink-200">Request 6 additional trains for Line 4. Activate holding pattern at platform barriers. Deploy 12 crowd marshals.</p>
                <Button size="sm" className="w-full mt-2">Execute Rerouting <ArrowRight size={12} /></Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Bus */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="w-4 h-4 text-flame-400" /> Bus Integration
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {bus.map((r) => (
                <div key={r.id} className="p-3 rounded-xl bg-ink-900/40 border border-ink-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-flame-500/15 text-flame-400 flex items-center justify-center">
                        <Bus className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink-100">{r.name}</p>
                        <p className="text-xs text-ink-500">ETA: {r.eta} min</p>
                      </div>
                    </div>
                    <Badge variant={r.status === 'congested' ? 'danger' : r.status === 'busy' ? 'warning' : 'success'}>
                      {r.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={r.load} color={statusColor(r.status)} className="flex-1" height={6} />
                    <span className="text-xs text-ink-300 tabular-nums w-10 text-right">{r.load}%</span>
                  </div>
                </div>
              ))}
              <div className="p-3 rounded-lg bg-flame-500/10 border border-flame-500/30">
                <p className="text-xs font-semibold text-flame-300 mb-1 flex items-center gap-1">
                  <Sparkles size={10} /> AI Optimization
                </p>
                <p className="text-xs text-ink-200">Reroute 4 buses from Route 92 to Metro Station to handle post-match surge. Estimated wait reduction: 6 min.</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Parking + Exit flow */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-4 h-4 text-pitch-400" /> Parking Optimization
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {parking.map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-ink-900/40 border border-ink-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-ink-400" />
                      <p className="text-sm font-medium text-ink-100">{p.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ink-400">{p.nextArrival}</span>
                      <Badge variant={p.status === 'congested' ? 'danger' : p.status === 'busy' ? 'warning' : 'success'}>
                        {p.load}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={p.load} color={statusColor(p.status)} height={6} />
                </div>
              ))}
              <div className="p-3 rounded-lg bg-alert-500/10 border border-alert-500/30">
                <p className="text-xs font-semibold text-alert-300 mb-1 flex items-center gap-1">
                  <AlertTriangle size={10} /> Action Required
                </p>
                <p className="text-xs text-ink-200">Parking North is full. Redirect inbound traffic to Parking South or Overflow P7 (free shuttle, 4 min ride). Update variable message signs on M4.</p>
                <Button variant="danger" size="sm" className="w-full mt-2">Activate Traffic Diversion</Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-pitch-400" /> Exit Flow Prediction
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-ink-400 mb-2">Predicted exit flow (fans/min) — next 20 min</p>
                <Sparkline data={exitFlow} color="#00e890" width={400} height={100} />
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-ink-400">Current: <span className="text-pitch-400 font-bold tabular-nums">{Math.round(exitFlow[exitFlow.length - 1])}</span>/min</span>
                  <span className="text-ink-400">Peak: <span className="text-ink-200 tabular-nums">{Math.round(Math.max(...exitFlow))}</span>/min</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-ink-400 mb-2">Exit Distribution by Gate</p>
                <div className="space-y-2">
                  {[
                    { gate: 'Gate A — North', pct: 28, status: 'congested' },
                    { gate: 'Gate B — South', pct: 42, status: 'optimal' },
                    { gate: 'Gate C — East', pct: 18, status: 'normal' },
                    { gate: 'Gate D — West', pct: 12, status: 'normal' },
                  ].map((g) => (
                    <div key={g.gate}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-ink-300">{g.gate}</span>
                        <span className="text-ink-400 tabular-nums">{g.pct}%</span>
                      </div>
                      <Progress value={g.pct} color={g.status === 'congested' ? '#ff8c00' : g.status === 'optimal' ? '#00e890' : '#4d8fff'} height={6} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-lg bg-ink-900/40 text-center">
                  <p className="text-xs text-ink-500">Clearance</p>
                  <p className="font-display text-lg font-bold text-pitch-400">38<span className="text-xs text-ink-400">min</span></p>
                </div>
                <div className="p-2.5 rounded-lg bg-ink-900/40 text-center">
                  <p className="text-xs text-ink-500">Baseline</p>
                  <p className="font-display text-lg font-bold text-ink-300">62<span className="text-xs text-ink-400">min</span></p>
                </div>
                <div className="p-2.5 rounded-lg bg-ink-900/40 text-center">
                  <p className="text-xs text-ink-500">Improvement</p>
                  <p className="font-display text-lg font-bold text-pitch-400">-39%</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Carbon impact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-pitch-400" /> Transport Carbon Impact
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: 'Metro (public)', value: 0.8, unit: 'kgCO2/km', color: '#00e890', fans: 42000 },
              { label: 'Bus (shuttle)', value: 4.2, unit: 'kgCO2/km', color: '#4d8fff', fans: 18000 },
              { label: 'Car (private)', value: 192, unit: 'kgCO2/km', color: '#ff8c00', fans: 12000 },
              { label: 'EV (charging)', value: 0, unit: 'kgCO2/km', color: '#a855f7', fans: 6432 },
            ].map((c) => (
              <div key={c.label} className="p-4 rounded-xl bg-ink-900/40 border border-ink-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-ink-400">{c.label}</span>
                  <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                </div>
                <p className="font-display text-2xl font-bold" style={{ color: c.color }}>{c.value}</p>
                <p className="text-xs text-ink-500">{c.unit}</p>
                <p className="text-xs text-ink-400 mt-2">{formatNumber(c.fans)} fans</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-pitch-500/10 border border-pitch-500/30">
            <p className="text-xs font-semibold text-pitch-300 mb-1 flex items-center gap-1">
              <Sparkles size={10} /> Sustainability AI
            </p>
            <p className="text-xs text-ink-200">Public transit usage at 72% — 21% above baseline. Estimated carbon savings: 38 tCO2 vs. all-private-vehicle scenario. Recommend incentivizing metro with free return tickets.</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
