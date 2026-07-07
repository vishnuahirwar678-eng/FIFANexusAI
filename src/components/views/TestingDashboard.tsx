import { useState } from 'react';
import {
  FlaskConical, CheckCircle2, XCircle, Activity, Shield,
  Accessibility, Gauge, Zap, Brain, Radio, Clock, TrendingUp, Play,
  RotateCcw, Users, Server, Cpu,
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardTitle } from '../ui/Card';
import { Button, Badge } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { Sparkline } from '../ui/Sparkline';
import { Gauge as GaugeCmp } from '../ui/Gauge';
import { generateTestResults, generateSparkline } from '../../lib/mock-data';
import { cn, statusColor } from '../../lib/utils';

const CATEGORY_ICONS: Record<string, typeof FlaskConical> = {
  unit: CheckCircle2, integration: Activity, e2e: Play, accessibility: Accessibility,
  security: Shield, performance: Zap, load: Users, 'ai-accuracy': Brain, uptime: Radio,
};

const CATEGORY_LABELS: Record<string, string> = {
  unit: 'Unit Testing', integration: 'Integration', e2e: 'End-to-End', accessibility: 'Accessibility',
  security: 'Security', performance: 'Performance', load: 'Load Testing', 'ai-accuracy': 'AI Accuracy', uptime: 'Uptime',
};

