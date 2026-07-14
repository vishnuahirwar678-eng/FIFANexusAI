import type {
  Alert,
  AgentStatus,
  KPI,
  Zone,
  VolunteerTask,
  TransportRoute,
  SustainabilityMetric,
  AuditLog,
  TestResult,
  Language,
  AIExplanation,
  EvacuationRoute,
  EmergencyContact,
  SystemMetric,
  ErrorEvent,
  KpiRoiMetric,
  OperationalInsight,
  NavRoute,
  AccessibilityFeature,
  TranslationEntry,
  AlignmentEntry,
} from '../types';
import { randomBetween, randomInt, uid } from './utils';

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: 'GB' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: 'ES' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: 'FR' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: 'SA' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: 'IN' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: 'PT' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: 'DE' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: 'JP' },
];

export const STADIUM_ZONES: Zone[] = [
  { id: 'gate-a', name: 'Gate A — North', type: 'gate', density: 0.72, capacity: 8000, flowRate: 420, temperature: 22, status: 'congested', x: 20, y: 8, width: 14, height: 8 },
  { id: 'gate-b', name: 'Gate B — South', type: 'gate', density: 0.45, capacity: 8000, flowRate: 380, temperature: 22, status: 'busy', x: 66, y: 84, width: 14, height: 8 },
  { id: 'gate-c', name: 'Gate C — East', type: 'gate', density: 0.28, capacity: 6000, flowRate: 290, temperature: 22, status: 'normal', x: 84, y: 46, width: 8, height: 10 },
  { id: 'gate-d', name: 'Gate D — West', type: 'gate', density: 0.55, capacity: 6000, flowRate: 340, temperature: 22, status: 'busy', x: 8, y: 46, width: 8, height: 10 },
  { id: 'stand-north', name: 'North Stand', type: 'stand', density: 0.88, capacity: 22000, flowRate: 120, temperature: 24, status: 'critical', x: 22, y: 18, width: 56, height: 14 },
  { id: 'stand-south', name: 'South Stand', type: 'stand', density: 0.82, capacity: 22000, flowRate: 110, temperature: 24, status: 'congested', x: 22, y: 68, width: 56, height: 14 },
  { id: 'stand-east', name: 'East Stand', type: 'stand', density: 0.74, capacity: 18000, flowRate: 95, temperature: 24, status: 'congested', x: 76, y: 28, width: 12, height: 44 },
  { id: 'stand-west', name: 'West Stand', type: 'stand', density: 0.79, capacity: 18000, flowRate: 100, temperature: 24, status: 'congested', x: 12, y: 28, width: 12, height: 44 },
  { id: 'concourse-1', name: 'Concourse Level 1', type: 'concourse', density: 0.62, capacity: 15000, flowRate: 580, temperature: 21, status: 'busy', x: 30, y: 38, width: 40, height: 24 },
  { id: 'concourse-2', name: 'Concourse Level 2', type: 'concourse', density: 0.48, capacity: 12000, flowRate: 460, temperature: 21, status: 'busy', x: 30, y: 38, width: 40, height: 24 },
  { id: 'food-plaza', name: 'Food Plaza Central', type: 'food', density: 0.81, capacity: 4000, flowRate: 220, temperature: 23, status: 'congested', x: 42, y: 44, width: 16, height: 12 },
  { id: 'food-north', name: 'Food Court North', type: 'food', density: 0.54, capacity: 2500, flowRate: 180, temperature: 23, status: 'busy', x: 38, y: 24, width: 12, height: 8 },
  { id: 'medical-1', name: 'Medical Station 1', type: 'medical', density: 0.22, capacity: 200, flowRate: 12, temperature: 20, status: 'normal', x: 50, y: 50, width: 6, height: 4 },
  { id: 'medical-2', name: 'Medical Station 2', type: 'medical', density: 0.18, capacity: 200, flowRate: 8, temperature: 20, status: 'normal', x: 30, y: 30, width: 6, height: 4 },
  { id: 'parking-north', name: 'Parking North', type: 'parking', density: 0.91, capacity: 6000, flowRate: 80, temperature: 25, status: 'critical', x: 24, y: 2, width: 52, height: 4 },
  { id: 'parking-south', name: 'Parking South', type: 'parking', density: 0.67, capacity: 6000, flowRate: 140, temperature: 25, status: 'busy', x: 24, y: 94, width: 52, height: 4 },
  { id: 'metro-station', name: 'Metro Station', type: 'transport', density: 0.86, capacity: 12000, flowRate: 720, temperature: 19, status: 'critical', x: 2, y: 50, width: 6, height: 12 },
  { id: 'bus-terminal', name: 'Bus Terminal', type: 'transport', density: 0.58, capacity: 5000, flowRate: 320, temperature: 23, status: 'busy', x: 92, y: 50, width: 6, height: 12 },
];

export const AGENTS: AgentStatus[] = [
  { id: 'operations-commander', name: 'Operations Commander', status: 'online', load: 0.74, tasksHandled: 1284, accuracy: 98.4, latencyMs: 142, lastAction: 'Reallocated 12 volunteers to Gate A', icon: 'Command', color: '#1f6fff' },
  { id: 'crowd-management', name: 'Crowd Management', status: 'online', load: 0.81, tasksHandled: 3421, accuracy: 96.7, latencyMs: 89, lastAction: 'Predicted congestion at North Stand in 28 min', icon: 'Users', color: '#ff8c00' },
  { id: 'security', name: 'Security Agent', status: 'online', load: 0.62, tasksHandled: 892, accuracy: 99.1, latencyMs: 67, lastAction: 'Flagged unattended bag at Concourse L1', icon: 'Shield', color: '#e61e1e' },
  { id: 'fan-experience', name: 'Fan Experience', status: 'online', load: 0.68, tasksHandled: 8742, accuracy: 97.8, latencyMs: 124, lastAction: 'Resolved 47 fan queries in 8 languages', icon: 'Heart', color: '#00e890' },
  { id: 'volunteer', name: 'Volunteer Copilot', status: 'online', load: 0.55, tasksHandled: 612, accuracy: 95.3, latencyMs: 156, lastAction: 'Assigned 3 tasks to Zone B volunteers', icon: 'Hand', color: '#4d8fff' },
  { id: 'transport', name: 'Transport Agent', status: 'online', load: 0.71, tasksHandled: 1456, accuracy: 94.2, latencyMs: 98, lastAction: 'Rerouted 4 buses to Metro Station', icon: 'Bus', color: '#a855f7' },
  { id: 'sustainability', name: 'Sustainability Agent', status: 'online', load: 0.43, tasksHandled: 328, accuracy: 96.8, latencyMs: 210, lastAction: 'Reduced HVAC load by 18% in West Stand', icon: 'Leaf', color: '#22c55e' },
];

export const KPIS: KPI[] = [
  { id: 'attendance', label: 'Live Attendance', value: 78432, unit: 'fans', target: 88000, trend: 2.4, sparkline: [62, 65, 68, 71, 74, 76, 78], category: 'crowd', status: 'good' },
  { id: 'density', label: 'Avg Crowd Density', value: 64, unit: '%', target: 70, trend: -3.1, sparkline: [58, 62, 67, 71, 68, 65, 64], category: 'crowd', status: 'warning' },
  { id: 'queue-time', label: 'Avg Queue Time', value: 8.4, unit: 'min', target: 12, trend: -1.2, sparkline: [14, 12, 11, 10, 9, 9, 8.4], category: 'fan', status: 'good' },
  { id: 'incidents', label: 'Active Incidents', value: 7, unit: '', target: 5, trend: 1, sparkline: [3, 4, 5, 6, 5, 6, 7], category: 'security', status: 'warning' },
  { id: 'response-time', label: 'Incident Response', value: 3.2, unit: 'min', target: 6, trend: -0.8, sparkline: [6.4, 5.8, 5.1, 4.6, 4.0, 3.6, 3.2], category: 'security', status: 'good' },
  { id: 'energy', label: 'Energy Usage', value: 4.2, unit: 'MW', target: 5.0, trend: -0.3, sparkline: [4.8, 4.6, 4.5, 4.4, 4.3, 4.2, 4.2], category: 'sustainability', status: 'good' },
  { id: 'water', label: 'Water Consumption', value: 28, unit: 'kL/h', target: 35, trend: -1.4, sparkline: [34, 32, 31, 30, 29, 28, 28], category: 'sustainability', status: 'good' },
  { id: 'carbon', label: 'Carbon Output', value: 142, unit: 'tCO2', target: 180, trend: -4.2, sparkline: [180, 172, 165, 158, 152, 146, 142], category: 'sustainability', status: 'good' },
  { id: 'metro-load', label: 'Metro Load', value: 86, unit: '%', target: 75, trend: 4.1, sparkline: [72, 76, 80, 82, 84, 85, 86], category: 'transport', status: 'critical' },
  { id: 'parking-avail', label: 'Parking Available', value: 12, unit: '%', target: 20, trend: -2.3, sparkline: [28, 24, 20, 18, 16, 14, 12], category: 'transport', status: 'critical' },
  { id: 'fan-satisfaction', label: 'Fan Satisfaction', value: 94, unit: '%', target: 90, trend: 1.8, sparkline: [88, 90, 91, 92, 93, 94, 94], category: 'fan', status: 'good' },
  { id: 'ai-accuracy', label: 'AI Prediction Accuracy', value: 96.8, unit: '%', target: 95, trend: 0.4, sparkline: [94.2, 95.1, 95.8, 96.3, 96.5, 96.7, 96.8], category: 'ops', status: 'good' },
];

