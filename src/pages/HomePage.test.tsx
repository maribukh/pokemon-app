import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from './HomePage';
import * as pokemonApi from '../services/pokemonApi';

vi.mock('../services/pokemonApi');

const mockPokemon = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  types: [{ slot: 1, type: { name: 'electric', url: '' } }],
  stats: [
    { base_stat: 35, effort: 0, stat: { name: 'hp', url: '' } },
    { base_stat: 55, effort: 0, stat: { name: 'attack', url: '' } },
  ],
  sprites: {
    front_default: 'default.png',
    other: { 'official-artwork': { front_default: 'artwork.png' } },
  },
};

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('shows loading state and then displays the pokemon list on mount', async () => {
    vi.mocked(pokemonApi.fetchPokemonList).mockResolvedValue({
      count: 1,
      next: null,
      previous: null,
      results: [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
      ],
    });
    vi.mocked(pokemonApi.fetchPokemonDetailsBatch).mockResolvedValue([
      mockPokemon,
    ]);

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });

    expect(pokemonApi.fetchPokemonList).toHaveBeenCalledWith(20, 0);
  });

  it('loads a specific pokemon when a search term is saved in localStorage', async () => {
    localStorage.setItem('pokemon_search_term', 'pikachu');
    vi.mocked(pokemonApi.fetchPokemonByName).mockResolvedValue(mockPokemon);

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });

    expect(pokemonApi.fetchPokemonByName).toHaveBeenCalledWith('pikachu');
    expect(pokemonApi.fetchPokemonList).not.toHaveBeenCalled();
  });

  it('displays an error message when the API call fails', async () => {
    vi.mocked(pokemonApi.fetchPokemonList).mockRejectedValue(
      new Error('Network error')
    );

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('performs a new search when the user searches for a pokemon', async () => {
    const user = userEvent.setup();

    vi.mocked(pokemonApi.fetchPokemonList).mockResolvedValue({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
    vi.mocked(pokemonApi.fetchPokemonDetailsBatch).mockResolvedValue([]);
    vi.mocked(pokemonApi.fetchPokemonByName).mockResolvedValue(mockPokemon);

    render(<HomePage />);

    await waitFor(() => {
      expect(pokemonApi.fetchPokemonList).toHaveBeenCalled();
    });

    const input = screen.getByPlaceholderText(/search pokemon/i);
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'pikachu');
    await user.click(button);

    await waitFor(() => {
      expect(pokemonApi.fetchPokemonByName).toHaveBeenCalledWith('pikachu');
    });

    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
  });

  it('shows "not found" error when searching for a non-existent pokemon', async () => {
    const user = userEvent.setup();

    vi.mocked(pokemonApi.fetchPokemonList).mockResolvedValue({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
    vi.mocked(pokemonApi.fetchPokemonDetailsBatch).mockResolvedValue([]);
    vi.mocked(pokemonApi.fetchPokemonByName).mockRejectedValue(
      new Error('Pokemon "xyz" not found')
    );

    render(<HomePage />);

    await waitFor(() => {
      expect(pokemonApi.fetchPokemonList).toHaveBeenCalled();
    });

    const input = screen.getByPlaceholderText(/search pokemon/i);
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'xyz');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/not found/i)).toBeInTheDocument();
    });
  });

  it('renders the BuggyButton for error boundary testing', async () => {
    vi.mocked(pokemonApi.fetchPokemonList).mockResolvedValue({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
    vi.mocked(pokemonApi.fetchPokemonDetailsBatch).mockResolvedValue([]);

    render(<HomePage />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /simulate error/i })
      ).toBeInTheDocument();
    });
  });
});
