import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Landing } from './components/landing/Landing';
import { SignIn } from './components/auth/SignIn';
import { AppShell, type ViewId } from './components/shell/AppShell';
import { CommandCenter } from './components/views/CommandCenter';
import { DigitalTwin } from './components/views/DigitalTwin';
import { FanCopilot } from './components/views/FanCopilot';
import { CrowdIntelligence } from './components/views/CrowdIntelligence';
import { VolunteerCopilot } from './components/views/VolunteerCopilot';
import { SmartTransport } from './components/views/SmartTransport';
import { SustainabilityIntelligence } from './components/views/SustainabilityIntelligence';
import { TestingDashboard } from './components/views/TestingDashboard';
import { SecurityCenter } from './components/views/SecurityCenter';
import { ExplainableAI } from './components/views/ExplainableAI';
import { OfflineEmergencyMode } from './components/views/OfflineEmergencyMode';
import { MonitoringObservability } from './components/views/MonitoringObservability';
import { KpiRoiDashboard } from './components/views/KpiRoiDashboard';
import { OperationalIntelligence } from './components/views/OperationalIntelligence';

type Screen = 'landing' | 'signin' | 'app';

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
    return (
      <>
        <Landing onEnter={enterApp} onSignIn={() => setScreen('signin')} />
      </>
    );
  }

  if (screen === 'signin') {
    return <SignIn onBack={() => setScreen('landing')} onEnter={enterApp} />;
  }

  if (!user) {
    return <SignIn onBack={() => setScreen('landing')} onEnter={enterApp} />;
  }

  return (
    <AppShell current={view} onNavigate={setView} onExit={() => setScreen('landing')}>
      {view === 'command' && <CommandCenter />}
      {view === 'digital-twin' && <DigitalTwin />}
      {view === 'fan-copilot' && <FanCopilot />}
      {view === 'crowd' && <CrowdIntelligence />}
      {view === 'volunteer' && <VolunteerCopilot />}
      {view === 'transport' && <SmartTransport />}
      {view === 'sustainability' && <SustainabilityIntelligence />}
      {view === 'security' && <SecurityCenter />}
      {view === 'testing' && <TestingDashboard />}
      {view === 'explainable-ai' && <ExplainableAI />}
      {view === 'offline-emergency' && <OfflineEmergencyMode />}
      {view === 'monitoring' && <MonitoringObservability />}
      {view === 'kpi-roi' && <KpiRoiDashboard />}
      {view === 'operational-intelligence' && <OperationalIntelligence />}
    </AppShell>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