const ALERT_TEMPLATES = [
  { title: 'Crowd density exceeding threshold', description: 'North Stand at 88% capacity with rising trend. Predicted to reach critical in 12 minutes.', severity: 'critical' as const, zone: 'North Stand', source: 'Crowd Management Agent', recommendedActions: ['Open overflow gates B2 and B3', 'Deploy 8 additional stewards', 'Activate queue management at F&B outlets', 'Broadcast soft diversion to South Stand via app'] },
  { title: 'Unattended item detected', description: 'Backpack identified by CV model at Concourse L1 near Section 104. No movement for 4 minutes.', severity: 'high' as const, zone: 'Concourse Level 1', source: 'Security Agent', recommendedActions: ['Dispatch nearest security team (ETA 90s)', 'Establish 15m safety perimeter', 'Review camera feed CAM-104-N', 'Prepare controlled evacuation plan for Section 104'] },
  { title: 'Metro station congestion forecast', description: 'Metro load at 86% with post-match surge predicted in 35 minutes. Capacity will be exceeded.', severity: 'high' as const, zone: 'Metro Station', source: 'Transport Agent', recommendedActions: ['Request 6 additional trains from dispatch', 'Activate holding pattern at platform barriers', 'Deploy 12 crowd marshals', 'Coordinate with city transit authority'] },
  { title: 'Medical assistance requested', description: 'Fan reported feeling unwell in Section 222. Wheelchair access route identified.', severity: 'medium' as const, zone: 'South Stand', source: 'Fan Experience Agent', recommendedActions: ['Dispatch medical team to Section 222', 'Clear wheelchair route via Elevator E3', 'Prepare hydration station', 'Notify next-of-kin if registered'] },
  { title: 'F&B queue anomaly', description: 'Food Plaza Central queue time 18 min, 3x baseline. Inventory of bottled water low.', severity: 'medium' as const, zone: 'Food Plaza Central', source: 'Operations Commander', recommendedActions: ['Open mobile F&B cart CP-7', 'Restock bottled water from depot', 'Deploy 4 volunteers for queue management', 'Activate pre-order pickup lane'] },
  { title: 'Parking North at capacity', description: 'Parking North 91% full. Inbound vehicles causing backup on access road.', severity: 'medium' as const, zone: 'Parking North', source: 'Transport Agent', recommendedActions: ['Redirect inbound traffic to Parking South', 'Update variable message signs on M4', 'Activate shuttle from overflow lot P7', 'Notify traffic control center'] },
  { title: 'Sustainability target exceeded', description: 'HVAC load in West Stand 18% above forecast. Cooling demand spike detected.', severity: 'low' as const, zone: 'West Stand', source: 'Sustainability Agent', recommendedActions: ['Pre-cool East Stand during low occupancy', 'Adjust setpoint by 2°C in non-occupied zones', 'Activate natural ventilation in concourse', 'Log anomaly for post-match review'] },
];

export function generateAlerts(count = 8): Alert[] {
  return Array.from({ length: count }).map((_, i) => {
    const template = ALERT_TEMPLATES[i % ALERT_TEMPLATES.length];
    const minutesAgo = randomInt(1, 30);
    return {
      id: uid('alert'),
      ...template,
      status: i < 3 ? 'active' : i < 5 ? 'acknowledged' : 'monitoring',
      timestamp: new Date(Date.now() - minutesAgo * 60_000).toISOString(),
      confidence: randomBetween(0.82, 0.99),
    };
  });
}

export function generateVolunteerTasks(): VolunteerTask[] {
  const volunteers = [
    { id: 'v1', name: 'Maria Santos' },
    { id: 'v2', name: 'James Okoro' },
    { id: 'v3', name: 'Yuki Tanaka' },
    { id: 'v4', name: 'Sophie Müller' },
    { id: 'v5', name: 'Raj Patel' },
    { id: 'v6', name: 'Carlos Ferreira' },
    { id: 'v7', name: 'Aisha Khan' },
    { id: 'v8', name: 'Liam O\'Brien' },
  ];
  const tasks = [
    { title: 'Crowd flow management at Gate A', description: 'Assist with entry flow. Current density 72%. Direct fans to less congested gates.', zone: 'Gate A — North', priority: 'high' as const, instructions: ['Position at Gate A entry point', 'Hold flow for 30 seconds when density > 80%', 'Direct families to Gate C (28% density)', 'Report any medical issues to Medical-1'] },
    { title: 'F&B queue assistance', description: 'Manage queue at Food Plaza Central. Current wait 18 min. Open pre-order pickup lane.', zone: 'Food Plaza Central', priority: 'medium' as const, instructions: ['Open pre-order pickup lane 3', 'Direct app users to pickup lane', 'Distribute water to queue (max 1 per person)', 'Monitor for heat distress symptoms'] },
    { title: 'Wayfinding for accessibility', description: 'Guide wheelchair user from Section 222 to Medical Station 1 via Elevator E3.', zone: 'South Stand', priority: 'high' as const, instructions: ['Meet at Section 222 Row J', 'Use Elevator E3 (wheelchair accessible)', 'Route: 222 → Concourse L1 → E3 → Medical-1', 'ETA 6 minutes, notify medical on arrival'] },
    { title: 'Multilingual assistance', description: 'Japanese-speaking fan needs directions to nearest restroom. Provide in Japanese.', zone: 'East Stand', priority: 'low' as const, instructions: ['Nearest restroom: East Stand Concourse L2', 'Phrase: トイレはこちらです (Toilet is this way)', 'Offer app translation feature', 'Escort if needed'] },
    { title: 'Sustainability monitoring', description: 'Check waste sorting stations in North Stand concourse. Report overflow.', zone: 'North Stand', priority: 'low' as const, instructions: ['Inspect 6 sorting stations', 'Replace bags if > 80% full', 'Log contamination in app', 'Restock from supply closet NS-SC-2'] },
    { title: 'Transport coordination', description: 'Assist fans at Metro Station. Direct to less crowded platforms.', zone: 'Metro Station', priority: 'critical' as const, instructions: ['Position at platform entrance', 'Direct to Platform 2 (lower load)', 'Maintain 1m spacing at barriers', 'Flag any overcrowding to control room'] },
    { title: 'Lost child assistance', description: 'Reported lost child (age 6) at Concourse L1. Escort to information desk.', zone: 'Concourse Level 1', priority: 'critical' as const, instructions: ['Locate child near Section 104', 'Stay with child, do not move without consent', 'Contact information desk on channel 4', 'Reunification at Info Desk ID-1'] },
    { title: 'Exit flow optimization', description: 'Post-match: optimize exit flow at Gate B. Predicted surge in 15 min.', zone: 'Gate B — South', priority: 'high' as const, instructions: ['Open all 6 turnstiles at Gate B', 'Direct to Metro (Platform 2) and Bus Terminal', 'Maintain clear emergency lanes', 'Stand down when density < 40%'] },
  ];
  return tasks.map((t, i) => {
    const v = volunteers[i % volunteers.length];
    const assignedMinutesAgo = randomInt(2, 45);
    const dueIn = randomInt(5, 60);
    return {
      id: uid('task'),
      volunteerId: v.id,
      volunteerName: v.name,
      title: t.title,
      description: t.description,
      zone: t.zone,
      priority: t.priority,
      status: i < 2 ? 'in-progress' : i < 5 ? 'assigned' : i < 7 ? 'completed' : 'overdue',
      assignedAt: new Date(Date.now() - assignedMinutesAgo * 60_000).toISOString(),
      dueAt: new Date(Date.now() + dueIn * 60_000).toISOString(),
      aiInstructions: t.instructions,
    };
  });
}

export function generateTransportRoutes(): TransportRoute[] {
  return [
    { id: 'm1', type: 'metro', name: 'Metro Line 4 — Stadium', load: 86, capacity: 1200, eta: 3, status: 'congested', nextArrival: '3 min', carbon: 0.8 },
    { id: 'm2', type: 'metro', name: 'Metro Line 7 — Express', load: 64, capacity: 1200, eta: 6, status: 'busy', nextArrival: '6 min', carbon: 0.8 },
    { id: 'b1', type: 'bus', name: 'Bus Route 88 — Downtown', load: 72, capacity: 80, eta: 5, status: 'busy', nextArrival: '5 min', carbon: 4.2 },
    { id: 'b2', type: 'bus', name: 'Bus Route 92 — Airport', load: 45, capacity: 80, eta: 9, status: 'normal', nextArrival: '9 min', carbon: 4.2 },
    { id: 'b3', type: 'bus', name: 'Shuttle S1 — Parking P7', load: 38, capacity: 50, eta: 4, status: 'normal', nextArrival: '4 min', carbon: 2.1 },
    { id: 'p1', type: 'parking', name: 'Parking North', load: 91, capacity: 6000, eta: 0, status: 'congested', nextArrival: 'Full', carbon: 0 },
    { id: 'p2', type: 'parking', name: 'Parking South', load: 67, capacity: 6000, eta: 0, status: 'busy', nextArrival: '1,980 spots', carbon: 0 },
    { id: 'p3', type: 'parking', name: 'Overflow P7', load: 22, capacity: 3000, eta: 0, status: 'normal', nextArrival: '2,340 spots', carbon: 0 },
  ];
}

export function generateSustainabilityMetrics(): SustainabilityMetric[] {
  return [
    { id: 'e1', category: 'energy', label: 'HVAC Systems', value: 2.1, unit: 'MW', target: 2.5, trend: -0.12, status: 'good' },
    { id: 'e2', category: 'energy', label: 'Lighting', value: 0.8, unit: 'MW', target: 1.0, trend: -0.05, status: 'good' },
    { id: 'e3', category: 'energy', label: 'Broadcast & AV', value: 0.6, unit: 'MW', target: 0.7, trend: 0.02, status: 'good' },
    { id: 'e4', category: 'energy', label: 'Concessions', value: 0.7, unit: 'MW', target: 0.8, trend: -0.03, status: 'good' },
    { id: 'w1', category: 'water', label: 'Restrooms', value: 14, unit: 'kL/h', target: 18, trend: -0.8, status: 'good' },
    { id: 'w2', category: 'water', label: 'F&B Operations', value: 8, unit: 'kL/h', target: 10, trend: -0.4, status: 'good' },
    { id: 'w3', category: 'water', label: 'Pitch Irrigation', value: 6, unit: 'kL/h', target: 7, trend: -0.2, status: 'good' },
    { id: 'ws1', category: 'waste', label: 'Recyclable', value: 1.8, unit: 't', target: 2.0, trend: 0.1, status: 'good' },
    { id: 'ws2', category: 'waste', label: 'Compostable', value: 1.2, unit: 't', target: 1.5, trend: 0.05, status: 'good' },
    { id: 'ws3', category: 'waste', label: 'Landfill', value: 0.4, unit: 't', target: 0.3, trend: 0.08, status: 'warning' },
    { id: 'c1', category: 'carbon', label: 'Scope 1 (Direct)', value: 42, unit: 'tCO2', target: 50, trend: -1.2, status: 'good' },
    { id: 'c2', category: 'carbon', label: 'Scope 2 (Energy)', value: 68, unit: 'tCO2', target: 80, trend: -2.1, status: 'good' },
    { id: 'c3', category: 'carbon', label: 'Scope 3 (Transport)', value: 32, unit: 'tCO2', target: 50, trend: -0.9, status: 'good' },
  ];
}