export function TestingDashboard() {
  const [results] = useState(() => generateTestResults());
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = Array.from(new Set(results.map((r) => r.category)));
  const filtered = activeCategory === 'all' ? results : results.filter((r) => r.category === activeCategory);

  const totalTests = results.length;
  const passing = results.filter((r) => r.status === 'passing').length;
  const totalAssertions = results.reduce((s, r) => s + r.assertions, 0);
  const avgCoverage = results.reduce((s, r) => s + r.coverage, 0) / results.length;
  const totalDuration = results.reduce((s, r) => s + r.duration, 0);

  const loadTestData = generateSparkline(20, 95000, 8000);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <FlaskConical className="w-7 h-7 text-nexus-400" /> Testing Dashboard
          </h1>
          <p className="text-sm text-ink-400 mt-1">Unit · Integration · E2E · Accessibility · Security · Performance · Load · AI Accuracy</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm"><Play size={12} /> Run All</Button>
          <Button variant="outline" size="sm"><RotateCcw size={12} /> Reset</Button>
        </div>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: 'Test Suites', value: totalTests, icon: FlaskConical, color: '#1f6fff' },
          { label: 'Passing', value: passing, icon: CheckCircle2, color: '#00e890' },
          { label: 'Total Assertions', value: totalAssertions.toLocaleString(), icon: Activity, color: '#4d8fff' },
          { label: 'Avg Coverage', value: `${avgCoverage.toFixed(1)}%`, icon: TrendingUp, color: '#00e890' },
          { label: 'Total Duration', value: `${(totalDuration / 60).toFixed(1)}m`, icon: Clock, color: '#ff8c00' },
          { label: 'Failures', value: 0, icon: XCircle, color: '#e61e1e' },
        ].map((m) => (
          <Card key={m.label} hover>
            <div className="p-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2" style={{ background: `${m.color}15`, color: m.color }}>
                <m.icon className="w-4 h-4" />
              </div>
              <p className="font-display text-xl font-bold text-ink-50 tabular-nums">{m.value}</p>
              <p className="text-xs text-ink-400">{m.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Category overview */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-nexus-400" /> Test Results by Category
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setActiveCategory('all')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                  activeCategory === 'all' ? 'bg-nexus-500/15 border-nexus-500/40 text-nexus-200' : 'bg-ink-900/40 border-ink-700 text-ink-300 hover:border-ink-600',
                )}
              >
                All ({results.length})
              </button>
              {categories.map((c) => {
                const count = results.filter((r) => r.category === c).length;
                const Icon = CATEGORY_ICONS[c] ?? FlaskConical;
                return (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5',
                      activeCategory === c ? 'bg-nexus-500/15 border-nexus-500/40 text-nexus-200' : 'bg-ink-900/40 border-ink-700 text-ink-300 hover:border-ink-600',
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {CATEGORY_LABELS[c]} ({count})
                  </button>
                );
              })}
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {filtered.map((r) => {
                const Icon = CATEGORY_ICONS[r.category] ?? FlaskConical;
                return (
                  <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-ink-900/40 border border-ink-700/50 hover:border-ink-600 transition-colors">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${statusColor(r.status)}15`, color: statusColor(r.status) }}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-ink-100 truncate">{r.name}</p>
                        <Badge variant={r.status === 'passing' ? 'success' : 'danger'}>{r.status}</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-ink-500">
                        <span>{r.assertions} assertions</span>
                        <span>·</span>
                        <span>{r.coverage.toFixed(1)}% coverage</span>
                        <span>·</span>
                        <span>{r.duration.toFixed(1)}s</span>
                        <span>·</span>
                        <span>{r.lastRun}</span>
                      </div>
                    </div>
                    {r.failures > 0 ? (
                      <span className="text-xs text-alert-400 font-medium">{r.failures} failed</span>
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-pitch-400 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Coverage gauges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-pitch-400" /> Coverage
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <GaugeCmp value={94.2} label="Unit" color="#00e890" size={100} />
              </div>
              <div className="flex flex-col items-center">
                <GaugeCmp value={87.3} label="Integration" color="#4d8fff" size={100} />
              </div>
              <div className="flex flex-col items-center">
                <GaugeCmp value={78.4} label="E2E" color="#ff8c00" size={100} />
              </div>
              <div className="flex flex-col items-center">
                <GaugeCmp value={100} label="A11y" color="#00e890" size={100} />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-ink-700/50 space-y-2">
              {[
                { label: 'Security', value: 100, color: '#e61e1e' },
                { label: 'Performance', value: 94, color: '#a855f7' },
                { label: 'AI Accuracy', value: 96.8, color: '#1f6fff' },
              ].map((c) => (
                <div key={c.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-ink-300">{c.label}</span>
                    <span className="text-ink-400 tabular-nums">{c.value}%</span>
                  </div>
                  <Progress value={c.value} color={c.color} height={4} />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Load testing + AI accuracy */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-4 h-4 text-flame-400" /> Load Testing — 100K Concurrent Users
              </CardTitle>
              <Badge variant="success"><CheckCircle2 size={10} /> Passed</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-ink-400 mb-2">Concurrent users over time</p>
                <Sparkline data={loadTestData} color="#ff8c00" width={460} height={100} />
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-ink-400">Peak: <span className="text-flame-400 font-bold tabular-nums">{Math.round(Math.max(...loadTestData)).toLocaleString()}</span></span>
                  <span className="text-ink-400">Avg: <span className="text-ink-200 tabular-nums">{Math.round(loadTestData.reduce((a, b) => a + b, 0) / loadTestData.length).toLocaleString()}</span></span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'P50 Latency', value: '42ms', color: '#00e890' },
                  { label: 'P95 Latency', value: '142ms', color: '#4d8fff' },
                  { label: 'P99 Latency', value: '284ms', color: '#ff8c00' },
                  { label: 'Error Rate', value: '0.01%', color: '#00e890' },
                ].map((m) => (
                  <div key={m.label} className="p-2.5 rounded-lg bg-ink-900/40 text-center">
                    <p className="text-[10px] text-ink-500">{m.label}</p>
                    <p className="font-display text-sm font-bold" style={{ color: m.color }}>{m.value}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-lg bg-pitch-500/10 border border-pitch-500/30">
                <p className="text-xs font-semibold text-pitch-300 mb-1">Load Test Summary</p>
                <p className="text-xs text-ink-200">Sustained 100,000 concurrent users for 30 minutes. Zero downtime. P99 latency under 300ms. Error rate 0.01% (well below 0.1% threshold). Auto-scaling handled 4x baseline capacity.</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-nexus-400" /> AI Accuracy Metrics
              </CardTitle>
              <Badge variant="pitch">96.8% avg</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {[
                { model: 'Crowd Prediction (Nexus-Crowd-v3.1)', accuracy: 96.7, latency: 89, color: '#ff8c00' },
                { model: 'Translation Quality (Nexus-MT-v2)', accuracy: 94.2, latency: 42, color: '#4d8fff' },
                { model: 'Intent Classification', accuracy: 97.8, latency: 28, color: '#00e890' },
                { model: 'Anomaly Detection (Vision)', accuracy: 99.1, latency: 67, color: '#e61e1e' },
                { model: 'Route Optimization', accuracy: 94.2, latency: 142, color: '#a855f7' },
                { model: 'Sentiment Analysis', accuracy: 92.4, latency: 38, color: '#1f6fff' },
              ].map((m) => (
                <div key={m.model} className="p-3 rounded-lg bg-ink-900/40 border border-ink-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-ink-100">{m.model}</span>
                    <span className="text-xs font-bold tabular-nums" style={{ color: m.color }}>{m.accuracy.toFixed(1)}%</span>
                  </div>
                  <Progress value={m.accuracy} color={m.color} height={4} />
                  <p className="text-[10px] text-ink-500 mt-1">Inference latency: {m.latency}ms</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Uptime + Security + A11y */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-pitch-400" /> Uptime Metrics
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {[
                { service: 'API Gateway', uptime: 99.99, status: 'operational' },
                { service: 'AI Service', uptime: 99.97, status: 'operational' },
                { service: 'Database (Supabase)', uptime: 99.99, status: 'operational' },
                { service: 'Real-time Stream', uptime: 99.95, status: 'operational' },
                { service: 'CDN / Edge', uptime: 100, status: 'operational' },
              ].map((s) => (
                <div key={s.service} className="flex items-center justify-between p-2.5 rounded-lg bg-ink-900/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pitch-400 animate-pulse" />
                    <span className="text-sm text-ink-100">{s.service}</span>
                  </div>
                  <span className="text-xs font-bold text-pitch-400 tabular-nums">{s.uptime}%</span>
                </div>
              ))}
              <div className="p-3 rounded-lg bg-pitch-500/10 border border-pitch-500/30">
                <p className="text-xs font-semibold text-pitch-300">Overall: 99.97% uptime (30-day)</p>
                <p className="text-xs text-ink-400 mt-1">SLA target: 99.9% — exceeded by 0.07%</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-alert-400" /> Security Testing
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {[
                { test: 'OWASP Top 10', status: 'passing', detail: '0 vulnerabilities' },
                { test: 'Prompt Injection', status: 'passing', detail: '218/218 blocked' },
                { test: 'JWT & RBAC', status: 'passing', detail: '96/96 passed' },
                { test: 'SQL Injection', status: 'passing', detail: 'Parameterized queries' },
                { test: 'XSS Prevention', status: 'passing', detail: 'Input sanitized' },
                { test: 'CSRF Protection', status: 'passing', detail: 'Tokens validated' },
                { test: 'Rate Limiting', status: 'passing', detail: '100 req/min' },
                { test: 'Encryption Audit', status: 'passing', detail: 'AES-256 + TLS 1.3' },
              ].map((s) => (
                <div key={s.test} className="flex items-center justify-between p-2.5 rounded-lg bg-ink-900/40">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-pitch-400" />
                    <span className="text-sm text-ink-100">{s.test}</span>
                  </div>
                  <span className="text-xs text-ink-400">{s.detail}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Accessibility className="w-4 h-4 text-nexus-400" /> Accessibility Testing
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {[
                { test: 'WCAG 2.2 AA Compliance', status: 'passing', detail: '247 checks' },
                { test: 'Screen Reader (NVDA)', status: 'passing', detail: 'All pages' },
                { test: 'Screen Reader (VoiceOver)', status: 'passing', detail: 'All pages' },
                { test: 'Keyboard Navigation', status: 'passing', detail: 'Full coverage' },
                { test: 'Color Contrast', status: 'passing', detail: '4.5:1+ ratio' },
                { test: 'Focus Management', status: 'passing', detail: 'Visible focus' },
                { test: 'ARIA Labels', status: 'passing', detail: 'Semantic HTML' },
                { test: 'Reduced Motion', status: 'passing', detail: 'Respected' },
              ].map((s) => (
                <div key={s.test} className="flex items-center justify-between p-2.5 rounded-lg bg-ink-900/40">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-pitch-400" />
                    <span className="text-sm text-ink-100">{s.test}</span>
                  </div>
                  <span className="text-xs text-ink-400">{s.detail}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* CI/CD pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-nexus-400" /> CI/CD Pipeline
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { step: 'Lint (ESLint)', status: 'passing', time: '4s' },
              { step: 'Type Check (tsc)', status: 'passing', time: '8s' },
              { step: 'Unit Tests (Vitest)', status: 'passing', time: '12s' },
              { step: 'Integration Tests', status: 'passing', time: '24s' },
              { step: 'E2E Tests (Playwright)', status: 'passing', time: '142s' },
              { step: 'A11y Tests (axe)', status: 'passing', time: '42s' },
              { step: 'Security Scan (OWASP)', status: 'passing', time: '284s' },
              { step: 'Build (Vite)', status: 'passing', time: '18s' },
              { step: 'Deploy (Edge)', status: 'passing', time: '12s' },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-pitch-500/10 border border-pitch-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pitch-400" />
                  <span className="text-xs text-ink-100">{s.step}</span>
                  <span className="text-[10px] text-ink-500">{s.time}</span>
                </div>
                {i < 8 && <span className="text-ink-600">→</span>}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between p-3 rounded-lg bg-ink-900/40">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-nexus-400" />
              <span className="text-sm text-ink-100">Pipeline: main → production</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-ink-400">Total: 8m 46s</span>
              <Badge variant="success">All green</Badge>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
