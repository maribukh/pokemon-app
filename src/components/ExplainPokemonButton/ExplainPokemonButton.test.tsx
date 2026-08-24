import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExplainPokemonButton from './ExplainPokemonButton';
import type { PokemonExplanationContext } from '../../utils/pokemonExplanationContext';

const explainPokemonAction = vi.fn();
let locale = 'en';

vi.mock('./actions', () => ({
  explainPokemonAction: (...args: unknown[]) => explainPokemonAction(...args),
}));

vi.mock('next-intl', () => ({
  useLocale: () => locale,
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      explain: 'Explain with AI',
      pending: 'Explaining...',
      retry: 'Try again',
      regenerate: 'Regenerate',
      notice: 'AI-generated, may be inaccurate.',
      'errors.unknown': 'Something went wrong.',
    };
    return translations[key] ?? key;
  },
}));

const context: PokemonExplanationContext = {
  name: 'pikachu',
  id: 25,
  types: ['electric'],
  height: 0.4,
  weight: 6,
  hp: 35,
  attack: 55,
};

describe('ExplainPokemonButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    locale = 'en';
  });

  it('does not request until clicked and disables while pending', async () => {
    let resolveRequest: (value: { ok: true; explanation: string }) => void =
      () => undefined;
    explainPokemonAction.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );
    const user = userEvent.setup();

    render(<ExplainPokemonButton context={context} />);

    expect(explainPokemonAction).not.toHaveBeenCalled();
    const button = screen.getByRole('button', { name: /explain with ai/i });
    await user.click(button);

    expect(button).toBeDisabled();
    expect(screen.getByRole('button', { name: /explaining/i })).toBeDisabled();
    expect(explainPokemonAction).toHaveBeenCalledTimes(1);

    resolveRequest({ ok: true, explanation: 'A short explanation.' });
  });

  it('offers retry after failure and regenerate after success', async () => {
    explainPokemonAction
      .mockResolvedValueOnce({ ok: false, code: 'unknown' })
      .mockResolvedValueOnce({ ok: true, explanation: 'First answer.' })
      .mockResolvedValueOnce({ ok: true, explanation: 'New answer.' });
    const user = userEvent.setup();
    render(<ExplainPokemonButton context={context} />);

    await user.click(screen.getByRole('button', { name: /explain with ai/i }));
    const retry = await screen.findByRole('button', { name: /try again/i });
    await user.click(retry);
    expect(await screen.findByText('First answer.')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /regenerate/i })
    );
    expect(await screen.findByText('New answer.')).toBeInTheDocument();
    expect(explainPokemonAction).toHaveBeenCalledTimes(3);
  });

  it('clears the result when the keyed Pokémon or locale changes', async () => {
    explainPokemonAction.mockResolvedValueOnce({
      ok: true,
      explanation: 'First answer.',
    });
    const user = userEvent.setup();
    const view = render(
      <ExplainPokemonButton key="25-en" context={context} />
    );

    await user.click(screen.getByRole('button', { name: /explain with ai/i }));
    expect(await screen.findByText('First answer.')).toBeInTheDocument();

    locale = 'ru';
    view.rerender(
      <ExplainPokemonButton
        key="26-ru"
        context={{ ...context, id: 26, name: 'raichu' }}
      />
    );

    expect(screen.queryByText('First answer.')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /explain with ai/i })
    ).toBeEnabled();
  });
});