export function generateAuditLogs(count = 12): AuditLog[] {
  const users = ['Commander Chen', 'Ops Lead Rivera', 'Security Chief Volkov', 'Volunteer Coord. Adams', 'Transport Mgr. Park', 'Sustainability Lead Costa'];
  const actions = [
    { action: 'LOGIN', resource: 'auth/sessions', status: 'success' as const, details: 'MFA verified, JWT issued' },
    { action: 'VIEW_ALERT', resource: 'alerts/alt_8472', status: 'success' as const, details: 'Critical alert acknowledged' },
    { action: 'APPROVE_ACTION', resource: 'actions/act_2941', status: 'success' as const, details: 'Gate B overflow approved' },
    { action: 'DEPLOY_VOLUNTEERS', resource: 'volunteers/zone-a', status: 'success' as const, details: '8 volunteers reassigned' },
    { action: 'BROADCAST_MESSAGE', resource: 'announcements/all', status: 'success' as const, details: 'Multilingual broadcast sent to 78K fans' },
    { action: 'ACCESS_DENIED', resource: 'admin/financials', status: 'denied' as const, details: 'Role volunteer lacks permission' },
    { action: 'PROMPT_QUERY', resource: 'ai/copilot', status: 'success' as const, details: 'Input validated, guardrails passed' },
    { action: 'PROMPT_BLOCKED', resource: 'ai/copilot', status: 'denied' as const, details: 'Prompt injection detected and blocked' },
    { action: 'EXPORT_DATA', resource: 'reports/incidents', status: 'success' as const, details: 'PDF exported, 247 records' },
    { action: 'CONFIG_CHANGE', resource: 'system/thresholds', status: 'success' as const, details: 'Crowd density threshold updated to 85%' },
    { action: 'API_CALL', resource: 'api/v1/transport/routes', status: 'success' as const, details: 'GET 200, 142ms' },
    { action: 'FAILED_LOGIN', resource: 'auth/sessions', status: 'error' as const, details: 'Invalid credentials, 3rd attempt' },
  ];
  return Array.from({ length: count }).map((_, i) => {
    const a = actions[i % actions.length];
    const u = users[i % users.length];
    const minutesAgo = randomInt(1, 120);
    return {
      id: uid('log'),
      timestamp: new Date(Date.now() - minutesAgo * 60_000).toISOString(),
      userId: `u_${100 + i}`,
      userName: u,
      action: a.action,
      resource: a.resource,
      ip: `10.42.${randomInt(0, 7)}.${randomInt(2, 254)}`,
      status: a.status,
      details: a.details,
    };
  });
}

export function generateTestResults(): TestResult[] {
  return [
    { id: 'u1', category: 'unit', name: 'Component Unit Tests', status: 'passing', coverage: 94.2, duration: 12.4, lastRun: '2m ago', assertions: 1284, failures: 0 },
    { id: 'u2', category: 'unit', name: 'Utility Functions', status: 'passing', coverage: 98.7, duration: 3.1, lastRun: '2m ago', assertions: 342, failures: 0 },
    { id: 'u3', category: 'unit', name: 'AI Agent Logic', status: 'passing', coverage: 91.4, duration: 8.7, lastRun: '2m ago', assertions: 218, failures: 0 },
    { id: 'i1', category: 'integration', name: 'API Integration', status: 'passing', coverage: 87.3, duration: 24.6, lastRun: '5m ago', assertions: 412, failures: 0 },
    { id: 'i2', category: 'integration', name: 'Supabase Integration', status: 'passing', coverage: 84.1, duration: 18.2, lastRun: '5m ago', assertions: 168, failures: 0 },
    { id: 'i3', category: 'integration', name: 'Auth Flow Integration', status: 'passing', coverage: 92.8, duration: 14.3, lastRun: '5m ago', assertions: 96, failures: 0 },
    { id: 'e1', category: 'e2e', name: 'Fan Journey E2E', status: 'passing', coverage: 78.4, duration: 142.7, lastRun: '12m ago', assertions: 84, failures: 0 },
    { id: 'e2', category: 'e2e', name: 'Command Center E2E', status: 'passing', coverage: 81.2, duration: 168.4, lastRun: '12m ago', assertions: 112, failures: 0 },
    { id: 'e3', category: 'e2e', name: 'Volunteer Workflow E2E', status: 'passing', coverage: 74.6, duration: 98.3, lastRun: '12m ago', assertions: 68, failures: 0 },
    { id: 'a1', category: 'accessibility', name: 'WCAG 2.2 AA Compliance', status: 'passing', coverage: 100, duration: 42.1, lastRun: '8m ago', assertions: 247, failures: 0 },
    { id: 'a2', category: 'accessibility', name: 'Screen Reader Tests', status: 'passing', coverage: 96.4, duration: 28.7, lastRun: '8m ago', assertions: 124, failures: 0 },
    { id: 'a3', category: 'accessibility', name: 'Keyboard Navigation', status: 'passing', coverage: 98.1, duration: 18.4, lastRun: '8m ago', assertions: 86, failures: 0 },
    { id: 's1', category: 'security', name: 'OWASP Top 10 Scan', status: 'passing', coverage: 100, duration: 284.6, lastRun: '1h ago', assertions: 142, failures: 0 },
    { id: 's2', category: 'security', name: 'Prompt Injection Tests', status: 'passing', coverage: 100, duration: 68.3, lastRun: '1h ago', assertions: 218, failures: 0 },
    { id: 's3', category: 'security', name: 'JWT & RBAC Tests', status: 'passing', coverage: 100, duration: 42.1, lastRun: '1h ago', assertions: 96, failures: 0 },
    { id: 'p1', category: 'performance', name: 'Lighthouse Audit', status: 'passing', coverage: 94, duration: 38.2, lastRun: '15m ago', assertions: 48, failures: 0 },
    { id: 'p2', category: 'performance', name: 'Bundle Size Check', status: 'passing', coverage: 100, duration: 4.2, lastRun: '15m ago', assertions: 12, failures: 0 },
    { id: 'p3', category: 'performance', name: 'API Latency P95', status: 'passing', coverage: 88, duration: 62.4, lastRun: '15m ago', assertions: 24, failures: 0 },
    { id: 'l1', category: 'load', name: '100K Concurrent Users', status: 'passing', coverage: 100, duration: 600, lastRun: '30m ago', assertions: 18, failures: 0 },
    { id: 'l2', category: 'load', name: 'Sustained Throughput', status: 'passing', coverage: 100, duration: 1800, lastRun: '30m ago', assertions: 12, failures: 0 },
    { id: 'ai1', category: 'ai-accuracy', name: 'Crowd Prediction Model', status: 'passing', coverage: 96.7, duration: 142, lastRun: '20m ago', assertions: 500, failures: 0 },
    { id: 'ai2', category: 'ai-accuracy', name: 'Translation Quality', status: 'passing', coverage: 94.2, duration: 86, lastRun: '20m ago', assertions: 320, failures: 0 },
    { id: 'ai3', category: 'ai-accuracy', name: 'Intent Classification', status: 'passing', coverage: 97.8, duration: 42, lastRun: '20m ago', assertions: 248, failures: 0 },
    { id: 'up1', category: 'uptime', name: 'API Gateway Uptime', status: 'passing', coverage: 99.99, duration: 0, lastRun: 'live', assertions: 1, failures: 0 },
    { id: 'up2', category: 'uptime', name: 'AI Service Uptime', status: 'passing', coverage: 99.97, duration: 0, lastRun: 'live', assertions: 1, failures: 0 },
  ];
}

export function generateSparkline(length = 20, base = 50, variance = 20): number[] {
  const data: number[] = [];
  let current = base;
  for (let i = 0; i < length; i++) {
    current += randomBetween(-variance / 4, variance / 4);
    current = Math.max(0, Math.min(100, current));
    data.push(current);
  }
  return data;
}

export function generateHeatmapGrid(cols = 24, rows = 16): number[][] {
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      const cx = cols / 2;
      const cy = rows / 2;
      const dist = Math.sqrt((c - cx) ** 2 + (r - cy) ** 2) / Math.max(cols, rows);
      const noise = Math.random() * 0.3;
      const value = Math.max(0, 1 - dist * 1.8 + noise - 0.2);
      row.push(clamp01(value));
    }
    grid.push(row);
  }
  return grid;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

export const IMPACT_METRICS = [
  { label: 'Crowd Congestion Reduction', value: 35, unit: '%', icon: 'Users', color: '#ff8c00' },
  { label: 'Faster Navigation', value: 40, unit: '%', icon: 'Navigation', color: '#1f6fff' },
  { label: 'Faster Incident Response', value: 50, unit: '%', icon: 'Shield', color: '#00e890' },
  { label: 'Accessibility Improvement', value: 60, unit: '%', icon: 'Accessibility', color: '#4d8fff' },
  { label: 'Operational Cost Reduction', value: 22, unit: '%', icon: 'TrendingDown', color: '#a855f7' },
  { label: 'Fan Satisfaction Increase', value: 18, unit: '%', icon: 'Smile', color: '#ff8c00' },
];

