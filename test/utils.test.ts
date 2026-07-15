import { describe, it, expect } from 'vitest';
import {
  cn, formatNumber, formatPercent, clamp, lerp, randomBetween, randomInt,
  pick, uid, sleep, severityRank, statusColor, densityColor, timeAgo,
} from '../src/lib/utils';

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });
  it('filters out falsy values', () => {
    expect(cn('a', undefined, null, false, 'b')).toBe('a b');
  });
  it('returns empty string for all falsy', () => {
    expect(cn(false, undefined, null)).toBe('');
  });
  it('handles single class', () => {
    expect(cn('only')).toBe('only');
  });
});

describe('formatNumber', () => {
  it('formats millions', () => { expect(formatNumber(1_200_000)).toBe('1.2M'); });
  it('formats thousands', () => { expect(formatNumber(78_000)).toBe('78.0K'); });
  it('formats small numbers with locale', () => { expect(formatNumber(42)).toBe('42'); });
  it('formats zero', () => { expect(formatNumber(0)).toBe('0'); });
  it('formats exact million boundary', () => { expect(formatNumber(1_000_000)).toBe('1.0M'); });
  it('formats exact thousand boundary', () => { expect(formatNumber(1_000)).toBe('1.0K'); });
  it('formats 999 as plain number', () => { expect(formatNumber(999)).toBe('999'); });
});

describe('formatPercent', () => {
  it('formats with default 0 digits', () => { expect(formatPercent(85)).toBe('85%'); });
  it('formats with 1 digit', () => { expect(formatPercent(85.56, 1)).toBe('85.6%'); });
  it('formats with 2 digits', () => { expect(formatPercent(33.333, 2)).toBe('33.33%'); });
  it('formats zero', () => { expect(formatPercent(0)).toBe('0%'); });
});

describe('clamp', () => {
  it('clamps below min', () => { expect(clamp(-5, 0, 10)).toBe(0); });
  it('clamps above max', () => { expect(clamp(15, 0, 10)).toBe(10); });
  it('returns value in range', () => { expect(clamp(5, 0, 10)).toBe(5); });
  it('returns min when equal', () => { expect(clamp(0, 0, 10)).toBe(0); });
  it('returns max when equal', () => { expect(clamp(10, 0, 10)).toBe(10); });
});

describe('lerp', () => {
  it('interpolates at t=0', () => { expect(lerp(0, 100, 0)).toBe(0); });
  it('interpolates at t=1', () => { expect(lerp(0, 100, 1)).toBe(100); });
  it('interpolates at t=0.5', () => { expect(lerp(0, 100, 0.5)).toBe(50); });
  it('interpolates negative range', () => { expect(lerp(-10, 10, 0.5)).toBe(0); });
});

describe('randomBetween', () => {
  it('returns value within range', () => {
    const v = randomBetween(10, 20);
    expect(v).toBeGreaterThanOrEqual(10);
    expect(v).toBeLessThanOrEqual(20);
  });
  it('returns min when min equals max', () => {
    expect(randomBetween(5, 5)).toBe(5);
  });
});

describe('randomInt', () => {
  it('returns integer within range', () => {
    for (let i = 0; i < 50; i++) {
      const v = randomInt(1, 10);
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(10);
    }
  });
});

describe('pick', () => {
  it('returns an element from the array', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arr).toContain(pick(arr));
  });
  it('returns the only element', () => {
    expect(pick([42])).toBe(42);
  });
});

describe('uid', () => {
  it('generates unique ids with prefix', () => {
    const a = uid('test');
    const b = uid('test');
    expect(a).not.toBe(b);
    expect(a).toMatch(/^test_/);
  });
  it('uses default prefix', () => {
    expect(uid()).toMatch(/^id_/);
  });
});

describe('sleep', () => {
  it('resolves after specified time', async () => {
    const start = Date.now();
    await sleep(50);
    expect(Date.now() - start).toBeGreaterThanOrEqual(40);
  });
});

