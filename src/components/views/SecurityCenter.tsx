import { useEffect, useState } from 'react';
import {
  Shield, ShieldCheck, Lock, Key, Users, FileText,
  CheckCircle2, XCircle, Brain, Sparkles, Eye, Download,
  Activity, Server, Cpu, Zap, Fingerprint, RefreshCw,
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardTitle } from '../ui/Card';
import { Button, Badge } from '../ui/Button';
import { Sparkline } from '../ui/Sparkline';
import { generateAuditLogs, generateSparkline } from '../../lib/mock-data';
import { useAuth } from '../../context/useAuth';
import { cn, statusColor } from '../../lib/utils';
import type { UserRole } from '../../types';

const ROLES: { role: UserRole; label: string; permissions: string[]; color: string }[] = [
  { role: 'commander', label: 'Commander', color: '#1f6fff', permissions: ['view_all', 'approve_actions', 'deploy_resources', 'broadcast', 'manage_users', 'view_audit', 'export_data', 'config_change'] },
  { role: 'operations', label: 'Operations', color: '#00e890', permissions: ['view_all', 'approve_actions', 'deploy_resources', 'broadcast', 'view_audit'] },
  { role: 'security', label: 'Security', color: '#e61e1e', permissions: ['view_security', 'manage_incidents', 'view_audit', 'escalate'] },
  { role: 'volunteer', label: 'Volunteer', color: '#4d8fff', permissions: ['view_assigned', 'update_tasks', 'report_incidents'] },
  { role: 'transport', label: 'Transport', color: '#a855f7', permissions: ['view_transport', 'reroute', 'coordinate'] },
  { role: 'sustainability', label: 'Sustainability', color: '#22c55e', permissions: ['view_sustainability', 'optimize_energy'] },
];

const ALL_PERMISSIONS = [
  { id: 'view_all', label: 'View All Dashboards' },
  { id: 'approve_actions', label: 'Approve AI Actions' },
  { id: 'deploy_resources', label: 'Deploy Resources' },
  { id: 'broadcast', label: 'Broadcast Messages' },
  { id: 'manage_users', label: 'Manage Users' },
  { id: 'view_audit', label: 'View Audit Logs' },
  { id: 'export_data', label: 'Export Data' },
  { id: 'config_change', label: 'Change Configuration' },
  { id: 'view_security', label: 'View Security Data' },
  { id: 'manage_incidents', label: 'Manage Incidents' },
  { id: 'escalate', label: 'Escalate Incidents' },
  { id: 'view_assigned', label: 'View Assigned Tasks' },
  { id: 'update_tasks', label: 'Update Tasks' },
  { id: 'report_incidents', label: 'Report Incidents' },
  { id: 'view_transport', label: 'View Transport' },
  { id: 'reroute', label: 'Reroute Vehicles' },
  { id: 'view_sustainability', label: 'View Sustainability' },
  { id: 'optimize_energy', label: 'Optimize Energy' },
];

