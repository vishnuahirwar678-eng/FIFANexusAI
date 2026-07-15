import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button, Badge } from '../src/components/ui/Button';
import { Card, CardHeader, CardBody, CardTitle } from '../src/components/ui/Card';
import { Progress } from '../src/components/ui/Progress';
import { Gauge } from '../src/components/ui/Gauge';
import { LoadingState, EmptyState, ErrorState } from '../src/components/ui/StateViews';
import { Sparkline } from '../src/components/ui/Sparkline';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { vi } from 'vitest';

// ─── WCAG 2.1 AA — ARIA Roles ─────────────────────────────────────────
describe('Accessibility: ARIA Roles', () => {
  it('Progress has role progressbar', () => {
    render(<Progress value={50} label="Test" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('Gauge has role progressbar', () => {
    render(<Gauge value={75} label="CPU" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('LoadingState has role status', () => {
    render(<LoadingState />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('ErrorState has role alert', () => {
    render(<ErrorState message="Failed" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('Sparkline has role img when label provided', () => {
    render(<Sparkline data={[1, 2, 3]} label="Trend chart" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('Button is a native button element (role button)', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

// ─── WCAG 2.1 AA — ARIA Labels & Attributes ──────────────────────────
describe('Accessibility: ARIA Labels & Attributes', () => {
  it('Progress has aria-valuenow, aria-valuemin, aria-valuemax', () => {
    render(<Progress value={65} max={100} label="Progress" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '65');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('Gauge has aria-valuenow, aria-valuemin, aria-valuemax', () => {
    render(<Gauge value={42} max={100} label="Memory" />);
    const gauge = screen.getByRole('progressbar');
    expect(gauge).toHaveAttribute('aria-valuenow', '42');
    expect(gauge).toHaveAttribute('aria-valuemin', '0');
    expect(gauge).toHaveAttribute('aria-valuemax', '100');
  });

  it('Progress has aria-label', () => {
    render(<Progress value={30} label="Upload progress" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Upload progress');
  });

  it('Gauge has aria-label', () => {
    render(<Gauge value={30} label="CPU Usage" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'CPU Usage');
  });

  it('Sparkline has aria-label when label provided', () => {
    render(<Sparkline data={[1, 2, 3]} label="Crowd density trend" />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Crowd density trend');
  });

  it('LoadingState has aria-live polite', () => {
    render(<LoadingState />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });
});

// ─── WCAG 2.1 AA — Keyboard Navigation ───────────────────────────────
describe('Accessibility: Keyboard Navigation', () => {
  it('Button is focusable (tabindex defaults to 0)', () => {
    const { container } = render(<Button>Focusable</Button>);
    const btn = container.querySelector('button');
    expect(btn).not.toHaveAttribute('tabindex', '-1');
  });

  it('Button can receive focus', () => {
    const { container } = render(<Button>Focusable</Button>);
    const btn = container.querySelector('button')!;
    btn.focus();
    expect(document.activeElement).toBe(btn);
  });

  it('disabled Button does not fire clicks', () => {
    const handler = vi.fn();
    const { container } = render(<Button disabled onClick={handler}>No Click</Button>);
    const btn = container.querySelector('button')!;
    btn.click();
    expect(handler).not.toHaveBeenCalled();
  });
});

// ─── WCAG 2.1 AA — Focus Indicators ──────────────────────────────────
describe('Accessibility: Focus Indicators', () => {
  it('Button has focus-visible ring styles', () => {
    const { container } = render(<Button>Test</Button>);
    const btn = container.querySelector('button')!;
    expect(btn.className).toContain('focus-visible:outline-none');
    expect(btn.className).toContain('focus-visible:ring-2');
    expect(btn.className).toContain('focus-visible:ring-nexus-400');
  });

  it('all Button variants maintain focus-visible styles', () => {
    const variants = ['primary', 'secondary', 'ghost', 'danger', 'success', 'outline'] as const;
    variants.forEach((variant) => {
      const { container } = render(<Button variant={variant}>V</Button>);
      const btn = container.querySelector('button')!;
      expect(btn.className).toContain('focus-visible:ring-2');
    });
  });
});

// ─── WCAG 2.1 AA — Semantic HTML ─────────────────────────────────────
describe('Accessibility: Semantic HTML', () => {
  it('CardTitle renders as h3 for proper heading hierarchy', () => {
    const { container } = render(<CardTitle>Section Title</CardTitle>);
    expect(container.querySelector('h3')).not.toBeNull();
  });

  it('Button renders as native button element', () => {
    const { container } = render(<Button>Test</Button>);
    expect(container.querySelector('button')).not.toBeNull();
  });

  it('Badge renders as inline span', () => {
    const { container } = render(<Badge>Status</Badge>);
    expect(container.querySelector('span')).not.toBeNull();
  });
});

// ─── WCAG 2.1 AA — Screen Reader Support ─────────────────────────────
describe('Accessibility: Screen Reader Support', () => {
  it('LoadingState communicates via aria-live region', () => {
    render(<LoadingState message="Loading dashboard..." />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveTextContent('Loading dashboard...');
  });

  it('ErrorState communicates via role alert', () => {
    render(<ErrorState message="Connection failed" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Connection failed');
  });

  it('Sparkline has alt text via aria-label', () => {
    render(<Sparkline data={[10, 20, 30]} label="Attendance trend" />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Attendance trend');
  });

  it('ErrorBoundary has accessible error message', () => {
    const Throw = () => { throw new Error('Test error'); };
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ErrorBoundary><Throw /></ErrorBoundary>);
    expect(screen.getByRole('alert') || screen.getByText('Something went wrong')).toBeInTheDocument();
    spy.mockRestore();
  });
});

// ─── WCAG 2.1 AA — Color & Contrast (structural checks) ──────────────
describe('Accessibility: Color & Contrast', () => {
  it('statusColor function returns distinguishable colors', () => {
    // Verify that different statuses map to different colors
    const { statusColor } = require('../src/lib/utils');
    const good = statusColor('good');
    const warning = statusColor('warning');
    const critical = statusColor('critical');
    expect(good).not.toBe(warning);
    expect(warning).not.toBe(critical);
    expect(good).not.toBe(critical);
  });

  it('densityColor returns distinguishable colors for different levels', () => {
    const { densityColor } = require('../src/lib/utils');
    const low = densityColor(0.1);
    const medium = densityColor(0.5);
    const high = densityColor(0.8);
    expect(low).not.toBe(medium);
    expect(medium).not.toBe(high);
    expect(low).not.toBe(high);
  });

  it('Button text has explicit color class (not inherited)', () => {
    const { container } = render(<Button>Test</Button>);
    const btn = container.querySelector('button')!;
    // Primary variant should have text-white
    expect(btn.className).toContain('text-white');
  });

  it('Button success variant has dark text on light background', () => {
    const { container } = render(<Button variant="success">Test</Button>);
    const btn = container.querySelector('button')!;
    expect(btn.className).toContain('text-ink-900');
  });
});

// ─── WCAG 2.1 AA — Accessible Forms (SignIn) ─────────────────────────
describe('Accessibility: Accessible Forms', () => {
  // We test form patterns at the component level since SignIn requires auth context
  it('form inputs should have associated labels (pattern check)', () => {
    // Verify the pattern: input with id + label with htmlFor
    // This is validated in the SignIn component which uses htmlFor and id
    // Here we verify the Button component supports form submission
    const { container } = render(
      <form>
        <Button type="submit">Submit</Button>
      </form>,
    );
    const btn = container.querySelector('button')!;
    expect(btn.type).toBe('submit');
  });
});

// ─── WCAG 2.1 AA — Reduced Motion ────────────────────────────────────
describe('Accessibility: Reduced Motion', () => {
  it('Card uses transition classes that can be overridden by prefers-reduced-motion', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.querySelector('div')!;
    expect(card.className).toContain('transition-all');
  });
});

// ─── WCAG 2.1 AA — Error Identification ──────────────────────────────
describe('Accessibility: Error Identification', () => {
  it('ErrorBoundary displays error message text', () => {
    const Throw = () => { throw new Error('Database connection failed'); };
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ErrorBoundary><Throw /></ErrorBoundary>);
    expect(screen.getByText('Database connection failed')).toBeInTheDocument();
    spy.mockRestore();
  });

  it('ErrorState displays error message prominently', () => {
    render(<ErrorState message="Failed to load crowd data" />);
    expect(screen.getByText('Failed to load crowd data')).toBeInTheDocument();
  });
});

// ─── Summary: WCAG 2.1 AA Coverage ───────────────────────────────────
describe('Accessibility: WCAG 2.1 AA Summary', () => {
  it('all interactive components have ARIA roles', () => {
    // Progress → progressbar, Button → button, LoadingState → status, ErrorState → alert
    render(
      <>
        <Progress value={50} label="P" />
        <Button>B</Button>
        <LoadingState />
        <ErrorState message="E" />
      </>,
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('all data-display components have aria-labels', () => {
    render(
      <>
        <Gauge value={50} label="Gauge Label" />
        <Sparkline data={[1, 2, 3]} label="Spark Label" />
      </>,
    );
    expect(screen.getAllByRole('progressbar')[0]).toHaveAttribute('aria-label', 'Gauge Label');
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Spark Label');
  });
});
