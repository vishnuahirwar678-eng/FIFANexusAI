import { useState } from 'react';
import {
  WifiOff, MapPin, Phone, AlertTriangle, Shield, Navigation,
  Heart, Users, Radio, Download, CheckCircle2, Clock, Map,
  Building2, Stethoscope, Flame, RefreshCw,
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardTitle } from '../ui/Card';
import { Button, Badge } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { generateEvacuationRoutes, generateEmergencyContacts } from '../../lib/mock-data';
import { cn, statusColor } from '../../lib/utils';

export function OfflineEmergencyMode() {
  const [routes] = useState(() => generateEvacuationRoutes());
  const [contacts] = useState(() => generateEmergencyContacts());
  const [offlineMode, setOfflineMode] = useState(false);
  const [cacheProgress, setCacheProgress] = useState(100);

  const toggleOffline = () => {
    if (!offlineMode) {
      setOfflineMode(true);
      setCacheProgress(0);
      const t = setInterval(() => {
        setCacheProgress((p) => {
          if (p >= 100) {
            clearInterval(t);
            return 100;
          }
          return p + 5;
        });
      }, 50);
    } else {
      setOfflineMode(false);
      setCacheProgress(100);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <WifiOff className="w-7 h-7 text-alert-400" /> Offline Emergency Mode
          </h1>
          <p className="text-sm text-ink-400 mt-1">Resilience during network failures — cached maps, evacuation routes, and emergency instructions</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={offlineMode ? 'danger' : 'success'}>
            <span className={cn('w-1.5 h-1.5 rounded-full', offlineMode ? 'bg-alert-400' : 'bg-pitch-400', 'animate-pulse')} />
            {offlineMode ? 'Offline Mode Active' : 'Online — Cache Ready'}
          </Badge>
          <Button variant={offlineMode ? 'success' : 'danger'} size="sm" onClick={toggleOffline}>
            <WifiOff size={14} /> {offlineMode ? 'Reconnect' : 'Simulate Outage'}
          </Button>
        </div>
      </div>

      {/* Offline status banner */}
      {offlineMode && (
        <Card className="border-alert-500/40 bg-alert-500/5">
          <CardBody>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-alert-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-display font-semibold text-alert-300">Network Failure Detected — Operating in Offline Mode</p>
                <p className="text-sm text-ink-300 mt-1">
                  All critical safety systems are running from cached data. Evacuation routes, emergency contacts, and medical station locations
                  are available locally. AI agents have switched to edge-based inference. No cloud dependency.
                </p>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-ink-400">Loading cached emergency data...</span>
                    <span className="text-ink-200 tabular-nums">{cacheProgress}%</span>
                  </div>
                  <Progress value={cacheProgress} color="#e61e1e" height={6} />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Cached resources status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Map, label: 'Stadium Maps', size: '4.2 MB', cached: true, color: '#4d8fff' },
          { icon: Navigation, label: 'Evacuation Routes', size: '1.8 MB', cached: true, color: '#00e890' },
          { icon: Phone, label: 'Emergency Contacts', size: '12 KB', cached: true, color: '#ff8c00' },
          { icon: Heart, label: 'Medical Station Info', size: '340 KB', cached: true, color: '#e61e1e' },
        ].map((r) => (
          <Card key={r.label} hover>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${r.color}15`, color: r.color }}>
                  <r.icon className="w-4 h-4" />
                </div>
                {r.cached ? (
                  <CheckCircle2 className="w-4 h-4 text-pitch-400" />
                ) : (
                  <Download className="w-4 h-4 text-ink-500" />
                )}
              </div>
              <p className="text-sm font-medium text-ink-100">{r.label}</p>
              <p className="text-xs text-ink-400">{r.size} · {r.cached ? 'Cached' : 'Not cached'}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Evacuation routes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-pitch-400" /> Cached Evacuation Routes
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {routes.map((r) => {
                const loadPct = (r.currentLoad / r.capacity) * 100;
                return (
                  <div key={r.id} className="p-3 rounded-xl bg-ink-900/40 border border-ink-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-pitch-500/15 text-pitch-400 flex items-center justify-center">
                          <Navigation className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink-100">{r.name}</p>
                          <p className="text-xs text-ink-500">{r.distance}m · {r.estimatedTime} min · {r.capacity.toLocaleString()} cap</p>
                        </div>
                      </div>
                      <Badge variant={r.status === 'clear' ? 'success' : r.status === 'busy' ? 'warning' : r.status === 'congested' ? 'danger' : 'default'}>
                        {r.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={loadPct} color={statusColor(r.status === 'clear' ? 'normal' : r.status)} className="flex-1" height={6} />
                      <span className="text-xs text-ink-300 tabular-nums w-12 text-right">{Math.round(loadPct)}%</span>
                    </div>
                    {r.accessible && (
                      <p className="text-[10px] text-pitch-400 mt-1.5 flex items-center gap-1">
                        <Heart size={10} /> Wheelchair accessible
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Emergency contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-alert-400" /> Emergency Contact Directory
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {contacts.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-ink-900/40 border border-ink-700/50">
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                    c.available ? 'bg-pitch-500/15 text-pitch-400' : 'bg-ink-800 text-ink-500',
                  )}>
                    {c.role.includes('Medical') ? <Stethoscope className="w-4 h-4" />
                      : c.role.includes('Fire') ? <Flame className="w-4 h-4" />
                      : c.role.includes('Security') ? <Shield className="w-4 h-4" />
                      : c.role.includes('External') ? <Radio className="w-4 h-4" />
                      : <Users className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-100">{c.name}</p>
                    <p className="text-xs text-ink-500">{c.role} · {c.channel}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={cn('text-xs', c.available ? 'text-pitch-400' : 'text-ink-500')}>
                      {c.available ? 'Available' : 'Offline'}
                    </span>
                    <p className="text-[10px] text-ink-500">{c.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Emergency instructions */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            icon: Flame,
            title: 'Fire Emergency',
            color: '#e61e1e',
            steps: ['Activate nearest alarm', 'Follow illuminated exit signs', 'Do not use elevators', 'Proceed to Assembly Point AP-1', 'Await headcount by stewards'],
          },
          {
            icon: Users,
            title: 'Crowd Crush',
            color: '#ff8c00',
            steps: ['Move to perimeter walls', 'Do not push against crowd flow', 'If fallen, curl into ball', 'Protect head and chest', 'Signal nearest steward'],
          },
          {
            icon: Heart,
            title: 'Medical Emergency',
            color: '#00e890',
            steps: ['Call Channel 4 — Medical', 'Do not move injured person', 'Clear area around patient', 'Send someone to meet medics', 'Provide CPR if trained'],
          },
        ].map((inst) => (
          <Card key={inst.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <inst.icon className="w-4 h-4" style={{ color: inst.color }} /> {inst.title}
              </CardTitle>
            </CardHeader>
            <CardBody>
              <ol className="space-y-2">
                {inst.steps.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-200">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                      style={{ background: `${inst.color}20`, color: inst.color }}
                    >
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Assembly points + key facilities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-nexus-400" /> Key Facilities & Assembly Points
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { name: 'Assembly Point AP-1', loc: 'North Parking Lot', dist: '200m', icon: MapPin },
              { name: 'Assembly Point AP-2', loc: 'South Plaza', dist: '180m', icon: MapPin },
              { name: 'Medical Station 1', loc: 'Concourse L1 — Center', dist: '50m', icon: Stethoscope },
              { name: 'Medical Station 2', loc: 'Concourse L1 — West', dist: '80m', icon: Stethoscope },
              { name: 'First Aid Post A', loc: 'North Stand — Sec 104', dist: '30m', icon: Heart },
              { name: 'First Aid Post B', loc: 'South Stand — Sec 222', dist: '30m', icon: Heart },
              { name: 'Fire Control Room', loc: 'Operations Center', dist: '150m', icon: Flame },
              { name: 'Security Hub', loc: 'Concourse L1 — East', dist: '100m', icon: Shield },
            ].map((f) => (
              <div key={f.name} className="p-3 rounded-xl bg-ink-900/40 border border-ink-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <f.icon className="w-4 h-4 text-nexus-400" />
                  <p className="text-sm font-medium text-ink-100">{f.name}</p>
                </div>
                <p className="text-xs text-ink-400">{f.loc}</p>
                <p className="text-xs text-ink-500 mt-1 flex items-center gap-1">
                  <Clock size={10} /> {f.dist} from center
                </p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Cache management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-4 h-4 text-pitch-400" /> Cache Management
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-ink-900/40 border border-ink-700/50">
              <p className="text-xs text-ink-400 mb-1">Cache Size</p>
              <p className="font-display text-2xl font-bold text-ink-50">6.4 <span className="text-sm text-ink-400">MB</span></p>
              <p className="text-xs text-ink-500 mt-1">Last updated 2 min ago</p>
            </div>
            <div className="p-4 rounded-xl bg-ink-900/40 border border-ink-700/50">
              <p className="text-xs text-ink-400 mb-1">Cache Validity</p>
              <p className="font-display text-2xl font-bold text-pitch-400">72 <span className="text-sm text-ink-400">hours</span></p>
              <p className="text-xs text-ink-500 mt-1">Auto-refreshes when online</p>
            </div>
            <div className="p-4 rounded-xl bg-ink-900/40 border border-ink-700/50">
              <p className="text-xs text-ink-400 mb-1">Edge Sync Status</p>
              <p className="font-display text-2xl font-bold text-nexus-400">Ready</p>
              <p className="text-xs text-ink-500 mt-1">5 edge nodes active</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm">
              <RefreshCw size={14} /> Refresh Cache
            </Button>
            <Button variant="ghost" size="sm">
              <Download size={14} /> Download Full Offline Package
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
