import { useEffect, useState } from 'react';
import {
  Command, Users, Shield, Heart, Hand, Bus, Leaf, ArrowRight, Activity, Globe,
  Accessibility, Brain, TrendingUp, Radio, Lock, CheckCircle2,
  Sparkles, ChevronRight, Play, Cpu, Network, Database, Layers,
  Navigation, TrendingDown, Smile,
} from 'lucide-react';
import { Button, Badge } from '../ui/Button';
import { Card } from '../ui/Card';
import { IMPACT_METRICS, AI_AGENTS_INFO } from '../../lib/mock-data';
import { cn } from '../../lib/utils';

interface LandingProps {
  onEnter: () => void;
  onSignIn: () => void;
}

const ICONS: Record<string, typeof Command> = {
  Command, Users, Shield, Heart, Hand, Bus, Leaf, Navigation, Accessibility, TrendingDown, Smile,
};

export function Landing({ onEnter, onSignIn }: LandingProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { id: 'problem', label: 'Problem' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'agents', label: 'AI Agents' },
    { id: 'features', label: 'Features' },
    { id: 'impact', label: 'Impact' },
  ];

  return (
    <div className="min-h-screen bg-ink-950 text-ink-50 bg-stadium-grid">
      {/* Nav */}
      <nav
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          scrollY > 40 ? 'glass-strong border-b border-ink-700/50' : 'bg-transparent',
        )}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-nexus-500 via-pitch-500 to-flame-500 flex items-center justify-center shadow-glow">
              <Activity className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-xl bg-nexus-500/30 animate-ping-slow" />
            </div>
            <div>
              <p className="font-display font-bold text-lg leading-none">FIFA Nexus AI</p>
              <p className="text-[10px] text-ink-400 uppercase tracking-widest">World Cup 2026</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className="px-4 py-2 text-sm text-ink-300 hover:text-ink-50 hover:bg-ink-800/50 rounded-lg transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onSignIn}>Sign In</Button>
            <Button size="sm" onClick={onEnter}>
              Launch Platform <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="absolute inset-0 bg-stadium-grid opacity-40" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nexus-500/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pitch-500/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-flame-500/15 rounded-full blur-[100px] animate-pulse-slow" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <Badge variant="info" className="mb-6">
              <Sparkles size={12} /> Generative AI · Digital Twin · Multi-Agent
            </Badge>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
              The AI brain behind the
              <span className="block gradient-text mt-2">World Cup 2026</span>
            </h1>
            <p className="mt-6 text-lg text-ink-300 max-w-xl leading-relaxed">
              FIFA Nexus AI is an end-to-end generative AI ecosystem that powers stadium operations, fan experience, and real-time decision intelligence across 16 host cities — built on a Digital Twin Stadium and 7 autonomous AI agents.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={onEnter}>
                Enter Command Center <ArrowRight size={16} />
              </Button>
              <Button variant="outline" size="lg" onClick={onSignIn}>
                <Play size={16} /> Watch Demo
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                { label: 'Live Fans', value: '78K' },
                { label: 'AI Agents', value: '7' },
                { label: 'Languages', value: '8' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl font-bold text-ink-50">{s.value}</p>
                  <p className="text-xs text-ink-400 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual: stadium twin */}
          <div className="relative animate-fade-in">
            <HeroStadiumVisual />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink-500">
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <ChevronRight size={20} className="rotate-90 animate-bounce" />
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            kicker="The Challenge"
            title="Operating the largest sporting event in history"
            subtitle="48 teams. 104 matches. 16 cities. 5.5 million fans. The 2026 World Cup faces operational complexity no human team can manage alone."
          />
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, stat: '78K+', label: 'Fans per stadium', desc: 'Crowd density exceeds safe thresholds within minutes. Manual monitoring is reactive, not predictive.', color: '#ff8c00' },
              { icon: TrendingUp, stat: '12 min', label: 'Average incident response', desc: 'Without AI coordination, security and medical incidents take too long to detect and resolve.', color: '#e61e1e' },
              { icon: Globe, stat: '95+ languages', label: 'Spoken by fans', desc: 'Language barriers prevent effective communication of safety, navigation, and emergency info.', color: '#4d8fff' },
              { icon: Accessibility, stat: '15% of fans', label: 'Need accessibility support', desc: 'Wheelchair routes, visual/hearing assistance, and cognitive load require dedicated intelligence.', color: '#00e890' },
            ].map((p) => (
              <Card key={p.label} hover className="animate-slide-up" >
                <div className="p-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${p.color}15`, color: p.color }}
                  >
                    <p.icon className="w-6 h-6" />
                  </div>
                  <p className="font-display text-3xl font-bold" style={{ color: p.color }}>{p.stat}</p>
                  <p className="text-sm font-medium text-ink-200 mt-1">{p.label}</p>
                  <p className="text-sm text-ink-400 mt-3 leading-relaxed">{p.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" className="py-24 relative bg-ink-900/40">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            kicker="System Architecture"
            title="A multi-agent generative AI ecosystem"
            subtitle="Seven specialized AI agents collaborate through an event-driven backbone, powered by a real-time Digital Twin of the stadium."
          />
          <ArchitectureDiagram />
        </div>
      </section>

      {/* AI Agents */}
      <section id="agents" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            kicker="AI Agents"
            title="Seven specialized AI agents"
            subtitle="Each agent is purpose-built for a domain, with its own models, guardrails, and action space — coordinated by the Operations Commander."
          />
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AI_AGENTS_INFO.map((agent) => {
              const Icon = ICONS[agent.icon] ?? Command;
              return (
                <Card key={agent.id} hover className="animate-slide-up" >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: `${agent.color}15`, color: agent.color }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant="success">
                        <span className="w-1.5 h-1.5 rounded-full bg-pitch-400 animate-pulse" /> Online
                      </Badge>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-ink-50">{agent.name}</h3>
                    <p className="text-sm text-ink-400 mt-2 leading-relaxed">{agent.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {agent.capabilities.slice(0, 3).map((c) => (
                        <span key={c} className="text-[10px] px-2 py-1 rounded-md bg-ink-800 text-ink-300 border border-ink-700">
                          {c}
                        </span>
                      ))}
                      {agent.capabilities.length > 3 && (
                        <span className="text-[10px] px-2 py-1 rounded-md bg-ink-800 text-ink-400">
                          +{agent.capabilities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-ink-900/40">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            kicker="GenAI Features"
            title="Eight generative AI capabilities"
            subtitle="From natural language fan copilot to predictive crowd intelligence — every feature is generative, real-time, and explainable."
          />
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'AI Fan Copilot', desc: 'Natural language chat, voice, smart navigation, F&B recommendations, personalized journey planning.', color: '#00e890' },
              { icon: Users, title: 'Crowd Intelligence', desc: 'Density heatmaps, queue prediction, 30-min congestion forecasting, AI-generated mitigation plans.', color: '#ff8c00' },
              { icon: Command, title: 'Operations Command', desc: 'Executive dashboard, NL analytics, incident summarization, predictive risk alerts, recommended actions.', color: '#1f6fff' },
              { icon: Hand, title: 'Volunteer Copilot', desc: 'Dynamic task assignment, real-time instructions, shift summaries, incident reporting.', color: '#4d8fff' },
              { icon: Globe, title: 'Multilingual AI', desc: 'Voice & text translation across 8 languages. AI-generated announcements in real time.', color: '#a855f7' },
              { icon: Accessibility, title: 'Accessibility First', desc: 'Voice navigation, screen-reader support, keyboard-only, wheelchair route optimization, high contrast.', color: '#00e890' },
              { icon: Bus, title: 'Smart Transportation', desc: 'Metro, bus, parking integration. Exit flow prediction. Dynamic rerouting.', color: '#a855f7' },
              { icon: Leaf, title: 'Sustainability', desc: 'Energy optimization, waste prediction, water management, real-time carbon dashboard.', color: '#22c55e' },
            ].map((f) => (
              <Card key={f.title} hover className="animate-slide-up">
                <div className="p-5">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: `${f.color}15`, color: f.color }}
                  >
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-semibold text-ink-50">{f.title}</h3>
                  <p className="text-sm text-ink-400 mt-2 leading-relaxed">{f.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            kicker="Impact Metrics"
            title="Measurable outcomes at global scale"
            subtitle="Validated against baseline operations across simulated match-day scenarios."
          />
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {IMPACT_METRICS.map((m) => {
              const Icon = ICONS[m.icon] ?? TrendingUp;
              return (
                <Card key={m.label} hover className="animate-slide-up">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: `${m.color}15`, color: m.color }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <span className="font-display text-4xl font-bold" style={{ color: m.color }}>
                          {m.value}
                        </span>
                        <span className="text-xl font-bold ml-1" style={{ color: m.color }}>{m.unit}</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-ink-200">{m.label}</p>
                    <div className="mt-3 h-1.5 bg-ink-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${m.value}%`, background: `linear-gradient(90deg, ${m.color}80, ${m.color})` }}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security & Quality */}
      <section className="py-24 bg-ink-900/40">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            kicker="Built for Production"
            title="Enterprise-grade security and code quality"
            subtitle="JWT auth, RBAC, end-to-end encryption, AI safety guardrails, prompt injection protection, and a full testing dashboard."
          />
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Lock, title: 'JWT + RBAC', desc: 'Role-based access control across 6 roles with signed JWT sessions.' },
              { icon: Shield, title: 'AI Guardrails', desc: 'Prompt injection detection, input sanitization, output validation.' },
              { icon: Database, title: 'Audit Logging', desc: 'Every action logged with user, IP, resource, and outcome.' },
              { icon: CheckCircle2, title: 'Test Coverage', desc: '94% unit, 87% integration, 78% E2E, 100% a11y, 100% security.' },
            ].map((s) => (
              <Card key={s.title} hover>
                <div className="p-5">
                  <s.icon className="w-6 h-6 text-nexus-400 mb-3" />
                  <h3 className="font-display font-semibold text-ink-50">{s.title}</h3>
                  <p className="text-sm text-ink-400 mt-1">{s.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Badge variant="pitch" className="mb-6">
            <Sparkles size={12} /> Ready to deploy
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            Step into the
            <span className="gradient-text"> FIFA Nexus AI Command Center</span>
          </h2>
          <p className="mt-6 text-lg text-ink-300">
            Explore the live operations dashboard, chat with AI agents, monitor the Digital Twin, and see how generative AI transforms stadium operations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={onEnter}>
              Launch Platform <ArrowRight size={16} />
            </Button>
            <Button variant="outline" size="lg" onClick={onSignIn}>
              Sign in with role
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-800 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-nexus-500 via-pitch-500 to-flame-500 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <p className="font-display font-bold">FIFA Nexus AI</p>
            </div>
            <p className="text-sm text-ink-400">Generative AI ecosystem for FIFA World Cup 2026 operations.</p>
          </div>
          {[
            { title: 'Platform', links: ['Command Center', 'Digital Twin', 'Fan Copilot', 'Volunteer Copilot'] },
            { title: 'Intelligence', links: ['Crowd AI', 'Security AI', 'Transport AI', 'Sustainability AI'] },
            { title: 'Engineering', links: ['Architecture', 'Security', 'Testing', 'API Docs'] },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-ink-200 mb-3">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <button onClick={onEnter} className="text-sm text-ink-400 hover:text-ink-50 transition-colors">
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-ink-800 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-ink-500">© 2026 FIFA Nexus AI. Built for the FIFA World Cup 2026 hackathon.</p>
          <div className="flex items-center gap-4 text-xs text-ink-500">
            <span className="flex items-center gap-1"><Cpu size={12} /> 96.8% AI accuracy</span>
            <span className="flex items-center gap-1"><Radio size={12} /> 99.99% uptime</span>
            <span className="flex items-center gap-1"><Lock size={12} /> SOC 2 ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ kicker, title, subtitle }: { kicker: string; title: string; subtitle: string }) {
  return (
    <div className="max-w-3xl">
      <Badge variant="info" className="mb-4">
        <Sparkles size={12} /> {kicker}
      </Badge>
      <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">{title}</h2>
      <p className="mt-4 text-lg text-ink-300">{subtitle}</p>
    </div>
  );
}

function HeroStadiumVisual() {
  return (
    <div className="relative aspect-square max-w-lg mx-auto">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-nexus-500/20 via-pitch-500/10 to-flame-500/20 blur-3xl" />
      <svg viewBox="0 0 400 400" className="relative w-full h-full">
        <defs>
          <radialGradient id="pitch-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00e890" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00e890" stopOpacity="0.05" />
          </radialGradient>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4d8fff" />
            <stop offset="50%" stopColor="#00e890" />
            <stop offset="100%" stopColor="#ff8c00" />
          </linearGradient>
        </defs>
        {/* Outer rings */}
        {[180, 150, 120, 90].map((r, i) => (
          <circle
            key={r}
            cx="200"
            cy="200"
            r={r}
            fill="none"
            stroke="url(#ring-grad)"
            strokeWidth="1"
            strokeOpacity={0.3 - i * 0.05}
            className="animate-spin-slow"
            style={{ transformOrigin: 'center', animationDuration: `${20 + i * 5}s` }}
          />
        ))}
        {/* Stadium oval */}
        <ellipse cx="200" cy="200" rx="170" ry="140" fill="url(#pitch-grad)" stroke="#1f6fff" strokeWidth="2" strokeOpacity="0.4" />
        {/* Pitch */}
        <rect x="140" y="160" width="120" height="80" rx="4" fill="#00e890" fillOpacity="0.08" stroke="#00e890" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="200" y1="160" x2="200" y2="240" stroke="#00e890" strokeOpacity="0.4" />
        <circle cx="200" cy="200" r="12" fill="none" stroke="#00e890" strokeOpacity="0.5" />
        <circle cx="200" cy="200" r="3" fill="#00e890" />
        {/* Crowd dots */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i / 60) * Math.PI * 2;
          const r = 150 + Math.sin(i * 7) * 12;
          const x = 200 + Math.cos(angle) * r;
          const y = 200 + Math.sin(angle) * r * 0.82;
          const colors = ['#4d8fff', '#00e890', '#ff8c00', '#e61e1e'];
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill={colors[i % 4]}
              fillOpacity={0.6 + Math.sin(i) * 0.3}
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          );
        })}
        {/* AI nodes */}
        {[
          { x: 200, y: 60, label: 'OPS', color: '#1f6fff' },
          { x: 340, y: 200, label: 'CROWD', color: '#ff8c00' },
          { x: 200, y: 340, label: 'SEC', color: '#e61e1e' },
          { x: 60, y: 200, label: 'FAN', color: '#00e890' },
          { x: 320, y: 80, label: 'VOL', color: '#4d8fff' },
          { x: 320, y: 320, label: 'TRANS', color: '#a855f7' },
          { x: 80, y: 320, label: 'SUST', color: '#22c55e' },
        ].map((n) => (
          <g key={n.label}>
            <circle cx={n.x} cy={n.y} r="14" fill={n.color} fillOpacity="0.15" stroke={n.color} strokeWidth="1.5" />
            <circle cx={n.x} cy={n.y} r="6" fill={n.color} className="animate-pulse" />
            <text x={n.x} y={n.y - 22} textAnchor="middle" className="fill-ink-200" style={{ fontSize: 9, fontWeight: 600 }}>
              {n.label}
            </text>
          </g>
        ))}
        {/* Connection lines */}
        {[
          { x: 200, y: 60, color: '#1f6fff' },
          { x: 340, y: 200, color: '#ff8c00' },
          { x: 200, y: 340, color: '#e61e1e' },
          { x: 60, y: 200, color: '#00e890' },
          { x: 320, y: 80, color: '#4d8fff' },
          { x: 320, y: 320, color: '#a855f7' },
          { x: 80, y: 320, color: '#22c55e' },
        ].map((n, i) => (
          <line
            key={i}
            x1="200"
            y1="200"
            x2={n.x}
            y2={n.y}
            stroke={n.color}
            strokeOpacity="0.2"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        ))}
        {/* Center pulse */}
        <circle cx="200" cy="200" r="20" fill="#1f6fff" fillOpacity="0.2" className="animate-ping-slow" />
        <circle cx="200" cy="200" r="8" fill="#1f6fff" />
      </svg>
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass-strong rounded-full px-4 py-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-pitch-400 animate-pulse" />
        <span className="text-xs text-ink-200 font-medium">Digital Twin · Live</span>
      </div>
    </div>
  );
}

function ArchitectureDiagram() {
  const layers = [
    {
      title: 'Presentation Layer',
      icon: Layers,
      color: '#4d8fff',
      items: ['Command Center', 'Fan App', 'Volunteer App', 'Digital Twin 3D'],
    },
    {
      title: 'AI Agent Layer',
      icon: Brain,
      color: '#00e890',
      items: ['Ops Commander', 'Crowd Mgmt', 'Security', 'Fan Experience', 'Volunteer', 'Transport', 'Sustainability'],
    },
    {
      title: 'Generative AI Services',
      icon: Sparkles,
      color: '#ff8c00',
      items: ['LLM Orchestrator', 'Translation Engine', 'Vision Models', 'Forecasting Models', 'Safety Guardrails'],
    },
    {
      title: 'Event-Driven Backbone',
      icon: Network,
      color: '#a855f7',
      items: ['Message Queue', 'Stream Processing', 'Event Sourcing', 'Real-time Pub/Sub'],
    },
    {
      title: 'Data & Security Layer',
      icon: Database,
      color: '#e61e1e',
      items: ['PostgreSQL (Supabase)', 'Time-series DB', 'Redis Cache', 'JWT Auth + RBAC', 'Audit Logs'],
    },
  ];
  return (
    <div className="mt-16 space-y-3">
      {layers.map((layer, i) => (
        <div key={layer.title} className="animate-slide-in" style={{ animationDelay: `${i * 100}ms` }}>
          <Card>
            <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-3 md:w-64 shrink-0">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${layer.color}15`, color: layer.color }}
                >
                  <layer.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-ink-400 uppercase tracking-wider">Layer {i + 1}</p>
                  <p className="font-display font-semibold text-ink-50">{layer.title}</p>
                </div>
              </div>
              <div className="flex-1 flex flex-wrap gap-2">
                {layer.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 rounded-lg text-sm bg-ink-800/60 border border-ink-700 text-ink-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Card>
          {i < layers.length - 1 && (
            <div className="flex justify-center py-1">
              <div className="w-px h-6 bg-gradient-to-b from-ink-600 to-transparent" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
