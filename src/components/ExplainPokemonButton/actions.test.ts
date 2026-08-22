import { describe, expect, it, vi } from 'vitest';

vi.mock('../../services/ai/pokemonExplanation', () => ({
  generatePokemonExplanation: vi.fn(),
  PokemonExplanationError: class PokemonExplanationError extends Error {
    code = 'unknown';
  },
}));

import { generatePokemonExplanation } from '../../services/ai/pokemonExplanation';
import { explainPokemonAction } from './actions';
import type { PokemonExplanationContext } from '../../utils/pokemonExplanationContext';

const context: PokemonExplanationContext = {
  name: 'pikachu',
  id: 25,
  types: ['electric'],
  height: 0.4,
  weight: 6,
  hp: 35,
  attack: 55,
};

describe('explainPokemonAction', () => {
  it('rejects unsupported locales and extra fields before calling Gemini', async () => {
    await expect(explainPokemonAction(context, 'fr')).resolves.toEqual({
      ok: false,
      code: 'invalid_request',
    });
    await expect(
      explainPokemonAction({ ...context, sprites: 'excluded' } as never, 'en')
    ).resolves.toEqual({ ok: false, code: 'invalid_request' });
    expect(generatePokemonExplanation).not.toHaveBeenCalled();
  });

  it('returns the explanation from the server-only service', async () => {
    vi.mocked(generatePokemonExplanation).mockResolvedValueOnce(
      'Pikachu is an Electric type.'
    );

    await expect(explainPokemonAction(context, 'en')).resolves.toEqual({
      ok: true,
      explanation: 'Pikachu is an Electric type.',
    });
    expect(generatePokemonExplanation).toHaveBeenCalledWith(context, 'en');
  });

  it('maps service failures to safe error codes', async () => {
    vi.mocked(generatePokemonExplanation).mockRejectedValueOnce(
      new Error('provider internals')
    );

    await expect(explainPokemonAction(context, 'en')).resolves.toEqual({
      ok: false,
      code: 'unknown',
    });
  });
});
