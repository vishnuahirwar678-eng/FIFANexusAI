export type UserRole = 'commander' | 'operations' | 'security' | 'volunteer' | 'fan' | 'transport' | 'sustainability';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  zone?: string;
  shift?: string;
}

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'monitoring';

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  zone: string;
  timestamp: string;
  source: string;
  recommendedActions: string[];
  confidence: number;
}

export type AgentId =
  | 'fan-experience'
  | 'crowd-management'
  | 'security'
  | 'volunteer'
  | 'transport'
  | 'sustainability'
  | 'operations-commander';

export interface AgentStatus {
  id: AgentId;
  name: string;
  status: 'online' | 'degraded' | 'offline';
  load: number;
  tasksHandled: number;
  accuracy: number;
  latencyMs: number;
  lastAction: string;
  icon: string;
  color: string;
}

export interface Zone {
  id: string;
  name: string;
  type: 'stand' | 'concourse' | 'gate' | 'parking' | 'transport' | 'food' | 'medical';
  density: number;
  capacity: number;
  flowRate: number;
  temperature: number;
  status: 'normal' | 'busy' | 'congested' | 'critical';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  language: string;
  agent?: AgentId;
  translated?: string;
  confidence?: number;
  actions?: RecommendedAction[];
}

export interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  impact: string;
  effort: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'executing' | 'completed';
}

export interface KPI {
  id: string;
  label: string;
  value: number;
  unit: string;
  target: number;
  trend: number;
  sparkline: number[];
  category: 'crowd' | 'security' | 'sustainability' | 'transport' | 'fan' | 'ops';
  status: 'good' | 'warning' | 'critical';
}

export interface VolunteerTask {
  id: string;
  volunteerId: string;
  volunteerName: string;
  title: string;
  description: string;
  zone: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'assigned' | 'in-progress' | 'completed' | 'overdue';
  assignedAt: string;
  dueAt: string;
  aiInstructions: string[];
}

export interface TransportRoute {
  id: string;
  type: 'metro' | 'bus' | 'parking' | 'shuttle';
  name: string;
  load: number;
  capacity: number;
  eta: number;
  status: 'normal' | 'busy' | 'congested' | 'delayed';
  nextArrival: string;
  carbon: number;
}

export interface SustainabilityMetric {
  id: string;
  category: 'energy' | 'water' | 'waste' | 'carbon';
  label: string;
  value: number;
  unit: string;
  target: number;
  trend: number;
  status: 'good' | 'warning' | 'critical';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  ip: string;
  status: 'success' | 'denied' | 'error';
  details: string;
}

export interface TestResult {
  id: string;
  category: 'unit' | 'integration' | 'e2e' | 'accessibility' | 'security' | 'performance' | 'load' | 'ai-accuracy' | 'uptime';
  name: string;
  status: 'passing' | 'failing' | 'skipped' | 'running';
  coverage: number;
  duration: number;
  lastRun: string;
  assertions: number;
  failures: number;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface AIExplanation {
  id: string;
  agentId: AgentId;
  agentName: string;
  recommendation: string;
  confidence: number;
  reasoning: string;
  dataSources: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  model: string;
  timestamp: string;
  factors: { label: string; weight: number; value: string }[];
}

export interface EvacuationRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  distance: number;
  estimatedTime: number;
  capacity: number;
  currentLoad: number;
  status: 'clear' | 'busy' | 'congested' | 'blocked';
  accessible: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  channel: string;
  available: boolean;
  location: string;
}

export interface SystemMetric {
  id: string;
  name: string;
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  throughput: number;
  errorRate: number;
  uptime: number;
  cpu: number;
  memory: number;
}

export interface ErrorEvent {
  id: string;
  timestamp: string;
  service: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  count: number;
  resolved: boolean;
}

export interface KpiRoiMetric {
  id: string;
  label: string;
  category: 'crowd' | 'efficiency' | 'accessibility' | 'sustainability' | 'cost' | 'satisfaction';
  predicted: number;
  actual: number;
  unit: string;
  improvement: number;
  savings: number;
  savingsUnit: string;
}

export interface OperationalInsight {
  id: string;
  type: 'prediction' | 'anomaly' | 'recommendation' | 'trend';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  zone: string;
  agent: string;
  timestamp: string;
  actionable: boolean;
  recommendation?: string;
}

export interface NavRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  distance: number;
  estimatedTime: number;
  type: 'standard' | 'accessible' | 'emergency';
  congestion: number;
  steps: { instruction: string; distance: number; icon: string }[];
  accessible: boolean;
}

export interface AccessibilityFeature {
  id: string;
  type: 'wheelchair' | 'elevator' | 'restroom' | 'seating' | 'parking' | 'sign-language' | 'sensory' | 'service-animal';
  label: string;
  location: string;
  status: 'available' | 'in-use' | 'maintenance';
  count: number;
}

export interface TranslationEntry {
  id: string;
  sourceText: string;
  sourceLang: string;
  translations: Record<string, string>;
  category: 'announcement' | 'instruction' | 'emergency' | 'wayfinding' | 'general';
  voiceAvailable: boolean;
  usageCount: number;
}

export interface AlignmentEntry {
  id: string;
  requirement: string;
  feature: string;
  aiComponent: string;
  userBenefit: string;
  realWorldImpact: string;
  kpi: string;
  kpiValue: string;
  status: 'fully-implemented' | 'partially-implemented';
}

