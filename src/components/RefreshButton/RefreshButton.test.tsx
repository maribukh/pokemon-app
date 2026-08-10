import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RefreshButton from './RefreshButton';

describe('RefreshButton', () => {
  it('renders "Refresh" label when not fetching', () => {
    render(<RefreshButton onClick={vi.fn()} isFetching={false} />);
    expect(
      screen.getByRole('button', { name: /^refresh$/i })
    ).toBeInTheDocument();
  });

  it('renders "Refreshing" label and is disabled while fetching', () => {
    render(<RefreshButton onClick={vi.fn()} isFetching />);
    const button = screen.getByRole('button', { name: /refreshing/i });
    expect(button).toBeDisabled();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<RefreshButton onClick={onClick} isFetching={false} />);

    await user.click(screen.getByRole('button', { name: /^refresh$/i }));

    expect(onClick).toHaveBeenCalled();
  });
});
