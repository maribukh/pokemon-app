import { useEffect, useState } from 'react';
import { fetchPokemonByName } from '../services/pokemonApi';
import type { Pokemon } from '../types/pokemon.types';

interface UsePokemonDetailsState {
  pokemon: Pokemon | null;
  loading: boolean;
  error: string | null;
}

export function usePokemonDetails(
  id: string | undefined
): UsePokemonDetailsState {
  const [state, setState] = useState<UsePokemonDetailsState>({
    pokemon: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!id) {
      return;
    }

    let isCancelled = false;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetchPokemonByName(id)
      .then((data) => {
        if (!isCancelled) {
          setState({ pokemon: data, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          const message =
            err instanceof Error ? err.message : 'Something went wrong';
          setState({ pokemon: null, loading: false, error: message });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [id]);

  return state;
}
