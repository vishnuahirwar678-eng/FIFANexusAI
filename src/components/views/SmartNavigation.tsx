import { useCallback, useMemo, useState } from 'react';
import {
  MapPin, Navigation, Accessibility, DoorOpen, ArrowRight, ArrowUp,
  UtensilsCrossed, Clock, Train, Stethoscope, AlertTriangle,
  RefreshCw, Layers, Eye, CheckCircle2, Zap,
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardTitle } from '../ui/Card';
import { Button, Badge } from '../ui/Button';
import { EmptyState } from '../ui/StateViews';
import { generateNavRoutes } from '../../lib/mock-data';
import { cn, statusColor } from '../../lib/utils';
import type { NavRoute } from '../../types';

const STEP_ICONS: Record<string, typeof ArrowRight> = {
  ArrowRight, ArrowUp, MapPin, DoorOpen, Accessibility, UtensilsCrossed, Clock, Train, Stethoscope,
};

const ROUTE_TYPE_META = {
  standard: { label: 'Standard Route', color: '#4d8fff', icon: Navigation },
  accessible: { label: 'Accessible Route', color: '#00e890', icon: Accessibility },
  emergency: { label: 'Emergency Exit', color: '#e61e1e', icon: AlertTriangle },
} as const;

const MAP_ZONES = [
  { id: 'gate-a', name: 'Gate A', x: 15, y: 10, w: 12, h: 6, color: '#ff8c00' },
  { id: 'gate-b', name: 'Gate B', x: 73, y: 84, w: 12, h: 6, color: '#4d8fff' },
  { id: 'gate-c', name: 'Gate C', x: 84, y: 46, w: 8, h: 8, color: '#00e890' },
  { id: 'gate-d', name: 'Gate D', x: 8, y: 46, w: 8, h: 8, color: '#4d8fff' },
  { id: 'stand-n', name: 'North Stand', x: 22, y: 20, w: 56, h: 12, color: '#e61e1e' },
  { id: 'stand-s', name: 'South Stand', x: 22, y: 68, w: 56, h: 12, color: '#ff8c00' },
  { id: 'stand-e', name: 'East Stand', x: 76, y: 30, w: 10, h: 40, color: '#ff8c00' },
  { id: 'stand-w', name: 'West Stand', x: 14, y: 30, w: 10, h: 40, color: '#ff8c00' },
  { id: 'concourse', name: 'Concourse L1', x: 30, y: 38, w: 40, h: 24, color: '#4d8fff' },
  { id: 'food', name: 'Food Plaza', x: 42, y: 44, w: 16, h: 12, color: '#ff8c00' },
  { id: 'medical', name: 'Medical 1', x: 50, y: 50, w: 5, h: 4, color: '#00e890' },
  { id: 'elevator', name: 'Elevator E3', x: 48, y: 36, w: 4, h: 4, color: '#00e890' },
];

const KPI_ITEMS = [
  { label: 'Avg Navigation Time', value: '4.2 min', icon: Clock, color: '#00e890', trend: '-40%' },
  { label: 'Accessible Routes', value: '6', icon: Accessibility, color: '#4d8fff', trend: '+2' },
  { label: 'Emergency Exits', value: '8', icon: DoorOpen, color: '#e61e1e', trend: 'live' },
  { label: 'Reroutes Today', value: '142', icon: RefreshCw, color: '#ff8c00', trend: '+18%' },
] as const;