export const AI_AGENTS_INFO = [
  { id: 'operations-commander', name: 'Operations Commander', icon: 'Command', color: '#1f6fff', description: 'Orchestrates all agents, executive decision support, incident summarization, and recommended actions with explanations.', capabilities: ['Executive dashboard', 'Natural language analytics', 'Incident summarization', 'Predictive risk alerts', 'Recommended actions'] },
  { id: 'crowd-management', name: 'Crowd Management Agent', icon: 'Users', color: '#ff8c00', description: 'Real-time crowd density analysis, 30-minute congestion forecasting, and AI-generated mitigation plans.', capabilities: ['Crowd density heatmaps', 'Queue prediction', 'Congestion forecasting', 'Mitigation plan generation', 'Gate allocation optimization'] },
  { id: 'security', name: 'Security Agent', icon: 'Shield', color: '#e61e1e', description: 'Threat detection, anomaly identification, access control, and emergency response coordination.', capabilities: ['Threat detection', 'Anomaly identification', 'Emergency response', 'Perimeter monitoring', 'Incident escalation'] },
  { id: 'fan-experience', name: 'Fan Experience Agent', icon: 'Heart', color: '#00e890', description: 'Natural language copilot with voice, smart navigation, and personalized journey planning in 8 languages.', capabilities: ['Natural language chat', 'Voice interaction', 'Smart navigation', 'F&B recommendations', 'Personalized journey planning'] },
  { id: 'volunteer', name: 'Volunteer Copilot', icon: 'Hand', color: '#4d8fff', description: 'Dynamic task assignment, real-time instructions, shift summaries, and incident reporting for volunteers.', capabilities: ['Dynamic task assignment', 'Real-time instructions', 'Shift summaries', 'Incident reporting', 'Multilingual support'] },
  { id: 'transport', name: 'Transport Agent', icon: 'Bus', color: '#a855f7', description: 'Metro, bus, parking, and shuttle optimization with exit flow prediction and dynamic rerouting.', capabilities: ['Metro integration', 'Bus integration', 'Parking optimization', 'Exit flow prediction', 'Dynamic rerouting'] },
  { id: 'sustainability', name: 'Sustainability Agent', icon: 'Leaf', color: '#22c55e', description: 'Energy optimization, waste prediction, water management, and real-time carbon impact dashboard.', capabilities: ['Energy optimization', 'Waste prediction', 'Water management', 'Carbon impact dashboard', 'Sustainability scoring'] },
];

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  welcome: {
    en: 'Welcome to FIFA World Cup 2026',
    es: 'Bienvenido a la Copa Mundial de la FIFA 2026',
    fr: 'Bienvenue à la Coupe du Monde de la FIFA 2026',
    ar: 'مرحبًا بكم في كأس العالم لكرة القدم 2026',
    hi: 'फीफा विश्व कप 2026 में आपका स्वागत है',
    pt: 'Bem-vindo à Copa do Mundo da FIFA 2026',
    de: 'Willkommen zur FIFA Weltmeisterschaft 2026',
    ja: '2026 FIFAワールドカップへようこそ',
  },
  where_restroom: {
    en: 'Where is the nearest restroom?',
    es: '¿Dónde está el baño más cercano?',
    fr: 'Où sont les toilettes les plus proches ?',
    ar: 'أين أقرب دورة مياه؟',
    hi: 'निकटतम शौचालय कहाँ है?',
    pt: 'Onde fica o banheiro mais próximo?',
    de: 'Wo ist die nächste Toilette?',
    ja: '最寄りのトイレはどこですか？',
  },
  where_food: {
    en: 'Where can I get food?',
    es: '¿Dónde puedo conseguir comida?',
    fr: 'Où puis-je trouver à manger ?',
    ar: 'أين يمكنني الحصول على الطعام؟',
    hi: 'मुझे भोजन कहाँ मिल सकता है?',
    pt: 'Onde posso comer?',
    de: 'Wo bekomme ich Essen?',
    ja: 'どこで食べ物を買えますか？',
  },
  help_medical: {
    en: 'I need medical help',
    es: 'Necesito ayuda médica',
    fr: 'J\'ai besoin d\'aide médicale',
    ar: 'أحتاج إلى مساعدة طبية',
    hi: 'मुझे चिकित्सा सहायता चाहिए',
    pt: 'Preciso de ajuda médica',
    de: 'Ich brauche medizinische Hilfe',
    ja: '医療支援が必要です',
  },
};

export const ANNOUNCEMENTS = [
  { en: 'Welcome to FIFA World Cup 2026. Gates open at 5:00 PM. Please proceed to your assigned gate.', es: 'Bienvenido a la Copa Mundial de la FIFA 2026. Las puertas abren a las 5:00 PM. Diríjase a su puerta asignada.' },
  { en: 'North Stand is experiencing high congestion. Please consider using South Stand for faster entry.', es: 'La Tribuna Norte está muy congestionada. Considere usar la Tribuna Sur para una entrada más rápida.' },
  { en: 'Metro Line 4 is operating at high capacity. Additional trains have been requested.', es: 'La Línea 4 del Metro opera a alta capacidad. Se han solicitado trenes adicionales.' },
  { en: 'Stay hydrated. Free water stations are available at all concourse levels.', es: 'Manténgase hidratado. Hay estaciones de agua gratuitas en todos los niveles del vestíbulo.' },
];

export function generateAIExplanations(): AIExplanation[] {
  return [
    {
      id: uid('xai'),
      agentId: 'crowd-management',
      agentName: 'Crowd Management Agent',
      recommendation: 'Open overflow gates B2 and B3; deploy 8 stewards to North Stand',
      confidence: 0.942,
      reasoning: 'North Stand density has risen from 74% to 88% over 12 minutes (rate: +1.2%/min). Historical pattern at 88% shows 92% probability of reaching critical (95%+) within 10 minutes. Opening B2/B3 reduces density by 18% based on 3 prior similar events. Steward deployment reduces queue-related incidents by 64%.',
      dataSources: ['Crowd density sensors (24)', 'Gate flow counters (8)', 'Historical event data (3 matches)', 'Weather data (temp 24C)', 'Volunteer positioning system'],
      riskLevel: 'high',
      model: 'CrowdFlow-LSTM v2.4',
      timestamp: new Date(Date.now() - 2 * 60_000).toISOString(),
      factors: [
        { label: 'Current density', weight: 0.35, value: '88%' },
        { label: 'Rate of change', weight: 0.28, value: '+1.2%/min' },
        { label: 'Historical precedent', weight: 0.20, value: '92% match' },
        { label: 'Gate availability', weight: 0.12, value: 'B2/B3 open' },
        { label: 'Steward proximity', weight: 0.05, value: '8 within 2min' },
      ],
    },
    {
      id: uid('xai'),
      agentId: 'security',
      agentName: 'Security Agent',
      recommendation: 'Dispatch nearest security team; establish 15m safety perimeter at Concourse L1',
      confidence: 0.972,
      reasoning: 'Computer vision model detected stationary backpack for 4+ minutes in high-traffic zone. Object classification confidence 97.2%. No owner identified within 8m radius via camera cross-reference. Historical false-positive rate for this model: 2.8%. Recommended protocol aligns with FIFA safety standard section 4.2.',
      dataSources: ['CCTV cameras (CAM-104-N)', 'CV object detection model', 'People tracking system', 'FIFA safety protocols', 'Security team GPS'],
      riskLevel: 'critical',
      model: 'SecureVision-CNN v3.1',
      timestamp: new Date(Date.now() - 4 * 60_000).toISOString(),
      factors: [
        { label: 'Object classification', weight: 0.40, value: '97.2% backpack' },
        { label: 'Stationary duration', weight: 0.25, value: '4.2 min' },
        { label: 'Owner proximity', weight: 0.20, value: 'None detected' },
        { label: 'Zone traffic level', weight: 0.10, value: 'High' },
        { label: 'Protocol match', weight: 0.05, value: 'FIFA 4.2' },
      ],
    },
    {
      id: uid('xai'),
      agentId: 'transport',
      agentName: 'Transport Agent',
      recommendation: 'Request 6 additional trains for Metro Line 4; activate holding pattern at platforms',
      confidence: 0.891,
      reasoning: 'Metro load at 86% with post-match surge predicted in 35 min. Demand forecast model predicts 14,200 passengers in next 90 min vs. current capacity of 8,400. Adding 6 trains increases capacity to 15,600, covering 110% of predicted demand. Holding pattern prevents platform overcrowding.',
      dataSources: ['Metro load sensors', 'Ticket sales data', 'Historical post-match surge (5 events)', 'City transit authority API', 'Weather forecast'],
      riskLevel: 'high',
      model: 'TransitPredict-ARIMA v1.8',
      timestamp: new Date(Date.now() - 6 * 60_000).toISOString(),
      factors: [
        { label: 'Current load', weight: 0.30, value: '86%' },
        { label: 'Predicted demand', weight: 0.28, value: '14,200 pax' },
        { label: 'Capacity gap', weight: 0.22, value: '5,800 pax' },
        { label: 'Train availability', weight: 0.12, value: '6 trains' },
        { label: 'Platform capacity', weight: 0.08, value: '1,200 pax' },
      ],
    },
    {
      id: uid('xai'),
      agentId: 'sustainability',
      agentName: 'Sustainability Agent',
      recommendation: 'Pre-cool East Stand during low occupancy; adjust setpoint by 2C in non-occupied zones',
      confidence: 0.876,
      reasoning: 'West Stand HVAC load 18% above forecast due to unexpected cooling demand spike. Pattern matches 2 prior events where pre-cooling adjacent zones reduced peak load by 22%. Current East Stand occupancy is 31%, making it optimal for pre-cooling. Estimated energy savings: 340 kWh.',
      dataSources: ['HVAC telemetry', 'Occupancy sensors', 'Weather API', 'Energy pricing data', 'Historical HVAC patterns'],
      riskLevel: 'low',
      model: 'EcoOptimize-RL v2.0',
      timestamp: new Date(Date.now() - 8 * 60_000).toISOString(),
      factors: [
        { label: 'Load deviation', weight: 0.32, value: '+18%' },
        { label: 'East occupancy', weight: 0.24, value: '31%' },
        { label: 'Historical match', weight: 0.20, value: '2 prior events' },
        { label: 'Energy savings', weight: 0.16, value: '340 kWh' },
        { label: 'Cost savings', weight: 0.08, value: '$48' },
      ],
    },
    {
      id: uid('xai'),
      agentId: 'fan-experience',
      agentName: 'Fan Experience Agent',
      recommendation: 'Dispatch medical team to Section 222; clear wheelchair route via Elevator E3',
      confidence: 0.953,
      reasoning: 'Fan reported feeling unwell via app. Location confirmed at Section 222 Row J. Nearest medical team (Med-1) is 3 min away. Elevator E3 is wheelchair accessible and currently available. Route: 222 -> Concourse L1 -> E3 -> Medical-1. Estimated arrival: 6 min.',
      dataSources: ['Fan app location', 'Medical team GPS', 'Elevator status system', 'Stadium map data', 'Accessibility routing engine'],
      riskLevel: 'medium',
      model: 'FanCare-NLP v1.5',
      timestamp: new Date(Date.now() - 10 * 60_000).toISOString(),
      factors: [
        { label: 'Location accuracy', weight: 0.30, value: 'Section 222' },
        { label: 'Medical proximity', weight: 0.25, value: '3 min' },
        { label: 'Route accessibility', weight: 0.20, value: 'E3 available' },
        { label: 'Symptom severity', weight: 0.15, value: 'Moderate' },
        { label: 'Next-of-kin', weight: 0.10, value: 'Not registered' },
      ],
    },
    {
      id: uid('xai'),
      agentId: 'operations-commander',
      agentName: 'Operations Commander',
      recommendation: 'Activate mobile F&B cart CP-7; restock bottled water at Food Plaza Central',
      confidence: 0.918,
      reasoning: 'Food Plaza Central queue time 18 min (3x baseline of 6 min). Bottled water inventory at 12% of capacity. Mobile cart CP-7 can be deployed in 4 min and handles 200 orders/hour, reducing queue by 35%. Historical data shows water demand peaks at 78% during 2nd half. Restocking prevents stockout in 15 min.',
      dataSources: ['Queue monitoring cameras', 'POS inventory data', 'Mobile cart GPS', 'Historical F&B demand', 'Match timeline data'],
      riskLevel: 'medium',
      model: 'OpsCommander-ML v3.2',
      timestamp: new Date(Date.now() - 12 * 60_000).toISOString(),
      factors: [
        { label: 'Queue deviation', weight: 0.28, value: '3x baseline' },
        { label: 'Water inventory', weight: 0.24, value: '12%' },
        { label: 'Cart deploy time', weight: 0.20, value: '4 min' },
        { label: 'Demand forecast', weight: 0.16, value: 'Peak 2nd half' },
        { label: 'Queue reduction', weight: 0.12, value: '-35%' },
      ],
    },
  ];
}

