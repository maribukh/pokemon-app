import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import PokemonDetails from './PokemonDetails';
import * as pokemonApi from '../../services/pokemonApi';
import { createTestQueryClient } from '../../test-utils/renderWithProviders';

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

function renderDetails(initialEntry: string, client = createTestQueryClient()) {
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/details/:id" element={<PokemonDetails />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
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

  it('does not refetch when reopening a previously loaded pokemon', async () => {
    vi.mocked(pokemonApi.fetchPokemonByName).mockResolvedValue(
      mockPokemon as never
    );
    const client = createTestQueryClient();

    const { unmount } = renderDetails('/details/pikachu', client);
    await waitFor(() =>
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument()
    );
    unmount();

    renderDetails('/details/pikachu', client);
    await waitFor(() =>
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument()
    );

    expect(pokemonApi.fetchPokemonByName).toHaveBeenCalledTimes(1);
  });

  it('refetches when Refresh is clicked', async () => {
    vi.mocked(pokemonApi.fetchPokemonByName).mockResolvedValue(
      mockPokemon as never
    );
    const user = userEvent.setup();
    renderDetails('/details/pikachu');

    await waitFor(() =>
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument()
    );
    expect(pokemonApi.fetchPokemonByName).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /refresh/i }));

    await waitFor(() =>
      expect(pokemonApi.fetchPokemonByName).toHaveBeenCalledTimes(2)
    );
  });

  it('navigates back when Close button is clicked', async () => {
    vi.mocked(pokemonApi.fetchPokemonByName).mockResolvedValue(
      mockPokemon as never
    );
    const user = userEvent.setup();
    renderDetails('/details/pikachu?page=2');

    await waitFor(() =>
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument()
    );

    await user.click(screen.getByRole('button', { name: /close/i }));
  });

  it('shows a refreshing state on the button while refetching', async () => {
    let resolvePending: (value: typeof mockPokemon) => void = () => {};
    const pendingPromise = new Promise<typeof mockPokemon>((resolve) => {
      resolvePending = resolve;
    });

    vi.mocked(pokemonApi.fetchPokemonByName)
      .mockResolvedValueOnce(mockPokemon as never)
      .mockImplementationOnce(() => pendingPromise as never);

    const user = userEvent.setup();
    renderDetails('/details/pikachu');

    await waitFor(() =>
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument()
    );

    await user.click(screen.getByRole('button', { name: /^refresh$/i }));

    expect(screen.getByRole('button', { name: /refreshing/i })).toBeDisabled();

    resolvePending(mockPokemon);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /^refresh$/i })
      ).not.toBeDisabled();
    });
  });
});
