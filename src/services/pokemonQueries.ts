import {
  fetchPokemonList,
  fetchPokemonByName,
  fetchPokemonDetailsBatch,
} from './pokemonApi';
import { mapPokemonToCard } from '../utils/pokemonMapper';
import type { CardListItem } from '../components/CardList/CardList.types';

const PAGE_SIZE = 20;

export interface PokemonPageResult {
  items: CardListItem[];
  totalPages: number;
}

export async function getPokemonPage(
  term: string,
  page: number
): Promise<PokemonPageResult> {
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
