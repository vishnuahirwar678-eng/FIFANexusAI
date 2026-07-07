export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function formatPercent(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1));
}

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function densityColor(density: number): string {
  if (density < 0.3) return '#00e890';
  if (density < 0.5) return '#4d8fff';
  if (density < 0.7) return '#ff8c00';
  if (density < 0.85) return '#ff3b3b';
  return '#e61e1e';
}

export function statusColor(status: string): string {
  switch (status) {
    case 'normal':
    case 'good':
    case 'online':
    case 'passing':
    case 'success':
    case 'completed':
      return '#00e890';
    case 'busy':
    case 'warning':
    case 'monitoring':
    case 'in-progress':
    case 'degraded':
      return '#ff8c00';
    case 'congested':
    case 'critical':
    case 'failing':
    case 'error':
    case 'overdue':
    case 'active':
      return '#e61e1e';
    case 'info':
    case 'pending':
    case 'assigned':
    case 'skipped':
      return '#4d8fff';
    default:
      return '#6b7a93';
  }
}

export function severityRank(severity: string): number {
  const ranks: Record<string, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
    info: 0,
  };
  return ranks[severity] ?? 0;
}
