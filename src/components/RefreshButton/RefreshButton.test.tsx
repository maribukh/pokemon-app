import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RefreshButton from './RefreshButton';

const { refreshPokemonDataAction } = vi.hoisted(() => ({
  refreshPokemonDataAction: vi.fn(),
}));

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
  refreshPokemonDataAction,
}));

describe('RefreshButton', () => {
  beforeEach(() => {
    refreshPokemonDataAction.mockResolvedValue(undefined);
  });

  it('renders "Refresh" label when not fetching', () => {
    render(<RefreshButton />);

    expect(
      screen.getByRole('button', { name: /^refresh$/i })
    ).toBeInTheDocument();
  });

  it('shows "Refreshing" and disables button while refreshing', async () => {
    let resolveRefresh: () => void = () => undefined;
    refreshPokemonDataAction.mockReturnValueOnce(
      new Promise<void>((resolve) => {
        resolveRefresh = resolve;
      })
    );
    const user = userEvent.setup();

    render(<RefreshButton />);

    const button = screen.getByRole('button', { name: /^refresh$/i });

    await user.click(button);

    const refreshingButton = await screen.findByRole('button', {
      name: /refreshing/i,
    });
    expect(refreshingButton).toBeDisabled();

    resolveRefresh();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /^refresh$/i })).toBeEnabled()
    );
  });
});
