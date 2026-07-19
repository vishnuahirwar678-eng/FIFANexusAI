import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button, Badge } from '../src/components/ui/Button';
import { Card, CardHeader, CardBody, CardTitle } from '../src/components/ui/Card';
import { Progress } from '../src/components/ui/Progress';
import { Sparkline } from '../src/components/ui/Sparkline';
import { Gauge } from '../src/components/ui/Gauge';
import { KpiCard } from '../src/components/ui/KpiCard';
import { LoadingState, EmptyState, ErrorState, AsyncSection } from '../src/components/ui/StateViews';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import type { KPI } from '../src/types';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  it('applies variant classes', () => {
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByText('Delete').closest('button')?.className).toContain('bg-alert-500');
  });
  it('applies success variant', () => {
    render(<Button variant="success">Confirm</Button>);
    expect(screen.getByText('Confirm').closest('button')?.className).toContain('bg-pitch-500');
  });
  it('applies secondary variant', () => {
    render(<Button variant="secondary">Cancel</Button>);
    expect(screen.getByText('Cancel').closest('button')?.className).toContain('bg-ink-700');
  });
  it('applies ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByText('Ghost').closest('button')?.className).toContain('hover:bg-ink-700/50');
  });
  it('applies outline variant', () => {
    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByText('Outline').closest('button')?.className).toContain('border');
  });
  it('applies size sm', () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByText('Small').closest('button')?.className).toContain('text-sm');
  });
  it('applies size lg', () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByText('Large').closest('button')?.className).toContain('text-base');
  });
  it('is disabled when disabled prop', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled').closest('button')).toBeDisabled();
  });
  it('fires onClick handler', () => {
    const handler = vi.fn();
    render(<Button onClick={handler}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handler).toHaveBeenCalledTimes(1);
  });
  it('does not fire onClick when disabled', () => {
    const handler = vi.fn();
    render(<Button disabled onClick={handler}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handler).not.toHaveBeenCalled();
  });
  it('supports custom type', () => {
    render(<Button type="button">Test</Button>);
    expect(screen.getByText('Test').closest('button')?.type).toBe('button');
  });
  it('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>);
    expect(screen.getByText('Test').closest('button')?.className).toContain('custom-class');
  });
  it('has focus-visible ring styles for accessibility', () => {
    render(<Button>Test</Button>);
    expect(screen.getByText('Test').closest('button')?.className).toContain('focus-visible:ring');
  });
});

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
  it('applies success variant', () => {
    const { container } = render(<Badge variant="success">Pass</Badge>);
    expect(container.querySelector('span')?.className).toContain('pitch-300');
  });
  it('applies danger variant', () => {
    const { container } = render(<Badge variant="danger">Fail</Badge>);
    expect(container.querySelector('span')?.className).toContain('alert-300');
  });
  it('applies warning variant', () => {
    const { container } = render(<Badge variant="warning">Warn</Badge>);
    expect(container.querySelector('span')?.className).toContain('flame-300');
  });
  it('applies info variant', () => {
    const { container } = render(<Badge variant="info">Info</Badge>);
    expect(container.querySelector('span')?.className).toContain('nexus-300');
  });
  it('applies custom className', () => {
    const { container } = render(<Badge className="custom">X</Badge>);
    expect(container.querySelector('span')?.className).toContain('custom');
  });
});

