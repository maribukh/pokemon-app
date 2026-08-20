import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BuggyButton from './BuggyButton';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

describe('BuggyButton', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the trigger button', () => {
    render(
      <ErrorBoundary>
        <BuggyButton />
      </ErrorBoundary>
    );
    expect(
      screen.getByRole('button', { name: /simulate error/i })
    ).toBeInTheDocument();
  });

  it('throws an error and triggers the error boundary when clicked', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const user = userEvent.setup();
    render(
      <ErrorBoundary>
        <BuggyButton />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /simulate error/i });
    await user.click(button);

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
