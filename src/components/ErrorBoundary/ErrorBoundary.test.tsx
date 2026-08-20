import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Component } from 'react';
import type { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';
import userEvent from '@testing-library/user-event';

class ThrowingChild extends Component {
  // eslint-disable-next-line react/require-render-return -- render intentionally throws to test ErrorBoundary
  render(): ReactNode {
    throw new Error('Test error');
  }
}

class SafeChild extends Component {
  render() {
    return <div>All good</div>;
  }
}

describe('ErrorBoundary', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <SafeChild />
      </ErrorBoundary>
    );
    expect(screen.getByText(/all good/i)).toBeInTheDocument();
  });

  it('renders fallback UI when a child throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/please reload the page/i)).toBeInTheDocument();
  });

  it('logs the error to console when a child throws', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalled();
  });

  it('renders a reload button in fallback UI', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    );

    expect(
      screen.getByRole('button', { name: /reload page/i })
    ).toBeInTheDocument();
  });
  it('calls window.location.reload when reload button is clicked', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });

    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /reload page/i });
    await user.click(button);

    expect(reloadMock).toHaveBeenCalled();
  });
});
