import { useEffect, useState } from 'react';
import {
  Activity, Server, Cpu, Zap, AlertTriangle, CheckCircle2,
  TrendingDown, Clock, RefreshCw, Eye, Radio,
  Gauge as GaugeIcon, Database, Cloud, GitBranch,
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardTitle } from '../ui/Card';
import { Button, Badge } from '../ui/Button';
import { Sparkline } from '../ui/Sparkline';
import { Progress } from '../ui/Progress';
import { Gauge } from '../ui/Gauge';
import { generateSystemMetrics, generateErrorEvents, generateSparkline, AGENTS } from '../../lib/mock-data';
import { cn, statusColor, timeAgo } from '../../lib/utils';
import type { SystemMetric, ErrorEvent } from '../../types';

export function MonitoringObservability() {
  const [metrics] = useState<SystemMetric[]>(() => generateSystemMetrics());
  const [errors] = useState<ErrorEvent[]>(() => generateErrorEvents());
  const [latencyData, setLatencyData] = useState(() => generateSparkline(30, 45, 20));
  const [throughputData, setThroughputData] = useState(() => generateSparkline(30, 12000, 3000));

  useEffect(() => {
    const t = setInterval(() => {
      setLatencyData((p) => [...p.slice(1), Math.max(20, Math.min(120, p[p.length - 1] + (Math.random() - 0.5) * 15))]);
      setThroughputData((p) => [...p.slice(1), Math.max(8000, Math.min(20000, p[p.length - 1] + (Math.random() - 0.5) * 2000))]);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const healthyCount = metrics.filter((m) => m.status === 'healthy').length;
  const degradedCount = metrics.filter((m) => m.status === 'degraded').length;
  const downCount = metrics.filter((m) => m.status === 'down').length;
  const avgLatency = metrics.reduce((s, m) => s + m.latency, 0) / metrics.length;
  const avgUptime = metrics.reduce((s, m) => s + m.uptime, 0) / metrics.length;
  const totalErrors = errors.reduce((s, e) => s + e.count, 0);
  const unresolvedErrors = errors.filter((e) => !e.resolved).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Activity className="w-7 h-7 text-nexus-400" /> Monitoring & Observability
          </h1>
          <p className="text-sm text-ink-400 mt-1">System health · API monitoring · Error tracking · AI agent monitoring · Latency · Alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success"><CheckCircle2 size={10} /> {healthyCount} healthy</Badge>
          {degradedCount > 0 && <Badge variant="warning"><AlertTriangle size={10} /> {degradedCount} degraded</Badge>}
          {downCount > 0 && <Badge variant="danger"><AlertTriangle size={10} /> {downCount} down</Badge>}
          <Badge variant="info"><Radio size={10} /> Real-time</Badge>
        </div>
      </div>

      {/* Top-level KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: 'Avg Latency', value: `${avgLatency.toFixed(0)}ms`, icon: Clock, color: '#4d8fff', trend: '-8%' },
          { label: 'Avg Uptime', value: `${avgUptime.toFixed(2)}%`, icon: CheckCircle2, color: '#00e890', trend: '+0.01%' },
          { label: 'Error Rate', value: '0.14%', icon: AlertTriangle, color: '#ff8c00', trend: '-0.03%' },
          { label: 'Throughput', value: '12.4K/s', icon: Zap, color: '#1f6fff', trend: '+2.1%' },
          { label: 'Active Errors', value: `${unresolvedErrors}`, icon: AlertTriangle, color: '#e61e1e', trend: '-2' },
          { label: 'Total Errors', value: `${totalErrors}`, icon: TrendingDown, color: '#a855f7', trend: '-12%' },
        ].map((k) => (
          <Card key={k.label} hover>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${k.color}15`, color: k.color }}>
                  <k.icon className="w-4 h-4" />
                </div>
                <span className={cn('text-xs', k.trend.startsWith('-') || k.trend.startsWith('+0') ? 'text-pitch-400' : 'text-flame-400')}>{k.trend}</span>
              </div>
              <p className="font-display text-xl font-bold text-ink-50">{k.value}</p>
              <p className="text-xs text-ink-400">{k.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Real-time charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-nexus-400" /> API Latency (ms) — Live
              </CardTitle>
              <Badge variant="success"><span className="w-1.5 h-1.5 rounded-full bg-pitch-400 animate-pulse" /> Streaming</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <Sparkline data={latencyData} color="#4d8fff" width={400} height={120} />
            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="text-ink-400">Current: <span className="text-nexus-300 font-bold tabular-nums">{Math.round(latencyData[latencyData.length - 1])}ms</span></span>
              <span className="text-ink-400">P95: <span className="text-ink-200 tabular-nums">{Math.round(Math.max(...latencyData) * 0.95)}ms</span></span>
              <span className="text-ink-400">P99: <span className="text-ink-200 tabular-nums">{Math.round(Math.max(...latencyData) * 0.99)}ms</span></span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-pitch-400" /> Request Throughput (req/s) — Live
              </CardTitle>
              <Badge variant="success"><span className="w-1.5 h-1.5 rounded-full bg-pitch-400 animate-pulse" /> Streaming</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <Sparkline data={throughputData} color="#00e890" width={400} height={120} />
            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="text-ink-400">Current: <span className="text-pitch-400 font-bold tabular-nums">{Math.round(throughputData[throughputData.length - 1]).toLocaleString()}/s</span></span>
              <span className="text-ink-400">Peak: <span className="text-ink-200 tabular-nums">{Math.round(Math.max(...throughputData)).toLocaleString()}/s</span></span>
              <span className="text-ink-400">Avg: <span className="text-ink-200 tabular-nums">{Math.round(throughputData.reduce((a, b) => a + b, 0) / throughputData.length).toLocaleString()}/s</span></span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* System health gauges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GaugeIcon className="w-4 h-4 text-nexus-400" /> System Health Overview
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <Gauge value={avgUptime} label="Uptime" color="#00e890" size={120} />
            </div>
            <div className="flex flex-col items-center">
              <Gauge value={100 - 0.14} label="Success Rate" color="#4d8fff" size={120} />
            </div>
            <div className="flex flex-col items-center">
              <Gauge value={avgLatency} label="Avg Latency" color="#ff8c00" size={120} unit="ms" />
            </div>
            <div className="flex flex-col items-center">
              <Gauge value={healthyCount / metrics.length * 100} label="Services Up" color="#1f6fff" size={120} unit="%" />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Service health table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Server className="w-4 h-4 text-nexus-400" /> Service Health Monitor
            </CardTitle>
            <Button variant="ghost" size="sm"><RefreshCw size={14} /> Refresh</Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-500 border-b border-ink-700/50">
                  <th className="pb-2 pr-4 font-medium">Service</th>
                  <th className="pb-2 px-4 font-medium">Status</th>
                  <th className="pb-2 px-4 font-medium">Latency</th>
                  <th className="pb-2 px-4 font-medium">Throughput</th>
                  <th className="pb-2 px-4 font-medium">Error Rate</th>
                  <th className="pb-2 px-4 font-medium">Uptime</th>
                  <th className="pb-2 px-4 font-medium">CPU</th>
                  <th className="pb-2 px-4 font-medium">Memory</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((m) => (
                  <tr key={m.id} className="border-b border-ink-800/50 hover:bg-ink-800/30">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: statusColor(m.status), boxShadow: `0 0 6px ${statusColor(m.status)}` }}
                        />
                        <span className="text-ink-100 font-medium">{m.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded"
                        style={{ background: `${statusColor(m.status)}20`, color: statusColor(m.status) }}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-ink-200 tabular-nums">{m.latency}ms</td>
                    <td className="py-3 px-4 text-ink-200 tabular-nums">{m.throughput.toLocaleString()}/s</td>
                    <td className="py-3 px-4 text-ink-200 tabular-nums">{m.errorRate.toFixed(2)}%</td>
                    <td className="py-3 px-4 text-ink-200 tabular-nums">{m.uptime.toFixed(2)}%</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Progress value={m.cpu} color={m.cpu > 75 ? '#ff8c00' : '#4d8fff'} height={4} className="w-16" />
                        <span className="text-xs text-ink-400 tabular-nums">{m.cpu}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Progress value={m.memory} color={m.memory > 80 ? '#ff8c00' : '#00e890'} height={4} className="w-16" />
                        <span className="text-xs text-ink-400 tabular-nums">{m.memory}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Error tracking */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-alert-400" /> Error Tracking
              </CardTitle>
              <Badge variant={unresolvedErrors > 0 ? 'warning' : 'success'}>{unresolvedErrors} unresolved</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {errors.map((e) => (
                <div key={e.id} className={cn(
                  'flex items-start gap-3 p-3 rounded-xl border',
                  e.resolved
                    ? 'bg-ink-900/30 border-ink-700/30'
                    : e.level === 'error'
                    ? 'bg-alert-500/5 border-alert-500/30'
                    : e.level === 'warning'
                    ? 'bg-flame-500/5 border-flame-500/30'
                    : 'bg-nexus-500/5 border-nexus-500/30',
                )}>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: e.level === 'error' ? '#e61e1e15' : e.level === 'warning' ? '#ff8c0015' : '#4d8fff15',
                      color: e.level === 'error' ? '#e61e1e' : e.level === 'warning' ? '#ff8c00' : '#4d8fff',
                    }}
                  >
                    {e.level === 'error' ? <AlertTriangle className="w-4 h-4" /> : e.level === 'warning' ? <AlertTriangle className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-ink-500">{e.service}</span>
                      <span
                        className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded"
                        style={{
                          background: e.level === 'error' ? '#e61e1e20' : e.level === 'warning' ? '#ff8c0020' : '#4d8fff20',
                          color: e.level === 'error' ? '#e61e1e' : e.level === 'warning' ? '#ff8c00' : '#4d8fff',
                        }}
                      >
                        {e.level}
                      </span>
                      {e.resolved && <CheckCircle2 className="w-3 h-3 text-pitch-400" />}
                    </div>
                    <p className="text-sm text-ink-200 mt-0.5">{e.message}</p>
                    <p className="text-[10px] text-ink-500 mt-1">{timeAgo(e.timestamp)} · {e.count} occurrences</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* AI Agent monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-pitch-400" /> AI Agent Monitoring
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {AGENTS.map((a) => (
                <div key={a.id} className="p-3 rounded-xl bg-ink-900/40 border border-ink-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: statusColor(a.status), boxShadow: `0 0 8px ${statusColor(a.status)}` }}
                      />
                      <span className="text-sm font-medium text-ink-100">{a.name}</span>
                    </div>
                    <span className="text-xs text-ink-400 tabular-nums">{a.accuracy.toFixed(1)}% acc</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-ink-500">Load</p>
                      <div className="flex items-center gap-1.5">
                        <Progress value={a.load * 100} color={a.color} height={4} className="flex-1" />
                        <span className="text-ink-200 tabular-nums">{Math.round(a.load * 100)}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-ink-500">Latency</p>
                      <p className="text-ink-200 tabular-nums">{a.latencyMs}ms</p>
                    </div>
                    <div>
                      <p className="text-ink-500">Tasks</p>
                      <p className="text-ink-200 tabular-nums">{a.tasksHandled.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Infrastructure overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-nexus-400" /> Infrastructure Overview
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Server, label: 'Edge Nodes', value: '5', detail: '3 regions · 0 down', color: '#4d8fff' },
              { icon: Database, label: 'Database', value: 'Primary', detail: 'Supabase · 12ms avg', color: '#00e890' },
              { icon: GitBranch, label: 'CI/CD Pipeline', value: 'Passing', detail: 'Build 1.2.4 · 2m ago', color: '#00e890' },
              { icon: Cloud, label: 'CDN', value: '99.99%', detail: 'Global · 142 PoPs', color: '#ff8c00' },
            ].map((i) => (
              <div key={i.label} className="p-4 rounded-xl bg-ink-900/40 border border-ink-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${i.color}15`, color: i.color }}>
                    <i.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-ink-400">{i.label}</span>
                </div>
                <p className="font-display text-lg font-bold text-ink-50">{i.value}</p>
                <p className="text-xs text-ink-500">{i.detail}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