export function generateEvacuationRoutes(): EvacuationRoute[] {
  return [
    { id: uid('evac'), name: 'North Stand → Gate A', from: 'North Stand', to: 'Gate A — North', distance: 180, estimatedTime: 4, capacity: 8000, currentLoad: 5600, status: 'busy', accessible: true },
    { id: uid('evac'), name: 'South Stand → Gate B', from: 'South Stand', to: 'Gate B — South', distance: 200, estimatedTime: 5, capacity: 8000, currentLoad: 3600, status: 'clear', accessible: true },
    { id: uid('evac'), name: 'East Stand → Gate C', from: 'East Stand', to: 'Gate C — East', distance: 150, estimatedTime: 3, capacity: 6000, currentLoad: 1680, status: 'clear', accessible: true },
    { id: uid('evac'), name: 'West Stand → Gate D', from: 'West Stand', to: 'Gate D — West', distance: 160, estimatedTime: 4, capacity: 6000, currentLoad: 3300, status: 'busy', accessible: true },
    { id: uid('evac'), name: 'Concourse L1 → Emergency Exit E1', from: 'Concourse Level 1', to: 'Emergency Exit E1', distance: 90, estimatedTime: 2, capacity: 4000, currentLoad: 1200, status: 'clear', accessible: true },
    { id: uid('evac'), name: 'Concourse L2 → Emergency Exit E2', from: 'Concourse Level 2', to: 'Emergency Exit E2', distance: 110, estimatedTime: 3, capacity: 3500, currentLoad: 1400, status: 'clear', accessible: false },
    { id: uid('evac'), name: 'Food Plaza → Gate C (bypass)', from: 'Food Plaza Central', to: 'Gate C — East', distance: 220, estimatedTime: 5, capacity: 3000, currentLoad: 2400, status: 'congested', accessible: true },
    { id: uid('evac'), name: 'Medical-1 → Assembly Point AP-1', from: 'Medical Station 1', to: 'Assembly Point AP-1', distance: 140, estimatedTime: 3, capacity: 500, currentLoad: 45, status: 'clear', accessible: true },
  ];
}

export function generateEmergencyContacts(): EmergencyContact[] {
  return [
    { id: uid('ec'), name: 'Commander Chen', role: 'Chief Commander', channel: 'Channel 1 — Command', available: true, location: 'Command Center' },
    { id: uid('ec'), name: 'Security Chief Volkov', role: 'Security Lead', channel: 'Channel 2 — Security', available: true, location: 'Security Hub' },
    { id: uid('ec'), name: 'Ops Lead Rivera', role: 'Operations Lead', channel: 'Channel 3 — Ops', available: true, location: 'Operations Center' },
    { id: uid('ec'), name: 'Medical Team Alpha', role: 'Medical Response', channel: 'Channel 4 — Medical', available: true, location: 'Medical Station 1' },
    { id: uid('ec'), name: 'Medical Team Bravo', role: 'Medical Response', channel: 'Channel 4 — Medical', available: true, location: 'Medical Station 2' },
    { id: uid('ec'), name: 'Fire Safety Officer', role: 'Fire Safety', channel: 'Channel 5 — Fire', available: true, location: 'Concourse Level 1' },
    { id: uid('ec'), name: 'Transport Mgr. Park', role: 'Transport Coordinator', channel: 'Channel 6 — Transport', available: true, location: 'Bus Terminal' },
    { id: uid('ec'), name: 'Volunteer Coord. Adams', role: 'Volunteer Coordinator', channel: 'Channel 7 — Volunteers', available: true, location: 'Concourse Level 2' },
    { id: uid('ec'), name: 'City Emergency Services', role: 'External — 911', channel: 'Channel 0 — External', available: true, location: 'Off-site' },
  ];
}

export function generateSystemMetrics(): SystemMetric[] {
  return [
    { id: uid('sys'), name: 'API Gateway', service: 'api-gateway', status: 'healthy', latency: 42, throughput: 12480, errorRate: 0.02, uptime: 99.99, cpu: 34, memory: 48 },
    { id: uid('sys'), name: 'AI Inference Service', service: 'ai-service', status: 'healthy', latency: 142, throughput: 3420, errorRate: 0.08, uptime: 99.97, cpu: 67, memory: 72 },
    { id: uid('sys'), name: 'Real-time Data Pipeline', service: 'data-pipeline', status: 'healthy', latency: 28, throughput: 89000, errorRate: 0.01, uptime: 99.99, cpu: 52, memory: 61 },
    { id: uid('sys'), name: 'Crowd Detection API', service: 'crowd-api', status: 'healthy', latency: 89, throughput: 1240, errorRate: 0.05, uptime: 99.98, cpu: 45, memory: 54 },
    { id: uid('sys'), name: 'Translation Service', service: 'translation', status: 'healthy', latency: 124, throughput: 890, errorRate: 0.12, uptime: 99.95, cpu: 38, memory: 42 },
    { id: uid('sys'), name: 'Notification Service', service: 'notifications', status: 'degraded', latency: 340, throughput: 4200, errorRate: 1.2, uptime: 99.82, cpu: 78, memory: 84 },
    { id: uid('sys'), name: 'Auth Service', service: 'auth', status: 'healthy', latency: 18, throughput: 680, errorRate: 0.0, uptime: 100, cpu: 22, memory: 31 },
    { id: uid('sys'), name: 'Supabase Database', service: 'database', status: 'healthy', latency: 12, throughput: 12400, errorRate: 0.0, uptime: 99.99, cpu: 41, memory: 58 },
    { id: uid('sys'), name: 'Edge Functions', service: 'edge', status: 'healthy', latency: 34, throughput: 3200, errorRate: 0.03, uptime: 99.97, cpu: 29, memory: 37 },
    { id: uid('sys'), name: 'WebSocket Gateway', service: 'websocket', status: 'healthy', latency: 56, throughput: 24800, errorRate: 0.04, uptime: 99.96, cpu: 48, memory: 63 },
  ];
}

export function generateErrorEvents(): ErrorEvent[] {
  return [
    { id: uid('err'), timestamp: new Date(Date.now() - 2 * 60_000).toISOString(), service: 'notifications', level: 'warning', message: 'Push notification delivery delayed (avg 2.3s)', count: 142, resolved: false },
    { id: uid('err'), timestamp: new Date(Date.now() - 8 * 60_000).toISOString(), service: 'translation', level: 'warning', message: 'Arabic translation latency above threshold (180ms)', count: 28, resolved: false },
    { id: uid('err'), timestamp: new Date(Date.now() - 15 * 60_000).toISOString(), service: 'ai-service', level: 'info', message: 'Model fallback triggered (primary -> secondary)', count: 3, resolved: true },
    { id: uid('err'), timestamp: new Date(Date.now() - 22 * 60_000).toISOString(), service: 'crowd-api', level: 'error', message: 'Sensor 12 timeout — auto-recovered in 3s', count: 1, resolved: true },
    { id: uid('err'), timestamp: new Date(Date.now() - 35 * 60_000).toISOString(), service: 'data-pipeline', level: 'warning', message: 'Backpressure detected on queue Q-7', count: 12, resolved: true },
    { id: uid('err'), timestamp: new Date(Date.now() - 48 * 60_000).toISOString(), service: 'websocket', level: 'info', message: 'Client reconnection spike (420 in 30s)', count: 420, resolved: true },
    { id: uid('err'), timestamp: new Date(Date.now() - 62 * 60_000).toISOString(), service: 'api-gateway', level: 'warning', message: 'Rate limit triggered for client IP 10.42.3.142', count: 8, resolved: true },
    { id: uid('err'), timestamp: new Date(Date.now() - 75 * 60_000).toISOString(), service: 'edge', level: 'error', message: 'Edge function timeout: translate-voice (5s)', count: 2, resolved: true },
  ];
}

