import { useQuery } from '@tanstack/react-query';
import { fetchPokemonByName } from '../services/pokemonApi';

export function usePokemonDetailsQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['pokemonDetails', id],
    queryFn: () => fetchPokemonByName(id as string),
    enabled: Boolean(id),
  });
}