describe('severityRank', () => {
  it('ranks critical highest', () => { expect(severityRank('critical')).toBe(4); });
  it('ranks high', () => { expect(severityRank('high')).toBe(3); });
  it('ranks medium', () => { expect(severityRank('medium')).toBe(2); });
  it('ranks low', () => { expect(severityRank('low')).toBe(1); });
  it('ranks info lowest', () => { expect(severityRank('info')).toBe(0); });
  it('returns 0 for unknown', () => { expect(severityRank('unknown')).toBe(0); });
});

describe('statusColor', () => {
  it('returns green for good statuses', () => {
    expect(statusColor('normal')).toBe('#00e890');
    expect(statusColor('good')).toBe('#00e890');
    expect(statusColor('online')).toBe('#00e890');
    expect(statusColor('passing')).toBe('#00e890');
    expect(statusColor('success')).toBe('#00e890');
    expect(statusColor('completed')).toBe('#00e890');
  });
  it('returns orange for warning statuses', () => {
    expect(statusColor('busy')).toBe('#ff8c00');
    expect(statusColor('warning')).toBe('#ff8c00');
    expect(statusColor('monitoring')).toBe('#ff8c00');
    expect(statusColor('in-progress')).toBe('#ff8c00');
    expect(statusColor('degraded')).toBe('#ff8c00');
  });
  it('returns red for critical statuses', () => {
    expect(statusColor('critical')).toBe('#e61e1e');
    expect(statusColor('error')).toBe('#e61e1e');
    expect(statusColor('failing')).toBe('#e61e1e');
    expect(statusColor('overdue')).toBe('#e61e1e');
  });
  it('returns blue for info statuses', () => {
    expect(statusColor('info')).toBe('#4d8fff');
    expect(statusColor('pending')).toBe('#4d8fff');
    expect(statusColor('assigned')).toBe('#4d8fff');
    expect(statusColor('skipped')).toBe('#4d8fff');
  });
  it('returns gray for unknown status', () => {
    expect(statusColor('unknown')).toBe('#6b7a93');
  });
});

describe('densityColor', () => {
  it('returns green for low density', () => { expect(densityColor(0.1)).toBe('#00e890'); });
  it('returns blue for moderate density', () => { expect(densityColor(0.4)).toBe('#4d8fff'); });
  it('returns orange for medium density', () => { expect(densityColor(0.6)).toBe('#ff8c00'); });
  it('returns red for high density', () => { expect(densityColor(0.8)).toBe('#ff3b3b'); });
  it('returns dark red for very high density', () => { expect(densityColor(0.9)).toBe('#e61e1e'); });
  it('returns green at exact 0.3 boundary (exclusive)', () => { expect(densityColor(0.29)).toBe('#00e890'); });
  it('returns blue at exact 0.3 boundary', () => { expect(densityColor(0.3)).toBe('#4d8fff'); });
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
  it('returns hours ago', () => {
    const ts = new Date(Date.now() - 3 * 60 * 60_000).toISOString();
    expect(timeAgo(ts)).toBe('3h ago');
  });
  it('returns days ago', () => {
    const ts = new Date(Date.now() - 2 * 24 * 60 * 60_000).toISOString();
    expect(timeAgo(ts)).toBe('2d ago');
  });
  it('handles 0 seconds', () => {
    const ts = new Date().toISOString();
    expect(timeAgo(ts)).toBe('0s ago');
  });
  it('handles 59 seconds boundary', () => {
    const ts = new Date(Date.now() - 59_000).toISOString();
    expect(timeAgo(ts)).toBe('59s ago');
  });
  it('handles 60 seconds boundary (becomes 1m)', () => {
    const ts = new Date(Date.now() - 60_000).toISOString();
    expect(timeAgo(ts)).toBe('1m ago');
  });
  it('handles 23 hours boundary', () => {
    const ts = new Date(Date.now() - 23 * 60 * 60_000).toISOString();
    expect(timeAgo(ts)).toBe('23h ago');
  });
  it('handles 24 hours boundary (becomes 1d)', () => {
    const ts = new Date(Date.now() - 24 * 60 * 60_000).toISOString();
    expect(timeAgo(ts)).toBe('1d ago');
  });
});