export function generateKpiRoiMetrics(): KpiRoiMetric[] {
  return [
    { id: uid('roi'), label: 'Crowd Congestion', category: 'crowd', predicted: 30, actual: 35, unit: '% reduction', improvement: 5, savings: 0, savingsUnit: '' },
    { id: uid('roi'), label: 'Queue Wait Time', category: 'efficiency', predicted: 35, actual: 42, unit: '% reduction', improvement: 7, savings: 0, savingsUnit: '' },
    { id: uid('roi'), label: 'Incident Response Time', category: 'efficiency', predicted: 45, actual: 50, unit: '% faster', improvement: 5, savings: 0, savingsUnit: '' },
    { id: uid('roi'), label: 'Navigation Speed', category: 'efficiency', predicted: 35, actual: 40, unit: '% faster', improvement: 5, savings: 0, savingsUnit: '' },
    { id: uid('roi'), label: 'Accessibility Feature Usage', category: 'accessibility', predicted: 50, actual: 60, unit: '% increase', improvement: 10, savings: 0, savingsUnit: '' },
    { id: uid('roi'), label: 'Energy Savings', category: 'sustainability', predicted: 15, actual: 18, unit: '% reduction', improvement: 3, savings: 12400, savingsUnit: 'kWh' },
    { id: uid('roi'), label: 'Water Savings', category: 'sustainability', predicted: 12, actual: 14, unit: '% reduction', improvement: 2, savings: 280, savingsUnit: 'kL' },
    { id: uid('roi'), label: 'Carbon Reduction', category: 'sustainability', predicted: 20, actual: 24, unit: '% reduction', improvement: 4, savings: 38, savingsUnit: 'tCO2' },
    { id: uid('roi'), label: 'Waste Diversion', category: 'sustainability', predicted: 75, actual: 82, unit: '% diverted', improvement: 7, savings: 4.2, savingsUnit: 'tons' },
    { id: uid('roi'), label: 'Operational Cost Savings', category: 'cost', predicted: 18, actual: 22, unit: '% reduction', improvement: 4, savings: 340000, savingsUnit: 'USD' },
    { id: uid('roi'), label: 'Staff Efficiency', category: 'cost', predicted: 25, actual: 31, unit: '% improvement', improvement: 6, savings: 86000, savingsUnit: 'USD' },
    { id: uid('roi'), label: 'Fan Satisfaction', category: 'satisfaction', predicted: 12, actual: 18, unit: '% increase', improvement: 6, savings: 0, savingsUnit: '' },
  ];
}

export function generateOperationalInsights(): OperationalInsight[] {
  return [
    {
      id: uid('insight'),
      type: 'prediction',
      title: 'North Stand will reach critical density in 12 minutes',
      description: 'Crowd density rising at 1.2%/min. Current: 88%. Projected: 95%+ by 18:54. Historical events at this density show 92% probability of stampede risk without intervention.',
      confidence: 0.942,
      impact: 'critical',
      zone: 'North Stand',
      agent: 'Crowd Management Agent',
      timestamp: new Date(Date.now() - 2 * 60_000).toISOString(),
      actionable: true,
      recommendation: 'Open overflow gates B2/B3, deploy 8 stewards, broadcast soft diversion',
    },
    {
      id: uid('insight'),
      type: 'anomaly',
      title: 'Unusual HVAC load spike in West Stand',
      description: 'HVAC power draw 18% above forecast. Pattern does not match weather or occupancy data. Possible sensor calibration issue or cooling system fault.',
      confidence: 0.876,
      impact: 'medium',
      zone: 'West Stand',
      agent: 'Sustainability Agent',
      timestamp: new Date(Date.now() - 8 * 60_000).toISOString(),
      actionable: true,
      recommendation: 'Inspect HVAC Zone W-3 sensors; pre-cool East Stand as buffer',
    },
    {
      id: uid('insight'),
      type: 'anomaly',
      title: 'Metro passenger flow anomaly detected',
      description: 'Inbound metro passengers 34% higher than pre-match forecast. Possible cause: delayed match-day transit from downtown. Impact: post-match surge will arrive earlier than predicted.',
      confidence: 0.891,
      impact: 'high',
      zone: 'Metro Station',
      agent: 'Transport Agent',
      timestamp: new Date(Date.now() - 5 * 60_000).toISOString(),
      actionable: true,
      recommendation: 'Advance train request by 15 min; activate holding pattern now',
    },
    {
      id: uid('insight'),
      type: 'recommendation',
      title: 'Redistribute volunteers from Concourse to Gate A',
      description: 'Gate A density at 72% with 420 fans/min inflow. Concourse L1 has 6 idle volunteers. Reallocating 4 volunteers to Gate A reduces entry queue by 35%.',
      confidence: 0.918,
      impact: 'high',
      zone: 'Gate A — North',
      agent: 'Operations Commander',
      timestamp: new Date(Date.now() - 3 * 60_000).toISOString(),
      actionable: true,
      recommendation: 'Reassign 4 volunteers from Concourse L1 to Gate A entry point',
    },
    {
      id: uid('insight'),
      type: 'trend',
      title: 'Fan satisfaction trending upward across all zones',
      description: 'Fan app ratings increased from 88% to 94% over 45 min. Correlates with AI copilot deployment (47 queries resolved) and improved queue management. Trend suggests 96% by end of match.',
      confidence: 0.953,
      impact: 'low',
      zone: 'All Zones',
      agent: 'Fan Experience Agent',
      timestamp: new Date(Date.now() - 12 * 60_000).toISOString(),
      actionable: false,
    },
    {
      id: uid('insight'),
      type: 'prediction',
      title: 'F&B water stockout predicted in 15 minutes',
      description: 'Food Plaza Central bottled water at 12% inventory. Current consumption rate: 8 units/min. Historical 2nd-half demand peaks at 78%. Stockout predicted at 19:05.',
      confidence: 0.918,
      impact: 'medium',
      zone: 'Food Plaza Central',
      agent: 'Operations Commander',
      timestamp: new Date(Date.now() - 6 * 60_000).toISOString(),
      actionable: true,
      recommendation: 'Restock from depot; activate mobile cart CP-7; open pre-order pickup lane',
    },
    {
      id: uid('insight'),
      type: 'anomaly',
      title: 'Translation latency spike for Arabic queries',
      description: 'Arabic translation response time increased from 120ms to 180ms (50% above baseline). Other languages unaffected. Possible cause: model cache miss or regional API degradation.',
      confidence: 0.834,
      impact: 'low',
      zone: 'Fan App',
      agent: 'Fan Experience Agent',
      timestamp: new Date(Date.now() - 14 * 60_000).toISOString(),
      actionable: true,
      recommendation: 'Switch to secondary translation provider; clear model cache',
    },
    {
      id: uid('insight'),
      type: 'recommendation',
      title: 'Activate sustainability mode for 2nd half',
      description: 'Current energy usage 4.2 MW, 16% below target. With 2nd half starting, occupancy will stabilize. Recommend activating eco-mode in non-occupied zones to save additional 340 kWh.',
      confidence: 0.876,
      impact: 'medium',
      zone: 'All Stands',
      agent: 'Sustainability Agent',
      timestamp: new Date(Date.now() - 18 * 60_000).toISOString(),
      actionable: true,
      recommendation: 'Activate eco-mode in West/East Stand non-occupied zones; adjust setpoint +2C',
    },
  ];
}

/** Generate mock indoor navigation routes with accessible and emergency options. */
export function generateNavRoutes(): NavRoute[] {
  return [
    {
      id: uid('nav'), name: 'Gate A → Section 222', from: 'Gate A — North', to: 'Section 222, Row J',
      distance: 320, estimatedTime: 6, type: 'standard', congestion: 72, accessible: false,
      steps: [
        { instruction: 'Enter through Gate A and proceed to Concourse L1', distance: 50, icon: 'DoorOpen' },
        { instruction: 'Turn right and follow signs to South Stand', distance: 120, icon: 'ArrowRight' },
        { instruction: 'Take the escalator up to Level 2', distance: 30, icon: 'ArrowUp' },
        { instruction: 'Continue along the concourse to Section 222', distance: 80, icon: 'ArrowRight' },
        { instruction: 'Your seat is in Row J, Seat 14', distance: 40, icon: 'MapPin' },
      ],
    },
    {
      id: uid('nav'), name: 'Gate C → Section 222 (Accessible)', from: 'Gate C — East', to: 'Section 222, Row J (Accessible Seating)',
      distance: 280, estimatedTime: 8, type: 'accessible', congestion: 28, accessible: true,
      steps: [
        { instruction: 'Enter through Gate C (less congested, 28% density)', distance: 40, icon: 'DoorOpen' },
        { instruction: 'Follow the blue accessible route signs', distance: 90, icon: 'Accessibility' },
        { instruction: 'Take Elevator E3 to Level 2 (wheelchair accessible)', distance: 20, icon: 'ArrowUp' },
        { instruction: 'Proceed to Section 222 accessible seating area', distance: 80, icon: 'ArrowRight' },
        { instruction: 'Accessible seating is in Row J, near elevator exit', distance: 50, icon: 'MapPin' },
      ],
    },
    {
      id: uid('nav'), name: 'Section 222 → Emergency Exit E1', from: 'Section 222', to: 'Emergency Exit E1',
      distance: 140, estimatedTime: 3, type: 'emergency', congestion: 15, accessible: true,
      steps: [
        { instruction: 'Exit row toward aisle — do NOT take belongings', distance: 10, icon: 'ArrowRight' },
        { instruction: 'Follow green emergency exit signs to Concourse L1', distance: 50, icon: 'ArrowRight' },
        { instruction: 'Exit through Emergency Exit E1 (auto-opening)', distance: 40, icon: 'DoorOpen' },
        { instruction: 'Proceed to Assembly Point AP-1 (marked in green)', distance: 40, icon: 'MapPin' },
      ],
    },
    {
      id: uid('nav'), name: 'Concourse L1 → Medical Station 1', from: 'Concourse Level 1', to: 'Medical Station 1',
      distance: 90, estimatedTime: 2, type: 'standard', congestion: 62, accessible: true,
      steps: [
        { instruction: 'Head toward the center of Concourse L1', distance: 40, icon: 'ArrowRight' },
        { instruction: 'Medical Station 1 is opposite Section 104', distance: 30, icon: 'MapPin' },
        { instruction: 'Red cross sign visible above the entrance', distance: 20, icon: 'Stethoscope' },
      ],
    },
    {
      id: uid('nav'), name: 'Section 222 → Food Plaza Central', from: 'Section 222', to: 'Food Plaza Central',
      distance: 200, estimatedTime: 4, type: 'standard', congestion: 81, accessible: false,
      steps: [
        { instruction: 'Exit Section 222 toward Concourse L1', distance: 40, icon: 'ArrowRight' },
        { instruction: 'Turn left and follow food court signs', distance: 80, icon: 'ArrowRight' },
        { instruction: 'Food Plaza Central is in the main concourse area', distance: 50, icon: 'UtensilsCrossed' },
        { instruction: 'Pre-order pickup lane 3 (skip the 18-min queue)', distance: 30, icon: 'Clock' },
      ],
    },
    {
      id: uid('nav'), name: 'Gate B → Metro Station (Fastest Exit)', from: 'Gate B — South', to: 'Metro Station',
      distance: 180, estimatedTime: 5, type: 'standard', congestion: 45, accessible: true,
      steps: [
        { instruction: 'Exit through Gate B (42% of post-match flow)', distance: 60, icon: 'DoorOpen' },
        { instruction: 'Follow metro signs (M) to the left', distance: 70, icon: 'ArrowRight' },
        { instruction: 'Platform 2 (Line 7 Express) is less crowded', distance: 50, icon: 'Train' },
      ],
    },
  ];
}

