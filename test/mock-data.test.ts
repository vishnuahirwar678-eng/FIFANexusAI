import { describe, it, expect } from 'vitest';
import {
  generateAlerts, generateVolunteerTasks, generateTransportRoutes,
  generateSustainabilityMetrics, generateAuditLogs, generateTestResults,
  generateSparkline, generateHeatmapGrid, generateAIExplanations,
  generateEvacuationRoutes, generateEmergencyContacts, generateSystemMetrics,
  generateErrorEvents, generateKpiRoiMetrics, generateOperationalInsights,
  generateNavRoutes, generateAccessibilityFeatures, generateTranslationEntries,
  ALIGNMENT_DATA, AGENTS, KPIS, STADIUM_ZONES, LANGUAGES,
  TRANSLATIONS, ANNOUNCEMENTS, IMPACT_METRICS, AI_AGENTS_INFO,
} from '../src/lib/mock-data';

describe('generateAlerts', () => {
  it('generates requested count', () => { expect(generateAlerts(5)).toHaveLength(5); });
  it('generates default count', () => { expect(generateAlerts()).toHaveLength(8); });
  it('generates zero alerts', () => { expect(generateAlerts(0)).toHaveLength(0); });
  it('each alert has required fields', () => {
    const a = generateAlerts(1)[0];
    expect(a).toHaveProperty('id');
    expect(a).toHaveProperty('title');
    expect(a).toHaveProperty('description');
    expect(a).toHaveProperty('severity');
    expect(a).toHaveProperty('status');
    expect(a).toHaveProperty('zone');
    expect(a).toHaveProperty('timestamp');
    expect(a).toHaveProperty('source');
    expect(a).toHaveProperty('recommendedActions');
    expect(a).toHaveProperty('confidence');
  });
  it('confidence is between 0 and 1', () => {
    for (const a of generateAlerts(10)) {
      expect(a.confidence).toBeGreaterThanOrEqual(0);
      expect(a.confidence).toBeLessThanOrEqual(1);
    }
  });
  it('severity is valid enum', () => {
    const valid = ['critical', 'high', 'medium', 'low', 'info'];
    for (const a of generateAlerts(10)) { expect(valid).toContain(a.severity); }
  });
  it('status is valid enum', () => {
    const valid = ['active', 'acknowledged', 'resolved', 'monitoring'];
    for (const a of generateAlerts(10)) { expect(valid).toContain(a.status); }
  });
});

describe('generateVolunteerTasks', () => {
  it('generates tasks', () => { expect(generateVolunteerTasks().length).toBeGreaterThan(0); });
  it('each task has required fields', () => {
    const t = generateVolunteerTasks()[0];
    expect(t).toHaveProperty('id');
    expect(t).toHaveProperty('volunteerName');
    expect(t).toHaveProperty('title');
    expect(t).toHaveProperty('zone');
    expect(t).toHaveProperty('priority');
    expect(t).toHaveProperty('status');
    expect(t).toHaveProperty('aiInstructions');
    expect(Array.isArray(t.aiInstructions)).toBe(true);
  });
});

describe('generateTransportRoutes', () => {
  it('generates routes', () => { expect(generateTransportRoutes().length).toBeGreaterThan(0); });
  it('includes metro, bus, parking types', () => {
    const types = generateTransportRoutes().map(r => r.type);
    expect(types).toContain('metro');
    expect(types).toContain('bus');
    expect(types).toContain('parking');
  });
  it('load is between 0 and capacity', () => {
    for (const r of generateTransportRoutes()) {
      expect(r.load).toBeGreaterThanOrEqual(0);
      expect(r.load).toBeLessThanOrEqual(r.capacity);
    }
  });
});

describe('generateSustainabilityMetrics', () => {
  it('generates metrics', () => { expect(generateSustainabilityMetrics().length).toBeGreaterThan(0); });
  it('includes energy, water, waste, carbon categories', () => {
    const cats = generateSustainabilityMetrics().map(m => m.category);
    expect(cats).toContain('energy');
    expect(cats).toContain('water');
    expect(cats).toContain('waste');
    expect(cats).toContain('carbon');
  });
});

describe('generateAuditLogs', () => {
  it('generates default count', () => { expect(generateAuditLogs()).toHaveLength(12); });
  it('generates requested count', () => { expect(generateAuditLogs(5)).toHaveLength(5); });
  it('each log has required fields', () => {
    const l = generateAuditLogs(1)[0];
    expect(l).toHaveProperty('id');
    expect(l).toHaveProperty('userId');
    expect(l).toHaveProperty('action');
    expect(l).toHaveProperty('timestamp');
    expect(l).toHaveProperty('status');
  });
});

describe('generateTestResults', () => {
  it('generates results', () => { expect(generateTestResults().length).toBeGreaterThan(0); });
  it('includes all test categories', () => {
    const cats = generateTestResults().map(r => r.category);
    expect(cats).toContain('unit');
    expect(cats).toContain('integration');
    expect(cats).toContain('e2e');
    expect(cats).toContain('security');
    expect(cats).toContain('performance');
    expect(cats).toContain('accessibility');
    expect(cats).toContain('ai-accuracy');
  });
  it('coverage is between 0 and 100', () => {
    for (const r of generateTestResults()) {
      expect(r.coverage).toBeGreaterThanOrEqual(0);
      expect(r.coverage).toBeLessThanOrEqual(100);
    }
  });
});

