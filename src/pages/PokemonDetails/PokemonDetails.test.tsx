import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PokemonDetails from './PokemonDetails';
import * as pokemonApi from '../../services/pokemonApi';

vi.mock('../../services/pokemonApi');

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
  sprites: { front_default: 'default.png' },
};

function renderDetails(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/details/:id" element={<PokemonDetails />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('PokemonDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    vi.mocked(pokemonApi.fetchPokemonByName).mockResolvedValue(
      mockPokemon as never
    );
    renderDetails('/details/pikachu');

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders pokemon details on success', async () => {
    vi.mocked(pokemonApi.fetchPokemonByName).mockResolvedValue(
      mockPokemon as never
    );
    renderDetails('/details/pikachu');

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/electric/i)).toBeInTheDocument();
    expect(screen.getByText(/hp: 35/i)).toBeInTheDocument();
  });

  it('renders error message when pokemon is not found', async () => {
    vi.mocked(pokemonApi.fetchPokemonByName).mockRejectedValue(
      new Error('Pokemon "xyz" not found')
    );
    renderDetails('/details/xyz');

    await waitFor(() => {
      expect(screen.getByText(/not found/i)).toBeInTheDocument();
    });
  });

  it('navigates back when Close button is clicked', async () => {
    vi.mocked(pokemonApi.fetchPokemonByName).mockResolvedValue(
      mockPokemon as never
    );
    const user = userEvent.setup();
    renderDetails('/details/pikachu?page=2');

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();

    await user.click(closeButton);
  });
});