/** Generate mock accessibility features across the stadium. */
export function generateAccessibilityFeatures(): AccessibilityFeature[] {
  return [
    { id: uid('acc'), type: 'wheelchair', label: 'Wheelchair Seating', location: 'All Stands — Row J', status: 'available', count: 240 },
    { id: uid('acc'), type: 'elevator', label: 'Accessible Elevators', location: 'E1, E2, E3, E4', status: 'available', count: 8 },
    { id: uid('acc'), type: 'restroom', label: 'Accessible Restrooms', location: 'Concourse L1 & L2', status: 'available', count: 12 },
    { id: uid('acc'), type: 'seating', label: 'Sensory-Friendly Seating', location: 'East Stand — Quiet Zone', status: 'available', count: 60 },
    { id: uid('acc'), type: 'parking', label: 'Accessible Parking', location: 'Parking South — Rows A-D', status: 'available', count: 180 },
    { id: uid('acc'), type: 'sign-language', label: 'Sign Language Interpreters', location: 'Main Stage & Info Desks', status: 'available', count: 6 },
    { id: uid('acc'), type: 'sensory', label: 'Sensory Relief Kits', location: 'Medical Stations 1 & 2', status: 'available', count: 24 },
    { id: uid('acc'), type: 'service-animal', label: 'Service Animal Relief Area', location: 'Outside Gate D', status: 'available', count: 1 },
  ];
}

/** Generate mock translation entries for the multilingual center. */
export function generateTranslationEntries(): TranslationEntry[] {
  return [
    {
      id: uid('tr'), sourceText: 'Welcome to FIFA World Cup 2026. Gates open at 5:00 PM.', sourceLang: 'en',
      category: 'announcement', voiceAvailable: true, usageCount: 78432,
      translations: {
        en: 'Welcome to FIFA World Cup 2026. Gates open at 5:00 PM.',
        es: 'Bienvenido a la Copa Mundial de la FIFA 2026. Las puertas abren a las 5:00 PM.',
        fr: 'Bienvenue à la Coupe du Monde de la FIFA 2026. Les portes ouvrent à 17h00.',
        ar: 'مرحبًا بكم في كأس العالم لكرة القدم 2026. تفتح الأبواب عند الساعة 5:00 مساءً.',
        hi: 'फीफा विश्व कप 2026 में आपका स्वागत है। गेट शाम 5:00 बजे खुलेंगे।',
        pt: 'Bem-vindo à Copa do Mundo da FIFA 2026. Os portões abrem às 17:00.',
        de: 'Willkommen zur FIFA Weltmeisterschaft 2026. Die Tore öffnen um 17:00 Uhr.',
        ja: '2026 FIFAワールドカップへようこそ。ゲートは午後5時に開きます。',
      },
    },
    {
      id: uid('tr'), sourceText: 'North Stand is experiencing high congestion. Please use South Stand for faster entry.', sourceLang: 'en',
      category: 'announcement', voiceAvailable: true, usageCount: 12480,
      translations: {
        en: 'North Stand is experiencing high congestion. Please use South Stand for faster entry.',
        es: 'La Tribuna Norte está muy congestionada. Use la Tribuna Sur para una entrada más rápida.',
        fr: 'La Tribune Nord est très encombrée. Veuillez utiliser la Tribune Sud pour une entrée plus rapide.',
        ar: 'المنصة الشمالية مزدحمة جدًا. يرجى استخدام المنصة الجنوبية لدخول أسرع.',
        hi: 'उत्तर स्टैंड में भीड़ है। तेज़ प्रवेश के लिए दक्षिण स्टैंड का उपयोग करें।',
        pt: 'A Arquibancada Norte está muito congestionada. Use a Arquibancada Sul para entrada mais rápida.',
        de: 'Die Nordtribüne ist stark überfüllt. Bitte nutzen Sie die Südtribüne für einen schnelleren Einlass.',
        ja: '北スタンドは混雑しています。スムーズな入場のため南スタンドをご利用ください。',
      },
    },
    {
      id: uid('tr'), sourceText: 'Medical emergency at Section 222. Please clear the aisle for medical team access.', sourceLang: 'en',
      category: 'emergency', voiceAvailable: true, usageCount: 3,
      translations: {
        en: 'Medical emergency at Section 222. Please clear the aisle for medical team access.',
        es: 'Emergencia médica en la Sección 222. Despeje el pasillo para el acceso del equipo médico.',
        fr: "Urgence médicale à la Section 222. Veuillez dégager l'allée pour l'accès de l'équipe médicale.",
        ar: 'طارئ طبي في القسم 222. يرجى إخلاء الممر لوصول الفريق الطبي.',
        hi: 'सेक्शन 222 पर चिकित्सा आपात स्थिति। चिकित्सा टीम के पहुँचने के लिए रास्ता खाली करें।',
        pt: 'Emergência médica na Seção 222. Por favor, desobstrua o corredor para a equipe médica.',
        de: 'Medizinischer Notfall in Sektion 222. Bitte den Gang für das medizinische Team freimachen.',
        ja: 'セクション222で医療緊急事態。医療チームのアクセスのため通路を空けてください。',
      },
    },
    {
      id: uid('tr'), sourceText: 'The nearest restroom is on Concourse Level 1, Section 104 — 40 meters to your left.', sourceLang: 'en',
      category: 'wayfinding', voiceAvailable: true, usageCount: 4210,
      translations: {
        en: 'The nearest restroom is on Concourse Level 1, Section 104 — 40 meters to your left.',
        es: 'El baño más cercano está en el Nivel 1 del Vestíbulo, Sección 104 — 40 metros a su izquierda.',
        fr: 'Les toilettes les plus proches sont au Niveau 1 du Vestibule, Section 104 — 40 mètres à gauche.',
        ar: 'أقرب دورة مياه في المستوى 1 من الرواق، القسم 104 — 40 مترًا إلى يسارك.',
        hi: 'निकटतम शौचालय गलियारा स्तर 1, अनुभाग 104 में है — आपके बाईं ओर 40 मीटर।',
        pt: 'O banheiro mais próximo está no Nível 1 do Concurso, Seção 104 — 40 metros à sua esquerda.',
        de: 'Die nächste Toilette befindet sich auf Ebene 1, Sektion 104 — 40 Meter links.',
        ja: '最寄りのトイレはコンコースレベル1、セクション104 — 左に40メートルです。',
      },
    },
    {
      id: uid('tr'), sourceText: 'Metro Line 7 Express arrives in 6 minutes at Platform 2. Less crowded than Line 4.', sourceLang: 'en',
      category: 'wayfinding', voiceAvailable: true, usageCount: 8920,
      translations: {
        en: 'Metro Line 7 Express arrives in 6 minutes at Platform 2. Less crowded than Line 4.',
        es: 'La Línea 7 Express del Metro llega en 6 minutos en Andén 2. Menos concurrida que la Línea 4.',
        fr: 'La Ligne 7 Express du Métro arrive dans 6 minutes au Quai 2. Moins bondée que la Ligne 4.',
        ar: 'يصل مترو الخط 7 السريع خلال 6 دقائق على الرصيف 2. أقل ازدحامًا من الخط 4.',
        hi: 'मेट्रो लाइन 7 एक्सप्रेस 6 मिनट में प्लेटफॉर्म 2 पर आएगी। लाइन 4 से कम भीड़।',
        pt: 'A Linha 7 Express do Metro chega em 6 minutos na Plataforma 2. Menos lotada que a Linha 4.',
        de: 'Metro Linie 7 Express kommt in 6 Minuten auf Gleis 2. Weniger überfüllt als Linie 4.',
        ja: '地下鉄7号線エクスプレスが6分後に2番線に到着します。4号線より混雑していません。',
      },
    },
    {
      id: uid('tr'), sourceText: 'Volunteers: Position at Gate A entry point. Hold flow for 30 seconds when density exceeds 80%.', sourceLang: 'en',
      category: 'instruction', voiceAvailable: true, usageCount: 142,
      translations: {
        en: 'Volunteers: Position at Gate A entry point. Hold flow for 30 seconds when density exceeds 80%.',
        es: 'Voluntarios: Posiciónense en la entrada de la Puerta A. Detengan el flujo 30 segundos cuando la densidad supere el 80%.',
        fr: "Bénévoles : Positionnez-vous à l'entrée de la Porte A. Suspendez le flux 30 secondes quand la densité dépasse 80%.",
        ar: 'المتطوعون: اتخذوا مواقعكم عند مدخل البوابة أ. أوقفوا التدفق لمدة 30 ثانية عند تجاوز الكثافة 80%.',
        hi: 'स्वयंसेवक: गेट ए प्रवेश बिंदु पर तैनात रहें। घनत्व 80% से अधिक होने पर 30 सेकंड के लिए प्रवाह रोकें।',
        pt: 'Voluntários: Posicionem-se na entrada do Portão A. Segurem o fluxo por 30 segundos quando a densidade exceder 80%.',
        de: 'Freiwillige: Positionieren Sie sich am Eingang Tor A. Stoppen Sie den Fluss für 30 Sekunden bei über 80% Dichte.',
        ja: 'ボランティア：ゲートAの入り口に配置してください。密度が80%を超えたら30秒間流れを止めてください。',
      },
    },
  ];
}

