import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchPokemonList,
  fetchPokemonByName,
  fetchPokemonDetailsBatch,
} from './pokemonApi';

describe('pokemonApi', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('fetchPokemonList', () => {
    it('returns parsed data on success', async () => {
      const mockResponse = {
        count: 2,
        next: null,
        previous: null,
        results: [],
      };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchPokemonList(20, 0);

      expect(fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0'
      );
      expect(result).toEqual(mockResponse);
    });

    it('throws an error when response is not ok', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(fetchPokemonList(20, 0)).rejects.toThrow(
        'Failed to fetch pokemon list: 500'
      );
    });
  });

  describe('fetchPokemonByName', () => {
    it('returns pokemon data on success', async () => {
      const mockPokemon = { id: 25, name: 'pikachu' };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemon,
      });

      const result = await fetchPokemonByName('pikachu');

      expect(fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/pikachu'
      );
      expect(result).toEqual(mockPokemon);
    });

    it('lowercases the name before requesting', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 25, name: 'pikachu' }),
      });

      await fetchPokemonByName('PIKACHU');

      expect(fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/pikachu'
      );
    });

    it('throws an error when pokemon is not found', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchPokemonByName('unknown')).rejects.toThrow(
        'Pokemon "unknown" not found'
      );
    });
  });

  describe('fetchPokemonDetailsBatch', () => {
    it('returns details for all successfully fetched pokemon', async () => {
      (fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 1, name: 'bulbasaur' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 4, name: 'charmander' }),
        });

      const result = await fetchPokemonDetailsBatch([
        'bulbasaur',
        'charmander',
      ]);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('bulbasaur');
      expect(result[1].name).toBe('charmander');
    });

    it('filters out failed requests and keeps successful ones', async () => {
      (fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 1, name: 'bulbasaur' }),
        })
        .mockResolvedValueOnce({ ok: false, status: 404 });

      const result = await fetchPokemonDetailsBatch(['bulbasaur', 'unknown']);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('bulbasaur');
    });

    it('returns empty array when all requests fail', async () => {
      (fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({ ok: false, status: 404 })
        .mockResolvedValueOnce({ ok: false, status: 500 });

      const result = await fetchPokemonDetailsBatch(['a', 'b']);

      expect(result).toHaveLength(0);
    });
  });
});