export function SecurityCenter() {
  const { user } = useAuth();
  const [logs] = useState(() => generateAuditLogs(15));
  const [filter, setFilter] = useState<'all' | 'success' | 'denied' | 'error'>('all');
  const [threatData, setThreatData] = useState(() => generateSparkline(20, 4, 6));

  useEffect(() => {
    const t = setInterval(() => {
      setThreatData((p) => [...p.slice(1), Math.max(0, Math.min(15, p[p.length - 1] + (Math.random() - 0.5) * 3))]);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const filteredLogs = filter === 'all' ? logs : logs.filter((l) => l.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Shield className="w-7 h-7 text-alert-400" /> Security Center
          </h1>
          <p className="text-sm text-ink-400 mt-1">JWT · RBAC · Audit logs · AI guardrails · Prompt injection protection</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success"><ShieldCheck size={10} /> All systems secure</Badge>
          <Badge variant="info"><Lock size={10} /> E2E encrypted</Badge>
        </div>
      </div>

      {/* Security KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Threats Blocked', value: '1,247', icon: Shield, color: '#e61e1e' },
          { label: 'Prompt Injections', value: '218', icon: Brain, color: '#ff8c00' },
          { label: 'Auth Attempts', value: '8,432', icon: Key, color: '#4d8fff' },
          { label: 'Failed Logins', value: '23', icon: XCircle, color: '#ff8c00' },
          { label: 'Active Sessions', value: '142', icon: Users, color: '#00e890' },
          { label: 'Encryption', value: 'AES-256', icon: Lock, color: '#a855f7' },
        ].map((k) => (
          <Card key={k.label} hover>
            <div className="p-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2" style={{ background: `${k.color}15`, color: k.color }}>
                <k.icon className="w-4 h-4" />
              </div>
              <p className="font-display text-xl font-bold text-ink-50 tabular-nums">{k.value}</p>
              <p className="text-xs text-ink-400">{k.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Threat monitor + Guardrails */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-alert-400" /> Real-time Threat Monitor
              </CardTitle>
              <Badge variant="success"><span className="w-1.5 h-1.5 rounded-full bg-pitch-400 animate-pulse" /> Monitoring</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-ink-400 mb-2">Threats detected (per hour)</p>
                <Sparkline data={threatData} color="#e61e1e" width={500} height={80} />
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-ink-400">Current: <span className="text-alert-400 font-bold tabular-nums">{Math.round(threatData[threatData.length - 1])}</span>/hr</span>
                  <span className="text-ink-400">Peak: <span className="text-ink-200 tabular-nums">{Math.round(Math.max(...threatData))}</span>/hr</span>
                  <span className="text-pitch-400">All blocked</span>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { type: 'Prompt Injection', count: 218, status: 'blocked', icon: Brain },
                  { type: 'SQL Injection', count: 0, status: 'blocked', icon: Server },
                  { type: 'XSS Attempts', count: 12, status: 'blocked', icon: Eye },
                  { type: 'CSRF Attacks', count: 4, status: 'blocked', icon: RefreshCw },
                  { type: 'Brute Force', count: 23, status: 'blocked', icon: Key },
                  { type: 'DDoS Mitigated', count: 8, status: 'blocked', icon: Zap },
                ].map((t) => (
                  <div key={t.type} className="p-3 rounded-lg bg-ink-900/40 border border-ink-700/50">
                    <div className="flex items-center justify-between mb-1">
                      <t.icon className="w-4 h-4 text-alert-400" />
                      <Badge variant="success"><CheckCircle2 size={9} /> blocked</Badge>
                    </div>
                    <p className="text-sm font-medium text-ink-100">{t.type}</p>
                    <p className="text-xs text-ink-400">{t.count} attempts</p>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* AI Guardrails */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pitch-400" /> AI Safety Guardrails
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {[
                { guard: 'Prompt Injection Detection', status: 'active', detail: 'Regex + ML model' },
                { guard: 'Input Sanitization', status: 'active', detail: 'XSS + SQL safe' },
                { guard: 'Output Validation', status: 'active', detail: 'Schema enforced' },
                { guard: 'PII Redaction', status: 'active', detail: 'Auto-detected' },
                { guard: 'Toxicity Filter', status: 'active', detail: '8 languages' },
                { guard: 'Hallucination Check', status: 'active', detail: 'Grounded RAG' },
                { guard: 'Rate Limiting', status: 'active', detail: '100 req/min' },
                { guard: 'Token Budget', status: 'active', detail: '4K tokens/query' },
                { guard: 'Content Policy', status: 'active', detail: 'FIFA guidelines' },
                { guard: 'Audit Trail', status: 'active', detail: 'Every query logged' },
              ].map((g) => (
                <div key={g.guard} className="flex items-center justify-between p-2.5 rounded-lg bg-ink-900/40">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-pitch-400" />
                    <div>
                      <p className="text-sm text-ink-100">{g.guard}</p>
                      <p className="text-[10px] text-ink-500">{g.detail}</p>
                    </div>
                  </div>
                  <Badge variant="success">active</Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* RBAC matrix */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-nexus-400" /> Role-Based Access Control
            </CardTitle>
            <Badge variant="info">{ROLES.length} roles · {ALL_PERMISSIONS.length} permissions</Badge>
          </div>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-700">
                  <th className="text-left p-2 text-xs text-ink-400 font-medium">Permission</th>
                  {ROLES.map((r) => (
                    <th key={r.role} className="p-2 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${r.color}15`, color: r.color }}>
                          <Users className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs text-ink-300">{r.label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_PERMISSIONS.map((p) => (
                  <tr key={p.id} className="border-b border-ink-800 hover:bg-ink-800/30">
                    <td className="p-2 text-ink-200">{p.label}</td>
                    {ROLES.map((r) => {
                      const has = r.permissions.includes(p.id);
                      return (
                        <td key={r.role} className="p-2 text-center">
                          {has ? (
                            <CheckCircle2 className="w-4 h-4 text-pitch-400 mx-auto" />
                          ) : (
                            <XCircle className="w-4 h-4 text-ink-700 mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {user && (
            <div className="mt-4 p-3 rounded-lg bg-nexus-500/10 border border-nexus-500/30">
              <p className="text-xs font-semibold text-nexus-300 mb-1">Your role: {user.role}</p>
              <p className="text-xs text-ink-200">You have {ROLES.find((r) => r.role === user.role)?.permissions.length ?? 0} permissions. All actions are logged to the audit trail.</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Audit logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-nexus-400" /> Audit Logs
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {(['all', 'success', 'denied', 'error'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors capitalize',
                      filter === f ? 'bg-nexus-500/15 border-nexus-500/40 text-nexus-200' : 'bg-ink-900/40 border-ink-700 text-ink-400 hover:text-ink-200',
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <Button variant="ghost" size="sm"><Download size={12} /> Export</Button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-1.5 max-h-96 overflow-y-auto">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-ink-900/40 hover:bg-ink-800/50 transition-colors">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: statusColor(log.status), boxShadow: `0 0 6px ${statusColor(log.status)}` }}
                />
                <span className="text-xs font-mono text-ink-500 tabular-nums shrink-0 w-20">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-ink-200">{log.userName}</span>
                    <span className="text-xs text-ink-400">{log.action}</span>
                    <span className="text-xs text-ink-500 font-mono">{log.resource}</span>
                  </div>
                  <p className="text-xs text-ink-500 mt-0.5">{log.details}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-ink-500 font-mono">{log.ip}</span>
                  <Badge
                    variant={log.status === 'success' ? 'success' : log.status === 'denied' ? 'warning' : 'danger'}
                  >
                    {log.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Encryption + Data privacy */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-pitch-400" /> Encryption & Data Protection
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {[
                { label: 'At Rest Encryption', value: 'AES-256-GCM', status: 'active' },
                { label: 'In Transit Encryption', value: 'TLS 1.3', status: 'active' },
                { label: 'JWT Signing', value: 'RS256', status: 'active' },
                { label: 'Password Hashing', value: 'bcrypt (12 rounds)', status: 'active' },
                { label: 'PII Redaction', value: 'Automatic', status: 'active' },
                { label: 'Data Retention', value: '90 days', status: 'compliant' },
                { label: 'GDPR Compliance', value: 'Verified', status: 'compliant' },
                { label: 'SOC 2 Type II', value: 'Certified', status: 'compliant' },
              ].map((e) => (
                <div key={e.label} className="flex items-center justify-between p-2.5 rounded-lg bg-ink-900/40">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-pitch-400" />
                    <span className="text-sm text-ink-100">{e.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ink-400 font-mono">{e.value}</span>
                    <CheckCircle2 className="w-4 h-4 text-pitch-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-nexus-400" /> API Gateway Security
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-ink-400 mb-2">Request validation pipeline</p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {['JWT Verify', 'RBAC Check', 'Rate Limit', 'Input Sanitize', 'Schema Validate', 'AI Guardrail', 'Audit Log', 'Response'].map((step, i) => (
                    <div key={step} className="flex items-center gap-1.5">
                      <div className="px-2.5 py-1.5 rounded-lg bg-pitch-500/10 border border-pitch-500/30 text-xs text-ink-100">
                        {step}
                      </div>
                      {i < 7 && <span className="text-ink-600 text-xs">→</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Requests Today', value: '2.4M' },
                  { label: 'Avg Latency', value: '42ms' },
                  { label: 'Blocked', value: '1,247' },
                  { label: 'Cache Hit Rate', value: '87%' },
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded-lg bg-ink-900/40">
                    <p className="text-xs text-ink-500">{s.label}</p>
                    <p className="font-display text-lg font-bold text-ink-50">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-lg bg-nexus-500/10 border border-nexus-500/30">
                <p className="text-xs font-semibold text-nexus-300 mb-1">Edge-Ready Architecture</p>
                <p className="text-xs text-ink-200">API deployed to 16 edge regions. P95 latency under 50ms globally. Auto-scaling handles 100K+ concurrent connections.</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
