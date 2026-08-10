import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from './HomePage';
import * as pokemonApi from '../services/pokemonApi';
import { renderWithProviders } from '../test-utils/renderWithProviders';
import { useSelectedItemsStore } from '../store/selectedItemsStore';

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

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    useSelectedItemsStore.setState({ selectedItems: {} });
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
      mockPokemon as never,
    ]);

    renderWithProviders(<HomePage />, { route: '/?page=1' });

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });

    expect(pokemonApi.fetchPokemonList).toHaveBeenCalledWith(20, 0);
  });

  it('displays an error message when the API call fails', async () => {
    vi.mocked(pokemonApi.fetchPokemonList).mockRejectedValue(
      new Error('Network error')
    );

    renderWithProviders(<HomePage />, { route: '/?page=1' });

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
    vi.mocked(pokemonApi.fetchPokemonByName).mockResolvedValue(
      mockPokemon as never
    );

    renderWithProviders(<HomePage />, { route: '/?page=1' });

    await waitFor(() => expect(pokemonApi.fetchPokemonList).toHaveBeenCalled());

    const input = screen.getByPlaceholderText(/search pokemon/i);
    const button = screen.getByRole('button', { name: /^search$/i });

    await user.type(input, 'pikachu');
    await user.click(button);

    await waitFor(() => {
      expect(pokemonApi.fetchPokemonByName).toHaveBeenCalledWith('pikachu');
    });

    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
  });

  it('invalidates and refetches data when Refresh is clicked', async () => {
    const user = userEvent.setup();

    vi.mocked(pokemonApi.fetchPokemonList).mockResolvedValue({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
    vi.mocked(pokemonApi.fetchPokemonDetailsBatch).mockResolvedValue([]);

    renderWithProviders(<HomePage />, { route: '/?page=1' });

    await waitFor(() =>
      expect(pokemonApi.fetchPokemonList).toHaveBeenCalledTimes(1)
    );

    await user.click(screen.getByRole('button', { name: /refresh/i }));

    await waitFor(() =>
      expect(pokemonApi.fetchPokemonList).toHaveBeenCalledTimes(2)
    );
  });

  it('renders the BuggyButton for error boundary testing', async () => {
    vi.mocked(pokemonApi.fetchPokemonList).mockResolvedValue({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
    vi.mocked(pokemonApi.fetchPokemonDetailsBatch).mockResolvedValue([]);

    renderWithProviders(<HomePage />, { route: '/?page=1' });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /simulate error/i })
      ).toBeInTheDocument();
    });
  });
});
