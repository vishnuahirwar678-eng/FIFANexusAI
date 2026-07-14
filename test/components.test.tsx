import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button, Badge } from '../src/components/ui/Button';
import { Progress } from '../src/components/ui/Progress';
import { Sparkline } from '../src/components/ui/Sparkline';
import { Gauge } from '../src/components/ui/Gauge';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  it('applies variant classes', () => {
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByText('Delete').closest('button')?.className).toContain('bg-alert-500');
  });
  it('is disabled when disabled', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled').closest('button')).toBeDisabled();
  });
});

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
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
});

describe('Sparkline', () => {
  it('renders svg with role img', () => {
    render(<Sparkline data={[10, 20, 30]} label="Trend" />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Trend');
  });
  it('returns null for empty data', () => {
    const { container } = render(<Sparkline data={[]} />);
    expect(container.querySelector('svg')).toBeNull();
  });
});

describe('Gauge', () => {
  it('renders with correct aria attributes', () => {
    render(<Gauge value={85} label="CPU" />);
    const gauge = screen.getByRole('progressbar');
    expect(gauge).toHaveAttribute('aria-valuenow', '85');
  });
});
