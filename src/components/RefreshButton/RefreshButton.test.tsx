import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RefreshButton from './RefreshButton';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      idle: 'Refresh',
      loading: 'Refreshing',
    };

    return translations[key];
  },
}));

vi.mock('../../i18n/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

vi.mock('./actions', () => ({
  refreshPokemonDataAction: vi.fn().mockResolvedValue(undefined),
}));

describe('RefreshButton', () => {
  it('renders "Refresh" label when not fetching', () => {
    render(<RefreshButton />);

    expect(
      screen.getByRole('button', { name: /^refresh$/i })
    ).toBeInTheDocument();
  });

  it('shows "Refreshing" and disables button while refreshing', async () => {
    const user = userEvent.setup();

    render(<RefreshButton />);

    const button = screen.getByRole('button', { name: /^refresh$/i });

    await user.click(button);

    expect(screen.getByRole('button', { name: /refreshing/i })).toBeDisabled();
  });
});
