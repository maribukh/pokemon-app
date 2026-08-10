import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { usePokemonListQuery } from './usePokemonListQuery';
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

describe('usePokemonListQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches a page of pokemon when no term is given', async () => {
    vi.mocked(pokemonApi.fetchPokemonList).mockResolvedValue({
      count: 1,
      next: null,
      previous: null,
      results: [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
      ],
    });
    vi.mocked(pokemonApi.fetchPokemonDetailsBatch).mockResolvedValue([
      mockPokemon as never,
    ]);

    const { result } = renderHook(() => usePokemonListQuery('', 1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.items).toHaveLength(1);
    expect(result.current.data?.items[0].name).toBe('pikachu');
  });

  it('fetches a single pokemon when a term is given', async () => {
    vi.mocked(pokemonApi.fetchPokemonByName).mockResolvedValue(
      mockPokemon as never
    );

    const { result } = renderHook(() => usePokemonListQuery('pikachu', 1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(pokemonApi.fetchPokemonByName).toHaveBeenCalledWith('pikachu');
    expect(result.current.data?.items).toHaveLength(1);
    expect(result.current.data?.totalPages).toBe(1);
  });

  it('exposes an error state when the request fails', async () => {
    vi.mocked(pokemonApi.fetchPokemonList).mockRejectedValue(
      new Error('Network error')
    );

    const { result } = renderHook(() => usePokemonListQuery('', 1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('reuses cached data for a previously fetched page', async () => {
    vi.mocked(pokemonApi.fetchPokemonList).mockResolvedValue({
      count: 1,
      next: null,
      previous: null,
      results: [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
      ],
    });
    vi.mocked(pokemonApi.fetchPokemonDetailsBatch).mockResolvedValue([
      mockPokemon as never,
    ]);

    const client = createTestQueryClient();
    function wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      );
    }

    const { result, rerender } = renderHook(
      ({ term, page }) => usePokemonListQuery(term, page),
      { wrapper, initialProps: { term: '', page: 1 } }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(pokemonApi.fetchPokemonList).toHaveBeenCalledTimes(1);

    rerender({ term: '', page: 1 });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(pokemonApi.fetchPokemonList).toHaveBeenCalledTimes(1);
  });
});
