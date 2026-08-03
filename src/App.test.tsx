import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import * as pokemonApi from './services/pokemonApi';

vi.mock('./services/pokemonApi');

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders the app without crashing', async () => {
    vi.mocked(pokemonApi.fetchPokemonList).mockResolvedValue({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
    vi.mocked(pokemonApi.fetchPokemonDetailsBatch).mockResolvedValue([]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/poki land/i)).toBeInTheDocument();
    });
  });
});