describe('generateSparkline', () => {
  it('generates array of specified length', () => { expect(generateSparkline(20, 50, 20)).toHaveLength(20); });
  it('generates default length', () => { expect(generateSparkline()).toHaveLength(20); });
  it('values are numbers', () => {
    for (const v of generateSparkline(10, 50, 20)) {
      expect(typeof v).toBe('number');
      expect(Number.isFinite(v)).toBe(true);
    }
  });
});

describe('generateHeatmapGrid', () => {
  it('generates grid with specified dimensions', () => {
    const grid = generateHeatmapGrid(24, 16);
    expect(grid).toHaveLength(16);
    expect(grid[0]).toHaveLength(24);
  });
  it('generates default dimensions', () => {
    const grid = generateHeatmapGrid();
    expect(grid).toHaveLength(16);
    expect(grid[0]).toHaveLength(24);
  });
  it('values between 0 and 1', () => {
    for (const row of generateHeatmapGrid(10, 10)) {
      for (const v of row) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    }
  });
  it('generates 1x1 grid', () => {
    const grid = generateHeatmapGrid(1, 1);
    expect(grid).toHaveLength(1);
    expect(grid[0]).toHaveLength(1);
  });
});

describe('generateAIExplanations', () => {
  it('generates explanations', () => { expect(generateAIExplanations().length).toBeGreaterThan(0); });
  it('each explanation has required fields', () => {
    const e = generateAIExplanations()[0];
    expect(e).toHaveProperty('id');
    expect(e).toHaveProperty('agentId');
    expect(e).toHaveProperty('recommendation');
    expect(e).toHaveProperty('confidence');
    expect(e).toHaveProperty('reasoning');
    expect(e).toHaveProperty('dataSources');
    expect(e).toHaveProperty('factors');
  });
  it('confidence is between 0 and 1', () => {
    for (const e of generateAIExplanations()) {
      expect(e.confidence).toBeGreaterThan(0);
      expect(e.confidence).toBeLessThanOrEqual(1);
    }
  });
});

describe('generateEvacuationRoutes', () => {
  it('generates routes', () => { expect(generateEvacuationRoutes().length).toBeGreaterThan(0); });
  it('each route has accessible flag', () => {
    for (const r of generateEvacuationRoutes()) { expect(typeof r.accessible).toBe('boolean'); }
  });
});

describe('generateEmergencyContacts', () => {
  it('generates contacts', () => { expect(generateEmergencyContacts().length).toBeGreaterThan(0); });
  it('each contact has required fields', () => {
    const c = generateEmergencyContacts()[0];
    expect(c).toHaveProperty('id');
    expect(c).toHaveProperty('name');
    expect(c).toHaveProperty('role');
    expect(c).toHaveProperty('available');
  });
});

describe('generateSystemMetrics', () => {
  it('generates metrics', () => { expect(generateSystemMetrics().length).toBeGreaterThan(0); });
  it('cpu and memory between 0 and 100', () => {
    for (const m of generateSystemMetrics()) {
      expect(m.cpu).toBeGreaterThanOrEqual(0);
      expect(m.cpu).toBeLessThanOrEqual(100);
      expect(m.memory).toBeGreaterThanOrEqual(0);
      expect(m.memory).toBeLessThanOrEqual(100);
    }
  });
});

describe('generateErrorEvents', () => {
  it('generates events', () => { expect(generateErrorEvents().length).toBeGreaterThan(0); });
  it('each event has required fields', () => {
    const e = generateErrorEvents()[0];
    expect(e).toHaveProperty('id');
    expect(e).toHaveProperty('level');
    expect(e).toHaveProperty('message');
    expect(e).toHaveProperty('resolved');
  });
});

describe('generateKpiRoiMetrics', () => {
  it('generates metrics', () => { expect(generateKpiRoiMetrics().length).toBeGreaterThan(0); });
  it('each metric has improvement value', () => {
    for (const m of generateKpiRoiMetrics()) { expect(typeof m.improvement).toBe('number'); }
  });
});

describe('generateOperationalInsights', () => {
  it('generates insights', () => { expect(generateOperationalInsights().length).toBeGreaterThan(0); });
  it('includes predictions and anomalies', () => {
    const types = generateOperationalInsights().map(i => i.type);
    expect(types).toContain('prediction');
    expect(types).toContain('anomaly');
  });
  it('confidence is between 0 and 1', () => {
    for (const i of generateOperationalInsights()) {
      expect(i.confidence).toBeGreaterThan(0);
      expect(i.confidence).toBeLessThanOrEqual(1);
    }
  });
});

