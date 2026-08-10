import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { usePokemonDetailsQuery } from './usePokemonDetailsQuery';
import { createTestQueryClient } from '../test-utils/renderWithProviders';
import * as pokemonApi from '../services/pokemonApi';

vi.mock('../services/pokemonApi');

const mockPokemon = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  types: [{ slot: 1, type: { name: 'electric', url: '' } }],
  stats: [],
  sprites: { front_default: 'default.png' },
};

function createWrapper() {
  const client = createTestQueryClient();
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  };
}

describe('usePokemonDetailsQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts in a loading state', () => {
    vi.mocked(pokemonApi.fetchPokemonByName).mockResolvedValue(
      mockPokemon as never
    );
    const { result } = renderHook(() => usePokemonDetailsQuery('pikachu'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('returns pokemon data on success', async () => {
    vi.mocked(pokemonApi.fetchPokemonByName).mockResolvedValue(
      mockPokemon as never
    );
    const { result } = renderHook(() => usePokemonDetailsQuery('pikachu'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockPokemon);
  });

  it('returns an error state on failure', async () => {
    vi.mocked(pokemonApi.fetchPokemonByName).mockRejectedValue(
      new Error('Pokemon not found')
    );
    const { result } = renderHook(() => usePokemonDetailsQuery('unknown'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('does not fetch when id is undefined', () => {
    renderHook(() => usePokemonDetailsQuery(undefined), {
      wrapper: createWrapper(),
    });

    expect(pokemonApi.fetchPokemonByName).not.toHaveBeenCalled();
  });
});
