import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../components/ErrorBoundary';

function Boom(): never {
  throw new Error('version exploded');
}

describe('ErrorBoundary', () => {
  it('renders children while nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>all good</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText('all good')).toBeInTheDocument();
  });

  it('shows a recovery screen instead of a blank page when a version throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const onReset = vi.fn();

    render(
      <ErrorBoundary onReset={onReset}>
        <Boom />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    screen.getByRole('button', { name: /back to v1/i }).click();
    expect(onReset).toHaveBeenCalledOnce();
  });
});