describe('generateNavRoutes', () => {
  it('generates routes with accessible and emergency types', () => {
    const routes = generateNavRoutes();
    expect(routes.some(r => r.type === 'accessible')).toBe(true);
    expect(routes.some(r => r.type === 'emergency')).toBe(true);
    expect(routes.some(r => r.type === 'standard')).toBe(true);
  });
  it('each route has steps array', () => {
    for (const r of generateNavRoutes()) {
      expect(Array.isArray(r.steps)).toBe(true);
      expect(r.steps.length).toBeGreaterThan(0);
    }
  });
  it('accessible routes have accessible flag', () => {
    for (const r of generateNavRoutes()) {
      if (r.type === 'accessible') expect(r.accessible).toBe(true);
    }
  });
});

describe('generateAccessibilityFeatures', () => {
  it('generates 8 feature types', () => { expect(generateAccessibilityFeatures()).toHaveLength(8); });
  it('each feature has required fields', () => {
    const f = generateAccessibilityFeatures()[0];
    expect(f).toHaveProperty('type');
    expect(f).toHaveProperty('label');
    expect(f).toHaveProperty('location');
    expect(f).toHaveProperty('status');
    expect(f).toHaveProperty('count');
  });
  it('includes wheelchair and elevator types', () => {
    const types = generateAccessibilityFeatures().map(f => f.type);
    expect(types).toContain('wheelchair');
    expect(types).toContain('elevator');
    expect(types).toContain('restroom');
    expect(types).toContain('seating');
  });
});

describe('generateTranslationEntries', () => {
  it('generates entries with 8 language translations', () => {
    const entries = generateTranslationEntries();
    expect(entries.length).toBeGreaterThan(0);
    expect(Object.keys(entries[0].translations)).toHaveLength(8);
  });
  it('includes all 8 language codes', () => {
    const translations = generateTranslationEntries()[0].translations;
    expect(translations).toHaveProperty('en');
    expect(translations).toHaveProperty('es');
    expect(translations).toHaveProperty('fr');
    expect(translations).toHaveProperty('ar');
    expect(translations).toHaveProperty('hi');
    expect(translations).toHaveProperty('pt');
    expect(translations).toHaveProperty('de');
    expect(translations).toHaveProperty('ja');
  });
  it('each entry has voiceAvailable flag', () => {
    for (const e of generateTranslationEntries()) { expect(typeof e.voiceAvailable).toBe('boolean'); }
  });
});

describe('ALIGNMENT_DATA', () => {
  it('contains 15 alignment entries', () => { expect(ALIGNMENT_DATA).toHaveLength(15); });
  it('all entries are fully implemented', () => {
    expect(ALIGNMENT_DATA.every(a => a.status === 'fully-implemented')).toBe(true);
  });
  it('each entry has all required fields', () => {
    const a = ALIGNMENT_DATA[0];
    expect(a).toHaveProperty('requirement');
    expect(a).toHaveProperty('feature');
    expect(a).toHaveProperty('aiComponent');
    expect(a).toHaveProperty('userBenefit');
    expect(a).toHaveProperty('realWorldImpact');
    expect(a).toHaveProperty('kpi');
    expect(a).toHaveProperty('kpiValue');
  });
  it('entries cover all challenge areas', () => {
    const text = ALIGNMENT_DATA.map(a => `${a.requirement} ${a.feature} ${a.aiComponent}`).join(' ').toLowerCase();
    expect(text).toMatch(/fan copilot/);
    expect(text).toMatch(/crowd intelligence/);
    expect(text).toMatch(/digital twin/);
    expect(text).toMatch(/operations/);
    expect(text).toMatch(/security/);
    expect(text).toMatch(/accessibility/);
    expect(text).toMatch(/sustainability/);
    expect(text).toMatch(/transport/);
    expect(text).toMatch(/volunteer/);
  });
});

describe('Static exports', () => {
  it('AGENTS has 7 agents', () => { expect(AGENTS).toHaveLength(7); });
  it('STADIUM_ZONES has zones', () => { expect(STADIUM_ZONES.length).toBeGreaterThan(0); });
  it('KPIS has metrics', () => { expect(KPIS.length).toBeGreaterThan(0); });
  it('LANGUAGES has 8 languages', () => {
    expect(LANGUAGES).toHaveLength(8);
    const codes = LANGUAGES.map(l => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('es');
    expect(codes).toContain('fr');
    expect(codes).toContain('ar');
    expect(codes).toContain('hi');
    expect(codes).toContain('pt');
    expect(codes).toContain('de');
    expect(codes).toContain('ja');
  });
  it('TRANSLATIONS has entries for 8 languages', () => {
    for (const key of Object.keys(TRANSLATIONS)) {
      expect(Object.keys(TRANSLATIONS[key])).toHaveLength(8);
    }
  });
  it('ANNOUNCEMENTS is non-empty', () => { expect(ANNOUNCEMENTS.length).toBeGreaterThan(0); });
  it('IMPACT_METRICS is non-empty', () => { expect(IMPACT_METRICS.length).toBeGreaterThan(0); });
  it('AI_AGENTS_INFO is non-empty', () => { expect(AI_AGENTS_INFO.length).toBeGreaterThan(0); });
});
