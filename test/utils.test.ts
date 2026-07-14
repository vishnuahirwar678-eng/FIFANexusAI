import { describe, it, expect } from 'vitest';
import {
  cn, formatNumber, formatPercent, clamp, lerp, randomBetween, randomInt,
  pick, uid, severityRank, statusColor, densityColor, timeAgo,
} from '../src/lib/utils';

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });
  it('filters out falsy values', () => {
    expect(cn('a', undefined, null, false, 'b')).toBe('a b');
  });
});

describe('formatNumber', () => {
  it('formats millions', () => { expect(formatNumber(1_200_000)).toBe('1.2M'); });
  it('formats thousands', () => { expect(formatNumber(78_000)).toBe('78.0K'); });
  it('formats small numbers', () => { expect(formatNumber(42)).toBe('42'); });
});

describe('clamp', () => {
  it('clamps below min', () => { expect(clamp(-5, 0, 10)).toBe(0); });
  it('clamps above max', () => { expect(clamp(15, 0, 10)).toBe(10); });
  it('returns value in range', () => { expect(clamp(5, 0, 10)).toBe(5); });
});

describe('lerp', () => {
  it('interpolates at t=0', () => { expect(lerp(0, 100, 0)).toBe(0); });
  it('interpolates at t=1', () => { expect(lerp(0, 100, 1)).toBe(100); });
  it('interpolates at t=0.5', () => { expect(lerp(0, 100, 0.5)).toBe(50); });
});

describe('uid', () => {
  it('generates unique ids with prefix', () => {
    const a = uid('test');
    const b = uid('test');
    expect(a).not.toBe(b);
    expect(a).toMatch(/^test_/);
  });
});

describe('severityRank', () => {
  it('ranks critical highest', () => { expect(severityRank('critical')).toBe(4); });
  it('ranks info lowest', () => { expect(severityRank('info')).toBe(0); });
});

describe('statusColor', () => {
  it('returns green for good statuses', () => { expect(statusColor('normal')).toBe('#00e890'); });
  it('returns red for critical', () => { expect(statusColor('critical')).toBe('#e61e1e'); });
  it('returns blue for info', () => { expect(statusColor('info')).toBe('#4d8fff'); });
});

describe('densityColor', () => {
  it('returns green for low density', () => { expect(densityColor(0.1)).toBe('#00e890'); });
  it('returns red for high density', () => { expect(densityColor(0.9)).toBe('#e61e1e'); });
});

describe('timeAgo', () => {
  it('returns seconds ago', () => {
    const ts = new Date(Date.now() - 10_000).toISOString();
    expect(timeAgo(ts)).toBe('10s ago');
  });
  it('returns minutes ago', () => {
    const ts = new Date(Date.now() - 5 * 60_000).toISOString();
    expect(timeAgo(ts)).toBe('5m ago');
  });
});