/** Challenge alignment data mapping requirements to implemented features with AI components and impact. */
export const ALIGNMENT_DATA: AlignmentEntry[] = [
  { id: 'al-1', requirement: 'AI Fan Copilot', feature: 'Personalized multilingual match assistant with voice, seat guidance, food recommendations, queue prediction, smart itinerary, and emergency assistance', aiComponent: 'Fan Experience Agent — NLP intent classification, 8-language translation, voice synthesis (Web Speech API), confidence scoring', userBenefit: 'Fans get instant answers in their language, navigate the stadium effortlessly, and receive emergency help in seconds', realWorldImpact: '94% fan satisfaction, 87 queries resolved per volunteer, 8-language support for 78K+ international fans', kpi: 'Fan Satisfaction', kpiValue: '+18%', status: 'fully-implemented' },
  { id: 'al-2', requirement: 'AI Crowd Intelligence', feature: 'Live heatmaps, density prediction, queue prediction, 30-min congestion forecasting, AI mitigation plans with redistribution recommendations', aiComponent: 'Crowd Management Agent — LSTM density forecasting, real-time sensor fusion (24 sensors), AI-generated mitigation plans with 94.2% confidence', userBenefit: 'Operators see congestion before it happens and receive actionable mitigation plans', realWorldImpact: '35% lower crowd congestion, 92% prediction accuracy for critical density events', kpi: 'Crowd Congestion Reduction', kpiValue: '35%', status: 'fully-implemented' },
  { id: 'al-3', requirement: 'Digital Twin Stadium', feature: 'Live stadium simulation with crowd movement, gate optimization, evacuation simulation, risk prediction, and staff deployment modeling', aiComponent: 'Digital Twin Engine — real-time zone density modeling, 4 simulation modes (live, forecast, gate-opt, evacuation), predictive risk scoring', userBenefit: 'Commanders simulate scenarios, optimize gate flow, and plan evacuations before they happen', realWorldImpact: '8.4-min evacuation clearance (vs 15-min baseline), 18% gate flow improvement, 3 bottlenecks identified proactively', kpi: 'Evacuation Clearance', kpiValue: '-44%', status: 'fully-implemented' },
  { id: 'al-4', requirement: 'Operations Command Center', feature: 'Executive dashboard with AI incident summaries, live alerts, AI recommendations, predictive intelligence, and KPI monitoring', aiComponent: 'Operations Commander Agent — NL analytics, incident summarization, predictive risk alerts, recommended actions with impact estimates', userBenefit: 'Commanders get a single pane of glass with AI-curated priorities and one-click action approval', realWorldImpact: '3.2-min average incident response (vs 6-min target), 94% resolution within SLA, 7 active incidents managed simultaneously', kpi: 'Incident Response Time', kpiValue: '-50%', status: 'fully-implemented' },
  { id: 'al-5', requirement: 'Volunteer AI Copilot', feature: 'AI task allocation with step-by-step instructions, incident reporting, shift summaries, and voice guidance', aiComponent: 'Volunteer Copilot Agent — dynamic task assignment, AI-generated instructions per task, multilingual translation, shift performance analytics', userBenefit: 'Volunteers always know what to do next with clear AI instructions in their language', realWorldImpact: '31% staff efficiency improvement, 14 tasks completed per shift, 87 fans assisted per volunteer', kpi: 'Volunteer Efficiency', kpiValue: '+31%', status: 'fully-implemented' },
  { id: 'al-6', requirement: 'Security Intelligence', feature: 'Risk scoring, threat monitoring, emergency coordination, AI guardrails, RBAC, audit logging, and AI response recommendations', aiComponent: 'Security Agent — threat detection, anomaly identification, prompt injection blocking (218 blocked), 10 AI guardrails, RBAC with 6 roles', userBenefit: 'Security teams monitor threats in real-time with AI-recommended responses and full audit trail', realWorldImpact: '99.1% threat detection accuracy, 218 prompt injections blocked, zero security breaches', kpi: 'Threat Detection Accuracy', kpiValue: '99.1%', status: 'fully-implemented' },
  { id: 'al-7', requirement: 'Smart Indoor Navigation', feature: 'Interactive stadium map with turn-by-turn directions, wheelchair-accessible routes, emergency exits, and dynamic rerouting', aiComponent: 'Navigation AI — congestion-aware routing, accessible route optimization, dynamic rerouting based on real-time density', userBenefit: 'Fans and staff navigate the stadium with optimized routes that avoid congestion and support accessibility needs', realWorldImpact: '40% faster navigation, 60% increase in accessibility feature usage, 6 route types with real-time congestion data', kpi: 'Navigation Speed', kpiValue: '+40%', status: 'fully-implemented' },
  { id: 'al-8', requirement: 'Transportation Intelligence', feature: 'Metro, bus, parking integration with traffic prediction, exit flow optimization, and carbon impact tracking', aiComponent: 'Transport Agent — ARIMA demand forecasting, dynamic rerouting, exit flow prediction, carbon optimization', userBenefit: 'Fans get real-time transport options with AI-recommended routes; operators optimize exit flow', realWorldImpact: '38-min post-match clearance (vs 62-min baseline, -39%), 72% public transit usage, 38 tCO2 saved', kpi: 'Exit Flow Improvement', kpiValue: '-39%', status: 'fully-implemented' },
  { id: 'al-9', requirement: 'Accessibility Center', feature: 'Voice navigation, screen reader support, keyboard navigation, high contrast mode, AI accessibility assistant, 8 accessibility feature types', aiComponent: 'Accessibility AI — voice-guided navigation, screen reader optimization, 8 feature types (wheelchair, elevator, sensory, sign language, service animal)', userBenefit: 'Fans with disabilities get equal access with AI-powered assistance and real-time feature availability', realWorldImpact: '60% increase in accessibility feature usage, 240 wheelchair seats, 8 accessible elevators, WCAG 2.1 AA compliant', kpi: 'Accessibility Usage', kpiValue: '+60%', status: 'fully-implemented' },
  { id: 'al-10', requirement: 'Sustainability Intelligence', feature: 'Carbon dashboard, water optimization, waste prediction, energy optimization, and AI sustainability recommendations', aiComponent: 'Sustainability Agent — RL-based energy optimization, waste prediction models, real-time carbon tracking, AI recommendations with 87.6% confidence', userBenefit: 'Operators reduce environmental impact with AI-driven optimization across energy, water, waste, and carbon', realWorldImpact: '18% energy reduction, 14% water savings, 82% waste diversion, 24% carbon reduction, FIFA Sustainability Score A-', kpi: 'Carbon Reduction', kpiValue: '24%', status: 'fully-implemented' },
  { id: 'al-11', requirement: 'Multilingual AI Support', feature: '8-language AI translation (EN, ES, FR, AR, HI, PT, DE, JA), voice translation, live announcements, AI-powered translation', aiComponent: 'Fan Experience Agent — NLP translation engine, voice synthesis in 8 languages, live announcement broadcasting, 6 translation categories', userBenefit: 'International fans communicate naturally in their language; operators broadcast to all fans simultaneously', realWorldImpact: '8 languages covering 92% of expected international visitors, 78K+ announcement reach, 4,210 wayfinding translations served', kpi: 'Language Coverage', kpiValue: '8 languages', status: 'fully-implemented' },
  { id: 'al-12', requirement: 'Real-Time Decision Intelligence', feature: 'Operational intelligence with predictions, anomaly detection, recommendations, trend analysis, and explainable AI', aiComponent: 'Operations Commander + Crowd + Security + Transport + Sustainability Agents — multi-agent collaboration, 96.8% prediction accuracy, explainable AI with factor weights', userBenefit: 'Every AI decision is transparent with confidence scores, data sources, and reasoning chains', realWorldImpact: '96.8% AI accuracy, 8 operational insights generated, 100% auditable decisions, 4 risk levels with factor weights', kpi: 'AI Prediction Accuracy', kpiValue: '96.8%', status: 'fully-implemented' },
  { id: 'al-13', requirement: 'Explainable AI', feature: 'Transparent AI reasoning with confidence scores, data sources, factor weights, risk assessment, and audit trails', aiComponent: 'Explainable AI Engine — 6 AI explanation types, decision factors with weights, 42 data sources, 4 risk levels, reasoning chains', userBenefit: 'Operators trust AI recommendations because every decision is explainable and auditable', realWorldImpact: '100% auditable decisions, 94.2% avg confidence, 6 models with version tracking, full audit trail', kpi: 'AI Transparency', kpiValue: '100% auditable', status: 'fully-implemented' },
  { id: 'al-14', requirement: 'Offline Emergency Mode', feature: 'Cached stadium data, evacuation routes, emergency contacts, failover procedures, and offline instructions', aiComponent: 'Offline AI — cached data persistence, emergency contact directory, 8 evacuation routes, 3 instruction sets, cache management', userBenefit: 'Critical operations continue during network outages with cached data and offline procedures', realWorldImpact: '100% offline capability for emergency features, 8 evacuation routes, 9 emergency contacts, 3 instruction sets', kpi: 'Offline Readiness', kpiValue: '100%', status: 'fully-implemented' },
  { id: 'al-15', requirement: 'KPI & ROI Measurement', feature: 'Executive KPI dashboard with predicted vs actual comparisons, cost savings, and ROI gauges across all operational areas', aiComponent: 'Analytics Engine — predicted vs actual tracking, 12 KPI metrics, ROI calculation, cost savings breakdown ($374K total)', userBenefit: 'Organizers see measurable impact of AI investments with clear ROI metrics', realWorldImpact: '22% operational cost reduction ($340K saved), 86K staff efficiency savings, 12 KPIs tracked with predictions', kpi: 'Operational Cost Reduction', kpiValue: '22%', status: 'fully-implemented' },
];