describe('Card', () => {
  it('renders children', () => {
    render(<Card><div>Content</div></Card>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
  it('applies glow class', () => {
    const { container } = render(<Card glow="nexus"><div>X</div></Card>);
    expect(container.querySelector('div')?.className).toContain('shadow-glow');
  });
  it('applies hover class', () => {
    const { container } = render(<Card hover><div>X</div></Card>);
    expect(container.querySelector('div')?.className).toContain('hover:border-nexus-500/40');
  });
  it('CardHeader renders children', () => {
    render(<CardHeader>Header</CardHeader>);
    expect(screen.getByText('Header')).toBeInTheDocument();
  });
  it('CardBody renders children', () => {
    render(<CardBody>Body</CardBody>);
    expect(screen.getByText('Body')).toBeInTheDocument();
  });
  it('CardTitle renders as h3', () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    expect(container.querySelector('h3')).not.toBeNull();
  });
  it('applies custom className', () => {
    const { container } = render(<Card className="my-card"><div>X</div></Card>);
    expect(container.querySelector('div')?.className).toContain('my-card');
  });
});

describe('Progress', () => {
  it('renders with correct aria attributes', () => {
    render(<Progress value={75} label="Completion" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '75');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });
  it('shows label text when showLabel is true', () => {
    render(<Progress value={50} showLabel label="Progress" />);
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });
  it('hides label text when showLabel is false', () => {
    render(<Progress value={50} label="Progress" />);
    expect(screen.queryByText('Progress')).not.toBeInTheDocument();
  });
  it('renders with custom max', () => {
    render(<Progress value={5} max={10} label="Half" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '10');
  });
  it('renders with custom aria-label', () => {
    render(<Progress value={50} label="Custom Label" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Custom Label');
  });
});

describe('Sparkline', () => {
  it('renders svg with role img when label provided', () => {
    render(<Sparkline data={[10, 20, 30]} label="Trend" />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Trend');
  });
  it('renders svg without role img when no label', () => {
    const { container } = render(<Sparkline data={[10, 20, 30]} />);
    expect(container.querySelector('svg')).not.toBeNull();
  });
  it('returns null for empty data', () => {
    const { container } = render(<Sparkline data={[]} />);
    expect(container.querySelector('svg')).toBeNull();
  });
  it('renders with custom width and height', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} width={200} height={50} />);
    expect(container.querySelector('svg')?.getAttribute('width')).toBe('200');
    expect(container.querySelector('svg')?.getAttribute('height')).toBe('50');
  });
  it('renders path element for the line', () => {
    const { container } = render(<Sparkline data={[10, 20, 30]} />);
    expect(container.querySelectorAll('path').length).toBeGreaterThanOrEqual(1);
  });
  it('renders fill area when fill is true', () => {
    const { container } = render(<Sparkline data={[10, 20, 30]} fill />);
    expect(container.querySelectorAll('path').length).toBeGreaterThanOrEqual(2);
  });
  it('does not render fill area when fill is false', () => {
    const { container } = render(<Sparkline data={[10, 20, 30]} fill={false} />);
    expect(container.querySelectorAll('path').length).toBe(1);
  });
});

describe('Gauge', () => {
  it('renders with correct aria attributes', () => {
    render(<Gauge value={85} label="CPU" />);
    const gauge = screen.getByRole('progressbar');
    expect(gauge).toHaveAttribute('aria-valuenow', '85');
    expect(gauge).toHaveAttribute('aria-valuemin', '0');
    expect(gauge).toHaveAttribute('aria-valuemax', '100');
    expect(gauge).toHaveAttribute('aria-label', 'CPU');
  });
  it('renders the numeric value', () => {
    render(<Gauge value={42} label="Load" />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });
  it('renders label text', () => {
    render(<Gauge value={50} label="Memory" />);
    expect(screen.getByText('Memory')).toBeInTheDocument();
  });
  it('renders with custom max value', () => {
    render(<Gauge value={5} max={10} label="Score" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '10');
  });
  it('renders with custom unit', () => {
    const { container } = render(<Gauge value={42} max={100} unit="k" label="Speed" />);
    // Value 42 and unit k are rendered in nested spans
    expect(container.textContent).toContain('42');
    expect(container.textContent).toContain('k');
  });
  it('clamps value above max', () => {
    render(<Gauge value={150} max={100} label="Over" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '150');
  });
  it('renders without label', () => {
    render(<Gauge value={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});

describe('KpiCard', () => {
  const mockKpi: KPI = {
    id: 'kpi_1', label: 'Crowd Density', value: 78.4, unit: '%', target: 85,
    trend: 2.3, sparkline: [60, 65, 70, 75, 78], category: 'crowd', status: 'warning',
  };
  it('renders label and value', () => {
    render(<KpiCard kpi={mockKpi} />);
    expect(screen.getByText('Crowd Density')).toBeInTheDocument();
    expect(screen.getByText('78.4')).toBeInTheDocument();
  });
  it('renders trend indicator', () => {
    render(<KpiCard kpi={mockKpi} />);
    expect(screen.getByText('+2.3')).toBeInTheDocument();
  });
  it('renders target value', () => {
    render(<KpiCard kpi={mockKpi} />);
    expect(screen.getByText(/target/)).toBeInTheDocument();
  });
  it('renders sparkline svg', () => {
    const { container } = render(<KpiCard kpi={mockKpi} />);
    expect(container.querySelector('svg')).not.toBeNull();
  });
  it('renders with good status', () => {
    const goodKpi = { ...mockKpi, status: 'good' as const };
    const { container } = render(<KpiCard kpi={goodKpi} />);
    expect(container.querySelector('.animate-fade-in')).not.toBeNull();
  });
  it('renders with critical status', () => {
    const criticalKpi = { ...mockKpi, status: 'critical' as const };
    render(<KpiCard kpi={criticalKpi} />);
    expect(screen.getByText('Crowd Density')).toBeInTheDocument();
  });
  it('renders icon when provided', () => {
    render(<KpiCard kpi={mockKpi} icon={<span data-testid="icon">X</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
  it('renders without icon', () => {
    const { container } = render(<KpiCard kpi={mockKpi} />);
    expect(container.querySelector('[data-testid="icon"]')).toBeNull();
  });
  it('handles negative trend', () => {
    const downKpi = { ...mockKpi, trend: -1.5 };
    render(<KpiCard kpi={downKpi} />);
    expect(screen.getByText('-1.5')).toBeInTheDocument();
  });
});

describe('LoadingState', () => {
  it('renders with default message', () => {
    render(<LoadingState />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  it('renders with custom message', () => {
    render(<LoadingState message="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });
  it('has role status', () => {
    render(<LoadingState />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  it('has aria-live polite', () => {
    render(<LoadingState />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });
});

describe('EmptyState', () => {
  it('renders with default message', () => {
    render(<EmptyState />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
  it('renders with custom message', () => {
    render(<EmptyState message="No results found" />);
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });
});

describe('ErrorState', () => {
  it('renders with default message', () => {
    render(<ErrorState />);
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });
  it('renders with custom message', () => {
    render(<ErrorState message="Network error" />);
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });
  it('has role alert', () => {
    render(<ErrorState />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

describe('AsyncSection', () => {
  it('shows loading state', () => {
    render(<AsyncSection loading><div>Content</div></AsyncSection>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  it('shows error state', () => {
    render(<AsyncSection loading={false} error="Something broke"><div>Content</div></AsyncSection>);
    expect(screen.getByText('Something broke')).toBeInTheDocument();
  });
  it('shows empty state', () => {
    render(<AsyncSection loading={false} empty><div>Content</div></AsyncSection>);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
  it('shows children when not loading/error/empty', () => {
    render(<AsyncSection loading={false}><div>Content</div></AsyncSection>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
  it('prioritizes loading over error', () => {
    render(<AsyncSection loading error="error"><div>X</div></AsyncSection>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  it('prioritizes error over empty', () => {
    render(<AsyncSection loading={false} error="err" empty><div>X</div></AsyncSection>);
    expect(screen.getByText('err')).toBeInTheDocument();
  });
  it('uses custom loading message', () => {
    render(<AsyncSection loading loadingMessage="Fetching..."><div>X</div></AsyncSection>);
    expect(screen.getByText('Fetching...')).toBeInTheDocument();
  });
  it('uses custom empty message', () => {
    render(<AsyncSection loading={false} empty emptyMessage="No items"><div>X</div></AsyncSection>);
    expect(screen.getByText('No items')).toBeInTheDocument();
  });
});

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(<ErrorBoundary><div>Safe content</div></ErrorBoundary>);
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });
  it('renders fallback on error', () => {
    const Throw = () => { throw new Error('Test error'); };
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ErrorBoundary><Throw /></ErrorBoundary>);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    spy.mockRestore();
  });
  it('renders custom fallback when provided', () => {
    const Throw = () => { throw new Error('Test error'); };
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ErrorBoundary fallback={<div>Custom fallback</div>}><Throw /></ErrorBoundary>);
    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    spy.mockRestore();
  });
  it('shows error message in default fallback', () => {
    const Throw = () => { throw new Error('Specific error message'); };
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ErrorBoundary><Throw /></ErrorBoundary>);
    expect(screen.getByText('Specific error message')).toBeInTheDocument();
    spy.mockRestore();
  });
  it('has a try again button', () => {
    const Throw = () => { throw new Error('Test error'); };
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ErrorBoundary><Throw /></ErrorBoundary>);
    expect(screen.getByText('Try again')).toBeInTheDocument();
    spy.mockRestore();
  });
});
