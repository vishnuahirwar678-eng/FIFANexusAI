import { useEffect, useState, type ReactNode } from 'react';
import {
  Activity, LayoutDashboard, Boxes, Heart, Users, Hand, Bus, Leaf,
  ShieldCheck, FlaskConical, Menu, X, Bell, Search, Globe,
  Accessibility, Sun, Volume2, ChevronDown, LogOut, User as UserIcon, Radio,
  Brain, WifiOff, BarChart3, Navigation, Target, Languages,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { AGENTS, LANGUAGES } from '../../lib/mock-data';
import { cn, statusColor } from '../../lib/utils';
import { Badge } from '../ui/Button';

export type ViewId =
  | 'command'
  | 'digital-twin'
  | 'fan-copilot'
  | 'crowd'
  | 'volunteer'
  | 'transport'
  | 'sustainability'
  | 'security'
  | 'testing'
  | 'explainable-ai'
  | 'offline-emergency'
  | 'monitoring'
  | 'kpi-roi'
  | 'operational-intelligence'
  | 'navigation'
  | 'accessibility'
  | 'multilingual'
  | 'alignment';

interface NavItem {
  id: ViewId;
  label: string;
  icon: typeof LayoutDashboard;
  roles: string[];
  badge?: string;
}

const NAV: NavItem[] = [
  { id: 'command', label: 'Command Center', icon: LayoutDashboard, roles: ['commander', 'operations', 'security', 'volunteer', 'fan', 'transport', 'sustainability'] },
  { id: 'digital-twin', label: 'Digital Twin', icon: Boxes, roles: ['commander', 'operations', 'security'] },
  { id: 'fan-copilot', label: 'Fan Copilot', icon: Heart, roles: ['commander', 'operations', 'fan', 'volunteer'] },
  { id: 'crowd', label: 'Crowd Intelligence', icon: Users, roles: ['commander', 'operations', 'security'], badge: 'AI' },
  { id: 'volunteer', label: 'Volunteer Copilot', icon: Hand, roles: ['commander', 'operations', 'volunteer'] },
  { id: 'transport', label: 'Transport', icon: Bus, roles: ['commander', 'operations', 'transport'] },
  { id: 'sustainability', label: 'Sustainability', icon: Leaf, roles: ['commander', 'operations', 'sustainability'] },
  { id: 'security', label: 'Security Center', icon: ShieldCheck, roles: ['commander', 'security'] },
  { id: 'operational-intelligence', label: 'Operational Intelligence', icon: Brain, roles: ['commander', 'operations', 'security'], badge: 'AI' },
  { id: 'explainable-ai', label: 'Explainable AI', icon: Brain, roles: ['commander', 'operations', 'security'] },
  { id: 'kpi-roi', label: 'KPI & ROI', icon: BarChart3, roles: ['commander', 'operations'] },
  { id: 'monitoring', label: 'Monitoring', icon: Activity, roles: ['commander', 'operations'] },
  { id: 'offline-emergency', label: 'Offline Emergency', icon: WifiOff, roles: ['commander', 'operations', 'security', 'volunteer'] },
  { id: 'testing', label: 'Testing Dashboard', icon: FlaskConical, roles: ['commander', 'operations'] },
  { id: 'navigation', label: 'Indoor Navigation', icon: Navigation, roles: ['commander', 'operations', 'security', 'volunteer', 'fan'] },
  { id: 'accessibility', label: 'Accessibility Center', icon: Accessibility, roles: ['commander', 'operations', 'volunteer', 'fan'] },
  { id: 'multilingual', label: 'Multilingual AI', icon: Languages, roles: ['commander', 'operations', 'volunteer', 'fan'], badge: '8' },
  { id: 'alignment', label: 'Challenge Alignment', icon: Target, roles: ['commander', 'operations'] },
];

interface AppShellProps {
  current: ViewId;
  onNavigate: (v: ViewId) => void;
  onExit: () => void;
  children: ReactNode;
}

export function AppShell({ current, onNavigate, onExit, children }: AppShellProps) {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  const visibleNav = NAV.filter((n) => !user || n.roles.includes(user.role));
  const activeAlerts = 3;

  return (
    <div className="min-h-screen bg-ink-950 text-ink-50 flex">
      {/* Skip link target */}
      <div id="main-content" className="sr-only" />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen w-64 glass-strong border-r border-ink-700/50 flex flex-col transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="p-5 border-b border-ink-700/50">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-nexus-500 via-pitch-500 to-flame-500 flex items-center justify-center shadow-glow shrink-0">
              <Activity className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-xl bg-nexus-500/30 animate-ping-slow" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-sm leading-tight truncate">FIFA Nexus AI</p>
              <p className="text-[10px] text-ink-400 uppercase tracking-widest">Command Center</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Main navigation">
          {visibleNav.map((item) => {
            const active = current === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setSidebarOpen(false);
                }}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                  active
                    ? 'bg-nexus-500/15 text-nexus-200 border border-nexus-500/30 shadow-glow'
                    : 'text-ink-300 hover:bg-ink-800/60 hover:text-ink-50 border border-transparent',
                )}
              >
                <item.icon className={cn('w-4 h-4 shrink-0', active ? 'text-nexus-300' : 'text-ink-400 group-hover:text-ink-200')} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-pitch-500/20 text-pitch-300 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Agent status mini */}
        <div className="p-3 border-t border-ink-700/50">
          <p className="text-[10px] text-ink-500 uppercase tracking-wider mb-2 px-1">AI Agents</p>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {AGENTS.slice(0, 4).map((a) => (
              <div key={a.id} className="flex items-center gap-2 px-1">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: statusColor(a.status), boxShadow: `0 0 6px ${statusColor(a.status)}` }}
                />
                <span className="text-xs text-ink-400 truncate flex-1">{a.name}</span>
                <span className="text-[10px] text-ink-500 tabular-nums">{Math.round(a.load * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-ink-700/50">
          <button
            onClick={onExit}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-ink-400 hover:text-ink-200 hover:bg-ink-800/60 transition-colors"
          >
            <X size={14} /> Exit to landing
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 glass-strong border-b border-ink-700/50">
          <div className="flex items-center gap-3 px-4 lg:px-6 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-ink-800 text-ink-300"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  type="search"
                  placeholder="Search or ask AI..."
                  className="w-full pl-10 pr-4 py-2 bg-ink-900/60 border border-ink-700 rounded-xl text-sm text-ink-50 placeholder-ink-500 focus:border-nexus-500 focus:ring-1 focus:ring-nexus-500 outline-none"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-ink-500 border border-ink-700 rounded px-1.5 py-0.5">⌘K</kbd>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* Live status */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pitch-500/10 border border-pitch-500/30">
                <Radio className="w-3.5 h-3.5 text-pitch-400 animate-pulse" />
                <span className="text-xs text-pitch-300 font-medium">LIVE</span>
              </div>

              {/* Time */}
              <div className="hidden sm:block text-right">
                <p className="text-xs font-mono text-ink-200 tabular-nums">{time.toLocaleTimeString()}</p>
                <p className="text-[10px] text-ink-500">Match Day · UTC-5</p>
              </div>

              {/* Accessibility */}
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  highContrast ? 'bg-nexus-500/20 text-nexus-300' : 'hover:bg-ink-800 text-ink-300',
                )}
                aria-label="Toggle high contrast"
                aria-pressed={highContrast}
                title="High contrast mode"
              >
                <Accessibility size={16} />
              </button>

              {/* Language */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="p-2 rounded-lg hover:bg-ink-800 text-ink-300 flex items-center gap-1"
                  aria-label="Select language"
                >
                  <Globe size={16} />
                  <span className="text-xs uppercase">{language}</span>
                </button>
                {showLangMenu && (
                  <div className="absolute right-0 mt-2 w-48 glass-strong rounded-xl border border-ink-700 p-1 z-50">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setShowLangMenu(false);
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-ink-800 transition-colors',
                          language === l.code ? 'text-nexus-300 bg-ink-800/50' : 'text-ink-200',
                        )}
                      >
                        <span>{l.nativeName}</span>
                        <span className="text-xs text-ink-500">{l.code.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="relative p-2 rounded-lg hover:bg-ink-800 text-ink-300"
                  aria-label="Notifications"
                >
                  <Bell size={16} />
                  {activeAlerts > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-alert-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {activeAlerts}
                    </span>
                  )}
                </button>
                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 glass-strong rounded-xl border border-ink-700 p-3 z-50">
                    <p className="text-xs text-ink-400 uppercase tracking-wider mb-2">Active Alerts</p>
                    <div className="space-y-2">
                      {[
                        { t: 'North Stand critical', s: 'critical', d: '2m ago' },
                        { t: 'Unattended bag, Concourse L1', s: 'high', d: '4m ago' },
                        { t: 'Metro load 86%', s: 'high', d: '6m ago' },
                      ].map((n) => (
                        <div key={n.t} className="flex items-start gap-2 p-2 rounded-lg hover:bg-ink-800/50">
                          <span
                            className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                            style={{ background: statusColor(n.s) }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-ink-100">{n.t}</p>
                            <p className="text-xs text-ink-500">{n.d}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-ink-800"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nexus-500 to-pitch-500 flex items-center justify-center text-white text-xs font-bold">
                    {user?.avatar ?? 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-medium text-ink-100 leading-tight">{user?.name}</p>
                    <p className="text-[10px] text-ink-500 capitalize">{user?.role}</p>
                  </div>
                  <ChevronDown size={14} className="text-ink-400" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 glass-strong rounded-xl border border-ink-700 p-1 z-50">
                    <div className="px-3 py-2 border-b border-ink-700/50 mb-1">
                      <p className="text-sm font-medium text-ink-100">{user?.name}</p>
                      <p className="text-xs text-ink-500">{user?.email}</p>
                      <Badge variant="info" className="mt-1.5 capitalize">{user?.role}</Badge>
                    </div>
                    <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-ink-200 hover:bg-ink-800">
                      <UserIcon size={14} /> Profile
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-ink-200 hover:bg-ink-800">
                      <Volume2 size={14} /> Voice settings
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-ink-200 hover:bg-ink-800">
                      <Sun size={14} /> Appearance
                    </button>
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-alert-300 hover:bg-alert-500/10"
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 bg-stadium-grid min-w-0" id="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
