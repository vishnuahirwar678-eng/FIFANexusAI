import { useEffect, useState } from 'react';
import {
  Leaf, Zap, Droplets, Recycle, Brain, Sparkles, TrendingDown,
  ArrowRight, Sun, Wind, Factory, Car, Award,
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardTitle } from '../ui/Card';
import { Button, Badge } from '../ui/Button';
import { Sparkline } from '../ui/Sparkline';
import { Gauge } from '../ui/Gauge';
import { Progress } from '../ui/Progress';
import { generateSustainabilityMetrics, generateSparkline } from '../../lib/mock-data';
import { statusColor } from '../../lib/utils';

export function SustainabilityIntelligence() {
  const [metrics] = useState(() => generateSustainabilityMetrics());
  const [energyData, setEnergyData] = useState(() => generateSparkline(20, 4.2, 0.6));

  useEffect(() => {
    const t = setInterval(() => {
      setEnergyData((p) => [...p.slice(1), Math.max(3.5, Math.min(5, p[p.length - 1] + (Math.random() - 0.5) * 0.2))]);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const energy = metrics.filter((m) => m.category === 'energy');
  const water = metrics.filter((m) => m.category === 'water');
  const waste = metrics.filter((m) => m.category === 'waste');
  const carbon = metrics.filter((m) => m.category === 'carbon');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Leaf className="w-7 h-7 text-pitch-400" /> Sustainability Intelligence
          </h1>
          <p className="text-sm text-ink-400 mt-1">Energy · Water · Waste · Carbon — AI-optimized in real time</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success"><span className="w-1.5 h-1.5 rounded-full bg-pitch-400 animate-pulse" /> Optimizing</Badge>
          <Badge variant="pitch"><Brain size={10} /> 96.8% accuracy</Badge>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Energy Usage', value: '4.2 MW', target: '5.0 MW', icon: Zap, color: '#ff8c00', trend: '-16%' },
          { label: 'Water Flow', value: '28 kL/h', target: '35 kL/h', icon: Droplets, color: '#4d8fff', trend: '-20%' },
          { label: 'Waste Diverted', value: '88%', target: '90%', icon: Recycle, color: '#00e890', trend: '+5%' },
          { label: 'Carbon Output', value: '142 tCO2', target: '180 tCO2', icon: Leaf, color: '#a855f7', trend: '-21%' },
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
              <p className="text-[10px] text-ink-500 mt-1">Target: {k.target}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Energy + Live chart */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-flame-400" /> Energy Optimization
              </CardTitle>
              <Badge variant="success"><span className="w-1.5 h-1.5 rounded-full bg-pitch-400 animate-pulse" /> Live</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-ink-400 mb-2">Real-time energy consumption (MW)</p>
                <Sparkline data={energyData} color="#ff8c00" width={500} height={100} />
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-ink-400">Current: <span className="text-flame-400 font-bold tabular-nums">{energyData[energyData.length - 1].toFixed(2)} MW</span></span>
                  <span className="text-ink-400">Target: <span className="text-ink-200 tabular-nums">≤ 5.0 MW</span></span>
                  <span className="text-pitch-400">16% below target</span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {energy.map((e) => (
                  <div key={e.id} className="p-3 rounded-lg bg-ink-900/40 border border-ink-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-ink-100">{e.label}</span>
                      <Badge variant={e.status === 'good' ? 'success' : 'warning'}>{e.status}</Badge>
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="font-display text-xl font-bold text-ink-50 tabular-nums">{e.value}</span>
                      <span className="text-xs text-ink-400">{e.unit}</span>
                    </div>
                    <Progress value={(e.value / e.target) * 100} color={statusColor(e.status)} height={4} />
                    <p className="text-[10px] text-ink-500 mt-1">Target: {e.target} {e.unit}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* AI optimization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pitch-400" /> AI Optimization
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="text-center py-4">
                <Gauge value={84} label="Efficiency" color="#00e890" size={140} />
                <p className="text-xs text-ink-400 mt-2">Sustainability Score</p>
              </div>
              <div className="p-3 rounded-lg bg-pitch-500/10 border border-pitch-500/30">
                <p className="text-xs font-semibold text-pitch-300 mb-2">Active Recommendations:</p>
                <ul className="space-y-2 text-xs text-ink-200">
                  <li className="flex items-start gap-2"><ArrowRight size={10} className="text-pitch-400 mt-1 shrink-0" /> Pre-cool East Stand during low occupancy (-12% peak HVAC)</li>
                  <li className="flex items-start gap-2"><ArrowRight size={10} className="text-pitch-400 mt-1 shrink-0" /> Adjust setpoint by 2°C in non-occupied zones</li>
                  <li className="flex items-start gap-2"><ArrowRight size={10} className="text-pitch-400 mt-1 shrink-0" /> Activate natural ventilation in concourse</li>
                  <li className="flex items-start gap-2"><ArrowRight size={10} className="text-pitch-400 mt-1 shrink-0" /> Switch to LED stage lighting (saves 0.2 MW)</li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-lg bg-ink-900/40">
                  <p className="text-xs text-ink-500">Saved</p>
                  <p className="font-display text-lg font-bold text-pitch-400">0.8 MW</p>
                </div>
                <div className="p-2 rounded-lg bg-ink-900/40">
                  <p className="text-xs text-ink-500">CO2 Avoided</p>
                  <p className="font-display text-lg font-bold text-pitch-400">8 t</p>
                </div>
              </div>
              <Button size="sm" className="w-full">Apply All Optimizations</Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Water + Waste */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-nexus-400" /> Water Management
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {water.map((w) => (
                <div key={w.id} className="p-3 rounded-lg bg-ink-900/40 border border-ink-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-ink-100">{w.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-bold text-ink-50 tabular-nums">{w.value} <span className="text-xs text-ink-400">{w.unit}</span></span>
                      <Badge variant={w.status === 'good' ? 'success' : 'warning'}>{w.status}</Badge>
                    </div>
                  </div>
                  <Progress value={(w.value / w.target) * 100} color={statusColor(w.status)} height={4} />
                  <p className="text-[10px] text-ink-500 mt-1">Target: {w.target} {w.unit}</p>
                </div>
              ))}
              <div className="p-3 rounded-lg bg-nexus-500/10 border border-nexus-500/30">
                <p className="text-xs font-semibold text-nexus-300 mb-1 flex items-center gap-1">
                  <Sparkles size={10} /> Water AI
                </p>
                <p className="text-xs text-ink-200">Restroom usage 22% below forecast due to efficient fixtures. Pitch irrigation optimized based on weather forecast (no rain expected).</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Recycle className="w-4 h-4 text-pitch-400" /> Waste Prediction
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {waste.map((w) => (
                <div key={w.id} className="p-3 rounded-lg bg-ink-900/40 border border-ink-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-ink-100">{w.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-bold text-ink-50 tabular-nums">{w.value} <span className="text-xs text-ink-400">{w.unit}</span></span>
                      <Badge variant={w.status === 'good' ? 'success' : 'warning'}>{w.status}</Badge>
                    </div>
                  </div>
                  <Progress value={(w.value / w.target) * 100} color={statusColor(w.status)} height={4} />
                </div>
              ))}
              {/* Waste composition donut */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#00e890" strokeWidth="12" strokeDasharray="125.6" strokeDashoffset="58" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#4d8fff" strokeWidth="12" strokeDasharray="125.6" strokeDashoffset="80" transform="rotate(180 50 50)" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#ff8c00" strokeWidth="12" strokeDasharray="125.6" strokeDashoffset="110" transform="rotate(270 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-xl font-bold text-ink-50">3.4t</span>
                    <span className="text-[10px] text-ink-400">total</span>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-pitch-500" /> Recyclable: 53%</div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-nexus-500" /> Compostable: 35%</div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-flame-500" /> Landfill: 12%</div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Carbon dashboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-pitch-400" /> Carbon Impact Dashboard
            </CardTitle>
            <Badge variant="success"><TrendingDown size={10} /> 21% below target</Badge>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid md:grid-cols-3 gap-4">
            {carbon.map((c) => (
              <div key={c.id} className="p-4 rounded-xl bg-ink-900/40 border border-ink-700/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-ink-100">{c.label}</span>
                  <Badge variant={c.status === 'good' ? 'success' : 'warning'}>{c.status}</Badge>
                </div>
                <p className="font-display text-3xl font-bold text-ink-50 tabular-nums">{c.value}<span className="text-sm text-ink-400 ml-1">{c.unit}</span></p>
                <div className="mt-3">
                  <Progress value={(c.value / c.target) * 100} color={statusColor(c.status)} height={6} />
                  <p className="text-[10px] text-ink-500 mt-1">Target: {c.target} {c.unit}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid md:grid-cols-4 gap-3">
            {[
              { icon: Sun, label: 'Solar contribution', value: '18%', color: '#ff8c00' },
              { icon: Wind, label: 'Wind offset', value: '12%', color: '#4d8fff' },
              { icon: Car, label: 'Transit modal share', value: '72%', color: '#00e890' },
              { icon: Factory, label: 'Local sourcing', value: '64%', color: '#a855f7' },
            ].map((s) => (
              <div key={s.label} className="p-3 rounded-lg bg-ink-900/40 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15`, color: s.color }}>
                  <s.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-ink-50">{s.value}</p>
                  <p className="text-[10px] text-ink-400">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-xl bg-pitch-500/10 border border-pitch-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-pitch-400" />
              <p className="text-sm font-semibold text-pitch-300">FIFA Sustainability Score: A-</p>
            </div>
            <p className="text-xs text-ink-200">On track to meet FIFA World Cup 2026 sustainability targets. Carbon output 21% below baseline, water usage 20% below target, waste diversion rate 88% (target 90%). Recommend increasing compostable packaging at F&B to reach 90% diversion.</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
