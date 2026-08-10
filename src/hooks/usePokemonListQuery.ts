import { useQuery } from '@tanstack/react-query';
import {
  fetchPokemonList,
  fetchPokemonByName,
  fetchPokemonDetailsBatch,
} from '../services/pokemonApi';
import { mapPokemonToCard } from '../utils/pokemonMapper';
import type { CardListItem } from '../components/CardList/CardList.types';

const PAGE_SIZE = 20;

interface PokemonListResult {
  items: CardListItem[];
  totalPages: number;
}

async function fetchPokemonPageData(
  term: string,
  page: number
): Promise<PokemonListResult> {
  if (term) {
    const pokemon = await fetchPokemonByName(term);
    return { items: [mapPokemonToCard(pokemon)], totalPages: 1 };
  }

  const offset = (page - 1) * PAGE_SIZE;
  const list = await fetchPokemonList(PAGE_SIZE, offset);
  const names = list.results.map((r) => r.name);
  const details = await fetchPokemonDetailsBatch(names);

  return {
    items: details.map(mapPokemonToCard),
    totalPages: Math.max(1, Math.ceil(list.count / PAGE_SIZE)),
  };
}

export function usePokemonListQuery(term: string, page: number) {
  return useQuery({
    queryKey: ['pokemonList', term, page],
    queryFn: () => fetchPokemonPageData(term, page),
  });
}
