import { describe, it, expect } from 'vitest';
import {
  generateAlerts, generateVolunteerTasks, generateTransportRoutes,
  generateSustainabilityMetrics, generateAuditLogs, generateTestResults,
  generateSparkline, generateHeatmapGrid, generateAIExplanations,
  generateEvacuationRoutes, generateEmergencyContacts, generateSystemMetrics,
  generateErrorEvents, generateKpiRoiMetrics, generateOperationalInsights,
  generateNavRoutes, generateAccessibilityFeatures, generateTranslationEntries,
  ALIGNMENT_DATA,
} from '../src/lib/mock-data';

describe('generateAlerts', () => {
  it('generates requested count', () => {
    expect(generateAlerts(5)).toHaveLength(5);
  });
  it('each alert has required fields', () => {
    const a = generateAlerts(1)[0];
    expect(a).toHaveProperty('id');
    expect(a).toHaveProperty('title');
    expect(a).toHaveProperty('confidence');
  });
});

describe('generateSparkline', () => {
  it('generates array of specified length', () => {
    expect(generateSparkline(20, 50, 20)).toHaveLength(20);
  });
});

describe('generateHeatmapGrid', () => {
  it('generates grid with specified dimensions', () => {
    const grid = generateHeatmapGrid(24, 16);
    expect(grid).toHaveLength(16);
    expect(grid[0]).toHaveLength(24);
  });
  it('values between 0 and 1', () => {
    for (const row of generateHeatmapGrid(10, 10)) {
      for (const v of row) { expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThanOrEqual(1); }
    }
  });
});

describe('generateNavRoutes', () => {
  it('generates routes with accessible and emergency types', () => {
    const routes = generateNavRoutes();
    expect(routes.some(r => r.type === 'accessible')).toBe(true);
    expect(routes.some(r => r.type === 'emergency')).toBe(true);
    expect(routes[0]).toHaveProperty('steps');
  });
});

describe('generateAccessibilityFeatures', () => {
  it('generates 8 feature types', () => {
    const features = generateAccessibilityFeatures();
    expect(features.length).toBe(8);
    expect(features[0]).toHaveProperty('type');
    expect(features[0]).toHaveProperty('count');
  });
});

describe('generateTranslationEntries', () => {
  it('generates entries with 8 language translations', () => {
    const entries = generateTranslationEntries();
    expect(entries.length).toBeGreaterThan(0);
    expect(Object.keys(entries[0].translations)).toHaveLength(8);
  });
});

describe('ALIGNMENT_DATA', () => {
  it('contains 15 alignment entries', () => {
    expect(ALIGNMENT_DATA).toHaveLength(15);
  });
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
});