/** Smart Indoor Navigation: interactive stadium map with turn-by-turn directions, accessible routes, and dynamic rerouting. */
export function SmartNavigation() {
  const [routes] = useState<NavRoute[]>(() => generateNavRoutes());
  const [selectedRoute, setSelectedRoute] = useState<NavRoute | null>(null);
  const [filter, setFilter] = useState<'all' | 'standard' | 'accessible' | 'emergency'>('all');
  const [activeStep, setActiveStep] = useState(0);

  const handleRouteSelect = useCallback((route: NavRoute) => {
    setSelectedRoute(route);
    setActiveStep(0);
  }, []);

  const handleFilterChange = useCallback((f: typeof filter) => {
    setFilter(f);
    setSelectedRoute(null);
  }, []);

  const filteredRoutes = useMemo(
    () => filter === 'all' ? routes : routes.filter((r) => r.type === filter),
    [routes, filter],
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Navigation className="w-7 h-7 text-nexus-400" aria-hidden="true" /> Smart Indoor Navigation
          </h1>
          <p className="text-sm text-ink-400 mt-1">Interactive stadium map · Turn-by-turn directions · Wheelchair routes · Dynamic rerouting</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success"><span className="w-1.5 h-1.5 rounded-full bg-pitch-400 animate-pulse" aria-hidden="true" /> Live</Badge>
          <Badge variant="info"><Zap size={10} aria-hidden="true" /> AI-optimized</Badge>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {KPI_ITEMS.map((k) => (
          <Card key={k.label} hover>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${k.color}15`, color: k.color }} aria-hidden="true">
                  <k.icon className="w-4 h-4" />
                </div>
                <span className={cn('text-xs', k.trend.startsWith('-') || k.trend.startsWith('+') ? 'text-pitch-400' : 'text-ink-400')}>{k.trend}</span>
              </div>
              <p className="font-display text-2xl font-bold text-ink-50">{k.value}</p>
              <p className="text-xs text-ink-400">{k.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-nexus-400" aria-hidden="true" /> Interactive Stadium Map
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="relative w-full aspect-[4/3] rounded-xl bg-ink-950 border border-ink-700/50 overflow-hidden">
              <svg viewBox="0 0 100 75" className="w-full h-full" role="img" aria-label="Interactive stadium map showing gates, stands, concourse, food plaza, medical station, and elevator locations">
                <title>Interactive Stadium Map</title>
                {/* Grid background */}
                <defs>
                  <pattern id="nav-grid" width="5" height="5" patternUnits="userSpaceOnUse">
                    <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(31,111,255,0.06)" strokeWidth="0.3" />
                  </pattern>
                </defs>
                <rect width="100" height="75" fill="url(#nav-grid)" />
                {/* Zones */}
                {MAP_ZONES.map((z) => (
                  <g key={z.id}>
                    <rect
                      x={z.x} y={z.y} width={z.w} height={z.h}
                      rx="1.5" fill={`${z.color}20`} stroke={z.color} strokeWidth="0.4"
                      className="transition-all duration-300"
                    />
                    <text x={z.x + z.w / 2} y={z.y + z.h / 2 + 0.8} textAnchor="middle" fontSize="1.8" fill="#a3b0c4" fontWeight="500">
                      {z.name}
                    </text>
                  </g>
                ))}
                {/* Pitch */}
                <rect x="30" y="32" width="40" height="36" rx="1" fill="rgba(0,232,144,0.06)" stroke="rgba(0,232,144,0.2)" strokeWidth="0.3" strokeDasharray="1,1" />
                <text x="50" y="50" textAnchor="middle" fontSize="2" fill="rgba(0,232,144,0.4)" fontWeight="600">PITCH</text>
                {/* Route path if selected */}
                {selectedRoute && (
                  <g>
                    <path
                      d={`M ${MAP_ZONES[0]?.x ?? 15} ${MAP_ZONES[0]?.y ?? 10} Q 50 38 ${MAP_ZONES[5]?.x ?? 22} ${MAP_ZONES[5]?.y ?? 68}`}
                      fill="none"
                      stroke={ROUTE_TYPE_META[selectedRoute.type].color}
                      strokeWidth="0.8"
                      strokeDasharray="2,1"
                      className="animate-pulse"
                    />
                  </g>
                )}
              </svg>
              {/* Legend */}
              <div className="absolute bottom-2 left-2 flex flex-wrap gap-2">
                {Object.entries(ROUTE_TYPE_META).map(([key, meta]) => (
                  <div key={key} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-ink-900/80 border border-ink-700/50">
                    <span className="w-2 h-2 rounded-full" style={{ background: meta.color }} aria-hidden="true" />
                    <span className="text-[10px] text-ink-300">{meta.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Route List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-pitch-400" aria-hidden="true" /> Available Routes
              </CardTitle>
            </div>
            <div className="flex gap-1 mt-3">
              {(['all', 'standard', 'accessible', 'emergency'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilterChange(f)}
                  aria-pressed={filter === f}
                  className={cn(
                    'text-xs px-2.5 py-1 rounded-lg capitalize transition-colors',
                    filter === f ? 'bg-nexus-500/20 text-nexus-300 border border-nexus-500/40' : 'bg-ink-800/60 text-ink-400 hover:text-ink-200 border border-transparent',
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardBody>
            {filteredRoutes.length === 0 ? (
              <EmptyState message="No routes match this filter" />
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {filteredRoutes.map((r) => {
                  const meta = ROUTE_TYPE_META[r.type];
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleRouteSelect(r)}
                      aria-pressed={selectedRoute?.id === r.id}
                      className={cn(
                        'w-full text-left p-3 rounded-xl border transition-all',
                        selectedRoute?.id === r.id ? 'bg-nexus-500/10 border-nexus-500/40' : 'bg-ink-900/40 border-ink-700/50 hover:border-ink-600',
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <meta.icon className="w-3.5 h-3.5" style={{ color: meta.color }} aria-hidden="true" />
                          <span className="text-sm font-medium text-ink-100">{r.name}</span>
                        </div>
                        {r.accessible && <Badge variant="pitch"><Accessibility size={8} aria-hidden="true" /> A11y</Badge>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-ink-400">
                        <span className="flex items-center gap-1"><MapPin size={9} aria-hidden="true" /> {r.distance}m</span>
                        <span className="flex items-center gap-1"><Clock size={9} aria-hidden="true" /> {r.estimatedTime} min</span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor(r.congestion > 70 ? 'critical' : r.congestion > 40 ? 'warning' : 'normal') }} aria-hidden="true" />
                          {r.congestion}% congestion
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Turn-by-turn directions */}
      {selectedRoute && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const Icon = ROUTE_TYPE_META[selectedRoute.type].icon;
                  return <Icon className="w-4 h-4" style={{ color: ROUTE_TYPE_META[selectedRoute.type].color }} aria-hidden="true" />;
                })()}
                Turn-by-Turn Directions
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="info">{selectedRoute.distance}m</Badge>
                <Badge variant="success">{selectedRoute.estimatedTime} min</Badge>
                {selectedRoute.accessible && <Badge variant="pitch"><Accessibility size={8} aria-hidden="true" /> Accessible</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {selectedRoute.steps.map((step, i) => {
                const Icon = STEP_ICONS[step.icon] ?? ArrowRight;
                const isActive = i === activeStep;
                const isDone = i < activeStep;
                return (
                  <div
                    key={i}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-xl border transition-all',
                      isActive ? 'bg-nexus-500/10 border-nexus-500/40' : isDone ? 'bg-ink-900/30 border-ink-700/30 opacity-60' : 'bg-ink-900/40 border-ink-700/50',
                    )}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                        isDone ? 'bg-pitch-500/20 text-pitch-400' : isActive ? 'bg-nexus-500/20 text-nexus-300' : 'bg-ink-800 text-ink-400',
                      )}
                      aria-hidden="true"
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className={cn('text-sm', isDone ? 'text-ink-400 line-through' : 'text-ink-100')}>{step.instruction}</p>
                      <p className="text-xs text-ink-500 mt-0.5">{step.distance}m</p>
                    </div>
                    {isActive && i < selectedRoute.steps.length - 1 && (
                      <Button size="sm" variant="ghost" onClick={() => setActiveStep(i + 1)} aria-label="Next step">
                        <ArrowRight size={12} aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => setActiveStep(0)} variant="outline" size="sm">
                <RefreshCw size={12} aria-hidden="true" /> Restart
              </Button>
              <Button variant="outline" size="sm">
                <Eye size={12} aria-hidden="true" /> View on Map
              </Button>
              <Button variant="ghost" size="sm">
                <Zap size={12} aria-hidden="true" /> AI: Optimize Route
              </Button>
            </div>
            <div className="mt-3 p-3 rounded-lg bg-nexus-500/10 border border-nexus-500/30">
              <p className="text-xs font-semibold text-nexus-300 mb-1 flex items-center gap-1">
                <Zap size={10} aria-hidden="true" /> AI Rerouting Active
              </p>
              <p className="text-xs text-ink-200">
                This route is dynamically optimized based on real-time congestion data. Route updates every 30 seconds.
                Current congestion on this path: {selectedRoute.congestion}%.
                {selectedRoute.congestion > 70 && ' AI recommends taking an alternative route.'}
              </p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
