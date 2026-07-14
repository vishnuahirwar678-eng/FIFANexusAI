import { lazy, Suspense, useState, type ReactNode } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Landing } from './components/landing/Landing';
import { SignIn } from './components/auth/SignIn';
import { AppShell, type ViewId } from './components/shell/AppShell';

const CommandCenter = lazy(() => import('./components/views/CommandCenter').then((m) => ({ default: m.CommandCenter })));
const DigitalTwin = lazy(() => import('./components/views/DigitalTwin').then((m) => ({ default: m.DigitalTwin })));
const FanCopilot = lazy(() => import('./components/views/FanCopilot').then((m) => ({ default: m.FanCopilot })));
const CrowdIntelligence = lazy(() => import('./components/views/CrowdIntelligence').then((m) => ({ default: m.CrowdIntelligence })));
const VolunteerCopilot = lazy(() => import('./components/views/VolunteerCopilot').then((m) => ({ default: m.VolunteerCopilot })));
const SmartTransport = lazy(() => import('./components/views/SmartTransport').then((m) => ({ default: m.SmartTransport })));
const SustainabilityIntelligence = lazy(() => import('./components/views/SustainabilityIntelligence').then((m) => ({ default: m.SustainabilityIntelligence })));
const TestingDashboard = lazy(() => import('./components/views/TestingDashboard').then((m) => ({ default: m.TestingDashboard })));
const SecurityCenter = lazy(() => import('./components/views/SecurityCenter').then((m) => ({ default: m.SecurityCenter })));
const ExplainableAI = lazy(() => import('./components/views/ExplainableAI').then((m) => ({ default: m.ExplainableAI })));
const OfflineEmergencyMode = lazy(() => import('./components/views/OfflineEmergencyMode').then((m) => ({ default: m.OfflineEmergencyMode })));
const MonitoringObservability = lazy(() => import('./components/views/MonitoringObservability').then((m) => ({ default: m.MonitoringObservability })));
const KpiRoiDashboard = lazy(() => import('./components/views/KpiRoiDashboard').then((m) => ({ default: m.KpiRoiDashboard })));
const OperationalIntelligence = lazy(() => import('./components/views/OperationalIntelligence').then((m) => ({ default: m.OperationalIntelligence })));
const SmartNavigation = lazy(() => import('./components/views/SmartNavigation').then((m) => ({ default: m.SmartNavigation })));
const AccessibilityCenter = lazy(() => import('./components/views/AccessibilityCenter').then((m) => ({ default: m.AccessibilityCenter })));
const MultilingualCenter = lazy(() => import('./components/views/MultilingualCenter').then((m) => ({ default: m.MultilingualCenter })));
const ChallengeAlignment = lazy(() => import('./components/views/ChallengeAlignment').then((m) => ({ default: m.ChallengeAlignment })));

type Screen = 'landing' | 'signin' | 'app';

const VIEW_LOADERS: Record<ViewId, () => ReactNode> = {
  'command': () => <CommandCenter />,
  'digital-twin': () => <DigitalTwin />,
  'fan-copilot': () => <FanCopilot />,
  'crowd': () => <CrowdIntelligence />,
  'volunteer': () => <VolunteerCopilot />,
  'transport': () => <SmartTransport />,
  'sustainability': () => <SustainabilityIntelligence />,
  'security': () => <SecurityCenter />,
  'testing': () => <TestingDashboard />,
  'explainable-ai': () => <ExplainableAI />,
  'offline-emergency': () => <OfflineEmergencyMode />,
  'monitoring': () => <MonitoringObservability />,
  'kpi-roi': () => <KpiRoiDashboard />,
  'operational-intelligence': () => <OperationalIntelligence />,
  'navigation': () => <SmartNavigation />,
  'accessibility': () => <AccessibilityCenter />,
  'multilingual': () => <MultilingualCenter />,
  'alignment': () => <ChallengeAlignment />,
};

function ViewLoader() {
  return (
    <div className="flex items-center justify-center py-20" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-nexus-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-ink-400">Loading dashboard...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [screen, setScreen] = useState<Screen>('landing');
  const [view, setView] = useState<ViewId>('command');

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-nexus-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-ink-400">Initializing FIFA Nexus AI...</p>
        </div>
      </div>
    );
  }

  const enterApp = () => {
    setScreen('app');
    setView('command');
  };

  if (screen === 'landing') {
    return <Landing onEnter={enterApp} onSignIn={() => setScreen('signin')} />;
  }

  if (screen === 'signin') {
    return <SignIn onBack={() => setScreen('landing')} onEnter={enterApp} />;
  }

  if (!user) {
    return <SignIn onBack={() => setScreen('landing')} onEnter={enterApp} />;
  }

  return (
    <AppShell current={view} onNavigate={setView} onExit={() => setScreen('landing')}>
      <ErrorBoundary>
        <Suspense fallback={<ViewLoader />}>
          {VIEW_LOADERS[view]()}
        </Suspense>
      </ErrorBoundary>
    </AppShell>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
