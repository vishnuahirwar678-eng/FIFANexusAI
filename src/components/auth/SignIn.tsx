import { useState } from 'react';
import { Activity, ArrowRight, Lock, Mail, Shield, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAuth } from '../../context/useAuth';
import { DEMO_CREDENTIALS } from '../../lib/demo-credentials';
import { cn } from '../../lib/utils';

interface SignInProps {
  onBack: () => void;
  onEnter: () => void;
}

export function SignIn({ onBack, onEnter }: SignInProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      onEnter();
    }
  };

  const handleDemo = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
    setLoading(true);
    const result = await signIn(demoEmail, demoPassword);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      onEnter();
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 bg-stadium-grid flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nexus-500/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pitch-500/20 rounded-full blur-[120px] animate-pulse-slow" />

      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left: branding */}
        <div className="hidden lg:block animate-slide-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-nexus-500 via-pitch-500 to-flame-500 flex items-center justify-center shadow-glow">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-xl">FIFA Nexus AI</p>
              <p className="text-xs text-ink-400 uppercase tracking-widest">World Cup 2026</p>
            </div>
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight">
            Sign in to the
            <span className="block gradient-text mt-2">Command Center</span>
          </h1>
          <p className="mt-4 text-ink-300 max-w-md">
            Role-based access control ensures every user sees exactly what they need — from executive dashboards to volunteer task lists.
          </p>
          <div className="mt-8 space-y-3">
            {[
              { icon: Lock, label: 'JWT authentication with signed sessions' },
              { icon: Shield, label: 'Role-based access control (6 roles)' },
              { icon: Zap, label: 'AI guardrails on every agent' },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3 text-sm text-ink-300">
                <div className="w-8 h-8 rounded-lg bg-nexus-500/15 text-nexus-400 flex items-center justify-center">
                  <f.icon className="w-4 h-4" />
                </div>
                {f.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <Card className="glass-strong animate-slide-up">
          <div className="p-8">
            <h2 className="font-display text-2xl font-bold mb-1">Welcome back</h2>
            <p className="text-sm text-ink-400 mb-6">Sign in to access your dashboard</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink-200 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="commander@fifanexus.ai"
                    required
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 bg-ink-900/60 border border-ink-700 rounded-xl text-ink-50 placeholder-ink-500 focus:border-nexus-500 focus:ring-1 focus:ring-nexus-500 outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-ink-200 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full pl-10 pr-4 py-2.5 bg-ink-900/60 border border-ink-700 rounded-xl text-ink-50 placeholder-ink-500 focus:border-nexus-500 focus:ring-1 focus:ring-nexus-500 outline-none transition-colors"
                  />
                </div>
              </div>
              {error && (
                <div className="text-sm text-alert-300 bg-alert-500/10 border border-alert-500/30 rounded-lg p-3" role="alert">
                  {error}
                </div>
              )}
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={16} />
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-ink-700/50">
              <p className="text-xs text-ink-400 mb-3 uppercase tracking-wider">Demo accounts — click to sign in</p>
              <div className="grid gap-2">
                {DEMO_CREDENTIALS.map((c) => (
                  <button
                    key={c.email}
                    onClick={() => handleDemo(c.email, c.password)}
                    disabled={loading}
                    className={cn(
                      'flex items-center justify-between p-2.5 rounded-lg bg-ink-900/40 border border-ink-700/50 hover:border-nexus-500/40 hover:bg-ink-800/50 transition-all text-left disabled:opacity-50',
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium text-ink-100">{c.name}</p>
                      <p className="text-xs text-ink-400">{c.email}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-md bg-nexus-500/15 text-nexus-300 border border-nexus-500/30">
                      {c.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={onBack}
              className="mt-6 text-sm text-ink-400 hover:text-ink-200 transition-colors"
            >
              ← Back to home
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
